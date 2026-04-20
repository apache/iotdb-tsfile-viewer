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
import { Button, Dropdown } from 'antdv-next';
import { GlobalOutlined } from '@antdv-next/icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePreferencesStore, type Language } from '@/stores/preferences';

const preferencesStore = usePreferencesStore();
const { locale } = useI18n();

const languageOptions = [
  { key: 'zh-CN', label: '中文' },
  { key: 'en-US', label: 'English' },
];

const currentLanguageLabel = computed(() => {
  const option = languageOptions.find((opt) => opt.key === preferencesStore.language);
  return option?.label || '中文';
});

const menuProps = computed(() => ({
  items: languageOptions,
  selectedKeys: [preferencesStore.language],
  onClick: ({ key }: { key: string }) => {
    const language = key as Language;
    preferencesStore.setLanguage(language);
    locale.value = language;
  },
}));
</script>

<template>
  <Dropdown :menu="menuProps" placement="bottomRight" :trigger="['click']">
    <Button type="text" style="color: #fff;" size="small" aria-label="Switch Language">
      <template #icon><GlobalOutlined /></template>
    </Button>
  </Dropdown>
</template>
