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
 * DTO for table-specific data query response.
 *
 * <p>Returns data from a specific table with pagination information.
 */
public class TableDataResponse {

  private String tableName;
  private List<String> columns;
  private List<String> columnTypes;
  private List<Map<String, Object>> rows;
  private int total;
  private int limit;
  private int offset;
  private boolean hasMore;

  /** Default constructor for JSON deserialization. */
  public TableDataResponse() {}

  /**
   * Creates a new table data response.
   *
   * @param tableName name of the table
   * @param columns list of column names
   * @param columnTypes list of column types
   * @param rows list of data rows as maps
   * @param total total number of matching rows
   * @param limit requested limit
   * @param offset requested offset
   * @param hasMore true if more data is available
   */
  public TableDataResponse(
      String tableName,
      List<String> columns,
      List<String> columnTypes,
      List<Map<String, Object>> rows,
      int total,
      int limit,
      int offset,
      boolean hasMore) {
    this.tableName = tableName;
    this.columns = columns;
    this.columnTypes = columnTypes;
    this.rows = rows;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
    this.hasMore = hasMore;
  }

  public String getTableName() {
    return tableName;
  }

  public void setTableName(String tableName) {
    this.tableName = tableName;
  }

  public List<String> getColumns() {
    return columns;
  }

  public void setColumns(List<String> columns) {
    this.columns = columns;
  }

  public List<String> getColumnTypes() {
    return columnTypes;
  }

  public void setColumnTypes(List<String> columnTypes) {
    this.columnTypes = columnTypes;
  }

  public List<Map<String, Object>> getRows() {
    return rows;
  }

  public void setRows(List<Map<String, Object>> rows) {
    this.rows = rows;
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

  /** Builder class for creating TableDataResponse instances. */
  public static class Builder {
    private String tableName;
    private List<String> columns;
    private List<String> columnTypes;
    private List<Map<String, Object>> rows;
    private int total;
    private int limit;
    private int offset;
    private boolean hasMore;

    public Builder tableName(String tableName) {
      this.tableName = tableName;
      return this;
    }

    public Builder columns(List<String> columns) {
      this.columns = columns;
      return this;
    }

    public Builder columnTypes(List<String> columnTypes) {
      this.columnTypes = columnTypes;
      return this;
    }

    public Builder rows(List<Map<String, Object>> rows) {
      this.rows = rows;
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

    public TableDataResponse build() {
      return new TableDataResponse(
          tableName, columns, columnTypes, rows, total, limit, offset, hasMore);
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
