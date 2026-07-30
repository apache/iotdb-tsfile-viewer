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
 *
 * 外层表格按后端分页（每页 PAGE_SIZE 条），展开行内的错误列表
 * 各自维护一份本地页码，避免一个文件报出上万条错误时把 DOM 撑爆。
 */
import type { FileError, ScanReport, ScanResult } from "@/api/tsfile/scan-types";
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useScanStore } from "@/stores/tsfile/scan";
import { tableStyleProps } from "@/utils/tableStyle";

import type { TagProps } from "element-plus";

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

function getPagedErrors(record: ScanResult): FileError[] {
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

function healthTagType(status: string): TagProps["type"] {
  switch (status) {
    case "HEALTHY": return "success";
    case "WARNING": return "warning";
    case "ERROR": return "danger";
    default: return "info";
  }
}

function severityTagType(severity: string): TagProps["type"] {
  switch (severity) {
    case "CRITICAL": return "danger";
    case "ERROR": return "warning";
    default: return "info";
  }
}

function getErrorSummary(record: ScanResult): string {
  const errors = record.errors || [];
  if (errors.length === 0) return "-";
  // Show first error description as summary
  const first = errors[0];
  const desc = first.description || first.errorType;
  return errors.length === 1 ? desc : `${desc} (+${errors.length - 1})`;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="tc-table-card">
      <el-table
        v-bind="tableStyleProps"
        :data="results"
        row-key="filePath"
        :empty-text="t('tsfile.common.noData')"
      >
        <!-- 旧组件库的 #expandedRowRender 对应 Element Plus 的 type="expand" 列 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <div v-if="row.errors && row.errors.length > 0" class="px-6 py-3">
              <div class="mb-2 text-xs text-text-body">
                {{ row.errors.length }} {{ t("tsfile.scan.logEntries") }}
              </div>
              <el-table
                v-bind="tableStyleProps"
                :data="getPagedErrors(row as ScanResult)"
                size="small"
                row-key="location"
              >
                <el-table-column
                  :label="t('tsfile.scan.errorType')"
                  prop="errorType"
                  width="240"
                  show-overflow-tooltip
                />
                <el-table-column
                  :label="t('tsfile.scan.errorLocation')"
                  prop="location"
                  width="240"
                  show-overflow-tooltip
                />
                <el-table-column :label="t('tsfile.scan.errorSeverity')" width="120">
                  <template #default="{ row: errorRow }">
                    <el-tag :type="severityTagType(errorRow.severity)" size="small">
                      {{ errorRow.severity }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="t('tsfile.scan.errorDescription')"
                  prop="description"
                  show-overflow-tooltip
                />
              </el-table>
              <div v-if="row.errors.length > ERROR_PAGE_SIZE" class="mt-2 flex justify-end">
                <el-pagination
                  :current-page="getErrorPage(row.filePath)"
                  :page-size="ERROR_PAGE_SIZE"
                  :total="row.errors.length"
                  size="small"
                  layout="total, prev, pager, next"
                  @current-change="(page: number) => handleErrorPageChange(row.filePath, page)"
                />
              </div>
            </div>
            <div v-else class="px-6 py-3 text-sm text-text-body">
              {{ t("tsfile.scan.noErrors") }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('tsfile.scan.filePath')"
          prop="filePath"
          show-overflow-tooltip
        />
        <el-table-column :label="t('tsfile.scan.fileSize')" width="100" align="right">
          <template #default="{ row }">
            <span class="tnum">{{ formatFileSize(row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('tsfile.scan.healthStatus')"
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="healthTagType(row.healthStatus)" size="small">
              {{ row.healthStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('tsfile.scan.errorSummary')"
          width="280"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span class="text-xs text-text-body">{{ getErrorSummary(row as ScanResult) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('tsfile.scan.scanDuration')"
          width="110"
          align="right"
        >
          <template #default="{ row }">
            <span class="tnum">{{ formatDuration(row.scanDurationMs) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="report && report.totalPages > 1" class="flex justify-end">
      <!-- Element Plus 不支持 旧组件库的 :show-total 自定义函数，改用内置 total 布局 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="PAGE_SIZE"
        :total="totalItems"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>
