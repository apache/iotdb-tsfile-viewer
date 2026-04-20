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
 * ScanChart - 扫描统计图表组件
 *
 * Health status pie chart + Error type bar chart using ECharts.
 * Clicking a chart category triggers scanStore.setFilter().
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch, shallowRef } from "vue";
import * as echarts from "echarts";
import { useI18n } from "vue-i18n";
import { useScanStore } from "@/stores/tsfile/scan";

const { t } = useI18n();
const scanStore = useScanStore();

interface ChartDataItem {
  name: string;
  value: number;
}

const props = defineProps<{
  healthStatusData: ChartDataItem[];
  errorTypeData: ChartDataItem[];
}>();

const pieRef = ref<HTMLDivElement>();
const barRef = ref<HTMLDivElement>();
const pieChart = shallowRef<echarts.ECharts>();
const barChart = shallowRef<echarts.ECharts>();
const mounted = ref(false);

const healthStatusColors: Record<string, string> = {
  HEALTHY: "#52c41a",
  WARNING: "#faad14",
  ERROR: "#ff4d4f",
};

function hasNonZero(data: ChartDataItem[]): boolean {
  return data.some((item) => item.value > 0);
}

function renderPie(data: ChartDataItem[]) {
  if (!pieRef.value) return;
  if (!pieChart.value) pieChart.value = echarts.init(pieRef.value);

  const coloredData = data.map((item) => ({
    ...item,
    itemStyle: { color: healthStatusColors[item.name] || "#909399" },
  }));

  pieChart.value.setOption({
    title: { text: t("tsfile.scan.healthStatusChart"), left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: "2%", left: "center" },
    series: [{
      name: t("tsfile.scan.healthStatus"),
      type: "pie",
      radius: ["40%", "65%"],
      label: { show: true, formatter: "{b}: {c}" },
      data: coloredData,
    }],
  }, true);

  pieChart.value.off("click");
  pieChart.value.on("click", (params: any) => {
    if (params.data?.name) scanStore.setFilter({ healthStatus: params.data.name });
  });
}

function renderBar(data: ChartDataItem[]) {
  if (!barRef.value) return;
  if (!barChart.value) barChart.value = echarts.init(barRef.value);

  const names = data.map((item) => t(`tsfile.scan.errorTypeName.${item.name}`));
  const values = data.map((item) => item.value);
  const originalNames = data.map((item) => item.name);

  barChart.value.setOption({
    title: { text: t("tsfile.scan.errorTypeChart"), left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: names, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: "value", name: t("tsfile.scan.fileCount"), minInterval: 1 },
    series: [{ name: t("tsfile.scan.fileCount"), type: "bar", data: values, itemStyle: { color: "#1677ff" }, barMaxWidth: 40 }],
  }, true);

  barChart.value.off("click");
  barChart.value.on("click", (params: any) => {
    const errorType = originalNames[params.dataIndex];
    if (errorType) scanStore.setFilter({ errorType: errorType as any });
  });
}

function handleResize() {
  pieChart.value?.resize();
  barChart.value?.resize();
}

onMounted(() => {
  mounted.value = true;
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  pieChart.value?.dispose();
  barChart.value?.dispose();
});

function tryRenderCharts() {
  if (!mounted.value) return;
  nextTick(() => {
    if (hasNonZero(props.healthStatusData)) renderPie(props.healthStatusData);
    if (hasNonZero(props.errorTypeData)) renderBar(props.errorTypeData);
  });
}

watch(() => props.healthStatusData, () => tryRenderCharts(), { deep: true });
watch(() => props.errorTypeData, () => tryRenderCharts(), { deep: true });
watch(mounted, (val) => { if (val) tryRenderCharts(); });
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div ref="pieRef" class="min-h-[300px]" />
    <div ref="barRef" class="min-h-[300px]" />
  </div>
</template>
