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
 * 使用 Element Plus el-upload 组件实现拖拽上传
 */
import type { UploadRequestOptions } from "element-plus";
import type { UploadResponse } from "@/api/tsfile/types";

// element-plus 未从公开入口导出 UploadAjaxError 类型，这里通过 onError 回调的参数类型间接推导
type UploadErrorArg = Parameters<NonNullable<UploadRequestOptions["onError"]>>[0];

import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { ElMessage } from "element-plus";
import { CloudUpload, Loader2 } from "lucide-vue-next";

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
async function httpRequest(options: UploadRequestOptions) {
  uploading.value = true;
  progress.value = 0;

  const file = options.file as File;

  try {
    const response = await fileApi.uploadFile(file);
    const data = response as UploadResponse;

    progress.value = 100;
    success.value = true;
    options.onSuccess?.(data);
    ElMessage.success(t("tsfile.file.uploadSuccess"));

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
    ElMessage.error(error.value);
    options.onError?.((error_ instanceof Error ? error_ : new Error(message)) as UploadErrorArg);
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="tc-panel file-upload">
    <div class="tc-panel-title">
      <span>{{ t("tsfile.file.uploadFile") }}</span>
    </div>
    <div class="p-5">
      <el-upload
        drag
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="httpRequest"
        accept=".tsfile"
        :disabled="uploading"
      >
        <div v-if="!uploading" class="upload-content">
          <CloudUpload class="upload-icon" :size="48" />
          <p class="upload-title text-text-heading">{{ t("tsfile.file.dragDrop") }}</p>
          <p class="upload-hint text-text-label">{{ t("tsfile.file.selectTsFile") }}</p>
        </div>

        <div v-else class="upload-content">
          <Loader2 class="upload-icon uploading animate-spin" :size="48" />
          <p class="upload-title text-text-heading">{{ t("tsfile.common.loading") }}</p>
          <el-progress :percentage="progress" :stroke-width="8" class="upload-progress" />
        </div>
      </el-upload>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        type="error"
        :title="t('tsfile.file.uploadFailed')"
        show-icon
        closable
        class="upload-alert"
        @close="error = null"
      >
        {{ error }}
      </el-alert>

      <!-- 成功提示 -->
      <el-alert
        v-if="success"
        type="success"
        :title="t('tsfile.file.uploadSuccess')"
        show-icon
        class="upload-alert"
      />
    </div>
  </div>
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
  margin-bottom: 1rem;
  color: var(--text-label);
}

.upload-icon.uploading {
  color: var(--primary);
}

.upload-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.upload-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
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
