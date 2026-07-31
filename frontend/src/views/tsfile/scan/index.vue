<!--
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
-->

<script setup lang="ts">
/**
 * ScanView - 文件扫描检测主页面
 */
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import type { LogEntry } from "@/stores/tsfile/scan";
import { exportReport } from "@/api/tsfile/scan";
import { useScanStore } from "@/stores/tsfile/scan";
import { useFileStore } from "@/stores/tsfile/file";
import PageHeader from "@/components/layout/PageHeader.vue";

const ScanProgress = defineAsyncComponent(() => import("@/components/tsfile/ScanProgress.vue"));
const ScanLogPanel = defineAsyncComponent(() => import("@/components/tsfile/ScanLogPanel.vue"));
const ScanReport = defineAsyncComponent(() => import("@/components/tsfile/ScanReport.vue"));
const ScanChart = defineAsyncComponent(() => import("@/components/tsfile/ScanChart.vue"));

const { t } = useI18n();
const scanStore = useScanStore();
const fileStore = useFileStore();

const scanMode = ref<"directory" | "file">("directory");
const inputPath = ref("");

// Watch sidebar tree selection and auto-populate input
watch(
  () => fileStore.selectedScanTarget,
  (target) => {
    if (target) {
      inputPath.value = target.path;
      scanMode.value = target.type;
      // Auto-start scan if requested (e.g. from error alert quick scan button)
      if (fileStore.autoStartScan) {
        fileStore.autoStartScan = false;
        handleStartScan();
      }
    }
  },
  { immediate: true },
);
const exporting = ref(false);

const taskStatus = computed(() => scanStore.currentTask?.status);
const isScanning = computed(() => scanStore.isScanning);
const isCompleted = computed(() => {
  const s = taskStatus.value;
  return s === "COMPLETED" || s === "CANCELLED" || s === "FAILED";
});
const hasResults = computed(() => scanStore.scanResults.length > 0 || scanStore.scanReport !== null);
const isDirectoryScan = computed(() => scanStore.currentTask?.taskId !== 'single-file');

const progressData = computed(() => ({
  scannedCount: scanStore.currentTask?.scannedFiles ?? 0,
  totalCount: scanStore.currentTask?.totalFiles ?? 0,
  currentFile: scanStore.currentTask?.currentFile ?? "",
  percentage: scanStore.progress,
}));

const logEntries = computed<LogEntry[]>(() => scanStore.logs);

async function handleStartScan() {
  const path = inputPath.value.trim();
  if (!path) { ElMessage.warning(t("tsfile.scan.pathRequired")); return; }
  try {
    if (scanMode.value === "directory") await scanStore.startScan(path);
    else await scanStore.startFileScan(path);
  } catch (error: any) {
    ElMessage.error(error?.message || t("tsfile.scan.scanFailed"));
  }
}

async function handleCancelScan() {
  try {
    await scanStore.cancelScan();
    ElMessage.info(t("tsfile.scan.scanCancelled"));
  } catch (error: any) {
    ElMessage.error(error?.message || t("tsfile.error.cancelFailed"));
  }
}

async function handleExport(format: "csv" | "json") {
  const taskId = scanStore.currentTask?.taskId;
  if (!taskId) return;
  exporting.value = true;
  try {
    const blob = await exportReport(taskId, format);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scan-report-${taskId}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    ElMessage.success(t("tsfile.scan.exportSuccess"));
  } catch (error: any) {
    ElMessage.error(error?.message || t("tsfile.scan.exportFailed"));
  } finally {
    exporting.value = false;
  }
}

async function handleFetchReport() {
  const taskId = scanStore.currentTask?.taskId;
  if (!taskId) return;
  try { await scanStore.fetchReport(taskId, 0); }
  catch (error: any) { ElMessage.error(error?.message || t("tsfile.error.loadFailed")); }
}
</script>

<template>
  <!-- 外层 <main> 已给 1.5rem 内边距，这里不要再加 p-4，否则比其它页多一圈 -->
  <div class="flex h-full flex-col gap-3 overflow-auto">
    <PageHeader :title="t('tsfile.scan.title')" :subtitle="t('tsfile.scan.description')" />
    <!-- Top: Scan Mode + Path Input + Control Buttons -->
    <div class="tc-panel">
      <div class="tc-panel-title">
        <span>{{ t("tsfile.scan.scanConfig") }}</span>
      </div>
      <div class="p-5">
      <div class="mb-4">
        <el-radio-group v-model="scanMode" :disabled="isScanning">
          <el-radio-button value="directory">{{ t("tsfile.scan.directoryScan") }}</el-radio-button>
          <el-radio-button value="file">{{ t("tsfile.scan.fileScan") }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flex items-center gap-3">
        <el-input
          v-model="inputPath"
          :placeholder="scanMode === 'directory' ? t('tsfile.scan.directoryPlaceholder') : t('tsfile.scan.filePlaceholder')"
          :disabled="isScanning"
          clearable
          class="flex-1"
          @keyup.enter="handleStartScan"
        />
        <el-button v-if="!isScanning" type="primary" :disabled="!inputPath.trim()" @click="handleStartScan">
          {{ t("tsfile.scan.startScan") }}
        </el-button>
        <el-button v-else type="danger" @click="handleCancelScan">{{ t("tsfile.scan.cancelScan") }}</el-button>
      </div>
      <p v-if="!isScanning" class="mt-2 text-xs text-text-label">
        {{ t("tsfile.scan.sidebarHint") }}
      </p>
      <div v-if="taskStatus" class="mt-3 text-sm text-text-body">
        <span>{{ t("tsfile.scan.status") }}:</span>
        <span class="ml-1 font-medium">{{ t(`tsfile.scan.taskStatus.${taskStatus}`) }}</span>
        <span v-if="taskStatus === 'QUEUED' && scanStore.currentTask?.queuePosition && scanStore.currentTask.queuePosition > 0" class="ml-2">
          ({{ t("tsfile.scan.queuePosition") }}: {{ scanStore.currentTask.queuePosition }})
        </span>
      </div>
      </div>
    </div>

    <!-- 空状态：还没发起过任何扫描任务时，把面板下方的空白变成操作引导 -->
    <div v-if="!taskStatus" class="tc-panel flex min-h-[200px] flex-1 items-center justify-center">
      <el-empty :image-size="88" :description="t('tsfile.scan.idleTitle')">
        <p class="mx-auto max-w-md text-sm leading-relaxed text-text-body">
          {{ t("tsfile.scan.idleHint") }}
        </p>
      </el-empty>
    </div>

    <!-- Middle: Progress + Log Panel -->
    <div v-if="isScanning || isCompleted" class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div class="tc-panel">
        <div class="tc-panel-title">
          <span>{{ t("tsfile.scan.progress") }}</span>
        </div>
        <div class="p-5">
          <ScanProgress :progress="progressData" />
        </div>
      </div>
      <div class="tc-panel lg:col-span-2">
        <div class="tc-panel-title">
          <span>{{ t("tsfile.scan.logs") }}</span>
        </div>
        <div class="p-5">
          <ScanLogPanel :logs="logEntries" />
        </div>
      </div>
    </div>

    <!-- Bottom: Report + Chart -->
    <template v-if="isCompleted && hasResults">
      <div class="flex items-center gap-3">
        <el-button v-if="isDirectoryScan" :loading="exporting" @click="handleExport('json')">{{ t("tsfile.scan.exportJson") }}</el-button>
        <el-button v-if="isDirectoryScan" :loading="exporting" @click="handleExport('csv')">{{ t("tsfile.scan.exportCsv") }}</el-button>
        <el-button v-if="isDirectoryScan && !scanStore.scanReport" type="primary" @click="handleFetchReport">
          {{ t("tsfile.scan.viewReport") }}
        </el-button>
      </div>
      <div class="tc-panel">
        <div class="tc-panel-title">
          <span>{{ t("tsfile.scan.statistics") }}</span>
        </div>
        <div class="p-5">
          <ScanChart :health-status-data="scanStore.healthStatusChartData" :error-type-data="scanStore.errorTypeChartData" />
        </div>
      </div>
      <div class="tc-panel">
        <div class="tc-panel-title">
          <span>{{ t("tsfile.scan.report") }}</span>
        </div>
        <div class="p-5">
          <ScanReport :results="scanStore.filteredResults" :report="scanStore.scanReport" :task-id="scanStore.currentTask?.taskId ?? ''" />
        </div>
      </div>
    </template>
  </div>
</template>
