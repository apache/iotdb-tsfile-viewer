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
package org.apache.iotdb.ui.controller.request;

/** @Author: LL @Description: @Date: create in 2022/10/8 14:12 */
public class QueryListReq {
  String nameLike;
  String selectColumn;
  Long begin;
  Long end;

  public String getNameLike() {
    return nameLike;
  }

  public void setNameLike(String nameLike) {
    this.nameLike = nameLike;
  }

  public String getSelectColumn() {
    return selectColumn;
  }

  public void setSelectColumn(String selectColumn) {
    this.selectColumn = selectColumn;
  }

  public Long getBegin() {
    return begin;
  }

  public void setBegin(Long begin) {
    this.begin = begin;
  }

  public Long getEnd() {
    return end;
  }

  public void setEnd(Long end) {
    this.end = end;
  }
}
