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
 * DTO for data preview response.
 *
 * <p>Validates: Requirement 3 (Data preview)
 */
public class DataPreviewResponse {

  private List<DataRow> data;
  private int total;
  private int limit;
  private int offset;
  private boolean hasMore;

  /** Default constructor for JSON deserialization. */
  public DataPreviewResponse() {}

  /**
   * Creates a new data preview response.
   *
   * @param data list of data rows
   * @param total total number of matching rows
   * @param limit requested limit
   * @param offset requested offset
   * @param hasMore true if more data is available
   */
  public DataPreviewResponse(
      List<DataRow> data, int total, int limit, int offset, boolean hasMore) {
    this.data = data;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.hasMore = hasMore;
  }

  public List<DataRow> getData() {
    return data;
  }

  public void setData(List<DataRow> data) {
    this.data = data;
  }

  public int getTotal() {
    return total;
  }

  public void setTotal(int total) {
    this.total = total;
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

  public boolean isHasMore() {
    return hasMore;
  }

  public void setHasMore(boolean hasMore) {
    this.hasMore = hasMore;
  }

  /** Builder class for creating DataPreviewResponse instances. */
  public static class Builder {
    private List<DataRow> data;
    private int total;
    private int limit;
    private int offset;
    private boolean hasMore;

    public Builder data(List<DataRow> data) {
      this.data = data;
      return this;
    }

    public Builder total(int total) {
      this.total = total;
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

    public Builder hasMore(boolean hasMore) {
      this.hasMore = hasMore;
      return this;
    }

    public DataPreviewResponse build() {
      return new DataPreviewResponse(data, total, limit, offset, hasMore);
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
