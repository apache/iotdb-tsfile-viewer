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

package org.apache.tsfile.viewer.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO representing a scan report with summary statistics and paginated results.
 *
 * <p>Provides an overview of the scan task outcome including file counts by health status, error
 * type distribution, and the list of individual file results (paginated).
 *
 * <p>Validates: Requirement 1.5 (Scan report contents)
 *
 * @param taskId unique task identifier
 * @param totalFiles total number of files scanned
 * @param healthyCount number of files with HEALTHY status
 * @param warningCount number of files with WARNING status
 * @param errorCount number of files with ERROR status
 * @param errorTypeDistribution count of files affected by each error type
 * @param results paginated list of individual file scan results
 * @param totalDurationMs total scan duration in milliseconds
 * @param currentPage current page number (zero-based)
 * @param totalPages total number of pages
 */
public record ScanReportDTO(
    String taskId,
    int totalFiles,
    int healthyCount,
    int warningCount,
    int errorCount,
    Map<ScanErrorType, Integer> errorTypeDistribution,
    List<ScanResultDTO> results,
    long totalDurationMs,
    int currentPage,
    int totalPages) {}
