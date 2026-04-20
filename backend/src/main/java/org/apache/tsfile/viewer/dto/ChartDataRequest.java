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

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for chart data request.
 *
 * <p>Validates: Requirement 4 (Data visualization)
 */
public class ChartDataRequest {

  @NotNull(message = "fileId is required")
  private String fileId;

  private Long startTime;
  private Long endTime;

  @NotEmpty(message = "At least one measurement is required")
  private List<String> measurements;

  private List<String> devices;
  private String tableName;
  private AggregationType aggregation;
  private Integer windowSize;
  private Integer maxPoints;

  /** Default constructor for JSON deserialization. */
  public ChartDataRequest() {}

  public String getFileId() {
    return fileId;
  }

  public void setFileId(String fileId) {
    this.fileId = fileId;
  }

  public Long getStartTime() {
    return startTime;
  }

  public void setStartTime(Long startTime) {
    this.startTime = startTime;
  }

  public Long getEndTime() {
    return endTime;
  }

  public void setEndTime(Long endTime) {
    this.endTime = endTime;
  }

  public List<String> getMeasurements() {
    return measurements;
  }

  public void setMeasurements(List<String> measurements) {
    this.measurements = measurements;
  }

  public List<String> getDevices() {
    return devices;
  }

  public void setDevices(List<String> devices) {
    this.devices = devices;
  }

  public String getTableName() {
    return tableName;
  }

  public void setTableName(String tableName) {
    this.tableName = tableName;
  }

  public AggregationType getAggregation() {
    return aggregation;
  }

  public void setAggregation(AggregationType aggregation) {
    this.aggregation = aggregation;
  }

  public Integer getWindowSize() {
    return windowSize;
  }

  public void setWindowSize(Integer windowSize) {
    this.windowSize = windowSize;
  }

  public Integer getMaxPoints() {
    return maxPoints;
  }

  public void setMaxPoints(Integer maxPoints) {
    this.maxPoints = maxPoints;
  }
}
