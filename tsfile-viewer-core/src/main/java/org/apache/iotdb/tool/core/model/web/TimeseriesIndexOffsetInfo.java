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
package org.apache.iotdb.tool.core.model.web;

import org.apache.iotdb.tsfile.file.metadata.enums.CompressionType;
import org.apache.iotdb.tsfile.file.metadata.enums.TSDataType;
import org.apache.iotdb.tsfile.file.metadata.enums.TSEncoding;

/** @Author: LL @Description: @Date: create in 2022/10/26 14:28 */
public class TimeseriesIndexOffsetInfo {

  /** page名称，逻辑概念，core包不负责填充 */
  private String pageNo;

  private long offset;

  private boolean isAligned;

  /** 对应的chunkHeader中 获取的信息 */
  private TSDataType tsDataType;

  /** 对应的chunkHeader中 获取的信息 */
  private TSEncoding encodingType;

  /** 对应的chunkHeader中 获取的信息 */
  private CompressionType compressionType;

  /** 通过chunk的marker 判断出来的信息 */
  private boolean hasStatistics;

  private long timeseriesIndexOffset;

  private long chunkOffset;

  public String getPageNo() {
    return pageNo;
  }

  public void setPageNo(String pageNo) {
    this.pageNo = pageNo;
  }

  public long getOffset() {
    return offset;
  }

  public void setOffset(long offset) {
    this.offset = offset;
  }

  public boolean isAligned() {
    return isAligned;
  }

  public void setAligned(boolean aligned) {
    isAligned = aligned;
  }

  public long getTimeseriesIndexOffset() {
    return timeseriesIndexOffset;
  }

  public void setTimeseriesIndexOffset(long timeseriesIndexOffset) {
    this.timeseriesIndexOffset = timeseriesIndexOffset;
  }

  public TSDataType getTsDataType() {
    return tsDataType;
  }

  public void setTsDataType(TSDataType tsDataType) {
    this.tsDataType = tsDataType;
  }

  public TSEncoding getEncodingType() {
    return encodingType;
  }

  public void setEncodingType(TSEncoding encodingType) {
    this.encodingType = encodingType;
  }

  public CompressionType getCompressionType() {
    return compressionType;
  }

  public void setCompressionType(CompressionType compressionType) {
    this.compressionType = compressionType;
  }

  public boolean isHasStatistics() {
    return hasStatistics;
  }

  public void setHasStatistics(boolean hasStatistics) {
    this.hasStatistics = hasStatistics;
  }

  public long getChunkOffset() {
    return chunkOffset;
  }

  public void setChunkOffset(long chunkOffset) {
    this.chunkOffset = chunkOffset;
  }
}
