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
 *
 * 宽度可由右边缘手柄拖拽调整，并持久化到 localStorage：文件树里的
 * 路径长短差异很大，固定宽度要么浪费横向空间、要么大量截断文件名。
 */
import { onBeforeUnmount, ref } from "vue";
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

// —— 侧栏宽度拖拽 ——
const SIDEBAR_WIDTH_KEY = "tsfile-viewer:sidebar-width";
const SIDEBAR_WIDTH_DEFAULT = 220;
// 下限保证导航文字与底部 5 个工具按钮不换行；上限避免内容区被挤没
const SIDEBAR_WIDTH_MIN = 180;
const SIDEBAR_WIDTH_MAX = 480;

const asideEl = ref<HTMLElement | null>(null);
const resizing = ref(false);

function clampWidth(value: number): number {
  return Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, Math.round(value)));
}

// localStorage 在隐私模式 / 禁用 cookie 下会抛出，宽度不是关键状态，读写都静默降级
function readStoredWidth(): number {
  try {
    const stored = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
    return Number.isFinite(stored) && stored > 0 ? clampWidth(stored) : SIDEBAR_WIDTH_DEFAULT;
  } catch {
    return SIDEBAR_WIDTH_DEFAULT;
  }
}

function persistWidth(width: number): void {
  try {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(width));
  } catch {
    // 忽略：宽度丢失只影响下次进入时的初始值
  }
}

const sidebarWidth = ref(readStoredWidth());

function updateWidthFromPointer(event: PointerEvent): void {
  // 以侧栏自身左边缘为基准而不是假设它贴在 x=0，窄屏抽屉态同样成立
  const left = asideEl.value?.getBoundingClientRect().left ?? 0;
  sidebarWidth.value = clampWidth(event.clientX - left);
}

function handleResizeStart(event: PointerEvent): void {
  resizing.value = true;
  // 指针捕获：拖到手柄外（甚至移出窗口）也能继续收到 move/up
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  event.preventDefault();
}

function handleResizeMove(event: PointerEvent): void {
  if (!resizing.value) return;
  updateWidthFromPointer(event);
}

function handleResizeEnd(event: PointerEvent): void {
  if (!resizing.value) return;
  resizing.value = false;
  const el = event.currentTarget as HTMLElement;
  if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
  persistWidth(sidebarWidth.value);
}

/** 双击手柄恢复默认宽度 */
function resetWidth(): void {
  sidebarWidth.value = SIDEBAR_WIDTH_DEFAULT;
  persistWidth(SIDEBAR_WIDTH_DEFAULT);
}

/** 键盘调宽：手柄可聚焦，方向键每次 16px，Home 复位 */
function handleResizeKeydown(event: KeyboardEvent): void {
  const STEP = 16;
  if (event.key === "ArrowLeft") sidebarWidth.value = clampWidth(sidebarWidth.value - STEP);
  else if (event.key === "ArrowRight") sidebarWidth.value = clampWidth(sidebarWidth.value + STEP);
  else if (event.key === "Home") sidebarWidth.value = SIDEBAR_WIDTH_DEFAULT;
  else return;
  event.preventDefault();
  persistWidth(sidebarWidth.value);
}

onBeforeUnmount(() => {
  resizing.value = false;
});
</script>

<template>
  <!-- 窄屏遮罩 -->
  <div
    v-if="props.open"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="emit('close')"
  />

  <aside
    ref="asideEl"
    class="fixed inset-y-0 left-0 z-40 flex flex-shrink-0 flex-col border-r border-border-default bg-bg-card lg:relative lg:translate-x-0"
    :class="[
      props.open ? 'translate-x-0' : '-translate-x-full',
      // 拖拽中关掉过渡，否则宽度跟手会有迟滞；同时禁选中避免拖出文字高亮
      resizing ? 'select-none' : 'transition-transform duration-200',
    ]"
    :style="{ width: `${sidebarWidth}px` }"
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

    <!--
      宽度拖拽手柄。横跨边框两侧（-right-1 + w-2）以放大命中区，
      窄屏抽屉态下隐藏——那里宽度由断点决定，拖拽没有意义。
    -->
    <div
      class="group absolute inset-y-0 -right-1 z-10 hidden w-2 cursor-col-resize touch-none lg:block"
      role="separator"
      tabindex="0"
      aria-orientation="vertical"
      :aria-label="t('tsfile.app.resizeSidebar')"
      :aria-valuenow="sidebarWidth"
      :aria-valuemin="SIDEBAR_WIDTH_MIN"
      :aria-valuemax="SIDEBAR_WIDTH_MAX"
      :title="t('tsfile.app.resizeSidebarHint')"
      @pointerdown="handleResizeStart"
      @pointermove="handleResizeMove"
      @pointerup="handleResizeEnd"
      @pointercancel="handleResizeEnd"
      @dblclick="resetWidth"
      @keydown="handleResizeKeydown"
    >
      <div
        class="mx-auto h-full w-px transition-colors group-hover:bg-primary group-focus-visible:bg-primary"
        :class="resizing ? 'bg-primary' : 'bg-transparent'"
      />
    </div>
  </aside>
</template>
