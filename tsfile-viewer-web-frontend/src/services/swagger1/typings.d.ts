/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace API {
  type BaseVOObject_ = {
    code?: string;
    data?: Record<string, any>;
    message?: string;
  };

  type fetchDataByDeviceAndMeasurementUsingPOSTParams = {
    /** filePath */
    filePath?: string;
    pageNo?: number;
    pageSize?: number;
    device?: string;
    beginDate?: number;
    endDate?: number;
    measurement?: string;
  };

  type getBaseinfoUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type getChunkGroupInfoUsingPOSTParams = {
    /** offset */
    offset?: number;
    /** filePath */
    filePath?: string;
  };

  type getChunkGroupsListUsingPOSTParams = {
    /** filePath */
    filePath?: string;
    pageNo?: number;
    pageSize?: number;
    /** deviceLike */
    deviceLike?: string;
  };

  type getChunkListUsingPOSTParams = {
    /** offset */
    offset?: number;
    /** filePath */
    filePath?: string;
    /** offsetType */
    offsetType?: 'CG' | 'TS_INDEX';
    beginDate?: number;
    endDate?: number;
    deviceNameLike?: string;
  };

  type getIndexOfTimeseriesIndexTreeUsingPOSTParams = {
    /** parentOffset */
    parentOffset?: number;
    /** filePath */
    filePath?: string;
    beginDate?: number;
    endDate?: number;
    deviceNameLike?: string;
  };

  type getMetaDataSizeUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type getMetaDataUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type getPageInfoThroughTimeseriesIndexOffsetUsingPOSTParams = {
    pageNo?: string;
    offset?: number;
    tsDataType?: 'BOOLEAN' | 'INT32' | 'INT64' | 'FLOAT' | 'DOUBLE' | 'TEXT' | 'VECTOR';
    encodingType?:
      | 'PLAIN'
      | 'DICTIONARY'
      | 'RLE'
      | 'DIFF'
      | 'TS_2DIFF'
      | 'BITMAP'
      | 'GORILLA_V1'
      | 'REGULAR'
      | 'GORILLA';
    compressionType?: 'UNCOMPRESSED' | 'SNAPPY' | 'GZIP' | 'LZO' | 'SDT' | 'PAA' | 'PLA' | 'LZ4';
    hasStatistics?: boolean;
    timeseriesIndexOffset?: number;
    chunkOffset?: number;
    /** filePath */
    filePath?: string;
    beginDate?: number;
    endDate?: number;
  };

  type getPageInfoUsingPOSTParams = {
    pageNo?: string;
    offset?: number;
    tsDataType?: 'BOOLEAN' | 'INT32' | 'INT64' | 'FLOAT' | 'DOUBLE' | 'TEXT' | 'VECTOR';
    encodingType?:
      | 'PLAIN'
      | 'DICTIONARY'
      | 'RLE'
      | 'DIFF'
      | 'TS_2DIFF'
      | 'BITMAP'
      | 'GORILLA_V1'
      | 'REGULAR'
      | 'GORILLA';
    compressionType?: 'UNCOMPRESSED' | 'SNAPPY' | 'GZIP' | 'LZO' | 'SDT' | 'PAA' | 'PLA' | 'LZ4';
    hasStatistics?: boolean;
    chunkGroupOffset?: number;
    startTime?: number;
    endTime?: number;
    /** filePath */
    filePath?: string;
  };

  type getPageListUsingPOSTParams = {
    /** offset */
    offset?: number;
    /** filePath */
    filePath?: string;
    beginDate?: number;
    endDate?: number;
    deviceNameLike?: string;
  };

  type getProcessUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type getTimeseriesIndexInfoUsingPOSTParams = {
    /** offset */
    offset?: number;
    /** filePath */
    filePath?: string;
  };

  type getTimeseriesIndexListNoPagingUsingPOSTParams = {
    /** filePath */
    filePath?: string;
    beginDate?: number;
    endDate?: number;
    deviceNameLike?: string;
  };

  type getTimeseriesIndexListUsingPOSTParams = {
    /** filePath */
    filePath?: string;
    pageNo?: number;
    pageSize?: number;
    beginDate?: number;
    endDate?: number;
    deviceNameLike?: string;
  };

  type getVersionUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type loadFileUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };

  type showFileListUsingPOSTParams = {
    /** directoryPath */
    directoryPath?: string;
  };

  type unLoadFileUsingPOSTParams = {
    /** filePath */
    filePath?: string;
  };
}
