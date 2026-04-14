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

/**
 * DTO representing real-time scan progress pushed via SSE.
 *
 * <p>Validates: Requirement 1.3 (Real-time progress push)
 *
 * @param scannedCount number of files scanned so far
 * @param totalCount total number of files to scan
 * @param currentFile name of the file currently being scanned
 * @param percentage scan completion percentage (0–100)
 */
public record ScanProgressDTO(
    int scannedCount, int totalCount, String currentFile, int percentage) {}
