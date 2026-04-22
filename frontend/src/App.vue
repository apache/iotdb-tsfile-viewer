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
import { HappyProvider } from "@antdv-next/happy-work-theme";
import {
  ConfigProvider,
  Layout,
  LayoutContent,
  LayoutHeader as AntLayoutHeader,
  LayoutSider,
} from "antdv-next";
import zhCN from "antdv-next/dist/locale/zh_CN";
import enUS from "antdv-next/dist/locale/en_US";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import LayoutHeader from "./components/layout/LayoutHeader.vue";
import FileTree from "./components/tsfile/FileTree.vue";
import { useFileStore } from "./stores/tsfile/file";
import { useTheme } from "./composables/useTheme";

const router = useRouter();
const route = useRoute();
const fileStore = useFileStore();
const { locale } = useI18n();
const { themeConfig, isDark } = useTheme();
const collapsed = ref(false);
const happyMode = ref(true);

const isOnScanPage = computed(() => route.name === 'FileScan');

const antdLocale = computed(() => {
  return locale.value === "zh-CN" ? zhCN : enUS;
});

function handleFileSelect(fileId: string, path: string, name: string) {
  if (isOnScanPage.value) {
    fileStore.setScanTarget(path, 'file');
  } else {
    fileStore.setCurrentFile(fileId, name);
    router.push(`/tsfile/data/${fileId}`);
  }
}

function handleDirectorySelect(path: string, _name: string) {
  if (isOnScanPage.value) {
    fileStore.setScanTarget(path, 'directory');
  }
}
</script>

<template>
  <HappyProvider :enabled="happyMode" v-slot="{ wave }">
    <ConfigProvider :locale="antdLocale" :wave="wave" :theme="themeConfig">
      <Layout style="height: 100vh; overflow: hidden;">
        <AntLayoutHeader style="line-height: normal; height: 48px; padding: 0; flex-shrink: 0;">
          <LayoutHeader />
        </AntLayoutHeader>
        <Layout style="flex: 1; overflow: hidden;">
          <LayoutSider
            v-model:collapsed="collapsed"
            collapsible
            :width="280"
            :collapsed-width="0"
            :theme="isDark ? 'dark' : 'light'"
          >
            <div style="padding: 16px; overflow-y: auto; height: 100%;">
              <FileTree @select="handleFileSelect" @select-directory="handleDirectorySelect" />
            </div>
          </LayoutSider>
          <LayoutContent style="padding: 16px; overflow: hidden; display: flex; flex-direction: column;">
            <RouterView />
          </LayoutContent>
        </Layout>
      </Layout>
    </ConfigProvider>
  </HappyProvider>
</template>
