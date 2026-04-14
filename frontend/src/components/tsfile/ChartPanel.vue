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
 * ChartPanel - ECharts 折线图面板
 * 使用 antdv-next 组件
 */
import type { ChartSeries, TimeRange } from "@/api/tsfile/types";

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Alert, Spin } from "antdv-next";
import { LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
]);

interface Props {
  series: ChartSeries[];
  timeRange?: TimeRange;
  loading?: boolean;
  error?: string | null;
  downsampled?: boolean;
  totalPoints?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  downsampled: false,
  totalPoints: 0,
  timeRange: undefined,
});

const { t } = useI18n();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const chartHeight = ref(500);

function calcChartHeight() {
  // Fill remaining viewport: subtract header(64) + filter(~140) + chart title(40) + padding(60)
  chartHeight.value = Math.max(400, window.innerHeight - 310);
}

const chartOption = computed(() => {
  const legendData = props.series.map((s) => s.name);
  const seriesData = props.series.map((s) => ({
    name: s.name,
    type: "line" as const,
    data: s.data,
    smooth: true,
    showSymbol: false,
    emphasis: { focus: "series" as const },
  }));

  return {
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "cross" as const },
      formatter: (params: unknown) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const firstParam = params[0] as { axisValue: number };
        const d = new Date(firstParam.axisValue);
        const pad = (n: number, len = 2) => String(n).padStart(len, '0');
        const time = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
        let result = `<div style="font-weight:600">${time}</div>`;
        for (const param of params as Array<{
          color: string;
          seriesName: string;
          value: number[];
        }>) {
          const value = param.value[1];
          const formattedValue = typeof value === "number" ? value.toFixed(4) : value;
          result += `<div style="display:flex;align-items:center;gap:4px">
            <span style="background-color:${param.color};width:10px;height:10px;border-radius:50%;display:inline-block"></span>
            <span>${param.seriesName}: ${formattedValue}</span>
          </div>`;
        }
        return result;
      },
    },
    legend: { data: legendData, type: "scroll" as const, bottom: 0 },
    grid: { left: "3%", right: "4%", bottom: "15%", top: "10%", containLabel: true },
    xAxis: {
      type: "time" as const,
      boundaryGap: false,
      axisLabel: {
        formatter: (value: number) => {
          const date = new Date(value);
          return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        },
      },
    },
    yAxis: {
      type: "value" as const,
    },
    dataZoom: [
      { type: "inside" as const, start: 0, end: 100 },
      { type: "slider" as const, start: 0, end: 100, bottom: "8%" },
    ],
    series: seriesData,
  };
});

function initChart() {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(chartOption.value);
}


function updateChart() {
  if (!chartInstance) {
    initChart();
    return;
  }
  chartInstance.setOption(chartOption.value, true);
  nextTick(() => chartInstance?.resize());
}

function resizeChart() {
  chartInstance?.resize();
}

watch(
  () => props.series,
  () => updateChart(),
  { deep: true },
);
watch(chartHeight, () => {
  nextTick(() => chartInstance?.resize());
});
watch(
  () => props.loading,
  (loading) => {
    if (chartInstance) {
      if (loading) chartInstance.showLoading();
      else chartInstance.hideLoading();
    }
  },
);

onMounted(() => {
  calcChartHeight();
  nextTick(() => {
    initChart();
  });
  window.addEventListener("resize", () => {
    calcChartHeight();
    resizeChart();
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-2 flex-shrink-0">
      <span class="font-semibold">{{ t("tsfile.chart.title") }}</span>
      <div v-if="totalPoints > 0" class="text-sm text-gray-500">
        {{ t("tsfile.chart.totalPoints") }}: {{ totalPoints.toLocaleString() }}
      </div>
    </div>

    <Alert
      v-if="downsampled"
      type="warning"
      :message="t('tsfile.chart.downsampledWarning')"
      :description="t('tsfile.chart.downsampledDescription')"
      show-icon
      class="mb-2 flex-shrink-0"
    />
    <Alert
      v-if="error"
      type="error"
      :message="t('tsfile.error.loadFailed')"
      :description="error"
      show-icon
      class="mb-2 flex-shrink-0"
    />

    <Spin :spinning="loading">
      <div
        v-show="!error && series.length > 0"
        ref="chartRef"
        :style="{ width: '100%', height: chartHeight + 'px' }"
      ></div>
      <div
        v-if="!loading && !error && series.length === 0"
        class="flex items-center justify-center text-gray-500"
        :style="{ height: chartHeight + 'px' }"
      >
        {{ t("tsfile.chart.noData") }}
      </div>
    </Spin>
  </div>
</template>
