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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tsfile.viewer.dto.ScanErrorType;

/**
 * Internal mutable model representing a scan report with summary statistics.
 *
 * <p>Aggregates results from a completed scan task. Converted to {@link
 * org.apache.tsfile.viewer.dto.ScanReportDTO} for API responses.
 */
public class ScanReport {

  private String taskId;
  private int totalFiles;
  private int healthyCount;
  private int warningCount;
  private int errorCount;
  private Map<ScanErrorType, Integer> errorTypeDistribution;
  private List<ScanResult> results;
  private long totalDurationMs;

  /** Default constructor. */
  public ScanReport() {
    this.errorTypeDistribution = new HashMap<>();
    this.results = new ArrayList<>();
  }

  /**
   * Creates a new scan report for the given task.
   *
   * @param taskId unique task identifier
   */
  public ScanReport(String taskId) {
    this.taskId = taskId;
    this.errorTypeDistribution = new HashMap<>();
    this.results = new ArrayList<>();
  }

  public String getTaskId() {
    return taskId;
  }

  public void setTaskId(String taskId) {
    this.taskId = taskId;
  }

  public int getTotalFiles() {
    return totalFiles;
  }

  public void setTotalFiles(int totalFiles) {
    this.totalFiles = totalFiles;
  }

  public int getHealthyCount() {
    return healthyCount;
  }

  public void setHealthyCount(int healthyCount) {
    this.healthyCount = healthyCount;
  }

  public int getWarningCount() {
    return warningCount;
  }

  public void setWarningCount(int warningCount) {
    this.warningCount = warningCount;
  }

  public int getErrorCount() {
    return errorCount;
  }

  public void setErrorCount(int errorCount) {
    this.errorCount = errorCount;
  }

  public Map<ScanErrorType, Integer> getErrorTypeDistribution() {
    return errorTypeDistribution;
  }

  public void setErrorTypeDistribution(Map<ScanErrorType, Integer> errorTypeDistribution) {
    this.errorTypeDistribution = errorTypeDistribution;
  }

  public List<ScanResult> getResults() {
    return results;
  }

  public void setResults(List<ScanResult> results) {
    this.results = results;
  }

  public long getTotalDurationMs() {
    return totalDurationMs;
  }

  public void setTotalDurationMs(long totalDurationMs) {
    this.totalDurationMs = totalDurationMs;
  }
}
