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

import org.apache.iotdb.tsfile.file.metadata.enums.TSDataType;

/** @Author: LL @Description: @Date: create in 2022/10/27 9:39 */
public class TimeseriesMetadataBriefVO {

  private byte timeSeriesMetadataType;

  private String measurementId;

  private TSDataType tsDataType;

  private int chunkMetaDataListSize;

  private String statistic;

  public byte getTimeSeriesMetadataType() {
    return timeSeriesMetadataType;
  }

  public void setTimeSeriesMetadataType(byte timeSeriesMetadataType) {
    this.timeSeriesMetadataType = timeSeriesMetadataType;
  }

  public String getMeasurementId() {
    return measurementId;
  }

  public void setMeasurementId(String measurementId) {
    this.measurementId = measurementId;
  }

  public TSDataType getTsDataType() {
    return tsDataType;
  }

  public void setTsDataType(TSDataType tsDataType) {
    this.tsDataType = tsDataType;
  }

  public int getChunkMetaDataListSize() {
    return chunkMetaDataListSize;
  }

  public void setChunkMetaDataListSize(int chunkMetaDataListSize) {
    this.chunkMetaDataListSize = chunkMetaDataListSize;
  }

  public String getStatistic() {
    return statistic;
  }

  public void setStatistic(String statistic) {
    this.statistic = statistic;
  }
}
