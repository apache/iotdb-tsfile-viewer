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

import { resolve } from "node:path";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // 开发代理目标可通过 .env.local 的 VITE_API_PROXY_TARGET 覆盖，
  // 便于连接远程后端而不必改动仓库内的配置。
  const env = loadEnv(mode, __dirname, "");

  return {
    base: "/view",
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ["vue", "vue-router", "vue-i18n", "pinia"],
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        dirs: ["src/components"],
        dts: "src/components.d.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
