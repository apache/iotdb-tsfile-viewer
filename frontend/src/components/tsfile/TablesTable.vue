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
 * TablesTable 组件 - 表模型的表列表
 * 显示表名、标签列、字段列
 */
import type { Table } from "@/api/tsfile/types";

import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Card, Collapse, Spin, Table as ATable, Tag } from "antdv-next";

interface Props {
  tables: Table[];
  loading?: boolean;
  scrollY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  scrollY: 400,
});

const innerScrollY = computed(() => Math.max(150, Math.floor((props.scrollY - 120) / 2)));

const { t } = useI18n();

const activeKeys = ref<(string | number)[]>([]);

// Auto-expand all panels when tables data arrives
watch(
  () => props.tables,
  (tables) => {
    if (tables.length > 0 && activeKeys.value.length === 0) {
      activeKeys.value = tables.map((tbl) => tbl.tableName);
    }
  },
  { immediate: true },
);

// 数据类型颜色映射
function getDataTypeColor(dataType: string): string | undefined {
  const colorMap: Record<string, string> = {
    INT32: "blue",
    INT64: "blue",
    FLOAT: "green",
    DOUBLE: "green",
    BOOLEAN: "orange",
    TEXT: "cyan",
    STRING: "cyan",
  };
  return colorMap[dataType];
}

const tableColumns = computed(() => [
  {
    title: t("tsfile.metadata.columnName"),
    dataIndex: "name",
    key: "name",
  },
  {
    title: t("tsfile.metadata.dataType"),
    dataIndex: "dataType",
    key: "dataType",
    width: 120,
  },
  {
    title: t("tsfile.metadata.encoding"),
    dataIndex: "encoding",
    key: "encoding",
    width: 120,
  },
  {
    title: t("tsfile.metadata.compression"),
    dataIndex: "compression",
    key: "compression",
    width: 120,
  },
]);

// Build collapse items from tables prop
const collapseItems = computed(() =>
  props.tables.map((table) => ({
    key: table.tableName,
    label: `${table.tableName}  (Tag: ${table.tagColumns.length}, Field: ${table.fieldColumns.length})`,
  })),
);

// Helper to find table by key
function getTable(key: string): Table | undefined {
  return props.tables.find((tbl) => tbl.tableName === key);
}
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <span class="font-semibold">
          {{ t("tsfile.metadata.tables") }}
          <span class="ml-2 text-sm font-normal text-gray-500"> ({{ tables.length }}) </span>
        </span>
      </div>
    </template>

    <Spin :spinning="loading">
      <Collapse v-if="tables.length > 0" v-model:activeKey="activeKeys" :items="collapseItems">
        <template #contentRender="{ item }">
          <div v-if="getTable(String(item.key))" class="space-y-4">
            <!-- 标签列 -->
            <div>
              <h4 class="mb-2 text-sm font-medium text-gray-600">
                {{ t("tsfile.metadata.tagColumnsDesc") }}
              </h4>
              <ATable
                v-if="getTable(String(item.key))!.tagColumns.length > 0"
                :data-source="getTable(String(item.key))!.tagColumns"
                :columns="tableColumns"
                :pagination="false"
                :scroll="{ y: innerScrollY }"
                row-key="name"
                size="small"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'dataType'">
                    <Tag :color="getDataTypeColor(record.dataType)">
                      {{ record.dataType }}
                    </Tag>
                  </template>
                </template>
              </ATable>
              <div v-else class="text-sm text-gray-500">
                {{ t("tsfile.metadata.noTagColumns") }}
              </div>
            </div>

            <!-- 字段列 -->
            <div>
              <h4 class="mb-2 text-sm font-medium text-gray-600">
                {{ t("tsfile.metadata.fieldColumnsDesc") }}
              </h4>
              <ATable
                v-if="getTable(String(item.key))!.fieldColumns.length > 0"
                :data-source="getTable(String(item.key))!.fieldColumns"
                :columns="tableColumns"
                :pagination="false"
                :scroll="{ y: innerScrollY }"
                row-key="name"
                size="small"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'dataType'">
                    <Tag :color="getDataTypeColor(record.dataType)">
                      {{ record.dataType }}
                    </Tag>
                  </template>
                </template>
              </ATable>
              <div v-else class="text-sm text-gray-500">
                {{ t("tsfile.metadata.noFieldColumns") }}
              </div>
            </div>
          </div>
        </template>
      </Collapse>

      <div v-else class="py-8 text-center text-gray-500">
        {{ t("tsfile.metadata.noTables") }}
      </div>
    </Spin>
  </Card>
</template>
