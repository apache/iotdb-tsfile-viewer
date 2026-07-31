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

import { Search } from "lucide-vue-next";

import { tableStyleProps } from "@/utils/tableStyle";
import { getDataTypeTagType } from "@/utils/dataTypeTag";

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
const totalNonVector = computed(
  () => props.measurements.filter((m) => m.dataType !== "VECTOR").length,
);

// 是否显示 columnCategory 列
const hasColumnCategory = computed(() =>
  props.measurements.some((m) => m.columnCategory),
);
</script>

<template>
  <div class="tc-panel">
    <div class="tc-panel-title">
      <span>
        {{ t("tsfile.metadata.measurements") }}
        <span class="ml-2 text-xs text-text-body tnum">
          ({{ filteredMeasurements.length }} / {{ totalNonVector }})
        </span>
      </span>
      <el-input
        v-model="searchQuery"
        :placeholder="t('tsfile.metadata.searchMeasurements')"
        clearable
        class="w-64"
        size="small"
      >
        <template #prefix>
          <Search class="h-3.5 w-3.5" :stroke-width="1.75" />
        </template>
      </el-input>
    </div>

    <div class="p-4">
      <div class="tc-table-card">
        <el-table
          v-bind="tableStyleProps"
          v-loading="loading"
          :data="filteredMeasurements"
          :max-height="props.scrollY"
          row-key="name"
          size="small"
          border
          :empty-text="t('tsfile.metadata.noMeasurements')"
        >
          <el-table-column
            :label="t('tsfile.metadata.measurementName')"
            prop="name"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="hasColumnCategory"
            :label="t('tsfile.metadata.columnCategory')"
            :width="100"
          >
            <template #default="{ row }">
              <el-tag
                v-if="row.columnCategory"
                :type="row.columnCategory === 'TAG' ? 'warning' : 'success'"
                size="small"
              >
                {{ row.columnCategory }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('tsfile.metadata.dataType')" :width="120">
            <template #default="{ row }">
              <el-tag :type="getDataTypeTagType(row.dataType)" size="small">
                {{ row.dataType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('tsfile.metadata.encoding')"
            prop="encoding"
            :width="120"
          />
          <el-table-column
            :label="t('tsfile.metadata.compression')"
            prop="compression"
            :width="120"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
