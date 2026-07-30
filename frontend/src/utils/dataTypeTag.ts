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

import type { TagProps } from "element-plus";

/**
 * TsFile 数据类型 → 标签配色。
 *
 * 旧组件库用的是 blue/green/orange/cyan 这类预设色名，Element Plus 只有
 * primary/success/warning/danger/info 五种语义类型，这里做一次归并：
 * 整型走 primary、浮点走 success、布尔走 warning、字符串类走 info。
 *
 * MeasurementsTable 与 TablesTable 必须保持一致，因此集中在这里。
 */
const DATA_TYPE_TAG_TYPE: Record<string, TagProps["type"]> = {
  INT32: "primary",
  INT64: "primary",
  FLOAT: "success",
  DOUBLE: "success",
  BOOLEAN: "warning",
  TEXT: "info",
  STRING: "info",
};

export function getDataTypeTagType(dataType: string): TagProps["type"] {
  return DATA_TYPE_TAG_TYPE[dataType] ?? "info";
}
