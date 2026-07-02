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

import type {
  ChartDataRequest,
  ChartDataResponse,
  DataPreviewRequest,
  DataPreviewResponse,
  TableDataRequest,
  TableDataResponse,
} from "./types";
import { apiClient } from "../request";

export function previewData(request: DataPreviewRequest) {
  return apiClient.post<unknown, DataPreviewResponse>("/data/preview", request, {
    // 保留时间戳原始精度：JSON.parse 会把 >2^53 的纳秒时间戳转成有损 double，
    // 因此在解析前把每个 timestamp 的精确数字串旁挂为 timestampRaw 字符串字段。
    // 仅作用于本接口，避免影响其它响应。
    transformResponse: [
      (raw: unknown) => {
        if (typeof raw !== "string") return raw;
        try {
          const patched = raw.replace(
            /"timestamp"\s*:\s*(-?\d+)/g,
            '"timestampRaw":"$1","timestamp":$1',
          );
          return JSON.parse(patched);
        } catch {
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        }
      },
    ],
  });
}

export function queryTableData(request: TableDataRequest) {
  return apiClient.post<unknown, TableDataResponse>("/tables/query", request);
}

export function queryChartData(request: ChartDataRequest) {
  return apiClient.post<unknown, ChartDataResponse>("/data/query", request);
}
