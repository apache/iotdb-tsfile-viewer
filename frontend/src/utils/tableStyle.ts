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
 * Element Plus 表格的统一密度与配色。
 *
 * 设计规范要求表头比正文更小、更淡，单元格用接近标题的深色，
 * 且表格自身透明——底色与圆角由外层 `.tc-table-card` 提供。
 * 这些取值必须在所有表格间保持一致，因此集中在这里而不是散落到各组件。
 */

/** 表头单元格：0.75rem / 500 字重 / 次级文字色 */
export const tableHeaderCellStyle = {
  background: "transparent",
  borderBottomColor: "var(--border-default)",
  color: "var(--text-body)",
  fontSize: "0.75rem",
  fontWeight: "500",
  padding: "0.5rem 0",
} as const;

/** 正文单元格：0.8125rem / 标题色，保证数据本身是视觉重心 */
export const tableCellStyle = {
  borderBottomColor: "var(--border-default)",
  color: "var(--text-heading)",
  fontSize: "0.8125rem",
  padding: "0.5rem 0",
} as const;

/** 行背景透明，交给 `.tc-table-card` 与 hover 态处理 */
export const tableRowStyle = {
  background: "transparent",
} as const;

/**
 * 一次性展开到 `<el-table>` 上的属性集合。
 *
 * 用法：`<el-table v-bind="tableStyleProps" :data="rows">`
 */
export const tableStyleProps = {
  headerCellStyle: tableHeaderCellStyle,
  cellStyle: tableCellStyle,
  rowStyle: tableRowStyle,
} as const;
