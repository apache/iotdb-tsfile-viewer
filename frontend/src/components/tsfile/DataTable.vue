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
 * DataTable 组件 - 数据表格
 * 支持动态列、分页、排序、导出
 */
import type { DataRow } from "@/api/tsfile/types";
import type { TableColumnType } from "antdv-next";

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Alert, Button, Card, Input, Pagination, Select, Table, Tooltip } from "antdv-next";
import { DownloadOutlined } from "@antdv-next/icons";

import { formatTimestamp } from "@/utils/timestamp";

interface Props {
  data: DataRow[];
  total: number;
  offset: number;
  limit?: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  tagColumns?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  limit: 100,
  tagColumns: () => [],
});

const emit = defineEmits<{
  export: [format: "csv" | "json"];
  limitChange: [limit: number];
  pageChange: [page: number];
}>();

const { t } = useI18n();

const internalLimit = ref(props.limit);
const sortColumn = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

// 字段列分页（避免一次性渲染数千列导致页面卡死）
const columnPage = ref(1);
const columnPageSize = ref(50);
const columnSearch = ref("");

const limitOptions = [10, 20, 50, 100, 200, 500, 1000].map((v) => ({
  label: String(v),
  value: v,
}));

const columnPageSizeOptions = [20, 50, 100, 200].map((v) => ({
  label: String(v),
  value: v,
}));

// 当前页码
const currentPage = computed(() => {
  return Math.floor(props.offset / internalLimit.value) + 1;
});

// 总页数
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / internalLimit.value));
});

// 获取所有测点列
const measurementColumns = computed(() => {
  const columns = new Set<string>();
  for (const row of props.data) {
    for (const key of Object.keys(row.measurements)) {
      columns.add(key);
    }
  }
  return [...columns].toSorted();
});

// 字段列（非标签列）—— 全量
const fieldColumnNames = computed(() => {
  const tagSet = new Set(props.tagColumns);
  return measurementColumns.value.filter((col) => !tagSet.has(col));
});

// 按搜索关键字过滤字段列
const filteredFieldColumns = computed(() => {
  const q = columnSearch.value.trim().toLowerCase();
  if (!q) return fieldColumnNames.value;
  return fieldColumnNames.value.filter((col) => col.toLowerCase().includes(q));
});

// 字段列总页数
const fieldColumnTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredFieldColumns.value.length / columnPageSize.value)),
);

// 当前页可见的字段列
const visibleFieldColumns = computed(() => {
  const start = (columnPage.value - 1) * columnPageSize.value;
  return filteredFieldColumns.value.slice(start, start + columnPageSize.value);
});

// 当前可见字段列区间（用于展示 "X–Y / 总数"）
const fieldColumnRange = computed(() => {
  const totalCols = filteredFieldColumns.value.length;
  if (totalCols === 0) return { start: 0, end: 0, total: 0 };
  const start = (columnPage.value - 1) * columnPageSize.value;
  return { start: start + 1, end: Math.min(start + columnPageSize.value, totalCols), total: totalCols };
});

// 当列搜索 / 每页列数 / 数据变化时，重置到第一页并防止页码越界
watch([columnSearch, columnPageSize, fieldColumnNames], () => {
  columnPage.value = 1;
});
watch(fieldColumnTotalPages, (pages) => {
  if (columnPage.value > pages) columnPage.value = pages;
});

// 动态列定义
const columns = computed<TableColumnType[]>(() => {
  const cols: TableColumnType[] = [
    {
      title: t("tsfile.data.timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
      fixed: "left",
      width: 210,
      sorter: true,
    },
    {
      title: t("tsfile.data.device"),
      dataIndex: "__device__",
      key: "__device__",
      fixed: "left",
      width: 180,
      sorter: true,
    },
  ];

  // 标签列（固定左侧）—— tag 名可能与保留列同名（如 "device"），
  // 固定"设备"列已改用保留 key "__device__" 避免冲突，此处 tag 列可安全使用原名。
  for (const tagCol of props.tagColumns) {
    cols.push({
      title: tagCol,
      dataIndex: tagCol,
      key: tagCol,
      fixed: "left",
      width: 120,
      sorter: true,
    });
  }

  // 字段列（可滚动）—— 仅渲染当前列分页窗口内的列
  for (const fieldCol of visibleFieldColumns.value) {
    cols.push({
      title: fieldCol,
      dataIndex: fieldCol,
      key: fieldCol,
      width: 120,
      sorter: true,
    });
  }

  return cols;
});

// 表格横向滚动宽度（固定列 + 当前可见字段列，撑出横向滚动条）
const scrollX = computed(() => {
  const fixedWidth = 210 + 180 + props.tagColumns.length * 120;
  return fixedWidth + visibleFieldColumns.value.length * 120;
});

// 表格纵向可视高度：用 ResizeObserver 实测表格外层容器的可用高度，
// 避免用写死常量手算上方元素（列控制条 / 精度说明 Alert / 分页）的高度——
// 上方任意增删元素时，虚拟滚动的 scroll.y 都能自适应，不再错位。
const tableWrapper = ref<HTMLElement | null>(null);
const tableBodyHeight = ref(400);
let resizeObserver: ResizeObserver | null = null;
// 表头 DOM 未就绪时的兜底预留高度（表头 + 横向滚动条 + 边框）
const HEADER_RESERVE_FALLBACK = 64;
// 横向滚动条 + 底部边框额外预留，避免 body 覆盖到下方分页
const SCROLLBAR_RESERVE = 16;

function measureTableHeight() {
  const el = tableWrapper.value;
  if (!el) return;
  // 优先实测真实表头高度（适配 size / 多行表头 / 字体变化），拿不到则用兜底值
  const headerEl = el.querySelector<HTMLElement>(".ant-table-header, thead");
  const reserve = (headerEl?.offsetHeight || HEADER_RESERVE_FALLBACK) + SCROLLBAR_RESERVE;
  const h = el.clientHeight - reserve;
  tableBodyHeight.value = Math.max(120, Math.floor(h));
}

onMounted(() => {
  measureTableHeight();
  if (typeof ResizeObserver !== "undefined" && tableWrapper.value) {
    resizeObserver = new ResizeObserver(() => measureTableHeight());
    resizeObserver.observe(tableWrapper.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// loading 结束 / 数据变化后，表头与上下方控制条、分页的显隐会改变，
// 等 DOM 更新后重新实测表头高度，确保 body 高度精确、不覆盖分页。
watch(
  () => [props.loading, props.data.length, props.total] as const,
  () => nextTick(measureTableHeight),
);

// 表格数据（扁平化）—— 仅展开当前可见列，避免每行生成数千个属性
const tableData = computed(() => {
  const visibleMeasurements = [...props.tagColumns, ...visibleFieldColumns.value];
  let data = props.data.map((row, index) => {
    const flatRow: Record<string, unknown> = {
      _key: `${row.timestamp}-${row.device}-${index}`,
      timestamp: row.timestamp,
      timestampRaw: row.timestampRaw,
      __device__: row.device,
    };
    for (const measurement of visibleMeasurements) {
      flatRow[measurement] = formatValue(row.measurements[measurement]);
    }
    return flatRow;
  });

  // 客户端排序
  if (sortColumn.value) {
    const column = sortColumn.value;
    data = [...data].toSorted((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      const comparison =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return sortDirection.value === "asc" ? comparison : -comparison;
    });
  }

  return data;
});

// 监听 limit prop 变化
watch(
  () => props.limit,
  (newLimit) => {
    if (newLimit && newLimit !== internalLimit.value) {
      internalLimit.value = newLimit;
    }
  },
);

// 处理分页变化
function handlePageChange(page: number) {
  emit("pageChange", page);
}

// 处理每页条数变化
function handleLimitChange(limit: number) {
  internalLimit.value = limit;
  emit("limitChange", limit);
}

// 处理字段列分页变化
function handleColumnPageChange(page: number) {
  columnPage.value = page;
}

// 处理排序
function handleTableChange(
  _pagination: unknown,
  _filters: unknown,
  sorter: any,
) {
  const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
  if (singleSorter?.order) {
    sortColumn.value = String(singleSorter.field ?? "");
    sortDirection.value = singleSorter.order === "ascend" ? "asc" : "desc";
  } else {
    sortColumn.value = null;
  }
}

// 将不同精度的时间戳归一到毫秒并格式化，见 utils/timestamp.ts
// 格式化值
function formatValue(value: unknown): number | string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value;
  return String(value);
}
</script>

<template>
  <Card class="data-table h-full flex flex-col">
    <template #title>
      <div class="flex items-center justify-between">
        <span class="font-semibold">{{ t("tsfile.data.title") }}</span>
        <div class="flex gap-2">
          <Button size="small" @click="emit('export', 'csv')">
            <template #icon>
              <DownloadOutlined />
            </template>
            {{ t("tsfile.data.exportCsv") }}
          </Button>
          <Button size="small" @click="emit('export', 'json')">
            <template #icon>
              <DownloadOutlined />
            </template>
            {{ t("tsfile.data.exportJson") }}
          </Button>
        </div>
      </div>
    </template>

    <!-- 错误提示 -->
    <Alert
      v-if="error"
      type="error"
      :message="t('tsfile.error.loadFailed')"
      :description="error"
      show-icon
      class="mb-4"
    />

    <!-- 字段列控制条：搜索 + 列分页（避免一次性渲染数千列） -->
    <div
      v-if="!error && fieldColumnNames.length > columnPageSize"
      class="mb-3 flex flex-wrap items-center gap-3"
    >
      <Input
        :value="columnSearch"
        :placeholder="t('tsfile.data.searchColumn')"
        allow-clear
        size="small"
        style="width: 220px"
        @update:value="(v: string) => (columnSearch = v ?? '')"
      />
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">{{ t("tsfile.data.columnsPerPage") }}:</span>
        <Select
          :value="columnPageSize"
          :options="columnPageSizeOptions"
          size="small"
          style="width: 80px"
          @change="(v: number) => (columnPageSize = v)"
        />
      </div>
      <span class="text-sm text-gray-500">
        {{ t("tsfile.data.columns") }} {{ fieldColumnRange.start }}–{{ fieldColumnRange.end }} /
        {{ fieldColumnRange.total }}
      </span>
      <Pagination
        :current="columnPage"
        :page-size="columnPageSize"
        :total="filteredFieldColumns.length"
        :show-size-changer="false"
        size="small"
        simple
        @change="handleColumnPageChange"
      />
    </div>

    <!-- 时间戳精度说明 -->
    <Alert
      v-if="!error"
      type="info"
      show-icon
      :message="t('tsfile.data.precisionNote')"
      class="mb-3"
      banner
    />

    <!-- 数据表格 —— 外层 wrapper 撑满剩余空间，实测其高度供虚拟滚动使用 -->
    <div v-if="!error" ref="tableWrapper" class="flex-1 min-h-0">
    <Table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: scrollX, y: tableBodyHeight }"
      :virtual="true"
      bordered
      size="middle"
      row-key="_key"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'timestamp'">
          <Tooltip :title="`${t('tsfile.data.rawTimestamp')}: ${record.timestampRaw ?? text}`">
            <span class="font-mono text-xs timestamp-cell">
              {{ formatTimestamp(text as number) }}
            </span>
          </Tooltip>
        </template>
        <template v-else-if="column.key === '__device__'">
          <span class="font-medium">{{ text }}</span>
        </template>
        <template v-else>
          <span :class="typeof text === 'number' ? 'font-mono' : ''">
            {{ text }}
          </span>
        </template>
      </template>
    </Table>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && total > 0" class="mt-4 flex items-center justify-between border-t pt-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500"> {{ t("tsfile.data.limit") }}: </span>
          <Select
            :value="internalLimit"
            :options="limitOptions"
            size="small"
            style="width: 90px"
            @change="handleLimitChange"
          />
        </div>
        <span class="text-sm text-gray-500">
          {{ currentPage }} / {{ totalPages }} {{ t("tsfile.data.pages") }}
        </span>
      </div>

      <Pagination
        :current="currentPage"
        :page-size="internalLimit"
        :total="total"
        size="small"
        @change="handlePageChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !error && tableData.length === 0" class="py-8 text-center text-gray-500">
      {{ t("tsfile.data.noDataFound") }}
    </div>
  </Card>
</template>

<style scoped>
/* Card 内容区撑满并成为 flex 列容器，使表格 wrapper 的 flex-1 能拿到真实剩余高度 */
.data-table :deep(.ant-card-body) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 时间戳单元格：虚线下划线提示悬浮可查看原始存储值 */
.timestamp-cell {
  border-bottom: 1px dotted var(--ant-color-border, #bbb);
  cursor: help;
}
</style>
