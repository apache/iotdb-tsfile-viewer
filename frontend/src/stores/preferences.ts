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
 * Preferences Store - 用户偏好设置管理
 */
import { ref } from "vue";

import { defineStore } from "pinia";

export type Theme = "light" | "dark" | "auto";
export type Language = "zh-CN" | "en-US";

export interface LayoutConfig {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  headerVisible: boolean;
  headerHeight: number;
}

export interface PreferencesState {
  theme: Theme;
  language: Language;
  timezone: string;
  layout: LayoutConfig;
}

const STORAGE_KEY = "tsfile-viewer-preferences";

const DEFAULT_PREFERENCES: PreferencesState = {
  theme: "auto",
  language: "zh-CN",
  timezone: "Asia/Shanghai",
  layout: {
    sidebarCollapsed: false,
    sidebarWidth: 240,
    headerVisible: true,
    headerHeight: 64,
  },
};

export const usePreferencesStore = defineStore("preferences", () => {
  const theme = ref<Theme>(DEFAULT_PREFERENCES.theme);
  const language = ref<Language>(DEFAULT_PREFERENCES.language);
  const timezone = ref<string>(DEFAULT_PREFERENCES.timezone);
  const layout = ref<LayoutConfig>({ ...DEFAULT_PREFERENCES.layout });

  // Load preferences from localStorage
  function loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValidPreferences(parsed)) {
          theme.value = parsed.theme;
          language.value = parsed.language;
          timezone.value = parsed.timezone;
          layout.value = { ...parsed.layout };
        } else {
          console.warn("Invalid preferences in localStorage, using defaults");
          savePreferences();
        }
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage:", error);
    }
  }

  // Save preferences to localStorage
  function savePreferences() {
    try {
      const state: PreferencesState = {
        theme: theme.value,
        language: language.value,
        timezone: timezone.value,
        layout: { ...layout.value },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save preferences to localStorage:", error);
    }
  }

  // Set theme
  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    savePreferences();
  }

  // Set language
  function setLanguage(newLanguage: Language) {
    language.value = newLanguage;
    savePreferences();
  }

  // Set timezone
  function setTimezone(newTimezone: string) {
    timezone.value = newTimezone;
    savePreferences();
  }

  // Set layout configuration
  function setLayout(newLayout: Partial<LayoutConfig>) {
    layout.value = { ...layout.value, ...newLayout };
    savePreferences();
  }

  // Reset to defaults
  function resetPreferences() {
    theme.value = DEFAULT_PREFERENCES.theme;
    language.value = DEFAULT_PREFERENCES.language;
    timezone.value = DEFAULT_PREFERENCES.timezone;
    layout.value = { ...DEFAULT_PREFERENCES.layout };
    savePreferences();
  }

  // Cross-tab synchronization
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (isValidPreferences(parsed)) {
            theme.value = parsed.theme;
            language.value = parsed.language;
            timezone.value = parsed.timezone;
            layout.value = { ...parsed.layout };
          }
        } catch (error) {
          console.error("Failed to sync preferences from storage event:", error);
        }
      }
    });
  }

  return {
    theme,
    language,
    timezone,
    layout,
    setTheme,
    setLanguage,
    setTimezone,
    setLayout,
    loadPreferences,
    resetPreferences,
  };
});

// Type guard for preferences validation
function isValidPreferences(value: unknown): value is PreferencesState {
  if (!value || typeof value !== "object") return false;

  const candidate = value as PreferencesState;

  // Validate theme
  if (!["light", "dark", "auto"].includes(candidate.theme)) return false;

  // Validate language
  if (!["zh-CN", "en-US"].includes(candidate.language)) return false;

  // Validate timezone
  if (typeof candidate.timezone !== "string") return false;

  // Validate layout
  if (!candidate.layout || typeof candidate.layout !== "object") return false;
  const layoutCandidate = candidate.layout;
  if (
    typeof layoutCandidate.sidebarCollapsed !== "boolean" ||
    typeof layoutCandidate.sidebarWidth !== "number" ||
    typeof layoutCandidate.headerVisible !== "boolean" ||
    typeof layoutCandidate.headerHeight !== "number"
  ) {
    return false;
  }

  return true;
}
