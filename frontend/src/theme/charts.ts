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

/**
 * ECharts 主题。取值与 src/styles/tokens.css 中的设计规范 token 保持一致；
 * 因为 ECharts 只接受具体色值、读不到 CSS 变量，这里必须重复一份常量。
 */

export const BRAND_COLORS = {
  primary: "#495AD4",
  primaryHover: "#3C4AB0",

  success: "#67C23A",
  warning: "#E6A23C",
  danger: "#F56C6C",
  info: "#909399",

  heading: "#061B31",
  label: "#273951",
  body: "#64748D",
  border: "#E5EDF5",
  borderSecondary: "#EDF1F6",
  cardBackground: "#FFFFFF",

  dark: {
    heading: "#FFFFFF",
    label: "#CBD5E1",
    body: "#94A3B8",
    border: "#1E2940",
    borderSecondary: "#182131",
    cardBackground: "#141C2E",
  },

  chart: [
    "#495AD4",
    "#3BA6C9",
    "#45B97C",
    "#EAC54F",
    "#EE8F4B",
    "#8E5BD9",
    "#7A88E0",
    "#63C5B5",
  ],
} as const;

export const CHART_COLORS = [...BRAND_COLORS.chart];

export const STATUS_COLORS = {
  HEALTHY: BRAND_COLORS.success,
  WARNING: BRAND_COLORS.warning,
  ERROR: BRAND_COLORS.danger,
  OFFLINE: BRAND_COLORS.info,
} as const;

export function getChartStyle(isDark: boolean) {
  const textHeading = isDark ? BRAND_COLORS.dark.heading : BRAND_COLORS.heading;
  const textLabel = isDark ? BRAND_COLORS.dark.label : BRAND_COLORS.label;
  const textBody = isDark ? BRAND_COLORS.dark.body : BRAND_COLORS.body;
  const border = isDark ? BRAND_COLORS.dark.border : BRAND_COLORS.border;
  const splitLine = isDark
    ? BRAND_COLORS.dark.borderSecondary
    : BRAND_COLORS.borderSecondary;
  const background = isDark
    ? BRAND_COLORS.dark.cardBackground
    : BRAND_COLORS.cardBackground;

  return {
    color: CHART_COLORS,
    backgroundColor: "transparent",
    textStyle: {
      color: textLabel,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    },
    title: {
      textStyle: { color: textHeading, fontSize: 14, fontWeight: 400 },
    },
    legend: {
      textStyle: { color: textLabel },
      pageTextStyle: { color: textBody },
    },
    tooltip: {
      backgroundColor: background,
      borderColor: border,
      textStyle: { color: textHeading },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: border } },
      axisTick: { lineStyle: { color: border } },
      axisLabel: { color: textBody },
      splitLine: { show: false },
    },
    timeAxis: {
      axisLine: { lineStyle: { color: border } },
      axisTick: { lineStyle: { color: border } },
      axisLabel: { color: textBody },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textBody },
      splitLine: { lineStyle: { color: splitLine } },
    },
  };
}
