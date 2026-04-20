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

package org.apache.tsfile.viewer.exception;

/**
 * Exception thrown when a query exceeds the configured timeout limit.
 *
 * <p>Results in HTTP 504 Gateway Timeout response.
 *
 * <p>Validates: Requirement 5.5 (Query timeout handling)
 */
public class QueryTimeoutException extends RuntimeException {

  private final long timeoutSeconds;

  /**
   * Creates a new QueryTimeoutException with a message.
   *
   * @param message the error message
   */
  public QueryTimeoutException(String message) {
    super(message);
    this.timeoutSeconds = 0;
  }

  /**
   * Creates a new QueryTimeoutException with a message and timeout value.
   *
   * @param message the error message
   * @param timeoutSeconds the timeout value in seconds
   */
  public QueryTimeoutException(String message, long timeoutSeconds) {
    super(message);
    this.timeoutSeconds = timeoutSeconds;
  }

  /**
   * Creates a new QueryTimeoutException with a message and cause.
   *
   * @param message the error message
   * @param cause the underlying cause
   */
  public QueryTimeoutException(String message, Throwable cause) {
    super(message, cause);
    this.timeoutSeconds = 0;
  }

  /**
   * Gets the timeout value in seconds.
   *
   * @return the timeout value, or 0 if not specified
   */
  public long getTimeoutSeconds() {
    return timeoutSeconds;
  }
}
