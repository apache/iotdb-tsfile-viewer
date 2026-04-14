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

import type { ScanReport, ScanResult, ScanTask } from "./scan-types";
import { apiClient } from "../request";

// ─── REST API ───────────────────────────────────────────────────────────────

export function startDirectoryScan(request: { directoryPath: string }) {
  return apiClient.post<unknown, { queuePosition: number; taskId: string }>(
    "/scan/directory",
    request,
  );
}

/**
 * Synchronous single-file health check (no SSE streaming).
 * Note: The scan store currently uses startDirectoryScan for single files
 * to leverage SSE streaming. This function is available for direct use
 * when streaming is not needed.
 */
export function checkSingleFile(request: { filePath: string }) {
  return apiClient.post<unknown, ScanResult>("/scan/file", request);
}

export function getTaskStatus(taskId: string) {
  return apiClient.get<unknown, ScanTask>(`/scan/status/${taskId}`);
}

export function getReport(taskId: string, page = 0, size = 50) {
  return apiClient.get<unknown, ScanReport>(`/scan/report/${taskId}`, {
    params: { page, size },
  });
}

export function cancelTask(taskId: string) {
  return apiClient.delete<unknown, { message: string }>(`/scan/${taskId}`);
}

export function exportReport(taskId: string, format: "csv" | "json") {
  return apiClient.get<unknown, Blob>(`/scan/export/${taskId}`, {
    params: { format },
    responseType: "blob",
  });
}

// ─── SSE EventSource Management ─────────────────────────────────────────────

export interface ScanProgress {
  scannedCount: number;
  totalCount: number;
  currentFile: string;
  percentage: number;
}

export interface SSECallbacks {
  onComplete?: (data: {
    duration: number;
    errorCount: number;
    healthyCount: number;
    warningCount: number;
    status: string;
    taskId: string;
    totalFiles: number;
  }) => void;
  onConnectionError?: (error: Event) => void;
  onErrorFound?: (data: {
    errorType: string;
    filePath: string;
    severity: string;
  }) => void;
  onLog?: (data: { level: string; message: string; timestamp: string }) => void;
  onProgress?: (data: ScanProgress) => void;
  onStatusChange?: (data: {
    newStatus: string;
    oldStatus: string;
    taskId: string;
  }) => void;
}

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAYS = [2000, 4000, 8000];

let activeEventSource: EventSource | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let activeCallbacks: SSECallbacks | null = null;
let activeTaskId: string | null = null;
let completedReceived = false;

function getSSEUrl(taskId: string): string {
  return `/api/scan/stream/${taskId}`;
}

function parseEventData<T>(event: MessageEvent): T | null {
  try {
    return JSON.parse(event.data) as T;
  } catch {
    console.error("[SSE] Failed to parse event data:", event.data);
    return null;
  }
}

function setupEventListeners(
  eventSource: EventSource,
  callbacks: SSECallbacks,
): void {
  eventSource.addEventListener("progress", (event: MessageEvent) => {
    const data = parseEventData<ScanProgress>(event);
    if (data && callbacks.onProgress) callbacks.onProgress(data);
  });

  eventSource.addEventListener("log", (event: MessageEvent) => {
    const data = parseEventData<{
      level: string;
      message: string;
      timestamp: string;
    }>(event);
    if (data && callbacks.onLog) callbacks.onLog(data);
  });

  eventSource.addEventListener("error-found", (event: MessageEvent) => {
    const data = parseEventData<{
      errorType: string;
      filePath: string;
      severity: string;
    }>(event);
    if (data && callbacks.onErrorFound) callbacks.onErrorFound(data);
  });

  eventSource.addEventListener("complete", (event: MessageEvent) => {
    completedReceived = true;
    const data = parseEventData<{
      duration: number;
      errorCount: number;
      healthyCount: number;
      warningCount: number;
      status: string;
      taskId: string;
      totalFiles: number;
    }>(event);
    if (data && callbacks.onComplete) callbacks.onComplete(data);
    cleanupConnection();
  });

  eventSource.addEventListener("status-change", (event: MessageEvent) => {
    const data = parseEventData<{
      newStatus: string;
      oldStatus: string;
      taskId: string;
    }>(event);
    if (data && callbacks.onStatusChange) callbacks.onStatusChange(data);
  });

  eventSource.onerror = (error: Event) => {
    // If we already received a 'complete' event, the server closed the connection
    // intentionally — do not reconnect.
    if (completedReceived) {
      cleanupState();
      return;
    }
    console.warn(
      `[SSE] Connection error (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`,
    );
    eventSource.close();
    activeEventSource = null;

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && activeTaskId) {
      const delay = RECONNECT_DELAYS[reconnectAttempts] ?? 8000;
      reconnectAttempts++;
      reconnectTimer = setTimeout(() => {
        if (activeTaskId && activeCallbacks)
          createConnection(activeTaskId, activeCallbacks);
      }, delay);
    } else {
      if (callbacks.onConnectionError) callbacks.onConnectionError(error);
      cleanupState();
    }
  };

  eventSource.onopen = () => {
    reconnectAttempts = 0;
  };
}

function createConnection(taskId: string, callbacks: SSECallbacks): void {
  const eventSource = new EventSource(getSSEUrl(taskId));
  activeEventSource = eventSource;
  setupEventListeners(eventSource, callbacks);
}

function cleanupConnection(): void {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (activeEventSource) {
    activeEventSource.close();
    activeEventSource = null;
  }
}

function cleanupState(): void {
  cleanupConnection();
  reconnectAttempts = 0;
  activeCallbacks = null;
  activeTaskId = null;
}

export function connectSSE(taskId: string, callbacks: SSECallbacks): void {
  disconnectSSE();
  activeTaskId = taskId;
  activeCallbacks = callbacks;
  reconnectAttempts = 0;
  completedReceived = false;
  createConnection(taskId, callbacks);
}

export function disconnectSSE(): void {
  cleanupState();
}
