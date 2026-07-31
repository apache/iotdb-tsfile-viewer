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
/** FullscreenToggle - 全屏进入 / 退出。 */
import { onMounted, onUnmounted, ref } from "vue";
import { Maximize, Minimize } from "lucide-vue-next";

const isFullscreen = ref(false);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
  } else {
    void document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<template>
  <button
    type="button"
    class="tc-tool-button"
    aria-label="Toggle Fullscreen"
    @click="toggleFullscreen"
  >
    <Minimize v-if="isFullscreen" class="h-4 w-4" :stroke-width="1.75" />
    <Maximize v-else class="h-4 w-4" :stroke-width="1.75" />
  </button>
</template>
