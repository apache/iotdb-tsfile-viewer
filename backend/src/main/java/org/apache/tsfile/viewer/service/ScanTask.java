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

package org.apache.tsfile.viewer.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.tsfile.viewer.dto.ScanTaskStatus;

/**
 * Internal mutable model representing a scan task.
 *
 * <p>Tracks the lifecycle of a scan operation including its status, progress, and collected
 * results. Converted to {@link org.apache.tsfile.viewer.dto.ScanTaskDTO} for API responses.
 */
public class ScanTask {

  private final String taskId;
  private final String targetPath;
  private volatile ScanTaskStatus status;
  private volatile LocalDateTime startTime;
  private volatile LocalDateTime endTime;
  private volatile int totalFiles;
  private volatile int scannedFiles;
  private volatile String currentFile;
  private volatile int queuePosition;
  private final List<ScanResult> results;

  /** Maximum number of log entries to cache for replay. */
  private static final int MAX_LOG_CACHE_SIZE = 10_000;

  /** Cached log entries for replay to late-connecting SSE clients. Guarded by itself. */
  private final LinkedList<String> logCache = new LinkedList<>();

  /** Volatile flag used by {@link ScanTaskExecutor} to signal cancellation. */
  private volatile boolean cancelled;

  /** Lock object for synchronizing status transitions. */
  private final Object statusLock = new Object();

  /** Default constructor for frameworks that need it (e.g. Jackson). */
  public ScanTask() {
    this.taskId = null;
    this.targetPath = null;
    this.results = new CopyOnWriteArrayList<>();
  }

  /**
   * Creates a new scan task with the given ID and target path.
   *
   * @param taskId unique task identifier
   * @param targetPath directory or file path to scan
   */
  public ScanTask(String taskId, String targetPath) {
    this.taskId = taskId;
    this.targetPath = targetPath;
    this.status = ScanTaskStatus.QUEUED;
    this.results = new CopyOnWriteArrayList<>();
  }

  public String getTaskId() {
    return taskId;
  }

  public String getTargetPath() {
    return targetPath;
  }

  public ScanTaskStatus getStatus() {
    return status;
  }

  public void setStatus(ScanTaskStatus status) {
    this.status = status;
  }

  public LocalDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalDateTime startTime) {
    this.startTime = startTime;
  }

  public LocalDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalDateTime endTime) {
    this.endTime = endTime;
  }

  public int getTotalFiles() {
    return totalFiles;
  }

  public void setTotalFiles(int totalFiles) {
    this.totalFiles = totalFiles;
  }

  public int getScannedFiles() {
    return scannedFiles;
  }

  public void setScannedFiles(int scannedFiles) {
    this.scannedFiles = scannedFiles;
  }

  public String getCurrentFile() {
    return currentFile;
  }

  public void setCurrentFile(String currentFile) {
    this.currentFile = currentFile;
  }

  public int getQueuePosition() {
    return queuePosition;
  }

  public void setQueuePosition(int queuePosition) {
    this.queuePosition = queuePosition;
  }

  public List<ScanResult> getResults() {
    return results;
  }

  public void setResults(List<ScanResult> results) {
    this.results.clear();
    if (results != null) {
      this.results.addAll(results);
    }
  }

  /**
   * Returns whether this task has been cancelled.
   *
   * @return {@code true} if the task has been cancelled
   */
  public boolean isCancelled() {
    return cancelled;
  }

  /**
   * Sets the cancellation flag for this task.
   *
   * @param cancelled {@code true} to signal cancellation
   */
  public void setCancelled(boolean cancelled) {
    this.cancelled = cancelled;
  }

  /**
   * Atomically transitions the task from QUEUED to RUNNING.
   *
   * <p>Returns {@code false} if the task is not in QUEUED state (e.g., already cancelled).
   *
   * @param startTime the start time to set
   * @return {@code true} if the transition was successful
   */
  public boolean transitionToRunning(LocalDateTime startTime) {
    synchronized (statusLock) {
      if (status != ScanTaskStatus.QUEUED) {
        return false;
      }
      this.status = ScanTaskStatus.RUNNING;
      this.startTime = startTime;
      return true;
    }
  }

  /**
   * Atomically transitions the task to a terminal state if it is not already in one.
   *
   * <p>Terminal states are: COMPLETED, CANCELLED, FAILED. If the task is already in a terminal
   * state, this method is a no-op and returns {@code false}.
   *
   * @param newStatus the target terminal status
   * @param endTime the end time to set
   * @return {@code true} if the transition was successful, {@code false} if already terminal
   */
  public boolean transitionToTerminalState(ScanTaskStatus newStatus, LocalDateTime endTime) {
    synchronized (statusLock) {
      if (status == ScanTaskStatus.COMPLETED
          || status == ScanTaskStatus.CANCELLED
          || status == ScanTaskStatus.FAILED) {
        return false;
      }
      this.status = newStatus;
      this.endTime = endTime;
      return true;
    }
  }

  /**
   * Adds a log entry JSON string to the cache for replay.
   *
   * @param logJson the serialized log event JSON
   */
  public void addLogEntry(String logJson) {
    synchronized (logCache) {
      if (logCache.size() >= MAX_LOG_CACHE_SIZE) {
        logCache.removeFirst();
      }
      logCache.add(logJson);
    }
  }

  /**
   * Returns a snapshot of all cached log entries.
   *
   * @return list of serialized log event JSON strings
   */
  public List<String> getLogCache() {
    synchronized (logCache) {
      return new ArrayList<>(logCache);
    }
  }
}
