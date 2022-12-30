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

import org.apache.iotdb.tsfile.file.metadata.enums.CompressionType;
import org.apache.iotdb.tsfile.file.metadata.enums.TSDataType;
import org.apache.iotdb.tsfile.file.metadata.enums.TSEncoding;
import org.apache.iotdb.tsfile.file.metadata.statistics.Statistics;

import java.io.Serializable;

public class PageInfo implements IPageInfo {

  private int uncompressedSize;

  private int compressedSize;

  private long position;

  private TSDataType dataType;

  private TSEncoding encodingType;

  private CompressionType compressionType;

  private byte chunkType;

  private Statistics<? extends Serializable> statistics;

  public PageInfo() {}

  public PageInfo(long position) {
    this.position = position;
  }

  @Override
  public int getUncompressedSize() {
    return uncompressedSize;
  }

  @Override
  public int getCompressedSize() {
    return compressedSize;
  }

  @Override
  public long getPosition() {
    return position;
  }

  @Override
  public TSDataType getDataType() {
    return dataType;
  }

  @Override
  public TSEncoding getEncodingType() {
    return encodingType;
  }

  @Override
  public CompressionType getCompressionType() {
    return compressionType;
  }

  @Override
  public byte getChunkType() {
    return chunkType;
  }

  @Override
  public Statistics<? extends Serializable> getStatistics() {
    return statistics;
  }

  @Override
  public void setUncompressedSize(int uncompressedSize) {
    this.uncompressedSize = uncompressedSize;
  }

  @Override
  public void setCompressedSize(int compressedSize) {
    this.compressedSize = compressedSize;
  }

  @Override
  public void setPosition(long position) {
    this.position = position;
  }

  @Override
  public void setDataType(TSDataType dataType) {
    this.dataType = dataType;
  }

  @Override
  public void setEncodingType(TSEncoding encodingType) {
    this.encodingType = encodingType;
  }

  @Override
  public void setCompressionType(CompressionType compressionType) {
    this.compressionType = compressionType;
  }

  @Override
  public void setChunkType(byte chunkType) {
    this.chunkType = chunkType;
  }

  @Override
  public void setStatistics(Statistics<? extends Serializable> statistics) {
    this.statistics = statistics;
  }

  @Override
  public String toString() {
    return "PageInfo{"
        + "uncompressedSize="
        + uncompressedSize
        + ", compressedSize="
        + compressedSize
        + ", position="
        + position
        + ", dataType="
        + dataType
        + ", encodingType="
        + encodingType
        + ", compressionType="
        + compressionType
        + ", chunkType="
        + chunkType
        + ", statistics="
        + statistics
        + '}';
  }
}
