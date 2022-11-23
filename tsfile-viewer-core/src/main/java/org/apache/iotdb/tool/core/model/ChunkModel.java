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

package org.apache.iotdb.tool.core.model;

import org.apache.iotdb.tsfile.file.header.PageHeader;
import org.apache.iotdb.tsfile.file.metadata.ChunkMetadata;
import org.apache.iotdb.tsfile.read.common.BatchData;
import org.apache.iotdb.tsfile.read.common.Chunk;

import java.util.List;

public class ChunkModel {

  private ChunkMetadata chunkMetadata;

  private List<PageHeader> pageHeaders;

  private List<BatchData> batchDataList;

  private Chunk chunk;

  public ChunkMetadata getChunkMetadata() {
    return chunkMetadata;
  }

  public void setChunkMetadata(ChunkMetadata chunkMetadata) {
    this.chunkMetadata = chunkMetadata;
  }

  public List<PageHeader> getPageHeaders() {
    return pageHeaders;
  }

  public void setPageHeaders(List<PageHeader> pageHeaders) {
    this.pageHeaders = pageHeaders;
  }

  public List<BatchData> getBatchDataList() {
    return batchDataList;
  }

  public void setBatchDataList(List<BatchData> batchDataList) {
    this.batchDataList = batchDataList;
  }

  public Chunk getChunk() {
    return chunk;
  }

  public void setChunk(Chunk chunk) {
    this.chunk = chunk;
  }
}
