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
import { Button, Input, message, RadioButton, RadioGroup } from "antdv-next";
import { useI18n } from "vue-i18n";
import type { LogEntry } from "@/stores/tsfile/scan";
import { exportReport } from "@/api/tsfile/scan";
import { useScanStore } from "@/stores/tsfile/scan";
import { useFileStore } from "@/stores/tsfile/file";

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
  if (!path) { message.warning(t("tsfile.scan.pathRequired")); return; }
  try {
    if (scanMode.value === "directory") await scanStore.startScan(path);
    else await scanStore.startFileScan(path);
  } catch (error: any) {
    message.error(error?.message || t("tsfile.scan.scanFailed"));
  }
}

async function handleCancelScan() {
  try {
    await scanStore.cancelScan();
    message.info(t("tsfile.scan.scanCancelled"));
  } catch (error: any) {
    message.error(error?.message || t("tsfile.error.cancelFailed"));
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
    message.success(t("tsfile.scan.exportSuccess"));
  } catch (error: any) {
    message.error(error?.message || t("tsfile.scan.exportFailed"));
  } finally {
    exporting.value = false;
  }
}

async function handleFetchReport() {
  const taskId = scanStore.currentTask?.taskId;
  if (!taskId) return;
  try { await scanStore.fetchReport(taskId, 0); }
  catch (error: any) { message.error(error?.message || t("tsfile.error.loadFailed")); }
}
</script>

<template>
  <div class="flex flex-col gap-3 h-full overflow-auto p-4">
    <!-- Top: Scan Mode + Path Input + Control Buttons -->
    <div class="rounded-lg border border-gray-200 bg-white px-4 pt-3 pb-4">
      <div class="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{{ t("tsfile.scan.scanConfig") }}</div>
      <div class="mb-4">
        <RadioGroup v-model:value="scanMode" :disabled="isScanning" button-style="solid">
          <RadioButton value="directory">{{ t("tsfile.scan.directoryScan") }}</RadioButton>
          <RadioButton value="file">{{ t("tsfile.scan.fileScan") }}</RadioButton>
        </RadioGroup>
      </div>
      <div class="flex items-center gap-3">
        <Input
          v-model:value="inputPath"
          :placeholder="scanMode === 'directory' ? t('tsfile.scan.directoryPlaceholder') : t('tsfile.scan.filePlaceholder')"
          :disabled="isScanning"
          allow-clear
          class="flex-1"
          @press-enter="handleStartScan"
        />
        <Button v-if="!isScanning" type="primary" :disabled="!inputPath.trim()" @click="handleStartScan">
          {{ t("tsfile.scan.startScan") }}
        </Button>
        <Button v-else danger @click="handleCancelScan">{{ t("tsfile.scan.cancelScan") }}</Button>
      </div>
      <p v-if="!isScanning" class="mt-2 text-xs text-gray-400">
        {{ t("tsfile.scan.sidebarHint") }}
      </p>
      <div v-if="taskStatus" class="mt-3 text-sm text-gray-500">
        <span>{{ t("tsfile.scan.status") }}:</span>
        <span class="ml-1 font-medium">{{ t(`tsfile.scan.taskStatus.${taskStatus}`) }}</span>
        <span v-if="taskStatus === 'QUEUED' && scanStore.currentTask?.queuePosition && scanStore.currentTask.queuePosition > 0" class="ml-2">
          ({{ t("tsfile.scan.queuePosition") }}: {{ scanStore.currentTask.queuePosition }})
        </span>
      </div>
    </div>

    <!-- Middle: Progress + Log Panel -->
    <div v-if="isScanning || isCompleted" class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div class="rounded-lg border border-gray-200 bg-white px-4 pt-3 pb-4">
        <div class="mb-2 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{{ t("tsfile.scan.progress") }}</div>
        <ScanProgress :progress="progressData" />
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 pt-3 pb-4 lg:col-span-2">
        <div class="mb-2 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{{ t("tsfile.scan.logs") }}</div>
        <ScanLogPanel :logs="logEntries" />
      </div>
    </div>

    <!-- Bottom: Report + Chart -->
    <template v-if="isCompleted && hasResults">
      <div class="flex items-center gap-3">
        <Button v-if="isDirectoryScan" :loading="exporting" @click="handleExport('json')">{{ t("tsfile.scan.exportJson") }}</Button>
        <Button v-if="isDirectoryScan" :loading="exporting" @click="handleExport('csv')">{{ t("tsfile.scan.exportCsv") }}</Button>
        <Button v-if="isDirectoryScan && !scanStore.scanReport" type="primary" @click="handleFetchReport">
          {{ t("tsfile.scan.viewReport") }}
        </Button>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 pt-3 pb-4">
        <div class="mb-2 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{{ t("tsfile.scan.statistics") }}</div>
        <ScanChart :health-status-data="scanStore.healthStatusChartData" :error-type-data="scanStore.errorTypeChartData" />
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 pt-3 pb-4">
        <div class="mb-2 border-b border-gray-100 pb-2 text-base font-semibold text-gray-800">{{ t("tsfile.scan.report") }}</div>
        <ScanReport :results="scanStore.filteredResults" :report="scanStore.scanReport" :task-id="scanStore.currentTask?.taskId ?? ''" />
      </div>
    </template>
  </div>
</template>
