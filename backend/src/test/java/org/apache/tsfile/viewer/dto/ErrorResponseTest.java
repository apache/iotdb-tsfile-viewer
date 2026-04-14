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

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for ErrorResponse DTO.
 *
 * <p>Validates: Requirement 7.1-7.6 (Error handling)
 */
class ErrorResponseTest {

  @Test
  @DisplayName("Should create ErrorResponse with basic constructor")
  void basicConstructor_createsResponse() {
    ErrorResponse response =
        new ErrorResponse(404, "Not Found", "File not found", "/api/files/123");

    assertThat(response.getStatus()).isEqualTo(404);
    assertThat(response.getError()).isEqualTo("Not Found");
    assertThat(response.getMessage()).isEqualTo("File not found");
    assertThat(response.getPath()).isEqualTo("/api/files/123");
    assertThat(response.getTimestamp()).isNotNull();
    assertThat(response.getValidationErrors()).isNull();
  }

  @Test
  @DisplayName("Should create ErrorResponse with validation errors")
  void constructorWithValidationErrors_createsResponse() {
    List<ValidationError> errors =
        List.of(
            new ValidationError("field1", "must not be null", null),
            new ValidationError("field2", "must be positive", -1));

    ErrorResponse response =
        new ErrorResponse(400, "Bad Request", "Validation failed", "/api/data", errors);

    assertThat(response.getStatus()).isEqualTo(400);
    assertThat(response.getError()).isEqualTo("Bad Request");
    assertThat(response.getMessage()).isEqualTo("Validation failed");
    assertThat(response.getPath()).isEqualTo("/api/data");
    assertThat(response.getValidationErrors()).hasSize(2);
    assertThat(response.getValidationErrors().get(0).getField()).isEqualTo("field1");
    assertThat(response.getValidationErrors().get(1).getField()).isEqualTo("field2");
  }

  @Test
  @DisplayName("Should create ErrorResponse using builder")
  void builder_createsResponse() {
    ErrorResponse response =
        ErrorResponse.builder()
            .status(500)
            .error("Internal Server Error")
            .message("Something went wrong")
            .path("/api/meta/123")
            .build();

    assertThat(response.getStatus()).isEqualTo(500);
    assertThat(response.getError()).isEqualTo("Internal Server Error");
    assertThat(response.getMessage()).isEqualTo("Something went wrong");
    assertThat(response.getPath()).isEqualTo("/api/meta/123");
    assertThat(response.getTimestamp()).isNotNull();
  }

  @Test
  @DisplayName("Should create ErrorResponse with builder and validation errors")
  void builderWithValidationErrors_createsResponse() {
    List<ValidationError> errors = List.of(new ValidationError("fileId", "must not be blank", ""));

    ErrorResponse response =
        ErrorResponse.builder()
            .status(400)
            .error("Bad Request")
            .message("Validation failed")
            .path("/api/data/preview")
            .validationErrors(errors)
            .build();

    assertThat(response.getStatus()).isEqualTo(400);
    assertThat(response.getValidationErrors()).hasSize(1);
    assertThat(response.getValidationErrors().get(0).getField()).isEqualTo("fileId");
  }

  @Test
  @DisplayName("Should set timestamp automatically")
  void defaultConstructor_setsTimestamp() {
    LocalDateTime before = LocalDateTime.now();
    ErrorResponse response = new ErrorResponse();
    LocalDateTime after = LocalDateTime.now();

    assertThat(response.getTimestamp()).isNotNull();
    assertThat(response.getTimestamp()).isAfterOrEqualTo(before);
    assertThat(response.getTimestamp()).isBeforeOrEqualTo(after);
  }

  @Test
  @DisplayName("Should allow setting all properties via setters")
  void setters_setProperties() {
    ErrorResponse response = new ErrorResponse();
    LocalDateTime timestamp = LocalDateTime.of(2024, 1, 15, 10, 30);
    List<ValidationError> errors = List.of(new ValidationError("test", "error", null));

    response.setStatus(403);
    response.setError("Forbidden");
    response.setMessage("Access denied");
    response.setPath("/api/files/tree");
    response.setTimestamp(timestamp);
    response.setValidationErrors(errors);

    assertThat(response.getStatus()).isEqualTo(403);
    assertThat(response.getError()).isEqualTo("Forbidden");
    assertThat(response.getMessage()).isEqualTo("Access denied");
    assertThat(response.getPath()).isEqualTo("/api/files/tree");
    assertThat(response.getTimestamp()).isEqualTo(timestamp);
    assertThat(response.getValidationErrors()).hasSize(1);
  }
}
