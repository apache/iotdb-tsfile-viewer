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
 * DTO representing a time range.
 *
 * <p>Used for specifying time-based filters and displaying time range information.
 *
 * <p>Validates: Requirement 2, 3 (Metadata display, Data preview)
 */
public class TimeRange {

  private long startTime;
  private long endTime;

  /** Default constructor for JSON deserialization. */
  public TimeRange() {}

  /**
   * Creates a new time range.
   *
   * @param startTime start timestamp in milliseconds
   * @param endTime end timestamp in milliseconds
   */
  public TimeRange(long startTime, long endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public long getStartTime() {
    return startTime;
  }

  public void setStartTime(long startTime) {
    this.startTime = startTime;
  }

  public long getEndTime() {
    return endTime;
  }

  public void setEndTime(long endTime) {
    this.endTime = endTime;
  }

  /**
   * Checks if this time range contains the given timestamp.
   *
   * @param timestamp the timestamp to check
   * @return true if the timestamp is within this range
   */
  public boolean contains(long timestamp) {
    return timestamp >= startTime && timestamp <= endTime;
  }

  /**
   * Checks if this time range overlaps with another.
   *
   * @param other the other time range
   * @return true if the ranges overlap
   */
  public boolean overlaps(TimeRange other) {
    return startTime <= other.endTime && endTime >= other.startTime;
  }

  /**
   * Gets the duration of this time range in milliseconds.
   *
   * @return duration in milliseconds
   */
  public long getDuration() {
    return endTime - startTime;
  }
}
