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
 * ScanProgress - 扫描进度组件
 */
import type { ScanProgress } from "@/api/tsfile/scan";
import { computed } from "vue";
import { Progress } from "antdv-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  progress: ScanProgress;
}

const props = defineProps<Props>();

const visible = computed(() => props.progress.totalCount > 0);
const isComplete = computed(() => props.progress.percentage >= 100);

const countText = computed(() =>
  t("tsfile.scan.scannedOf", { scanned: props.progress.scannedCount, total: props.progress.totalCount }),
);

const currentFileName = computed(() => props.progress.currentFile || "");
</script>

<template>
  <div v-if="visible" class="flex flex-col gap-2">
    <Progress :percent="progress.percentage" :size="{ height: 18 }" :status="isComplete ? 'success' : 'active'" />
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ countText }}</span>
    </div>
    <div v-if="currentFileName && !isComplete" class="truncate text-xs text-gray-400" :title="currentFileName">
      {{ t("tsfile.scan.scanningFile") }}: {{ currentFileName }}
    </div>
  </div>
</template>
