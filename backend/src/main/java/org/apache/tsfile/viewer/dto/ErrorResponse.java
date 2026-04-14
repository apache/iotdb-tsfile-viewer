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

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standard error response DTO for all API error responses.
 *
 * <p>Provides consistent error response structure across all endpoints with status code, error
 * type, message, timestamp, request path, and optional validation errors.
 *
 * <p>Validates: Requirement 7.1-7.6 (Error handling)
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

  private int status;
  private String error;
  private String message;
  private LocalDateTime timestamp;
  private String path;
  private List<ValidationError> validationErrors;

  /** Default constructor for JSON deserialization. */
  public ErrorResponse() {
    this.timestamp = LocalDateTime.now();
  }

  /**
   * Creates a new error response with basic information.
   *
   * @param status HTTP status code
   * @param error error type (e.g., "Not Found", "Bad Request")
   * @param message detailed error message
   * @param path request path that caused the error
   */
  public ErrorResponse(int status, String error, String message, String path) {
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
    this.timestamp = LocalDateTime.now();
  }

  /**
   * Creates a new error response with validation errors.
   *
   * @param status HTTP status code
   * @param error error type
   * @param message detailed error message
   * @param path request path
   * @param validationErrors list of field-level validation errors
   */
  public ErrorResponse(
      int status,
      String error,
      String message,
      String path,
      List<ValidationError> validationErrors) {
    this(status, error, message, path);
    this.validationErrors = validationErrors;
  }

  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
  }

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public List<ValidationError> getValidationErrors() {
    return validationErrors;
  }

  public void setValidationErrors(List<ValidationError> validationErrors) {
    this.validationErrors = validationErrors;
  }

  /** Builder class for creating ErrorResponse instances. */
  public static class Builder {
    private int status;
    private String error;
    private String message;
    private String path;
    private List<ValidationError> validationErrors;

    public Builder status(int status) {
      this.status = status;
      return this;
    }

    public Builder error(String error) {
      this.error = error;
      return this;
    }

    public Builder message(String message) {
      this.message = message;
      return this;
    }

    public Builder path(String path) {
      this.path = path;
      return this;
    }

    public Builder validationErrors(List<ValidationError> validationErrors) {
      this.validationErrors = validationErrors;
      return this;
    }

    public ErrorResponse build() {
      ErrorResponse response = new ErrorResponse(status, error, message, path);
      response.setValidationErrors(validationErrors);
      return response;
    }
  }

  public static Builder builder() {
    return new Builder();
  }
}
