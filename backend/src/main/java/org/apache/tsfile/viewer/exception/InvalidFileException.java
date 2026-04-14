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
 * Exception thrown when a file is invalid, corrupted, or has an unsupported format.
 *
 * <p>Results in HTTP 400 Bad Request response.
 *
 * <p>Validates: Requirement 7.2 (Invalid file error handling)
 */
public class InvalidFileException extends RuntimeException {

  private final String fileName;

  /**
   * Creates a new InvalidFileException with a message.
   *
   * @param message the error message
   */
  public InvalidFileException(String message) {
    super(message);
    this.fileName = null;
  }

  /**
   * Creates a new InvalidFileException with a message and file name.
   *
   * @param message the error message
   * @param fileName the name of the invalid file
   */
  public InvalidFileException(String message, String fileName) {
    super(message);
    this.fileName = fileName;
  }

  /**
   * Creates a new InvalidFileException with a message and cause.
   *
   * @param message the error message
   * @param cause the underlying cause
   */
  public InvalidFileException(String message, Throwable cause) {
    super(message, cause);
    this.fileName = null;
  }

  /**
   * Creates a new InvalidFileException with a message, file name, and cause.
   *
   * @param message the error message
   * @param fileName the name of the invalid file
   * @param cause the underlying cause
   */
  public InvalidFileException(String message, String fileName, Throwable cause) {
    super(message, cause);
    this.fileName = fileName;
  }

  /**
   * Gets the name of the invalid file.
   *
   * @return the file name, or null if not specified
   */
  public String getFileName() {
    return fileName;
  }
}
