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

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for ValidationError DTO.
 *
 * <p>Validates: Requirement 7.3 (Validation errors)
 */
class ValidationErrorTest {

  @Test
  @DisplayName("Should create ValidationError with all parameters")
  void constructor_createsValidationError() {
    ValidationError error = new ValidationError("fieldName", "must not be null", "rejectedValue");

    assertThat(error.getField()).isEqualTo("fieldName");
    assertThat(error.getMessage()).isEqualTo("must not be null");
    assertThat(error.getRejectedValue()).isEqualTo("rejectedValue");
  }

  @Test
  @DisplayName("Should create ValidationError with null rejected value")
  void constructor_withNullRejectedValue() {
    ValidationError error = new ValidationError("fileId", "must not be blank", null);

    assertThat(error.getField()).isEqualTo("fileId");
    assertThat(error.getMessage()).isEqualTo("must not be blank");
    assertThat(error.getRejectedValue()).isNull();
  }

  @Test
  @DisplayName("Should create ValidationError with numeric rejected value")
  void constructor_withNumericRejectedValue() {
    ValidationError error = new ValidationError("limit", "must be positive", -5);

    assertThat(error.getField()).isEqualTo("limit");
    assertThat(error.getMessage()).isEqualTo("must be positive");
    assertThat(error.getRejectedValue()).isEqualTo(-5);
  }

  @Test
  @DisplayName("Should allow setting properties via setters")
  void setters_setProperties() {
    ValidationError error = new ValidationError();

    error.setField("offset");
    error.setMessage("must be greater than or equal to 0");
    error.setRejectedValue(-10);

    assertThat(error.getField()).isEqualTo("offset");
    assertThat(error.getMessage()).isEqualTo("must be greater than or equal to 0");
    assertThat(error.getRejectedValue()).isEqualTo(-10);
  }

  @Test
  @DisplayName("Should handle complex rejected values")
  void constructor_withComplexRejectedValue() {
    Object complexValue = new String[] {"value1", "value2"};
    ValidationError error = new ValidationError("devices", "invalid device list", complexValue);

    assertThat(error.getField()).isEqualTo("devices");
    assertThat(error.getMessage()).isEqualTo("invalid device list");
    assertThat(error.getRejectedValue()).isEqualTo(complexValue);
  }

  @Test
  @DisplayName("Default constructor should create empty ValidationError")
  void defaultConstructor_createsEmptyError() {
    ValidationError error = new ValidationError();

    assertThat(error.getField()).isNull();
    assertThat(error.getMessage()).isNull();
    assertThat(error.getRejectedValue()).isNull();
  }
}
