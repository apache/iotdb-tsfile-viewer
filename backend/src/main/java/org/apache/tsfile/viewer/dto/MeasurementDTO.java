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
 * DTO representing a measurement schema.
 *
 * <p>Contains metadata about a measurement including its data type, encoding, and compression.
 *
 * <p>Validates: Requirement 2.3 (Measurement table)
 */
public class MeasurementDTO {

  private String name;
  private String dataType;
  private String encoding;
  private String compression;
  private String columnCategory; // TAG, FIELD, or ATTRIBUTE

  /** Default constructor for JSON deserialization. */
  public MeasurementDTO() {}

  /**
   * Creates a new measurement DTO.
   *
   * @param name measurement name
   * @param dataType data type (e.g., INT32, INT64, FLOAT, DOUBLE, TEXT, BOOLEAN)
   * @param encoding encoding type (e.g., PLAIN, RLE, TS_2DIFF, GORILLA)
   * @param compression compression type (e.g., UNCOMPRESSED, SNAPPY, GZIP, LZ4)
   */
  public MeasurementDTO(String name, String dataType, String encoding, String compression) {
    this.name = name;
    this.dataType = dataType;
    this.encoding = encoding;
    this.compression = compression;
    this.columnCategory = "FIELD"; // Default to FIELD for backward compatibility
  }

  /**
   * Creates a new measurement DTO with column category.
   *
   * @param name measurement name
   * @param dataType data type
   * @param encoding encoding type
   * @param compression compression type
   * @param columnCategory column category (TAG, FIELD, or ATTRIBUTE)
   */
  public MeasurementDTO(
      String name, String dataType, String encoding, String compression, String columnCategory) {
    this.name = name;
    this.dataType = dataType;
    this.encoding = encoding;
    this.compression = compression;
    this.columnCategory = columnCategory;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDataType() {
    return dataType;
  }

  public void setDataType(String dataType) {
    this.dataType = dataType;
  }

  public String getEncoding() {
    return encoding;
  }

  public void setEncoding(String encoding) {
    this.encoding = encoding;
  }

  public String getCompression() {
    return compression;
  }

  public void setCompression(String compression) {
    this.compression = compression;
  }

  public String getColumnCategory() {
    return columnCategory;
  }

  public void setColumnCategory(String columnCategory) {
    this.columnCategory = columnCategory;
  }

  /** Builder class for creating MeasurementDTO instances. */
  public static class Builder {
    private String name;
    private String dataType;
    private String encoding;
    private String compression;
    private String columnCategory = "FIELD";

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder dataType(String dataType) {
      this.dataType = dataType;
      return this;
    }

    public Builder encoding(String encoding) {
      this.encoding = encoding;
      return this;
    }

    public Builder compression(String compression) {
      this.compression = compression;
      return this;
    }

    public Builder columnCategory(String columnCategory) {
      this.columnCategory = columnCategory;
      return this;
    }

    public MeasurementDTO build() {
      return new MeasurementDTO(name, dataType, encoding, compression, columnCategory);
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
