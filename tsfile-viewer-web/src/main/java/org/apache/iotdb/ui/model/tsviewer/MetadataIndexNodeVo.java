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

import org.apache.iotdb.tsfile.file.metadata.MetadataIndexEntry;
import org.apache.iotdb.tsfile.file.metadata.enums.MetadataIndexNodeType;

import java.util.List;

/** @Author: LL @Description: @Date: create in 2022/10/27 15:21 */
public class MetadataIndexNodeVo {

  private int childSize;

  private long offset;

  List<MetadataIndexEntry> metadataIndexEntryList;

  private MetadataIndexNodeType nodeType;

  public int getChildSize() {
    return childSize;
  }

  public void setChildSize(int childSize) {
    this.childSize = childSize;
  }

  public long getOffset() {
    return offset;
  }

  public void setOffset(long offset) {
    this.offset = offset;
  }

  public List<MetadataIndexEntry> getMetadataIndexEntryList() {
    return metadataIndexEntryList;
  }

  public void setMetadataIndexEntryList(List<MetadataIndexEntry> metadataIndexEntryList) {
    this.metadataIndexEntryList = metadataIndexEntryList;
  }

  public MetadataIndexNodeType getNodeType() {
    return nodeType;
  }

  public void setNodeType(MetadataIndexNodeType nodeType) {
    this.nodeType = nodeType;
  }
}
