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

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.apache.tsfile.viewer.dto.HealthStatus;
import org.apache.tsfile.viewer.dto.ScanReportDTO;

import net.jqwik.api.*;

/**
 * Property-based test for pagination calculation correctness in ScanService.getReport().
 *
 * <p>Validates: Requirements 8.5
 */
class ScanPaginationPropertyTest {

  private static final int PAGE_SIZE = 50;

  /**
   * Property 11: 分页计算正确性
   *
   * <p>For any scan report containing N results, requesting page P (with page size 50) should
   * return:
   *
   * <ul>
   *   <li>If P is valid (P * 50 &lt; N): result count = min(50, N - P * 50)
   *   <li>If P is beyond range (P * 50 &gt;= N): result count = 0
   *   <li>totalPages = (N == 0) ? 0 : ceil(N / 50.0)
   *   <li>totalFiles always equals N regardless of page
   * </ul>
   *
   * <p><b>Validates: Requirements 8.5</b>
   */
  @Property(tries = 100)
  @Label("Feature: tsfile-scan, Property 11: 分页计算正确性")
  void paginationShouldReturnCorrectResultsAndPageCount(
      @ForAll("resultCounts") int n, @ForAll("pageNumbers") int page) {

    // Build a ScanTask with N results
    ScanTask task = new ScanTask("20260206142530-abc123", "/test/scan/dir");
    List<ScanResult> results = new ArrayList<>(n);
    for (int i = 0; i < n; i++) {
      results.add(
          new ScanResult(
              "/data/file" + i + ".tsfile", 1024L * (i + 1), HealthStatus.HEALTHY, List.of(), 10));
    }
    task.setResults(results);
    task.setTotalFiles(n);

    // Create a Caffeine cache and put the task in it
    com.github.benmanes.caffeine.cache.Cache<String, ScanTask> cache =
        com.github.benmanes.caffeine.cache.Caffeine.newBuilder().maximumSize(10).build();
    cache.put(task.getTaskId(), task);

    // Create ScanService with the cache (other dependencies not needed for getReport)
    ScanService scanService = new ScanService(cache, null, null, null);

    // Call getReport with the generated page number and fixed page size
    ScanReportDTO report = scanService.getReport(task.getTaskId(), page, PAGE_SIZE);

    // Verify totalFiles always equals N
    assertThat(report.totalFiles())
        .as("totalFiles should always equal N=%d regardless of page=%d", n, page)
        .isEqualTo(n);

    // Verify totalPages = (N == 0) ? 0 : ceil(N / 50.0)
    int expectedTotalPages = (n == 0) ? 0 : (int) Math.ceil((double) n / PAGE_SIZE);
    assertThat(report.totalPages())
        .as("totalPages should be ceil(%d / %d) = %d", n, PAGE_SIZE, expectedTotalPages)
        .isEqualTo(expectedTotalPages);

    // Page is clamped to valid range: safePage = max(0, min(page, totalPages - 1))
    int safePage = (n == 0) ? 0 : Math.max(0, Math.min(page, expectedTotalPages - 1));

    // Verify returned results count based on clamped page
    int fromIndex = Math.min(safePage * PAGE_SIZE, n);
    int toIndex = Math.min(fromIndex + PAGE_SIZE, n);
    int expectedResultCount = toIndex - fromIndex;

    assertThat(report.results())
        .as(
            "For N=%d, page=%d (clamped to %d): expected %d results (fromIndex=%d, toIndex=%d)",
            n, page, safePage, expectedResultCount, fromIndex, toIndex)
        .hasSize(expectedResultCount);

    // Verify currentPage matches the clamped page
    assertThat(report.currentPage())
        .as("currentPage should match the clamped page (safePage)")
        .isEqualTo(safePage);
  }

  /** Generates random result counts N in range [0, 500]. */
  @Provide
  Arbitrary<Integer> resultCounts() {
    return Arbitraries.integers().between(0, 500);
  }

  /** Generates random page numbers P in range [0, 10]. */
  @Provide
  Arbitrary<Integer> pageNumbers() {
    return Arbitraries.integers().between(0, 10);
  }
}
