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

import jakarta.validation.constraints.Size;

/**
 * DTO representing filter conditions for data queries.
 *
 * <p>Validates: Requirement 3.2-3.6 (Data filtering), FR-022/FR-023 (Advanced conditions)
 */
public class FilterConditions {

  private TimeRange timeRange;
  private List<String> devices;
  private List<String> measurements;
  private ValueRange valueRange;
  private int limit = 100;
  private int offset = 0;

  @Size(max = 10, message = "Maximum 10 advanced conditions allowed")
  private List<AdvancedCondition> advancedConditions;

  /** Default constructor for JSON deserialization. */
  public FilterConditions() {}

  public TimeRange getTimeRange() {
    return timeRange;
  }

  public void setTimeRange(TimeRange timeRange) {
    this.timeRange = timeRange;
  }

  public List<String> getDevices() {
    return devices;
  }

  public void setDevices(List<String> devices) {
    this.devices = devices;
  }

  public List<String> getMeasurements() {
    return measurements;
  }

  public void setMeasurements(List<String> measurements) {
    this.measurements = measurements;
  }

  public ValueRange getValueRange() {
    return valueRange;
  }

  public void setValueRange(ValueRange valueRange) {
    this.valueRange = valueRange;
  }

  public int getLimit() {
    return limit;
  }

  public void setLimit(int limit) {
    this.limit = limit;
  }

  public int getOffset() {
    return offset;
  }

  public void setOffset(int offset) {
    this.offset = offset;
  }

  public List<AdvancedCondition> getAdvancedConditions() {
    return advancedConditions;
  }

  public void setAdvancedConditions(List<AdvancedCondition> advancedConditions) {
    this.advancedConditions = advancedConditions;
  }

  /** Builder class for creating FilterConditions instances. */
  public static class Builder {
    private TimeRange timeRange;
    private List<String> devices;
    private List<String> measurements;
    private ValueRange valueRange;
    private int limit = 100;
    private int offset = 0;
    private List<AdvancedCondition> advancedConditions;

    public Builder timeRange(TimeRange timeRange) {
      this.timeRange = timeRange;
      return this;
    }

    public Builder devices(List<String> devices) {
      this.devices = devices;
      return this;
    }

    public Builder measurements(List<String> measurements) {
      this.measurements = measurements;
      return this;
    }

    public Builder valueRange(ValueRange valueRange) {
      this.valueRange = valueRange;
      return this;
    }

    public Builder limit(int limit) {
      this.limit = limit;
      return this;
    }

    public Builder offset(int offset) {
      this.offset = offset;
      return this;
    }

    public Builder advancedConditions(List<AdvancedCondition> advancedConditions) {
      this.advancedConditions = advancedConditions;
      return this;
    }

    public FilterConditions build() {
      FilterConditions conditions = new FilterConditions();
      conditions.setTimeRange(timeRange);
      conditions.setDevices(devices);
      conditions.setMeasurements(measurements);
      conditions.setValueRange(valueRange);
      conditions.setLimit(limit);
      conditions.setOffset(offset);
      conditions.setAdvancedConditions(advancedConditions);
      return conditions;
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
