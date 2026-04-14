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
 * ScanReport - 扫描报告表格组件
 */
import type { ScanReport, ScanResult } from "@/api/tsfile/scan-types";
import { computed, reactive } from "vue";
import { Pagination, Table, TableColumn, Tag } from "antdv-next";
import { useI18n } from "vue-i18n";
import { useScanStore } from "@/stores/tsfile/scan";

const { t } = useI18n();

interface Props {
  results: ScanResult[];
  report: ScanReport | null;
  taskId: string;
}

const props = defineProps<Props>();
const scanStore = useScanStore();

const PAGE_SIZE = 50;
const ERROR_PAGE_SIZE = 100;
const currentPage = computed(() => (props.report?.currentPage ?? 0) + 1);
const totalItems = computed(() => {
  // Use totalPages * PAGE_SIZE for accurate pagination when report is available,
  // since totalFiles may exceed actual scanned results if scan was cancelled/timed out
  if (props.report && props.report.totalPages > 0) {
    // Approximate total from pagination metadata; last page may be partial
    return Math.max(props.report.totalFiles, props.results.length);
  }
  return props.results.length;
});

// Track per-row error pagination: { [filePath]: currentPage (1-based) }
const errorPages = reactive<Record<string, number>>({});

function getErrorPage(filePath: string): number {
  return errorPages[filePath] || 1;
}

function getPagedErrors(record: any) {
  const errors = record.errors || [];
  const page = getErrorPage(record.filePath);
  const start = (page - 1) * ERROR_PAGE_SIZE;
  return errors.slice(start, start + ERROR_PAGE_SIZE);
}

function handleErrorPageChange(filePath: string, page: number) {
  errorPages[filePath] = page;
}

async function handlePageChange(page: number) {
  if (!props.taskId) return;
  await scanStore.fetchReport(props.taskId, page - 1);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function healthTagColor(status: string): string {
  switch (status) {
    case "HEALTHY": return "success";
    case "WARNING": return "warning";
    case "ERROR": return "error";
    default: return "default";
  }
}

function severityTagColor(severity: string): string {
  switch (severity) {
    case "CRITICAL": return "error";
    case "ERROR": return "warning";
    case "WARNING": return "default";
    default: return "default";
  }
}

const columns = computed(() => [
  { title: t("tsfile.scan.filePath"), dataIndex: "filePath", key: "filePath", ellipsis: true },
  { title: t("tsfile.scan.fileSize"), dataIndex: "fileSize", key: "fileSize", width: 100, align: "right" as const },
  { title: t("tsfile.scan.healthStatus"), dataIndex: "healthStatus", key: "healthStatus", width: 110, align: "center" as const },
  { title: t("tsfile.scan.errorSummary"), dataIndex: "errors", key: "errorSummary", width: 280, ellipsis: true },
  { title: t("tsfile.scan.scanDuration"), dataIndex: "scanDurationMs", key: "scanDurationMs", width: 110, align: "right" as const },
]);

function getErrorSummary(record: any): string {
  const errors = record.errors || [];
  if (errors.length === 0) return '-';
  // Show first error description as summary
  const first = errors[0];
  const desc = first.description || first.errorType;
  return errors.length === 1 ? desc : `${desc} (+${errors.length - 1})`;
}

const errorColumns = computed(() => [
  { title: t("tsfile.scan.errorType"), dataIndex: "errorType", key: "errorType", width: 240 },
  { title: t("tsfile.scan.errorLocation"), dataIndex: "location", key: "location", width: 240 },
  { title: t("tsfile.scan.errorSeverity"), dataIndex: "severity", key: "severity", width: 120 },
  { title: t("tsfile.scan.errorDescription"), dataIndex: "description", key: "description" },
]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <Table
      :data-source="results"
      :columns="columns"
      row-key="filePath"
      :pagination="false"
      :expandable="{ expandedRowRender: undefined }"
      size="middle"
    >
      <template #expandedRowRender="{ record }">
        <div v-if="record.errors && record.errors.length > 0" class="px-6 py-3">
          <div class="mb-2 text-xs text-gray-500">
            {{ record.errors.length }} {{ t("tsfile.scan.logEntries") }}
          </div>
          <Table :data-source="getPagedErrors(record)" :columns="errorColumns" :pagination="false" size="small" row-key="location">
            <template #bodyCell="{ column, record: errorRow }">
              <template v-if="column.key === 'severity'">
                <Tag :color="severityTagColor(errorRow.severity)">{{ errorRow.severity }}</Tag>
              </template>
            </template>
          </Table>
          <div v-if="record.errors.length > ERROR_PAGE_SIZE" class="mt-2 flex justify-end">
            <Pagination
              :current="getErrorPage(record.filePath)"
              :page-size="ERROR_PAGE_SIZE"
              :total="record.errors.length"
              size="small"
              :show-total="(total: number) => `${total} errors`"
              @change="(page: number) => handleErrorPageChange(record.filePath, page)"
            />
          </div>
        </div>
        <div v-else class="px-6 py-3 text-sm text-gray-400">
          {{ t("tsfile.scan.noErrors") }}
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'fileSize'">{{ formatFileSize(record.fileSize) }}</template>
        <template v-if="column.key === 'healthStatus'">
          <Tag :color="healthTagColor(record.healthStatus)">{{ record.healthStatus }}</Tag>
        </template>
        <template v-if="column.key === 'errorSummary'">
          <span class="text-xs text-gray-500">{{ getErrorSummary(record) }}</span>
        </template>
        <template v-if="column.key === 'scanDurationMs'">{{ formatDuration(record.scanDurationMs) }}</template>
      </template>
    </Table>

    <div v-if="report && report.totalPages > 1" class="flex justify-end">
      <Pagination
        :current="currentPage"
        :page-size="PAGE_SIZE"
        :total="totalItems"
        :show-total="(total: number) => `${t('tsfile.common.total')} ${total} ${t('tsfile.common.items')}`"
        @change="handlePageChange"
      />
    </div>

    <div v-if="results.length === 0" class="py-8 text-center text-gray-400">
      {{ t("tsfile.common.noData") }}
    </div>
  </div>
</template>
