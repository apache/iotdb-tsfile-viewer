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

import type { ThemeConfig } from "antdv-next";

const STRIPE_COLORS = {
  purple: "#533afd",
  purpleHover: "#4434d4",
  deepNavy: "#061b31",
  label: "#273951",
  slate: "#64748d",
  border: "#e5edf5",
  bgLayout: "#f6f9fc",
  success: "#15be53",
  successText: "#108c3d",
  warning: "#9b6829",
  ruby: "#ea2261",
  link: "#533afd",
  brandDark: "#1c1e54",
  darkNavy: "#0d253d",
};

export const stripeLightTokens: ThemeConfig["token"] = {
  colorPrimary: STRIPE_COLORS.purple,
  colorSuccess: STRIPE_COLORS.success,
  colorWarning: STRIPE_COLORS.warning,
  colorError: STRIPE_COLORS.ruby,
  colorInfo: STRIPE_COLORS.purple,
  colorLink: STRIPE_COLORS.link,

  colorText: STRIPE_COLORS.deepNavy,
  colorTextSecondary: STRIPE_COLORS.label,
  colorTextTertiary: STRIPE_COLORS.slate,
  colorTextQuaternary: "rgba(39, 57, 81, 0.45)",

  colorBorder: STRIPE_COLORS.border,
  colorBorderSecondary: "#edf0f4",

  colorBgContainer: "#ffffff",
  colorBgLayout: STRIPE_COLORS.bgLayout,
  colorBgElevated: "#ffffff",

  borderRadius: 4,
  borderRadiusLG: 8,
  borderRadiusSM: 4,

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyCode:
    "'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",

  boxShadow:
    "0 6px 12px -2px rgba(50, 50, 93, 0.25), 0 3px 7px -3px rgba(0, 0, 0, 0.1)",
  boxShadowSecondary:
    "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.1)",

  controlHeight: 36,
  controlHeightLG: 40,
  controlHeightSM: 28,
};

export const stripeDarkTokens: ThemeConfig["token"] = {
  colorPrimary: "#7a73ff",
  colorSuccess: "#3ecf6e",
  colorWarning: "#d4a04a",
  colorError: "#f25a7c",
  colorInfo: "#7a73ff",
  colorLink: "#9490ff",

  colorBorder: "#2a3a50",
  colorBorderSecondary: "#1e2d40",

  colorBgContainer: "#0b1b2e",
  colorBgLayout: "#060f1a",
  colorBgElevated: "#0f2035",

  borderRadius: 4,
  borderRadiusLG: 8,
  borderRadiusSM: 4,

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontFamilyCode:
    "'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",

  boxShadow:
    "0 6px 12px -2px rgba(0, 0, 0, 0.4), 0 3px 7px -3px rgba(0, 0, 0, 0.3)",
  boxShadowSecondary:
    "0 13px 27px -5px rgba(0, 0, 0, 0.4), 0 8px 16px -8px rgba(0, 0, 0, 0.3)",

  controlHeight: 36,
  controlHeightLG: 40,
  controlHeightSM: 28,
};

export const stripeComponentTokens: ThemeConfig["components"] = {
  Button: {
    primaryShadow: "0 1px 2px rgba(50, 50, 93, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    defaultShadow: "0 1px 2px rgba(50, 50, 93, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
    fontWeight: 400,
    borderRadius: 4,
  },
  Card: {
    borderRadiusLG: 6,
  },
  Table: {
    borderRadiusLG: 8,
    headerBg: STRIPE_COLORS.bgLayout,
  },
  Input: {
    activeShadow: `0 0 0 2px rgba(83, 58, 253, 0.15)`,
    borderRadius: 4,
  },
  Select: {
    optionSelectedBg: "rgba(83, 58, 253, 0.08)",
    borderRadius: 4,
  },
  Menu: {
    itemBorderRadius: 6,
  },
  Tabs: {
    inkBarColor: STRIPE_COLORS.purple,
    itemActiveColor: STRIPE_COLORS.purple,
    itemSelectedColor: STRIPE_COLORS.purple,
  },
};

export const stripeLightLayoutTokens = {
  Layout: {
    headerBg: STRIPE_COLORS.darkNavy,
    bodyBg: STRIPE_COLORS.bgLayout,
    siderBg: "#ffffff",
    triggerBg: STRIPE_COLORS.deepNavy,
    headerColor: "#ffffff",
    lightSiderBg: "#ffffff",
  },
};

export const stripeDarkLayoutTokens = {
  Layout: {
    headerBg: "#0f2035",
    bodyBg: "#060f1a",
    siderBg: "#0b1b2e",
    triggerBg: "#0b1b2e",
    headerColor: "#ffffff",
    lightSiderBg: "#0b1b2e",
  },
};

export { STRIPE_COLORS };
