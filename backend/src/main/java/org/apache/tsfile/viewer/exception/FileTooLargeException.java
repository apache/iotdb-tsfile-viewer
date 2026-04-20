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
 * Exception thrown when an uploaded file exceeds the configured size limit.
 *
 * <p>Results in HTTP 413 Payload Too Large response.
 *
 * <p>Validates: Requirement 7.5 (Upload size limit error handling)
 */
public class FileTooLargeException extends RuntimeException {

  private final long fileSize;
  private final long maxSize;

  /**
   * Creates a new FileTooLargeException with a message.
   *
   * @param message the error message
   */
  public FileTooLargeException(String message) {
    super(message);
    this.fileSize = 0;
    this.maxSize = 0;
  }

  /**
   * Creates a new FileTooLargeException with size information.
   *
   * @param message the error message
   * @param fileSize the actual file size in bytes
   * @param maxSize the maximum allowed size in bytes
   */
  public FileTooLargeException(String message, long fileSize, long maxSize) {
    super(message);
    this.fileSize = fileSize;
    this.maxSize = maxSize;
  }

  /**
   * Gets the actual file size.
   *
   * @return the file size in bytes
   */
  public long getFileSize() {
    return fileSize;
  }

  /**
   * Gets the maximum allowed file size.
   *
   * @return the maximum size in bytes
   */
  public long getMaxSize() {
    return maxSize;
  }
}
