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
 * Exception thrown when a requested scan task is not found.
 *
 * <p>Typically thrown when a task ID does not exist in the scan task cache. Results in HTTP 404 Not
 * Found response.
 *
 * <p>Validates: Requirement 9.1 (Scan task not found handling)
 */
public class TaskNotFoundException extends RuntimeException {

  private final String taskId;

  /**
   * Creates a new TaskNotFoundException with a message.
   *
   * @param message the error message
   */
  public TaskNotFoundException(String message) {
    super(message);
    this.taskId = null;
  }

  /**
   * Creates a new TaskNotFoundException with a message and task ID.
   *
   * @param message the error message
   * @param taskId the task ID that was not found
   */
  public TaskNotFoundException(String message, String taskId) {
    super(message);
    this.taskId = taskId;
  }

  /**
   * Gets the task ID that was not found.
   *
   * @return the task ID, or null if not specified
   */
  public String getTaskId() {
    return taskId;
  }
}
