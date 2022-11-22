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
package org.apache.iotdb.ui.controller;

import org.apache.iotdb.tool.core.model.ChunkGroupInfo;
import org.apache.iotdb.tool.core.model.web.ChunkGroupBriefInfo;
import org.apache.iotdb.tool.core.model.web.ChunkOffsetInfo;
import org.apache.iotdb.tool.core.model.web.PageOffsetInfo;
import org.apache.iotdb.tool.core.model.web.TimeseriesIndexOffsetInfo;
import org.apache.iotdb.ui.controller.pagination.PageModel;
import org.apache.iotdb.ui.controller.request.QueryByTimeReq;
import org.apache.iotdb.ui.controller.request.QueryByTimeseriesIndexReq;
import org.apache.iotdb.ui.controller.request.SearchDataReq;
import org.apache.iotdb.ui.exception.TsfileViewerException;
import org.apache.iotdb.ui.model.BaseVO;
import org.apache.iotdb.ui.model.Page;
import org.apache.iotdb.ui.model.tsviewer.*;
import org.apache.iotdb.ui.service.TsfileViewerService;
import org.apache.iotdb.ui.util.MessageUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/** @Author: LL @Description: @Date: create in 2022/9/22 17:56 */
@CrossOrigin
@RestController
@Api("TsViewer API")
public class TsfileViewerController {

  @Autowired private TsfileViewerService tsfileViewerService;

  /**
   * 获取文件列表 过滤非tsfile结尾的文件，文件夹可以下钻
   *
   * @return
   */
  @ApiOperation(value = "/api/ts-viewer/access-directory", notes = "打开目标文件夹")
  @PostMapping("/api/ts-viewer/access-directory")
  public BaseVO<Object> showFileList(String directoryPath) {
    try {
      List<FileRecord> recordList = tsfileViewerService.showFileList(directoryPath);
      return BaseVO.success("success", recordList);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/loaded-files", notes = "获取已经加载的文件列表")
  @PostMapping("/api/ts-viewer/loaded-files")
  public BaseVO<Object> showLoadedFileList() {
    try {
      List<FileRecord> recordList = tsfileViewerService.getLoadedFiles();
      return BaseVO.success("success", recordList);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/files/load-file", notes = "加载文件")
  @PostMapping("/api/ts-viewer/files/load-file")
  public BaseVO<Object> loadFile(String filePath) {
    try {
      tsfileViewerService.loadFile(filePath);
      return BaseVO.success("success", null);
    } catch (IOException e) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/files/unload-file", notes = "卸载文件")
  @PostMapping("/api/ts-viewer/files/unload-file")
  public BaseVO<Object> unLoadFile(String filePath) {
    // 从container 中卸载对应的文件
    try {
      tsfileViewerService.unLoadFile(filePath);
      return BaseVO.success("success", null);
    } catch (IOException e) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/process", notes = "获取加载进度")
  @PostMapping("/api/ts-viewer/file/process")
  public BaseVO<Object> getProcess(String filePath) {
    try {
      TsfilePropertiesVO tsfilePropertiesVO = tsfileViewerService.getProcess(filePath);
      return BaseVO.success("success", tsfilePropertiesVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/version", notes = "获取版本信息")
  @PostMapping("/api/ts-viewer/file/version")
  public BaseVO<Object> getVersion(String filePath) {
    try {
      TsfilePropertiesVO tsfilePropertiesVO = tsfileViewerService.getVersion(filePath);
      return BaseVO.success("success", tsfilePropertiesVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/chunk-groups", notes = "获取chunkgroup列表")
  @PostMapping("/api/ts-viewer/file/chunkgroups")
  public BaseVO<Object> getChunkGroupsList(
      String filePath, PageModel pageModel, @RequestParam(required = false) String deviceLike) {
    try {
      Page<ChunkGroupInfo> res =
          tsfileViewerService.getChunkGroupList(filePath, pageModel, deviceLike);
      return BaseVO.success("success", res);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(
      value = "/api/ts-viewer/file/chunk-groups/chunkgroup/brief-info",
      notes = "获取单个chunkgroup的简要信息,CGHeader,CHeader,PageHeader等等")
  @PostMapping("/api/ts-viewer/file/chunkgroups/chunkgroup/brief-info")
  public BaseVO<Object> getChunkGroupInfo(
      @RequestParam(required = false) Long offset, String filePath) {
    try {
      ChunkGroupBriefInfo chunkGroupBriefInfo =
          tsfileViewerService.getChunkGroupBriefInfo(filePath, offset);
      return BaseVO.success("success", chunkGroupBriefInfo);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException o) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  /**
   * @param offset offset值
   * @param filePath
   * @param offsetType offset 对应的数据结构，TIMESERIESINDEX,CHUNKGROUP, TIMESERIESINDEX
   *     也需要分为两种情况，对齐的逻辑聚合，和不聚合
   *     timeseriesIndex对应的查询的不聚合，从其他地方过来(chunkgroup，indexoftimeseriesindex)的逻辑聚合
   * @return
   */
  @ApiOperation(value = "/api/ts-viewer/file/offset/chunks", notes = "获取offset值对应的chunks")
  @PostMapping("/api/ts-viewer/file/offset/chunks")
  public BaseVO<Object> getChunkList(
      Long offset, String filePath, OffsetType offsetType, QueryByTimeseriesIndexReq req) {
    try {
      List<ChunkOffsetInfo> chunkOffsetInfoList =
          tsfileViewerService.getChunkOffsetList(offset, filePath, offsetType, req);
      return BaseVO.success("success", chunkOffsetInfoList);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException o) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  /**
   * @param offset
   * @param filePath
   * @return
   */
  @ApiOperation(value = "/api/ts-viewer/file/offset/pages", notes = "获取chunkOffset值对应的pages")
  @PostMapping("/api/ts-viewer/file/offset/pages")
  public BaseVO<Object> getPageList(Long offset, String filePath, QueryByTimeseriesIndexReq req) {
    try {
      List<PageOffsetInfo> pageOffsetInfoList =
          tsfileViewerService.getPageOffsetList(offset, filePath, req);
      return BaseVO.success("success", pageOffsetInfoList);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException o) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  /**
   * 这里查询的page详情是从chunkgroup下钻下来的
   *
   * @param pageOffsetInfo
   * @param filePath
   * @return
   */
  @ApiOperation(
      value = "/api/ts-viewer/file/offset/page-info",
      notes = "获取pageOffsetInfo值对应的page详情（chunkgroup下钻）")
  @PostMapping("/api/ts-viewer/file/offset/page-info")
  public BaseVO<Object> getPageInfo(PageOffsetInfo pageOffsetInfo, String filePath) {

    try {
      PageDataVO pageDataVO = tsfileViewerService.getPageData(pageOffsetInfo, filePath);
      return BaseVO.success("success", pageDataVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException o) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  /**
   * 这里查询的page详情是从timeseries-index下钻下来的
   *
   * @param timeseriesIndexOffsetInfo
   * @param filePath
   * @return
   */
  @ApiOperation(
      value = "/api/ts-viewer/file/timeseries-index/offset/page-info",
      notes = "获取pageOffsetInfo值对应的page详情（timeseries-index）")
  @PostMapping("/api/ts-viewer/file/timeseries-index/offset/page-info")
  public BaseVO<Object> getPageInfoThroughTimeseriesIndexOffset(
      TimeseriesIndexOffsetInfo timeseriesIndexOffsetInfo, String filePath, QueryByTimeReq req) {

    try {
      PageDataVO pageDataVO =
          tsfileViewerService.getPageDataThroughTimeseriesIndex(
              timeseriesIndexOffsetInfo, filePath, req);
      return BaseVO.success("success", pageDataVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException o) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(
      value = "/api/ts-viewer/file/timeseries-indexs/timeseries-index/brief-info",
      notes = "获取单个TimeseriesIndex的简要信息")
  @PostMapping("/api/ts-viewer/file/timeseries-indexs/timeseries-index/brief-info")
  public BaseVO<Object> getTimeseriesIndexInfo(
      @RequestParam(required = false) Long offset, String filePath) {
    try {
      TimeseriesIndexBriefVO timeseriesIndexBriefVO =
          tsfileViewerService.getTimeseriesIndexInfoBrief(offset, filePath);
      return BaseVO.success("success", timeseriesIndexBriefVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/timeseries-indexs", notes = "获取TimeseriesIndex列表")
  @PostMapping("/api/ts-viewer/file/timeseries-indexs")
  public BaseVO<Object> getTimeseriesIndexList(
      String filePath, PageModel pageModel, QueryByTimeseriesIndexReq req) {
    try {
      Page<TimeseriesIndexVO> list =
          tsfileViewerService.getTimeseriesIndexList(filePath, pageModel, req);
      return BaseVO.success("success", list);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(
      value = "/api/ts-viewer/file//search/index-timeseries-indexs",
      notes = "查询indexOfTimeseriesIndex索引使用")
  @PostMapping("/api/ts-viewer/file/search/index-timeseries-indexs")
  public BaseVO<Object> getTimeseriesIndexListNoPaging(
      String filePath, QueryByTimeseriesIndexReq req) {
    try {
      Map<String, List<TimeseriesIndexVO>> list =
          tsfileViewerService.getTimeseriesIndexListNoPaging(filePath, req);
      return BaseVO.success("success", list);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(
      value = "/api/ts-viewer/file/index-timeseries-indexs",
      notes = "获取IndexOfTimeseriesIndex索引树")
  @PostMapping("/api/ts-viewer/file/index-timeseries-indexs")
  public BaseVO<Object> getIndexOfTimeseriesIndexTree(
      Long parentOffset, String filePath, QueryByTimeseriesIndexReq req) {
    try {
      List<ITITreeNode> list =
          tsfileViewerService.getIndexOfTimeseriesIndexList(parentOffset, filePath, req);
      return BaseVO.success("success", list);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/meta-data", notes = "获取TsfileMetaData")
  @PostMapping("/api/ts-viewer/file/meta-data")
  public BaseVO<Object> getMetaData(String filePath) {
    try {
      TsfileMetadataVO tsfileMetadataVO = tsfileViewerService.getFileMetadata(filePath);
      return BaseVO.success("success", tsfileMetadataVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/meta-data-size", notes = "获取TsfileMetaDataSize")
  @PostMapping("/api/ts-viewer/file/meta-data-size")
  public BaseVO<Object> getMetaDataSize(String filePath) {
    try {
      int size = tsfileViewerService.getFileMetadataSize(filePath);
      return BaseVO.success("success", size);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/search", notes = "通过设备id和measurement查询对应的data数据")
  @PostMapping("/api/ts-viewer/file/search")
  public BaseVO<Object> fetchDataByDeviceAndMeasurement(
      String filePath, PageModel pageModel, SearchDataReq req) {
    try {
      PageDataVO dataVO =
          tsfileViewerService.fetchDataByDeviceAndMeasurement(filePath, pageModel, req);
      return BaseVO.success("success", dataVO);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (IOException e) {
      return new BaseVO<>(
          TsfileViewerException.IO_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.IO_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (InterruptedException o) {
      return new BaseVO<>(
          TsfileViewerException.INTERRUPTED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.INTERRUPTED_EXCEPTION))
              .append(":")
              .append(o.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }

  @ApiOperation(value = "/api/ts-viewer/file/base-info", notes = "tsfile的一些基本信息")
  @PostMapping("/api/ts-viewer/file/base-info")
  public BaseVO<Object> getBaseinfo(String filePath) {
    try {
      Map res = tsfileViewerService.getBaseInfo(filePath);
      return BaseVO.success("success", res);
    } catch (TsfileViewerException e) {
      return new BaseVO<>(
          e.getErrorCode(),
          new StringBuilder(MessageUtil.get(e.getErrorCode()))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    } catch (Exception e) {
      return new BaseVO<>(
          TsfileViewerException.UNHANDLED_EXCEPTION,
          new StringBuilder(MessageUtil.get(TsfileViewerException.UNHANDLED_EXCEPTION))
              .append(":")
              .append(e.getMessage())
              .toString(),
          null);
    }
  }
}
