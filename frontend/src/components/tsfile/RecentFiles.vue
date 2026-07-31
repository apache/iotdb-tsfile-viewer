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
 * RecentFiles 组件 - 最近打开的文件列表
 * 用 el-table 当无表头列表渲染，整行点击进入数据预览
 */
import type { FileInfo } from "@/stores/tsfile/file";

import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { FileText, X } from "lucide-vue-next";

import { useFileStore } from "@/stores/tsfile/file";
import { tableStyleProps } from "@/utils/tableStyle";

const { t } = useI18n();
const router = useRouter();
const fileStore = useFileStore();

/**
 * 处理文件点击
 */
function handleFileClick(file: FileInfo) {
  fileStore.setCurrentFile(file.fileId, file.name);
  router.push(`/tsfile/data/${file.fileId}`);
}

/**
 * 删除文件记录
 */
function removeFile(fileId: string) {
  fileStore.recentFiles = fileStore.recentFiles.filter((f) => f.fileId !== fileId);
  localStorage.setItem(
    "tsfile-viewer-recent-files",
    JSON.stringify(fileStore.recentFiles),
  );
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return t("tsfile.file.today");
  if (days === 1) return t("tsfile.file.yesterday");
  if (days < 7) return `${days} ${t("tsfile.file.daysAgo")}`;
  return date.toLocaleDateString();
}

onMounted(() => {
  fileStore.loadRecentFiles();
});
</script>

<template>
  <div class="tc-panel recent-files">
    <div class="tc-panel-title">
      <span>{{ t("tsfile.file.recentFiles") }}</span>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="fileStore.recentFiles.length === 0"
      :description="t('tsfile.file.noRecentFiles')"
      :image-size="72"
    />

    <!-- 文件列表 -->
    <div v-else class="tc-table-card !rounded-none !border-0">
      <el-table
        v-bind="tableStyleProps"
        :data="fileStore.recentFiles"
        :show-header="false"
        row-key="fileId"
        @row-click="handleFileClick"
      >
        <el-table-column prop="name">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <FileText class="h-5 w-5 flex-shrink-0 text-primary" :stroke-width="1.75" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-text-heading">{{ row.name }}</p>
                <p class="truncate text-xs text-text-body">{{ row.path }}</p>
              </div>
              <div class="flex flex-shrink-0 items-center gap-4 text-xs text-text-body tnum">
                <span>{{ formatFileSize(row.size) }}</span>
                <span>{{ formatDate(row.uploadTime) }}</span>
              </div>
              <el-button
                link
                type="danger"
                size="small"
                :aria-label="t('tsfile.common.delete')"
                @click.stop="removeFile(row.fileId)"
              >
                <X class="h-4 w-4" :stroke-width="1.75" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.recent-files :deep(.el-table__row) {
  cursor: pointer;
}
</style>
