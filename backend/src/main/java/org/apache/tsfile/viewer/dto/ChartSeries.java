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
 * DTO representing a chart series for visualization.
 *
 * <p>Validates: Requirement 4 (Data visualization)
 */
public class ChartSeries {

  private String name;
  private List<double[]> data; // Array of [timestamp, value] pairs

  /** Default constructor for JSON deserialization. */
  public ChartSeries() {}

  /**
   * Creates a new chart series.
   *
   * @param name series name (typically measurement name)
   * @param data list of [timestamp, value] pairs
   */
  public ChartSeries(String name, List<double[]> data) {
    this.name = name;
    this.data = data;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<double[]> getData() {
    return data;
  }

  public void setData(List<double[]> data) {
    this.data = data;
  }

  /** Builder class for creating ChartSeries instances. */
  public static class Builder {
    private String name;
    private List<double[]> data;

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder data(List<double[]> data) {
      this.data = data;
      return this;
    }

    public ChartSeries build() {
      return new ChartSeries(name, data);
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
