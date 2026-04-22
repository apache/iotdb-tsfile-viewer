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
 * useTheme Composable - Theme management with system preference detection
 */
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { theme } from "antdv-next";

import { usePreferencesStore } from "../stores/preferences";
import {
  stripeComponentTokens,
  stripeDarkLayoutTokens,
  stripeDarkTokens,
  stripeLightLayoutTokens,
  stripeLightTokens,
} from "../theme/stripeTheme";

import type { Theme } from "../stores/preferences";

const { defaultAlgorithm, darkAlgorithm } = theme;

export function useTheme() {
  const preferencesStore = usePreferencesStore();

  // System dark mode media query
  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

  // Detect system dark mode preference (reactive ref instead of computed)
  const systemPrefersDark = ref(false);

  // Initialize system preference
  if (typeof window !== "undefined") {
    systemPrefersDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Compute actual dark mode state (resolve 'auto' mode)
  const isDark = computed(() => {
    const themeValue = preferencesStore.theme;
    if (themeValue === "dark") return true;
    if (themeValue === "light") return false;
    // 'auto' mode: follow system preference
    return systemPrefersDark.value;
  });

  // Compute theme algorithm for antdv-next ConfigProvider
  const themeAlgorithm = computed(() => {
    return isDark.value ? darkAlgorithm : defaultAlgorithm;
  });

  const themeConfig = computed(() => ({
    token: isDark.value ? stripeDarkTokens : stripeLightTokens,
    algorithm: themeAlgorithm.value,
    components: {
      ...stripeComponentTokens,
      ...(isDark.value ? stripeDarkLayoutTokens : stripeLightLayoutTokens),
    },
  }));

  // Set theme
  function setTheme(newTheme: Theme) {
    preferencesStore.setTheme(newTheme);
  }

  // Toggle theme (cycle through light -> dark -> auto)
  function toggleTheme() {
    const current = preferencesStore.theme;
    if (current === "light") {
      setTheme("dark");
    } else if (current === "dark") {
      setTheme("auto");
    } else {
      setTheme("light");
    }
  }

  // Apply dark class to HTML element
  function updateHtmlDarkClass() {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (isDark.value) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  // Watch isDark and update HTML class
  watch(isDark, updateHtmlDarkClass, { immediate: true });

  // Set up system theme change listener
  onMounted(() => {
    if (typeof window === "undefined") return;

    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryListener = (_e: MediaQueryListEvent) => {
      // Update reactive ref when system preference changes
      systemPrefersDark.value = mediaQuery?.matches ?? false;
      if (preferencesStore.theme === "auto") {
        updateHtmlDarkClass();
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", mediaQueryListener);
    } else {
      // Legacy browsers
      mediaQuery.addListener(mediaQueryListener);
    }
  });

  // Clean up listener
  onUnmounted(() => {
    if (mediaQuery && mediaQueryListener) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", mediaQueryListener);
      } else {
        mediaQuery.removeListener(mediaQueryListener);
      }
    }
  });

  return {
    theme: computed(() => preferencesStore.theme),
    isDark,
    themeAlgorithm,
    themeConfig,
    setTheme,
    toggleTheme,
  };
}
