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
 * Timezone Management Composable
 */
import { computed } from 'vue';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePreferencesStore } from '../stores/preferences';

// Enable dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Extend dayjs type to include timezone methods
declare module 'dayjs' {
  interface Dayjs {
    tz(timezone?: string): Dayjs;
  }
  interface DayjsFn {
    tz: {
      (date?: string | number | Date | Dayjs, timezone?: string): Dayjs;
      guess(): string;
      setDefault(timezone?: string): void;
    };
  }
}

export interface TimezoneOption {
  label: string;
  value: string;
  offset: string;
}

// Preset timezone options
export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  {
    label: 'Asia/Shanghai',
    value: 'Asia/Shanghai',
    offset: 'GMT+8',
  },
  {
    label: 'Europe/London',
    value: 'Europe/London',
    offset: 'GMT+0',
  },
  {
    label: 'America/New_York',
    value: 'America/New_York',
    offset: 'GMT-5',
  },
  {
    label: 'America/Los_Angeles',
    value: 'America/Los_Angeles',
    offset: 'GMT-8',
  },
  {
    label: 'Asia/Tokyo',
    value: 'Asia/Tokyo',
    offset: 'GMT+9',
  },
];

export function useTimezone() {
  const preferencesStore = usePreferencesStore();

  // Get timezone from preferences store
  const timezone = computed(() => preferencesStore.timezone);

  // Timezone options list
  const timezoneOptions = computed(() => TIMEZONE_OPTIONS);

  // Current timezone label with offset
  const currentTimezoneLabel = computed(() => {
    const current = TIMEZONE_OPTIONS.find(
      (option) => option.value === timezone.value
    );
    return current ? `${current.label} (${current.offset})` : timezone.value;
  });

  /**
   * Format timestamp to string in current timezone
   * @param timestamp - Unix timestamp in milliseconds
   * @param format - dayjs format string (default: 'YYYY-MM-DD HH:mm:ss')
   * @returns Formatted time string
   */
  function formatTime(
    timestamp: number,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    return dayjs(timestamp).tz(timezone.value).format(format);
  }

  /**
   * Format timestamp to relative time string (e.g., "2 hours ago")
   * @param timestamp - Unix timestamp in milliseconds
   * @returns Relative time string
   */
  function formatTimeRelative(timestamp: number): string {
    return dayjs(timestamp).tz(timezone.value).fromNow();
  }

  /**
   * Set timezone and update dayjs default
   * @param newTimezone - Timezone string (e.g., 'Asia/Shanghai')
   */
  function setTimezone(newTimezone: string) {
    preferencesStore.setTimezone(newTimezone);
    dayjs.tz.setDefault(newTimezone);
  }

  // Set dayjs default timezone on initialization
  dayjs.tz.setDefault(timezone.value);

  return {
    timezone,
    timezoneOptions,
    currentTimezoneLabel,
    formatTime,
    formatTimeRelative,
    setTimezone,
  };
}
