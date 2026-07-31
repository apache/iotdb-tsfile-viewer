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
/**
 * PageHeader - 页面标题区。
 *
 * 存在的意义是把标题字号/字重集中到 `.tc-page-title` 一处，
 * 避免各视图页各写一套 `text-xl font-bold` 导致字重不统一。
 * 右侧操作区通过 `actions` 插槽提供。
 */
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
  }>(),
  { subtitle: undefined },
);
</script>

<template>
  <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div class="min-w-0">
      <h1 class="tc-page-title">{{ title }}</h1>
      <p v-if="subtitle" class="tc-page-subtitle">{{ subtitle }}</p>
      <slot name="subtitle" />
    </div>
    <div v-if="$slots.actions" class="flex flex-shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
