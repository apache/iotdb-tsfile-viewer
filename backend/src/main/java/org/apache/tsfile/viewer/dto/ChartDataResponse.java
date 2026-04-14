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

/**
 * DTO for chart data response.
 *
 * <p>Validates: Requirement 4 (Data visualization)
 */
public class ChartDataResponse {

  private List<ChartSeries> series;
  private TimeRange timeRange;
  private int totalPoints;
  private boolean downsampled;

  /** Default constructor for JSON deserialization. */
  public ChartDataResponse() {}

  /**
   * Creates a new chart data response.
   *
   * @param series list of chart series
   * @param timeRange time range of the data
   * @param totalPoints total number of data points
   * @param downsampled true if data was downsampled
   */
  public ChartDataResponse(
      List<ChartSeries> series, TimeRange timeRange, int totalPoints, boolean downsampled) {
    this.series = series;
    this.timeRange = timeRange;
    this.totalPoints = totalPoints;
    this.downsampled = downsampled;
  }

  public List<ChartSeries> getSeries() {
    return series;
  }

  public void setSeries(List<ChartSeries> series) {
    this.series = series;
  }

  public TimeRange getTimeRange() {
    return timeRange;
  }

  public void setTimeRange(TimeRange timeRange) {
    this.timeRange = timeRange;
  }

  public int getTotalPoints() {
    return totalPoints;
  }

  public void setTotalPoints(int totalPoints) {
    this.totalPoints = totalPoints;
  }

  public boolean isDownsampled() {
    return downsampled;
  }

  public void setDownsampled(boolean downsampled) {
    this.downsampled = downsampled;
  }

  /** Builder class for creating ChartDataResponse instances. */
  public static class Builder {
    private List<ChartSeries> series;
    private TimeRange timeRange;
    private int totalPoints;
    private boolean downsampled;

    public Builder series(List<ChartSeries> series) {
      this.series = series;
      return this;
    }

    public Builder timeRange(TimeRange timeRange) {
      this.timeRange = timeRange;
      return this;
    }

    public Builder totalPoints(int totalPoints) {
      this.totalPoints = totalPoints;
      return this;
    }

    public Builder downsampled(boolean downsampled) {
      this.downsampled = downsampled;
      return this;
    }

    public ChartDataResponse build() {
      return new ChartDataResponse(series, timeRange, totalPoints, downsampled);
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
