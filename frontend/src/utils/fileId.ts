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

/**
 * 将文件路径编码为 URL-safe 的 Base64 fileId。
 *
 * 先按 UTF-8 编码成字节再做 Base64，以支持中文等非 Latin1 字符
 * （直接使用 btoa 遇到中文会抛 InvalidCharacterError）。
 * 随后转为 URL-safe 变体（+/ → -_，去掉 = padding），使其可安全地
 * 作为单段路由参数（:fileId）使用。后端以 Base64.getUrlDecoder() 解码。
 */
export function encodeFileId(path: string): string {
  const bytes = new TextEncoder().encode(path);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * 将 URL-safe Base64 fileId 解码回原始文件路径（与 encodeFileId 互逆）。
 * 正确还原 UTF-8 编码的中文字符。解码失败时抛出，调用方需自行兜底。
 */
export function decodeFileId(fileId: string): string {
  let b64 = fileId.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
