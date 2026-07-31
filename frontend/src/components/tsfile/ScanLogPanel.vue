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
 * ScanLogPanel - 实时日志面板组件 (virtual scroll)
 */
import type { LogEntry } from "@/stores/tsfile/scan";
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const ITEM_HEIGHT = 22;
const CONTAINER_HEIGHT = 300;
const BUFFER = 10;

interface Props {
  logs: LogEntry[];
}

const props = defineProps<Props>();

const autoScroll = ref(true);
const scrollRef = ref<HTMLDivElement | null>(null);
const scrollTop = ref(0);

const totalHeight = computed(() => props.logs.length * ITEM_HEIGHT);

const visibleRange = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - BUFFER);
  const end = Math.min(
    props.logs.length,
    Math.ceil((scrollTop.value + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER,
  );
  return { start, end };
});

const visibleLogs = computed(() =>
  props.logs.slice(visibleRange.value.start, visibleRange.value.end).map((entry, i) => ({
    ...entry,
    _index: visibleRange.value.start + i,
  })),
);

const offsetY = computed(() => visibleRange.value.start * ITEM_HEIGHT);

function handleScroll() {
  if (scrollRef.value) {
    scrollTop.value = scrollRef.value.scrollTop;
    // Disable auto-scroll if user scrolls up
    const atBottom =
      scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight < 40;
    if (!atBottom && autoScroll.value) {
      autoScroll.value = false;
    }
  }
}

function scrollToBottom() {
  if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
}

function toggleAutoScroll() {
  autoScroll.value = !autoScroll.value;
  if (autoScroll.value) nextTick(scrollToBottom);
}

function levelClass(level: LogEntry["level"]): string {
  switch (level) {
    case "ERROR": return "text-danger";
    case "WARN": return "text-warning";
    default: return "text-text-body";
  }
}

watch(() => props.logs.length, () => {
  if (autoScroll.value) nextTick(scrollToBottom);
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-xs text-text-body">
        {{ logs.length }} {{ t("tsfile.scan.logEntries") }}
      </span>
      <el-button size="small" link type="primary" @click="toggleAutoScroll">
        {{ autoScroll ? t("tsfile.scan.autoScrollOn") : t("tsfile.scan.autoScrollOff") }}
      </el-button>
    </div>
    <div
      v-if="logs.length === 0"
      class="flex items-center justify-center rounded-card border border-border-default bg-bg-subtle text-sm text-text-body"
      :style="{ height: CONTAINER_HEIGHT + 'px' }"
    >
      {{ t("tsfile.scan.logs") }}
    </div>
    <div
      v-else
      ref="scrollRef"
      class="overflow-y-auto rounded-card border border-border-default bg-bg-subtle"
      :style="{ height: CONTAINER_HEIGHT + 'px' }"
      @scroll="handleScroll"
    >
      <div :style="{ height: totalHeight + 'px', position: 'relative' }">
        <div
          class="p-2 font-mono text-xs"
          :style="{ position: 'absolute', top: offsetY + 'px', left: 0, right: 0 }"
        >
          <div
            v-for="entry in visibleLogs"
            :key="entry._index"
            class="flex gap-2"
            :style="{ height: ITEM_HEIGHT + 'px', lineHeight: ITEM_HEIGHT + 'px' }"
          >
            <span class="shrink-0 text-text-body">{{ entry.timestamp.slice(11, 19) }}</span>
            <span class="w-12 shrink-0 font-medium" :class="levelClass(entry.level)">
              {{ entry.level }}
            </span>
            <span class="truncate text-text-heading" :title="entry.message">
              {{ entry.message }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
