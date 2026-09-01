/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import type { TreeNode, UploadResponse } from "./types";
import { apiClient } from "../request";

export const DEFAULT_UPLOAD_TIMEOUT_MINUTES = 30;
export const MAX_UPLOAD_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024;

interface UploadFileOptions {
  timeoutMs?: number;
  onProgress?: (percentage: number) => void;
}

export function getTree(root?: string, path?: string) {
  return apiClient.get<unknown, TreeNode | TreeNode[]>("/files/tree", { params: { root, path } });
}

export function uploadFile(file: File, options: UploadFileOptions = {}) {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post<unknown, UploadResponse>("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: options.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MINUTES * 60_000,
    onUploadProgress(event) {
      if (!event.total) return;

      const percentage = Math.min(99, Math.round((event.loaded / event.total) * 100));
      options.onProgress?.(percentage);
    },
  });
}
