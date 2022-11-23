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
package org.apache.iotdb.ui.model;

import org.apache.iotdb.ui.util.MessageUtil;

public class BaseVO<T> {

  /** 0 means success, other means error type */
  private String code;

  /** Define user-readable information when an error occurs */
  private String message;

  /** This is a generic type template that returns data */
  private T data;

  public BaseVO() {}

  public BaseVO(String code, String message, T data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  public BaseVO(String code, T data) {
    this.code = code;
    this.message = MessageUtil.get(code);
    this.data = data;
  }

  public static <T> BaseVO<T> success(T data) {
    return new BaseVO<>("0", null, data);
  }

  public static <T> BaseVO<T> success(String message, T data) {
    return new BaseVO<>("0", message, data);
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }
}
