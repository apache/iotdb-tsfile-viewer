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

import java.util.Collection;

/** @Author: LL @Description: @Date: create in 2022/11/15 16:05 */
public class Page<T> {
  private int pageNo;
  private int maxPageNum;
  private int totalCount;
  private Collection<T> pageItems;
  private int pageSize;

  public Page(Collection<T> items, PageParam pageParam) {
    this.pageItems = items;
    this.pageNo = pageParam.getPageNo();
    this.maxPageNum = pageParam.getMaxPageNum();
    this.totalCount = pageParam.getTotalCount();
    this.pageSize = pageParam.getPageSize();
  }

  public int getPageNo() {
    return this.pageNo;
  }

  public void setPageNo(int pageNo) {
    this.pageNo = pageNo;
  }

  public int getMaxPageNum() {
    return this.maxPageNum;
  }

  public void setMaxPageNum(int maxPageNum) {
    this.maxPageNum = maxPageNum;
  }

  public int getTotalCount() {
    return this.totalCount;
  }

  public void setTotalCount(int totalCount) {
    this.totalCount = totalCount;
  }

  public Collection<T> getPageItems() {
    return this.pageItems;
  }

  public void setPageItems(Collection<T> pageItems) {
    this.pageItems = pageItems;
  }

  public int getPageSize() {
    return this.pageSize;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }
}
