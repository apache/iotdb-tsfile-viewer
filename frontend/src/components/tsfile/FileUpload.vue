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
 * FileUpload 组件 - 文件上传
 * 使用 antdv-next Upload 组件实现拖拽上传
 */
import type { UploadProps } from "antdv-next";
import type { UploadResponse } from "@/api/tsfile/types";

type CustomRequestOptions = Parameters<NonNullable<UploadProps["customRequest"]>>[0];

import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { Alert, Card, Progress, UploadDragger } from "antdv-next";
import { CloudUploadOutlined, LoadingOutlined } from "@antdv-next/icons";

import { fileApi } from "@/api/tsfile";
import { useFileStore } from "@/stores/tsfile/file";

const { t } = useI18n();

const emit = defineEmits<{
  uploaded: [fileId: string, fileName: string, fileSize: number];
}>();

const fileStore = useFileStore();

const uploading = ref(false);
const progress = ref(0);
const error = ref<null | string>(null);
const success = ref(false);

/**
 * 验证文件
 */
function beforeUpload(file: File): boolean {
  error.value = null;
  success.value = false;

  if (!file.name.endsWith(".tsfile")) {
    error.value = t("tsfile.file.onlyTsFile");
    return false;
  }

  return true;
}

/**
 * 自定义上传处理
 */
async function customRequest(options: CustomRequestOptions) {
  uploading.value = true;
  progress.value = 0;

  const file = options.file as File;

  try {
    const response = await fileApi.uploadFile(file);
    const data = response as UploadResponse;

    progress.value = 100;
    success.value = true;
    options.onSuccess?.(data);

    emit("uploaded", data.fileId, data.fileName, data.fileSize);

    // 添加到最近文件
    fileStore.addRecentFile({
      fileId: data.fileId,
      name: data.fileName,
      path: data.fileName,
      size: data.fileSize,
      uploadTime: data.uploadTime,
    });

    // 2秒后重置状态
    setTimeout(() => {
      success.value = false;
      progress.value = 0;
    }, 2000);
  } catch (error_: unknown) {
    const message = error_ instanceof Error ? error_.message : "Upload failed";
    error.value =
      (error_ as { response?: { data?: { message?: string } } }).response?.data?.message || message;
    options.onError?.(error_ instanceof Error ? error_ : new Error(message));
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <Card class="file-upload">
    <template #title>
      <span class="font-semibold">{{ t("tsfile.file.uploadFile") }}</span>
    </template>

    <UploadDragger
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      accept=".tsfile"
      :disabled="uploading"
    >
      <div v-if="!uploading" class="upload-content">
        <CloudUploadOutlined class="upload-icon" />
        <p class="upload-title">{{ t("tsfile.file.dragDrop") }}</p>
        <p class="upload-hint">{{ t("tsfile.file.selectTsFile") }}</p>
      </div>

      <div v-else class="upload-content">
        <LoadingOutlined class="upload-icon uploading" spin />
        <p class="upload-title">{{ t("tsfile.common.loading") }}</p>
        <Progress :percent="progress" :stroke-width="8" class="upload-progress" />
      </div>
    </UploadDragger>

    <!-- 错误提示 -->
    <Alert
      v-if="error"
      type="error"
      :message="t('tsfile.file.uploadFailed')"
      :description="error"
      show-icon
      closable
      class="upload-alert"
      @close="error = null"
    />

    <!-- 成功提示 -->
    <Alert
      v-if="success"
      type="success"
      :message="t('tsfile.file.uploadSuccess')"
      show-icon
      class="upload-alert"
    />
  </Card>
</template>

<style scoped>
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.upload-icon {
  font-size: 3rem;
  color: #999;
  margin-bottom: 1rem;
}

.upload-icon.uploading {
  color: var(--ant-color-primary, #1677ff);
}

.upload-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.upload-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #999;
}

.upload-progress {
  margin-top: 1rem;
  width: 100%;
  max-width: 20rem;
}

.upload-alert {
  margin-top: 1rem;
}
</style>
