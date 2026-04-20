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
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useFileStore } from "@/stores/tsfile/file";
import FileUpload from "@/components/tsfile/FileUpload.vue";
import RecentFiles from "@/components/tsfile/RecentFiles.vue";

const router = useRouter();
const fileStore = useFileStore();
const { t } = useI18n();

function handleFileSelect(fileId: string, _path: string, fileName: string) {
  fileStore.setCurrentFile(fileId, fileName);
  router.push(`/tsfile/data/${fileId}`);
}

function handleFileUploaded(fileId: string, fileName: string) {
  fileStore.setCurrentFile(fileId, fileName);
  setTimeout(() => {
    router.push(`/tsfile/data/${fileId}`);
  }, 1000);
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-2">{{ t("tsfile.file.title") }}</h2>
    <p class="text-gray-500 mb-4">{{ t("tsfile.app.description") }}</p>
    <div class="space-y-4">
      <FileUpload @uploaded="handleFileUploaded" />
      <RecentFiles />
    </div>
  </div>
</template>
