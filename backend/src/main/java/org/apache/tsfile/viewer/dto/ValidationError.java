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
 * DTO for field-level validation errors.
 *
 * <p>Used in 400 Bad Request responses to provide detailed information about which fields failed
 * validation and why.
 *
 * <p>Validates: Requirement 7.3 (Validation errors)
 */
public class ValidationError {

  private String field;
  private String message;
  private Object rejectedValue;

  /** Default constructor for JSON deserialization. */
  public ValidationError() {}

  /**
   * Creates a new validation error.
   *
   * @param field the field name that failed validation
   * @param message the validation error message
   * @param rejectedValue the value that was rejected
   */
  public ValidationError(String field, String message, Object rejectedValue) {
    this.field = field;
    this.message = message;
    this.rejectedValue = rejectedValue;
  }

  public String getField() {
    return field;
  }

  public void setField(String field) {
    this.field = field;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Object getRejectedValue() {
    return rejectedValue;
  }

  public void setRejectedValue(Object rejectedValue) {
    this.rejectedValue = rejectedValue;
  }
}
