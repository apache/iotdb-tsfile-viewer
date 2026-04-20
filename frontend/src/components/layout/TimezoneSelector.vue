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
import { Button, Modal, Radio, RadioGroup, Space } from 'antdv-next';
import { ClockCircleOutlined } from '@antdv-next/icons';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTimezone } from '../../composables/useTimezone';

const { t } = useI18n();
const { timezone, timezoneOptions, setTimezone } = useTimezone();

const visible = ref(false);
const selectedTimezone = ref(timezone.value);

// Watch timezone changes to update selected value
watch(timezone, (newValue) => {
  selectedTimezone.value = newValue;
});

function openModal() {
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
    <Button
      type="text"
      style="color: #fff;"
      size="small"
      @click="openModal"
      :aria-label="t('tsfile.preferences.timezone')"
    >
      <template #icon><ClockCircleOutlined /></template>
    </Button>

    <Modal
      v-model:open="visible"
      :title="t('tsfile.preferences.timezone')"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <RadioGroup v-model:value="selectedTimezone">
        <Space direction="vertical" class="w-full">
          <Radio
            v-for="option in timezoneOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }} ({{ option.offset }})
          </Radio>
        </Space>
      </RadioGroup>
    </Modal>
  </div>
</template>
