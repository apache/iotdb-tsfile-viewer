/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import type { AdvancedCondition, FilterConditions, ValueRange } from "@/api/tsfile/types";

/**
 * Filter Store - 筛选条件状态管理
 */
import { ref } from "vue";

import { defineStore } from "pinia";

export const useFilterStore = defineStore("tsfile-filter", () => {
  const filters = ref<FilterConditions>({
    limit: 100,
    offset: 0,
  });

  // Table model specific filters
  const selectedTable = ref<null | string>(null);
  const selectedFields = ref<string[]>([]);

  function setTimeRange(startTime?: number, endTime?: number) {
    filters.value.startTime = startTime;
    filters.value.endTime = endTime;
  }

  function setDevices(devices?: string[]) {
    filters.value.devices = devices;
  }

  function setMeasurements(measurements?: string[]) {
    filters.value.measurements = measurements;
  }

  function setValueRange(valueRange?: ValueRange) {
    filters.value.valueRange = valueRange;
  }

  function setPagination(limit: number, offset: number) {
    filters.value.limit = limit;
    filters.value.offset = offset;
  }

  function resetFilters() {
    filters.value = {
      limit: 100,
      offset: 0,
    };
    selectedTable.value = null;
    selectedFields.value = [];
  }

  function getFilters(): FilterConditions {
    return { ...filters.value };
  }

  // Table model specific
  function setSelectedTable(tableName: null | string) {
    selectedTable.value = tableName;
  }

  function setSelectedFields(fields: string[]) {
    selectedFields.value = fields;
  }

  // Advanced conditions management
  function setAdvancedConditions(conditions: AdvancedCondition[]) {
    filters.value.advancedConditions = conditions;
  }

  function addAdvancedCondition(condition: Omit<AdvancedCondition, "id">) {
    if (!filters.value.advancedConditions) {
      filters.value.advancedConditions = [];
    }
    if (filters.value.advancedConditions.length >= 10) {
      throw new Error("Maximum 10 conditions allowed");
    }
    filters.value.advancedConditions.push({
      ...condition,
      id: crypto.randomUUID(),
    });
  }

  function removeAdvancedCondition(id: string) {
    if (filters.value.advancedConditions) {
      const index = filters.value.advancedConditions.findIndex((c) => c.id === id);
      if (index !== -1) {
        filters.value.advancedConditions.splice(index, 1);
      }
    }
  }

  function updateAdvancedCondition(id: string, updates: Partial<AdvancedCondition>) {
    if (filters.value.advancedConditions) {
      const condition = filters.value.advancedConditions.find((c) => c.id === id);
      if (condition) {
        Object.assign(condition, updates);
      }
    }
  }

  function clearAdvancedConditions() {
    filters.value.advancedConditions = [];
  }

  function getAdvancedConditionsCount(): number {
    return filters.value.advancedConditions?.length ?? 0;
  }

  return {
    filters,
    selectedTable,
    selectedFields,
    setTimeRange,
    setDevices,
    setMeasurements,
    setValueRange,
    setPagination,
    resetFilters,
    getFilters,
    setSelectedTable,
    setSelectedFields,
    // Advanced conditions
    setAdvancedConditions,
    addAdvancedCondition,
    removeAdvancedCondition,
    updateAdvancedCondition,
    clearAdvancedConditions,
    getAdvancedConditionsCount,
  };
});
