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
/** LanguageToggle - 中文 / English 切换，选中项自行高亮。 */
import { useI18n } from "vue-i18n";
import { Languages } from "lucide-vue-next";

import { usePreferencesStore, type Language } from "@/stores/preferences";

const preferencesStore = usePreferencesStore();
const { locale, t } = useI18n();

const languageOptions: { key: Language; label: string }[] = [
  { key: "zh-CN", label: "中文" },
  { key: "en-US", label: "English" },
];

function handleCommand(command: Language) {
  preferencesStore.setLanguage(command);
  locale.value = command;
}
</script>

<template>
  <el-dropdown trigger="click" placement="top-end" @command="handleCommand">
    <button type="button" class="tc-tool-button" :aria-label="t('tsfile.common.language')">
      <Languages class="h-4 w-4" :stroke-width="1.75" />
    </button>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in languageOptions"
          :key="option.key"
          :command="option.key"
          :class="{ 'is-current': option.key === preferencesStore.language }"
        >
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
