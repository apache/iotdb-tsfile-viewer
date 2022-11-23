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
package org.apache.iotdb.ui.exception;

/** @Author: LL @Description: @Date: create in 2022/10/10 14:16 */
public class TsfileViewerException extends Exception {

  public static final String UNHANDLED_EXCEPTION = "UNHANDLED_EXCEPTION";
  public static final String IO_EXCEPTION = "IO_EXCEPTION";
  public static final String PATH_NOT_EXIST = "TSVIEWER-0001";
  public static final String PATH_NOT_DIRECTORY = "TSVIEWER-0002";
  public static final String CONTAINER_SIZE_REACHED_MAXIMUM = "TSVIEWER-0003";
  public static final String UNSUPPORTED_OFFSETTYPE = "TSVIEWER-0004";
  public static final String INTERRUPTED_EXCEPTION = "TSVIEWER-0005";
  //    public static final String PATH_NOT_EXIST = "TSVIEWER-";
  //    public static final String PATH_NOT_EXIST = "TSVIEWER-";

  private String errorCode;
  private String message;

  public TsfileViewerException(String errorCode, String message) {
    this.errorCode = errorCode;
    this.message = message;
  }

  public String getErrorCode() {
    return errorCode;
  }

  @Override
  public String getMessage() {
    return message;
  }
}
