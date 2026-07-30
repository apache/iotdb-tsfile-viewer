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
/** TimezoneSelector - 弹窗内单选时区，确认后才写回偏好设置。 */
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Clock } from "lucide-vue-next";

import { useTimezone } from "@/composables/useTimezone";

const { t } = useI18n();
const { timezone, timezoneOptions, setTimezone } = useTimezone();

const visible = ref(false);
const selectedTimezone = ref(timezone.value);

// 外部改动（例如其它页面）时同步弹窗内的待选值
watch(timezone, (newValue) => {
  selectedTimezone.value = newValue;
});

function openDialog() {
  selectedTimezone.value = timezone.value;
  visible.value = true;
}

function handleConfirm() {
  setTimezone(selectedTimezone.value);
  visible.value = false;
}

function handleCancel() {
  selectedTimezone.value = timezone.value;
  visible.value = false;
}
</script>

<template>
  <div>
    <button
      type="button"
      class="tc-tool-button"
      :aria-label="t('tsfile.preferences.timezone')"
      @click="openDialog"
    >
      <Clock class="h-4 w-4" :stroke-width="1.75" />
    </button>

    <el-dialog
      v-model="visible"
      :title="t('tsfile.preferences.timezone')"
      width="420px"
      append-to-body
      @close="handleCancel"
    >
      <el-radio-group v-model="selectedTimezone" class="flex flex-col !items-start gap-2">
        <el-radio
          v-for="option in timezoneOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }} ({{ option.offset }})
        </el-radio>
      </el-radio-group>

      <template #footer>
        <el-button @click="handleCancel">{{ t("tsfile.common.cancel") }}</el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ t("tsfile.common.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
