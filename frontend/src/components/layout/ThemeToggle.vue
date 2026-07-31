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
 * ThemeToggle - 亮 / 暗 / 跟随系统三态切换。
 *
 * 当前生效项通过下拉项上的 `is-current` class 标出：Element Plus 的
 * el-dropdown-item 没有旧组件库的 selectedKeys 概念，高亮态需要自己实现。
 */
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Monitor, Moon, Sun } from "lucide-vue-next";

import { useTheme } from "@/composables/useTheme";

import type { Theme } from "@/stores/preferences";
import type { Component } from "vue";

const { t } = useI18n();
const { theme, setTheme } = useTheme();

const options = computed<{ key: Theme; label: string; icon: Component }[]>(() => [
  { key: "light", label: t("tsfile.common.lightMode"), icon: Sun },
  { key: "dark", label: t("tsfile.common.darkMode"), icon: Moon },
  { key: "auto", label: t("tsfile.preferences.followSystem"), icon: Monitor },
]);

const currentIcon = computed<Component>(
  () => options.value.find((item) => item.key === theme.value)?.icon ?? Sun,
);

function handleCommand(command: Theme) {
  setTheme(command);
}
</script>

<template>
  <el-dropdown trigger="click" placement="top-end" @command="handleCommand">
    <button
      type="button"
      class="tc-tool-button"
      :aria-label="t('tsfile.common.darkMode')"
    >
      <component :is="currentIcon" class="h-4 w-4" :stroke-width="1.75" />
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in options"
          :key="item.key"
          :command="item.key"
          :class="{ 'is-current': item.key === theme }"
        >
          <component :is="item.icon" class="mr-2 h-4 w-4" :stroke-width="1.75" />
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
