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

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/view"),
  routes: [
    {
      path: "/",
      redirect: "/tsfile/files",
    },
    {
      path: "/tsfile",
      redirect: "/tsfile/files",
      children: [
        {
          path: "files",
          name: "FileSelection",
          component: () => import("@/views/tsfile/file-selection/index.vue"),
        },
        {
          path: "meta/:fileId",
          name: "Metadata",
          component: () => import("@/views/tsfile/metadata/index.vue"),
        },
        {
          path: "data/:fileId",
          name: "DataPreview",
          component: () => import("@/views/tsfile/data-preview/index.vue"),
        },
        {
          path: "chart/:fileId",
          name: "ChartVisualization",
          component: () => import("@/views/tsfile/chart/index.vue"),
        },
        {
          path: "scan",
          name: "FileScan",
          component: () => import("@/views/tsfile/scan/index.vue"),
        },
      ],
    },
  ],
});

export default router;
