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
 * AdvancedFilterDialog - 高级条件筛选对话框
 * 支持多条件组合筛选
 */
import type { AdvancedCondition, ComparisonOperator, LogicalOperator } from "@/api/tsfile/types";

import { computed, ref, watch } from "vue";

import { Trash2, Plus } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

interface Props {
  open: boolean;
  conditions: AdvancedCondition[];
  availableFields: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [conditions: AdvancedCondition[]];
  "update:open": [value: boolean];
}>();

const { t } = useI18n();

// 内部条件列表
const internalConditions = ref<AdvancedCondition[]>([]);

// 运算符选项
const operatorOptions = computed<Array<{ label: string; value: ComparisonOperator }>>(() => [
  { label: t("tsfile.data.operatorEqual"), value: "EQUAL" },
  { label: t("tsfile.data.operatorNotEqual"), value: "NOT_EQUAL" },
  { label: t("tsfile.data.operatorGreater"), value: "GREATER" },
  { label: t("tsfile.data.operatorLess"), value: "LESS" },
  { label: t("tsfile.data.operatorGreaterEqual"), value: "GREATER_EQUAL" },
  { label: t("tsfile.data.operatorLessEqual"), value: "LESS_EQUAL" },
]);

// 逻辑运算符选项
const logicOptions: Array<{ label: string; value: LogicalOperator }> = [
  { label: "AND", value: "AND" },
  { label: "OR", value: "OR" },
];

// 字段选项
const fieldOptions = computed(() =>
  props.availableFields.map((field) => ({ label: field, value: field })),
);

// 最大条件数
const MAX_CONDITIONS = 10;

// 是否可以添加更多条件
const canAddMore = computed(() => internalConditions.value.length < MAX_CONDITIONS);

// 同步外部条件到内部
watch(
  () => props.conditions,
  (newConditions) => {
    internalConditions.value = newConditions.map((c) => ({ ...c }));
  },
  { immediate: true, deep: true },
);

// 生成唯一 ID
function generateId(): string {
  return `cond_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// 添加条件
function addCondition() {
  if (!canAddMore.value) return;

  const newCondition: AdvancedCondition = {
    id: generateId(),
    field: props.availableFields[0] || "",
    operator: "EQUAL",
    value: "",
    logic: "AND",
  };

  internalConditions.value.push(newCondition);
}

// 删除条件
function removeCondition(index: number) {
  internalConditions.value.splice(index, 1);
}

// 应用筛选
function handleApply() {
  const validConditions = internalConditions.value.filter((c) => c.field && c.value !== "");
  emit("apply", validConditions);
  emit("update:open", false);
}

// 取消
function handleCancel() {
  internalConditions.value = props.conditions.map((c) => ({ ...c }));
  emit("update:open", false);
}

// 清空所有条件
function clearAll() {
  internalConditions.value = [];
}
</script>

<template>
  <el-dialog
    :model-value="open"
    :title="t('tsfile.data.advancedFilterTitle')"
    width="700"
    @update:model-value="emit('update:open', $event)"
    @close="handleCancel"
  >
    <div class="space-y-4">
      <!-- 说明 -->
      <p class="text-sm text-text-label">
        {{ t("tsfile.data.advancedFilterDesc") }}
      </p>

      <!-- 条件列表 -->
      <div v-if="internalConditions.length > 0" class="space-y-3">
        <div
          v-for="(condition, index) in internalConditions"
          :key="condition.id"
          class="flex items-center gap-2 rounded-lg border border-border-default bg-bg-subtle p-3"
        >
          <!-- 字段选择 -->
          <el-select
            v-model="condition.field"
            :placeholder="t('tsfile.data.selectField')"
            filterable
            class="w-40"
            size="small"
          >
            <el-option
              v-for="fieldOption in fieldOptions"
              :key="fieldOption.value"
              :label="fieldOption.label"
              :value="fieldOption.value"
            />
          </el-select>

          <!-- 运算符选择 -->
          <el-select v-model="condition.operator" :placeholder="t('tsfile.data.selectOperator')" class="w-32" size="small">
            <el-option
              v-for="operatorOption in operatorOptions"
              :key="operatorOption.value"
              :label="operatorOption.label"
              :value="operatorOption.value"
            />
          </el-select>

          <!-- 值输入 -->
          <el-input
            :model-value="String(condition.value)"
            :placeholder="t('tsfile.data.enterValue')"
            class="w-32"
            size="small"
            @update:model-value="condition.value = $event"
          />

          <!-- 逻辑运算符（非最后一个条件时显示） -->
          <el-select
            v-if="index < internalConditions.length - 1"
            v-model="condition.logic"
            class="w-20"
            size="small"
          >
            <el-option
              v-for="logicOption in logicOptions"
              :key="logicOption.value"
              :label="logicOption.label"
              :value="logicOption.value"
            />
          </el-select>
          <div v-else class="w-20" />

          <!-- 删除按钮 -->
          <el-button link type="danger" circle size="small" @click="removeCondition(index)">
            <Trash2 :size="16" />
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="rounded-lg border-2 border-dashed border-border-default py-8 text-center text-text-label">
        {{ t("tsfile.data.noConditions") }}
      </div>

      <!-- 添加条件按钮 -->
      <div class="flex items-center justify-between">
        <el-button :disabled="!canAddMore" plain size="small" @click="addCondition">
          <Plus :size="16" class="mr-1" />
          {{ t("tsfile.data.addCondition") }}
        </el-button>

        <el-tag v-if="!canAddMore" type="warning">
          {{ t("tsfile.data.maxConditionsReached") }}
        </el-tag>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <el-button v-if="internalConditions.length > 0" type="danger" @click="clearAll">
          {{ t("tsfile.common.clear") }}
        </el-button>
        <div v-else />

        <div class="flex gap-2">
          <el-button @click="handleCancel">
            {{ t("tsfile.common.cancel") }}
          </el-button>
          <el-button type="primary" @click="handleApply">
            {{ t("tsfile.common.apply") }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
