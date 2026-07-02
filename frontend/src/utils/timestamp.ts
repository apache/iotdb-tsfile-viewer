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
 * 将不同精度的 TsFile 时间戳归一到毫秒。
 *
 * TsFile 的时间戳单位可能是秒 / 毫秒 / 微秒 / 纳秒，按数量级（位数）自适应判断：
 *   ~1e18 纳秒(19位) → /1e6，~1e15 微秒(16位) → /1e3，
 *   ~1e12 毫秒(13位) → 原样，~1e9 秒(10位) → *1e3。
 *
 * 直接用 new Date(纳秒) 会超出 JS Date 有效范围而得到 Invalid Date（显示 NaN）。
 */
export function normalizeToMs(timestamp: number): number {
  const abs = Math.abs(timestamp);
  if (abs >= 1e17) return Math.floor(timestamp / 1e6); // 纳秒
  if (abs >= 1e14) return Math.floor(timestamp / 1e3); // 微秒
  if (abs >= 1e11) return timestamp; // 毫秒
  if (abs >= 1e8) return timestamp * 1e3; // 秒
  return timestamp; // 其它（含 0 / 极小值）按毫秒处理
}

/**
 * 将时间戳格式化为 `YYYY-MM-DD HH:mm:ss.SSS`（本地时区，含毫秒）。
 * 无法解析时回退为原始值的字符串形式。
 */
export function formatTimestamp(timestamp: number): string {
  if (timestamp === null || timestamp === undefined || Number.isNaN(timestamp)) return "-";
  const d = new Date(normalizeToMs(timestamp));
  if (Number.isNaN(d.getTime())) return String(timestamp);
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}
