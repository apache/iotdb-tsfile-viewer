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
 * AppSidebar - 应用左侧栏：品牌区 + 导航 + 文件树插槽 + 底部工具区。
 * lg 断点以下退化为抽屉（fixed + translate-x + 遮罩）。
 */
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { FolderTree, ScanSearch } from "lucide-vue-next";

import FullscreenToggle from "./FullscreenToggle.vue";
import LanguageToggle from "./LanguageToggle.vue";
import RefreshButton from "./RefreshButton.vue";
import ThemeToggle from "./ThemeToggle.vue";
import TimezoneSelector from "./TimezoneSelector.vue";

const props = defineProps<{
  /** 窄屏抽屉是否展开；lg 以上无效 */
  open?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();

// BASE_URL 在 dev 与 build 下是否带尾斜杠并不一致（vite.config 里写的是 "/view"），
// 这里统一补齐再拼接，既不会出现 "/viewtsfile_logo.svg" 也不会出现双斜杠。
const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const logoUrl = `${baseUrl}tsfile_logo.svg`;
// 取不到 logo 时退化成纯文字标题，避免出现破图图标
const logoFailed = ref(false);

const navItems = [
  { name: "FileSelection", labelKey: "tsfile.nav.files", icon: FolderTree },
  { name: "FileScan", labelKey: "tsfile.nav.scan", icon: ScanSearch },
];
</script>

<template>
  <!-- 窄屏遮罩 -->
  <div
    v-if="props.open"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-shrink-0 flex-col border-r border-border-default bg-bg-card transition-transform duration-200 lg:static lg:translate-x-0"
    :class="props.open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- 品牌区 -->
    <div
      class="flex flex-shrink-0 items-center gap-2.5 border-b border-border-default px-4 py-4"
    >
      <img
        v-if="!logoFailed"
        :src="logoUrl"
        alt=""
        class="h-7 w-7 flex-shrink-0"
        @error="logoFailed = true"
      />
      <div class="min-w-0">
        <div class="truncate text-[0.9375rem] font-normal text-text-heading">
          TsFile Viewer
        </div>
        <div class="truncate text-[0.6875rem] text-text-body">
          {{ t("tsfile.app.description") }}
        </div>
      </div>
    </div>

    <!-- 导航区 -->
    <nav class="flex flex-shrink-0 flex-col gap-1 px-3 py-3">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        v-slot="{ href, navigate, isActive }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :href="href"
          class="tc-nav-item"
          :class="{ active: isActive }"
          @click="
            navigate($event);
            emit('close');
          "
        >
          <component :is="item.icon" class="h-4 w-4 flex-shrink-0" :stroke-width="1.75" />
          <span class="truncate">{{ t(item.labelKey) }}</span>
        </a>
      </RouterLink>
    </nav>

    <!-- 文件树：撑满剩余高度并可滚动。左右内边距比导航区小一档，
         把省下的横向空间让给容易被截断的文件名 -->
    <div class="min-h-0 flex-1 overflow-y-auto border-t border-border-default px-2 py-3">
      <slot name="tree" />
    </div>

    <!-- 底部工具区 -->
    <div
      class="flex flex-shrink-0 items-center justify-center gap-0.5 border-t border-border-default px-2 py-2"
    >
      <ThemeToggle />
      <LanguageToggle />
      <TimezoneSelector />
      <FullscreenToggle />
      <RefreshButton />
    </div>
  </aside>
</template>
