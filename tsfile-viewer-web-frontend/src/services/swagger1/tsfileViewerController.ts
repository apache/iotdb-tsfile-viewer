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
// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** /api/ts-viewer/access-directory 打开目标文件夹 POST /api/ts-viewer/access-directory */
export async function showFileListUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.showFileListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/access-directory', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/base-info tsfile的一些基本信息 POST /api/ts-viewer/file/base-info */
export async function getBaseinfoUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBaseinfoUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/base-info', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/chunk-groups 获取chunkgroup列表 POST /api/ts-viewer/file/chunkgroups */
export async function getChunkGroupsListUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChunkGroupsListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/chunkgroups', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/chunk-groups/chunkgroup/brief-info 获取单个chunkgroup的简要信息,CGHeader,CHeader,PageHeader等等 POST /api/ts-viewer/file/chunkgroups/chunkgroup/brief-info */
export async function getChunkGroupInfoUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChunkGroupInfoUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/chunkgroups/chunkgroup/brief-info', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/index-timeseries-indexs 获取IndexOfTimeseriesIndex索引树 POST /api/ts-viewer/file/index-timeseries-indexs */
export async function getIndexOfTimeseriesIndexTreeUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getIndexOfTimeseriesIndexTreeUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/index-timeseries-indexs', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/meta-data 获取TsfileMetaData POST /api/ts-viewer/file/meta-data */
export async function getMetaDataUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMetaDataUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/meta-data', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/meta-data-size 获取TsfileMetaDataSize POST /api/ts-viewer/file/meta-data-size */
export async function getMetaDataSizeUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMetaDataSizeUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/meta-data-size', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/offset/chunks 获取offset值对应的chunks POST /api/ts-viewer/file/offset/chunks */
export async function getChunkListUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChunkListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/offset/chunks', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/offset/page-info 获取pageOffsetInfo值对应的page详情（chunkgroup下钻） POST /api/ts-viewer/file/offset/page-info */
export async function getPageInfoUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPageInfoUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/offset/page-info', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/offset/pages 获取chunkOffset值对应的pages POST /api/ts-viewer/file/offset/pages */
export async function getPageListUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPageListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/offset/pages', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/process 获取加载进度 POST /api/ts-viewer/file/process */
export async function getProcessUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProcessUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/process', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/search 通过设备id和measurement查询对应的data数据 POST /api/ts-viewer/file/search */
export async function fetchDataByDeviceAndMeasurementUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.fetchDataByDeviceAndMeasurementUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/search', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file//search/index-timeseries-indexs 查询indexOfTimeseriesIndex索引使用 POST /api/ts-viewer/file/search/index-timeseries-indexs */
export async function getTimeseriesIndexListNoPagingUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTimeseriesIndexListNoPagingUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/search/index-timeseries-indexs', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/timeseries-index/offset/page-info 获取pageOffsetInfo值对应的page详情（timeseries-index） POST /api/ts-viewer/file/timeseries-index/offset/page-info */
export async function getPageInfoThroughTimeseriesIndexOffsetUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPageInfoThroughTimeseriesIndexOffsetUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/timeseries-index/offset/page-info', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/timeseries-indexs 获取TimeseriesIndex列表 POST /api/ts-viewer/file/timeseries-indexs */
export async function getTimeseriesIndexListUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTimeseriesIndexListUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/timeseries-indexs', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/file/timeseries-indexs/timeseries-index/brief-info 获取单个TimeseriesIndex的简要信息 POST /api/ts-viewer/file/timeseries-indexs/timeseries-index/brief-info */
export async function getTimeseriesIndexInfoUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTimeseriesIndexInfoUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>(
    '/api/ts-viewer/file/timeseries-indexs/timeseries-index/brief-info',
    {
      method: 'POST',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** /api/ts-viewer/file/version 获取版本信息 POST /api/ts-viewer/file/version */
export async function getVersionUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getVersionUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/file/version', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/files/load-file 加载文件 POST /api/ts-viewer/files/load-file */
export async function loadFileUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loadFileUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/files/load-file', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/files/unload-file 卸载文件 POST /api/ts-viewer/files/unload-file */
export async function unLoadFileUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.unLoadFileUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseVOObject_>('/api/ts-viewer/files/unload-file', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** /api/ts-viewer/loaded-files 获取已经加载的文件列表 POST /api/ts-viewer/loaded-files */
export async function showLoadedFileListUsingPOST(options?: { [key: string]: any }) {
  return request<API.BaseVOObject_>('/api/ts-viewer/loaded-files', {
    method: 'POST',
    ...(options || {}),
  });
}
