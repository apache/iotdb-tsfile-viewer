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
 * DTO representing a value range for filtering.
 *
 * <p>Validates: Requirement 3.5 (Value range filter)
 */
public class ValueRange {

  private Double min;
  private Double max;

  /** Default constructor for JSON deserialization. */
  public ValueRange() {}

  /**
   * Creates a new value range.
   *
   * @param min minimum value (inclusive), null for no lower bound
   * @param max maximum value (inclusive), null for no upper bound
   */
  public ValueRange(Double min, Double max) {
    this.min = min;
    this.max = max;
  }

  public Double getMin() {
    return min;
  }

  public void setMin(Double min) {
    this.min = min;
  }

  public Double getMax() {
    return max;
  }

  public void setMax(Double max) {
    this.max = max;
  }

  /**
   * Checks if a value is within this range.
   *
   * @param value the value to check
   * @return true if the value is within the range
   */
  public boolean contains(double value) {
    if (min != null && value < min) {
      return false;
    }
    if (max != null && value > max) {
      return false;
    }
    return true;
  }

  /**
   * Checks if this range has any bounds set.
   *
   * @return true if either min or max is set
   */
  public boolean hasBounds() {
    return min != null || max != null;
  }
}
