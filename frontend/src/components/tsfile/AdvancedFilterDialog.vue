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

import { Button, Input, Modal, Select, Tag } from "antdv-next";
import { DeleteOutlined, PlusOutlined } from "@antdv-next/icons";
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
  <Modal
    :open="open"
    :title="t('tsfile.data.advancedFilterTitle')"
    :width="700"
    @cancel="handleCancel"
  >
    <div class="space-y-4">
      <!-- 说明 -->
      <p class="text-sm text-gray-500">
        {{ t("tsfile.data.advancedFilterDesc") }}
      </p>

      <!-- 条件列表 -->
      <div v-if="internalConditions.length > 0" class="space-y-3">
        <div
          v-for="(condition, index) in internalConditions"
          :key="condition.id"
          class="flex items-center gap-2 rounded-lg border bg-gray-50 p-3 dark:bg-gray-800"
        >
          <!-- 字段选择 -->
          <Select
            v-model:value="condition.field"
            :placeholder="t('tsfile.data.selectField')"
            :options="fieldOptions"
            show-search
            class="w-40"
            size="small"
          />

          <!-- 运算符选择 -->
          <Select
            v-model:value="condition.operator"
            :placeholder="t('tsfile.data.selectOperator')"
            :options="operatorOptions"
            class="w-32"
            size="small"
          />

          <!-- 值输入 -->
          <Input
            :value="String(condition.value)"
            :placeholder="t('tsfile.data.enterValue')"
            class="w-32"
            size="small"
            @update:value="condition.value = $event"
          />

          <!-- 逻辑运算符（非最后一个条件时显示） -->
          <Select
            v-if="index < internalConditions.length - 1"
            v-model:value="condition.logic"
            :options="logicOptions"
            class="w-20"
            size="small"
          />
          <div v-else class="w-20" />

          <!-- 删除按钮 -->
          <Button type="text" danger shape="circle" size="small" @click="removeCondition(index)">
            <template #icon>
              <DeleteOutlined />
            </template>
          </Button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="rounded-lg border-2 border-dashed py-8 text-center text-gray-500">
        {{ t("tsfile.data.noConditions") }}
      </div>

      <!-- 添加条件按钮 -->
      <div class="flex items-center justify-between">
        <Button :disabled="!canAddMore" type="dashed" size="small" @click="addCondition">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t("tsfile.data.addCondition") }}
        </Button>

        <Tag v-if="!canAddMore" color="warning">
          {{ t("tsfile.data.maxConditionsReached") }}
        </Tag>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <Button v-if="internalConditions.length > 0" danger @click="clearAll">
          {{ t("tsfile.common.clear") }}
        </Button>
        <div v-else />

        <div class="flex gap-2">
          <Button @click="handleCancel">
            {{ t("tsfile.common.cancel") }}
          </Button>
          <Button type="primary" @click="handleApply">
            {{ t("tsfile.common.apply") }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
