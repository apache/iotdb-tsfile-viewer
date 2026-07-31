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

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "./router";
import { setupI18n } from "./i18n";
import { usePreferencesStore } from "./stores/preferences";
// 顺序不能反：Element Plus 的暗色变量必须先加载，
// 我们在 styles/index.css 里的 `.dark` 覆盖才能盖住组件库默认值。
import "element-plus/theme-chalk/dark/css-vars.css";
import "./styles/index.css";

const app = createApp(App);

app.use(ElementPlus);

for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component);
}

const pinia = createPinia();
app.use(pinia);

// Load preferences from localStorage after Pinia is initialized
const preferencesStore = usePreferencesStore();
preferencesStore.loadPreferences();

app.use(router);

setupI18n(app).then(() => {
  app.mount("#app");
});
