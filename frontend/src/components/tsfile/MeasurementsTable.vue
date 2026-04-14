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
 * MeasurementsTable 组件 - 测点列表表格
 * 显示测点名称、数据类型、编码方式、压缩方式
 */
import type { Measurement } from "@/api/tsfile/types";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { Card, Input, Spin, Table, Tag } from "antdv-next";

interface Props {
  measurements: Measurement[];
  loading?: boolean;
  scrollY?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  scrollY: 400,
});

const { t } = useI18n();

const searchQuery = ref("");

// 过滤后的测点列表
const filteredMeasurements = computed(() => {
  let list = props.measurements.filter((m) => m.dataType !== "VECTOR");
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter((m) => m.name?.toLowerCase().includes(query));
  }
  return list;
});

// 非 VECTOR 类型的总数
const totalNonVector = computed(() => props.measurements.filter((m) => m.dataType !== "VECTOR").length);

// 是否显示 columnCategory 列
const hasColumnCategory = computed(() => props.measurements.some((m) => m.columnCategory));

// 数据类型颜色映射（与 TablesTable 保持一致）
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

const columns = computed(() => {
  const cols: Array<{ title: string; dataIndex: string; key: string; width?: number }> = [
    {
      title: t("tsfile.metadata.measurementName"),
      dataIndex: "name",
      key: "name",
    },
  ];

  if (hasColumnCategory.value) {
    cols.push({
      title: t("tsfile.metadata.columnCategory"),
      dataIndex: "columnCategory",
      key: "columnCategory",
      width: 100,
    });
  }

  cols.push(
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
  );

  return cols;
});
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <span class="font-semibold">
          {{ t("tsfile.metadata.measurements") }}
          <span class="ml-2 text-sm font-normal text-gray-500">
            ({{ filteredMeasurements.length }} / {{ totalNonVector }})
          </span>
        </span>
        <Input
          v-model:value="searchQuery"
          :placeholder="t('tsfile.metadata.searchMeasurements')"
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
        :data-source="filteredMeasurements"
        :columns="columns"
        :pagination="false"
        :scroll="{ y: props.scrollY }"
        row-key="name"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span class="font-medium">{{ record.name }}</span>
          </template>
          <template v-else-if="column.key === 'dataType'">
            <Tag :color="getDataTypeColor(record.dataType)">
              {{ record.dataType }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'columnCategory'">
            <Tag
              v-if="record.columnCategory"
              :color="record.columnCategory === 'TAG' ? 'orange' : 'green'"
            >
              {{ record.columnCategory }}
            </Tag>
          </template>
        </template>
      </Table>

      <div v-if="measurements.length === 0" class="py-8 text-center text-gray-500">
        {{ t("tsfile.metadata.noMeasurements") }}
      </div>
    </Spin>
  </Card>
</template>
