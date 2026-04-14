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
 * RowGroupsTable 组件 - RowGroup 列表表格
 * 显示设备、时间范围、Chunk 数量
 */
import type { RowGroup } from "@/api/tsfile/types";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { Card, Input, Spin, Table } from "antdv-next";

interface Props {
  rowGroups: RowGroup[];
  loading?: boolean;
  scrollY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  scrollY: 400,
});

const { t } = useI18n();

const searchQuery = ref("");

// 过滤后的 RowGroup 列表
const filteredRowGroups = computed(() => {
  if (!searchQuery.value) {
    return props.rowGroups;
  }
  const query = searchQuery.value.toLowerCase();
  return props.rowGroups.filter((rg) => rg.device?.toLowerCase().includes(query));
});

// 格式化时间
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

const columns = computed(() => [
  {
    title: t("tsfile.metadata.rowGroupIndex"),
    dataIndex: "index",
    key: "index",
    width: 80,
    align: "center" as const,
  },
  {
    title: t("tsfile.metadata.device"),
    dataIndex: "device",
    key: "device",
  },
  {
    title: t("tsfile.metadata.timeRange"),
    key: "timeRange",
  },
  {
    title: t("tsfile.metadata.chunkCount"),
    dataIndex: "chunkCount",
    key: "chunkCount",
    width: 120,
    align: "center" as const,
  },
]);
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <span class="font-semibold">
          {{ t("tsfile.metadata.rowGroups") }}
          <span class="ml-2 text-sm font-normal text-gray-500">
            ({{ filteredRowGroups.length }} / {{ rowGroups.length }})
          </span>
        </span>
        <Input
          v-model:value="searchQuery"
          :placeholder="t('tsfile.metadata.searchByDevice')"
          allow-clear
          class="w-64"
          size="small"
        >
          <template #prefix>
            <span class="i-mdi:magnify" />
          </template>
        </Input>
      </div>
    </template>

    <Spin :spinning="loading">
      <Table
        :data-source="filteredRowGroups"
        :columns="columns"
        :pagination="false"
        :scroll="{ y: props.scrollY }"
        :virtual="filteredRowGroups.length > 100"
        row-key="index"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'device'">
            <span class="font-medium">{{ record.device }}</span>
          </template>
          <template v-else-if="column.key === 'timeRange'">
            <span class="font-mono text-xs">
              {{ formatTime(record.startTime) }}
            </span>
            <span class="mx-2 text-gray-400">~</span>
            <span class="font-mono text-xs">
              {{ formatTime(record.endTime) }}
            </span>
          </template>
        </template>
      </Table>

      <div v-if="rowGroups.length === 0" class="py-8 text-center text-gray-500">
        {{ t("tsfile.metadata.noRowGroups") }}
      </div>
    </Spin>
  </Card>
</template>
