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
package org.apache.iotdb.ui.model.tsviewer;

/** @Author: LL @Description: @Date: create in 2022/10/10 11:14 */
public class FileRecord {

  private String name;
  private FileType type;
  private boolean canRead;
  private LoadStatus status;
  // 是否查询的是同一个父级文件夹的子文件/文件夹
  private boolean sameFolder;
  // private String path;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public FileType getType() {
    return type;
  }

  public void setType(FileType type) {
    this.type = type;
  }

  public boolean isCanRead() {
    return canRead;
  }

  public void setCanRead(boolean canRead) {
    this.canRead = canRead;
  }

  public LoadStatus getStatus() {
    return status;
  }

  public void setStatus(LoadStatus status) {
    this.status = status;
  }

  public boolean isSameFolder() {
    return sameFolder;
  }

  public void setSameFolder(boolean sameFolder) {
    this.sameFolder = sameFolder;
  }
}
