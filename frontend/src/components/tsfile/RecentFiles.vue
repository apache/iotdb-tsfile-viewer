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
 * 使用 antdv-next Table 组件显示最近文件
 */
import type { FileInfo } from "@/stores/tsfile/file";

import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { Button, Card, Empty, Table } from "antdv-next";
import { CloseOutlined, FileTextOutlined } from "@antdv-next/icons";

import { useFileStore } from "@/stores/tsfile/file";

const { t } = useI18n();
const router = useRouter();
const fileStore = useFileStore();

const columns = [
  {
    key: "file",
    dataIndex: "name",
  },
];

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
  localStorage.setItem("tsfile-viewer-recent-files", JSON.stringify(fileStore.recentFiles));
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
  <Card class="recent-files">
    <template #title>
      <span class="font-semibold">{{ t("tsfile.file.recentFiles") }}</span>
    </template>

    <!-- 空状态 -->
    <Empty
      v-if="fileStore.recentFiles.length === 0"
      :description="t('tsfile.file.noRecentFiles')"
    />

    <!-- 文件列表 -->
    <Table
      v-else
      :data-source="fileStore.recentFiles"
      :columns="columns"
      :show-header="false"
      :pagination="false"
      row-key="fileId"
      :custom-row="(record: FileInfo) => ({ onClick: () => handleFileClick(record) })"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'file'">
          <div class="flex items-center gap-3 py-2">
            <FileTextOutlined class="file-icon" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium">{{ (record as FileInfo).name }}</p>
              <p class="truncate text-sm text-gray-500">{{ (record as FileInfo).path }}</p>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>{{ formatFileSize((record as FileInfo).size) }}</span>
              <span>{{ formatDate((record as FileInfo).uploadTime) }}</span>
            </div>
            <Button
              type="text"
              danger
              size="small"
              @click.stop="removeFile((record as FileInfo).fileId)"
            >
              <template #icon>
                <CloseOutlined />
              </template>
            </Button>
          </div>
        </template>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.recent-files :deep(.ant-table-row) {
  cursor: pointer;
}

.recent-files :deep(.ant-table-row:hover > td) {
  background-color: var(--ant-color-fill-secondary, #f5f5f5) !important;
}

.file-icon {
  font-size: 1.5rem;
  color: var(--ant-color-primary, #1677ff);
}
</style>
