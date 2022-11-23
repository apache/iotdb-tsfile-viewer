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
package org.apache.iotdb.ui.service;

import org.apache.iotdb.tool.core.model.ChunkGroupInfo;
import org.apache.iotdb.tool.core.model.TimeSeriesMetadataNode;
import org.apache.iotdb.tool.core.model.web.*;
import org.apache.iotdb.tool.core.service.TsFileAnalyserV13;
import org.apache.iotdb.tsfile.common.conf.TSFileConfig;
import org.apache.iotdb.tsfile.file.metadata.AlignedTimeSeriesMetadata;
import org.apache.iotdb.tsfile.file.metadata.ITimeSeriesMetadata;
import org.apache.iotdb.tsfile.file.metadata.TimeseriesMetadata;
import org.apache.iotdb.tsfile.file.metadata.TsFileMetadata;
import org.apache.iotdb.tsfile.read.common.BatchData;
import org.apache.iotdb.tsfile.read.common.Field;
import org.apache.iotdb.tsfile.read.common.Path;
import org.apache.iotdb.tsfile.read.common.RowRecord;
import org.apache.iotdb.tsfile.read.query.dataset.QueryDataSet;
import org.apache.iotdb.tsfile.utils.Pair;
import org.apache.iotdb.ui.config.TsfileViewerContainer;
import org.apache.iotdb.ui.controller.pagination.PageModel;
import org.apache.iotdb.ui.controller.request.QueryByTimeReq;
import org.apache.iotdb.ui.controller.request.QueryByTimeseriesIndexReq;
import org.apache.iotdb.ui.controller.request.SearchDataReq;
import org.apache.iotdb.ui.exception.TsfileViewerException;
import org.apache.iotdb.ui.model.Page;
import org.apache.iotdb.ui.model.PageParam;
import org.apache.iotdb.ui.model.tsviewer.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/** @Author: LL @Description: @Date: create in 2022/9/22 17:55 */
@Service
public class TsfileViewerService {

  @Value("${tsviewer.web.baseDirectory}")
  private String baseDirectoryPath;

  @Autowired private TsfileViewerContainer tsfileViewerContainer;

  public List<FileRecord> showFileList(String directoryPath) throws TsfileViewerException {
    directoryPath = getFullPath(directoryPath);
    List<FileRecord> fileRecordList = new ArrayList<>();
    File directoryFile = new File(directoryPath);
    if (!directoryFile.isDirectory()) {
      throw new TsfileViewerException(TsfileViewerException.PATH_NOT_DIRECTORY, "");
    }

    // 如果为空文件夹，直接返回
    if (directoryFile.listFiles() == null) {
      return fileRecordList;
    }

    for (File child : directoryFile.listFiles()) {
      if (child.isDirectory()) {
        FileRecord record = new FileRecord();
        record.setName(child.getName());
        record.setCanRead(child.canRead());
        record.setType(FileType.DIRECTORY);
        record.setStatus(LoadStatus.EXCLUDED);
        record.setSameFolder(true);
        fileRecordList.add(record);
      } else {
        if (child.getName().toLowerCase().endsWith(".tsfile")) {
          FileRecord record = new FileRecord();
          record.setName(child.getName());
          record.setCanRead(child.canRead());
          record.setType(FileType.FILE);
          if (tsfileViewerContainer.contain(child.getPath())) {
            record.setStatus(LoadStatus.LOADED);
          } else {
            record.setStatus(LoadStatus.UNLOAD);
          }
          // record.setPath(child.getPath());
          record.setSameFolder(true);
          fileRecordList.add(record);
        } else {
          continue;
        }
      }
    }
    fileRecordList =
        fileRecordList.stream()
            .sorted(
                (o1, o2) -> {
                  if (o1.getType() == FileType.DIRECTORY && o2.getType() == FileType.FILE) {
                    return -2;
                  } else if (o1.getType() == FileType.FILE && o2.getType() == FileType.DIRECTORY) {
                    return 2;
                  } else {
                    return 0;
                  }
                })
            .collect(Collectors.toList());
    return fileRecordList;
  }

  public List<FileRecord> getLoadedFiles() {
    List<FileRecord> fileRecordList =
        tsfileViewerContainer.getContainer().keySet().stream()
            .map(
                path -> {
                  FileRecord fileRecord = new FileRecord();
                  fileRecord.setName(path.substring(baseDirectoryPath.length()));
                  fileRecord.setStatus(LoadStatus.LOADED);
                  fileRecord.setType(FileType.FILE);
                  fileRecord.setSameFolder(false);
                  return fileRecord;
                })
            .collect(Collectors.toList());
    if (fileRecordList == null) {
      return new ArrayList<>();
    }
    return fileRecordList;
  }

  /**
   * 加载文件，并把tsfileAnalyserV13对象放入container中
   *
   * @param filePath
   * @throws IOException
   * @throws TsfileViewerException
   */
  public void loadFile(String filePath) throws IOException, TsfileViewerException {
    filePath = getFullPath(filePath);
    if (tsfileViewerContainer.contain(filePath)) {
      return;
    }
    TsFileAnalyserV13 tsFileAnalyserV13 = new TsFileAnalyserV13(filePath);
    tsfileViewerContainer.addTsfileParser(filePath, tsFileAnalyserV13);
  }

  /**
   * 关闭文件引用，从container中移除TsFileAnalyserV13对象
   *
   * @param filePath
   * @throws IOException
   */
  public void unLoadFile(String filePath) throws IOException, TsfileViewerException {
    filePath = getFullPath(filePath);
    tsfileViewerContainer.getTsfileParser(filePath).getReader().close();
    tsfileViewerContainer.removeTsfileParser(filePath);
  }

  /**
   * 获取文件加载进度
   *
   * @param filePath
   * @return
   */
  public TsfilePropertiesVO getProcess(String filePath) throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parser = tsfileViewerContainer.getTsfileParser(filePath);
    double rate = parser.getRateOfProcess() * 100;
    TsfilePropertiesVO tsfilePropertiesVO = new TsfilePropertiesVO();
    tsfilePropertiesVO.setRateOfProcess(String.format("%.2f", rate));
    return tsfilePropertiesVO;
  }

  /**
   * 获取文件版本
   *
   * @param filePath
   * @return
   */
  public TsfilePropertiesVO getVersion(String filePath) throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parser = tsfileViewerContainer.getTsfileParser(filePath);
    String version = parser.getVersion();
    TsfilePropertiesVO tsfilePropertiesVO = new TsfilePropertiesVO();
    tsfilePropertiesVO.setVersion(version);
    return tsfilePropertiesVO;
  }

  /**
   * 添加分页功能
   *
   * @param filePath
   * @param pageModel
   * @return
   */
  public Page<ChunkGroupInfo> getChunkGroupList(
      String filePath, PageModel pageModel, String deviceLike) throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parser = tsfileViewerContainer.getTsfileParser(filePath);
    List<ChunkGroupInfo> list = parser.getChunkGroupInfoList();
    if (!"".equals(deviceLike) && deviceLike != null) {
      list =
          list.stream()
              .filter((item) -> item.getDeviceName().contains(deviceLike))
              .collect(Collectors.toList());
    }
    double totalSize = list.size();
    double pageNo = pageModel.getPageNo();
    PageParam pageParam = new PageParam();
    pageParam.setPageNo(pageModel.getPageNo());
    pageParam.setPageSize(pageModel.getPageSize());
    pageParam.setMaxPageNum((int) Math.ceil(totalSize / pageNo));
    pageParam.setTotalCount(list.size());

    int start = (pageModel.getPageNo() - 1) * pageModel.getPageSize();
    int end = pageModel.getPageNo() * pageModel.getPageSize();
    if (end > list.size()) {
      end = list.size();
    }
    list = list.subList(start, end);
    Page<ChunkGroupInfo> res = new Page(list, pageParam);
    return res;
  }

  public ChunkGroupBriefInfo getChunkGroupBriefInfo(String filePath, Long offset)
      throws IOException, InterruptedException, TsfileViewerException {

    if (offset == null || offset == 0) {
      // 魔数 + 版本
      long headerLength = TSFileConfig.MAGIC_STRING.getBytes().length + Byte.BYTES;
      offset = headerLength + 1;
    }
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    ChunkGroupBriefInfo chunkGroupBriefInfo = parse.fetchChunkGroupBrief(offset);
    return chunkGroupBriefInfo;
  }

  /**
   * CG 不需要时间过滤 TimeseriesIndexQueryReq
   *
   * @param offset
   * @param filePath
   * @param offsetType
   * @param req
   * @return
   * @throws IOException
   * @throws InterruptedException
   * @throws TsfileViewerException
   */
  public List<ChunkOffsetInfo> getChunkOffsetList(
      Long offset, String filePath, OffsetType offsetType, QueryByTimeseriesIndexReq req)
      throws IOException, InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    List<ChunkOffsetInfo> chunkOffsetInfoList = new ArrayList<>();
    AtomicInteger no = new AtomicInteger(1);
    switch (offsetType) {
      case CG:
        chunkOffsetInfoList = parse.fetchChunkOffsetListByChunkGroupOffset(offset);
        if (chunkOffsetInfoList.get(0).isAligned()) {
          chunkOffsetInfoList = chunkOffsetInfoList.subList(0, 1);
        }
        chunkOffsetInfoList =
            chunkOffsetInfoList.stream()
                .map(
                    chunkOffsetInfo -> {
                      if (chunkOffsetInfo.isAligned()) {
                        chunkOffsetInfo.setMeasurementId(
                            no + ". " + "AlignedChunk[" + chunkOffsetInfo.getOffset() + "]");
                      } else {
                        chunkOffsetInfo.setMeasurementId(
                            no
                                + ". "
                                + chunkOffsetInfo.getMeasurementId()
                                + "["
                                + chunkOffsetInfo.getOffset()
                                + "]");
                      }
                      no.incrementAndGet();
                      return chunkOffsetInfo;
                    })
                .collect(Collectors.toList());
        break;
      case TS_INDEX:
        Map<Long, Pair<Path, ITimeSeriesMetadata>> timeseriesMetadataMap =
            parse.getTimeseriesMetadataMap();
        Pair<Path, ITimeSeriesMetadata> pair = timeseriesMetadataMap.get(offset);
        if (pair.right instanceof AlignedTimeSeriesMetadata) {
          AlignedTimeSeriesMetadata timeSeriesMetadata = (AlignedTimeSeriesMetadata) pair.right;
          chunkOffsetInfoList =
              timeSeriesMetadata.getChunkMetadataList().stream()
                  .map(
                      alignedChunkMetadata -> {
                        ChunkOffsetInfo chunkOffsetInfo = new ChunkOffsetInfo();
                        chunkOffsetInfo.setMeasurementId(
                            "AlignedChunk[" + alignedChunkMetadata.getOffsetOfChunkHeader() + "]");
                        chunkOffsetInfo.setOffset(alignedChunkMetadata.getOffsetOfChunkHeader());
                        chunkOffsetInfo.setAligned(true);
                        chunkOffsetInfo.setStartTime(
                            alignedChunkMetadata.getStatistics().getStartTime());
                        chunkOffsetInfo.setEndTime(
                            alignedChunkMetadata.getStatistics().getEndTime());
                        return chunkOffsetInfo;
                      })
                  .collect(Collectors.toList());
        } else {
          TimeseriesMetadata timeSeriesMetadata = (TimeseriesMetadata) pair.right;
          chunkOffsetInfoList =
              timeSeriesMetadata.getChunkMetadataList().stream()
                  .map(
                      iChunkMetadata -> {
                        ChunkOffsetInfo chunkOffsetInfo = new ChunkOffsetInfo();
                        chunkOffsetInfo.setMeasurementId(
                            iChunkMetadata.getMeasurementUid()
                                + "["
                                + iChunkMetadata.getOffsetOfChunkHeader()
                                + "]");
                        chunkOffsetInfo.setOffset(iChunkMetadata.getOffsetOfChunkHeader());
                        chunkOffsetInfo.setAligned(false);
                        chunkOffsetInfo.setStartTime(iChunkMetadata.getStatistics().getStartTime());
                        chunkOffsetInfo.setEndTime(iChunkMetadata.getStatistics().getEndTime());
                        return chunkOffsetInfo;
                      })
                  .collect(Collectors.toList());
        }
        // 添加过滤条件
        chunkOffsetInfoList =
            chunkOffsetInfoList.stream()
                .filter(
                    chunkOffsetInfo -> {
                      if (req.getBeginDate() != null && req.getBeginDate() != 0) {
                        if (req.getBeginDate() > chunkOffsetInfo.getEndTime()) {
                          return false;
                        }
                      }
                      if (req.getEndDate() != null && req.getEndDate() != 0) {
                        if (req.getEndDate() < chunkOffsetInfo.getStartTime()) {
                          return false;
                        }
                      }
                      return true;
                    })
                .map(
                    (chunkOffsetInfo) -> {
                      chunkOffsetInfo.setMeasurementId(
                          no + ". " + chunkOffsetInfo.getMeasurementId());
                      no.incrementAndGet();
                      return chunkOffsetInfo;
                    })
                .collect(Collectors.toList());

        break;
      default:
        throw new TsfileViewerException(TsfileViewerException.UNSUPPORTED_OFFSETTYPE, "");
    }
    return chunkOffsetInfoList;
  }

  public List<PageOffsetInfo> getPageOffsetList(
      Long offset, String filePath, QueryByTimeseriesIndexReq req)
      throws IOException, InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    List<PageOffsetInfo> pageOffsetInfoList = parse.fetchPageOffsetListByChunkOffset(offset);
    AtomicInteger no = new AtomicInteger(1);
    pageOffsetInfoList =
        pageOffsetInfoList.stream()
            .filter(
                pageOffsetInfo -> {
                  if (req.getBeginDate() != null && req.getBeginDate() != 0) {
                    if (req.getBeginDate() > pageOffsetInfo.getEndTime()) {
                      return false;
                    }
                  }
                  if (req.getEndDate() != null && req.getEndDate() != 0) {
                    if (req.getEndDate() < pageOffsetInfo.getStartTime()) {
                      return false;
                    }
                  }
                  return true;
                })
            .map(
                pageOffsetInfo -> {
                  if (pageOffsetInfo.isAligned()) {
                    pageOffsetInfo.setPageNo(
                        no + " .AlignedPage[" + pageOffsetInfo.getOffset() + "]");
                  } else {
                    pageOffsetInfo.setPageNo(no + " .Page[" + pageOffsetInfo.getOffset() + "]");
                  }
                  no.getAndIncrement();
                  return pageOffsetInfo;
                })
            .collect(Collectors.toList());
    return pageOffsetInfoList;
  }

  public PageDataVO getPageData(PageOffsetInfo pageOffsetInfo, String filePath)
      throws IOException, InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    PageDataTableInfo table = parse.fetchBatchDataByPageOffset(pageOffsetInfo);
    BatchData data = table.getData();
    PageDataVO pageDataVO = new PageDataVO();
    pageDataVO.setTitle(table.getTitle());
    if (pageOffsetInfo.isAligned()) {
      while (data.hasCurrent()) {
        List<String> col = new ArrayList<>();
        long time = data.currentTime();
        col.add(time + "");
        String[] values = data.currentTsPrimitiveType().getStringValue().split(",");
        for (int i = 0; i < values.length; i++) {
          values[i] = values[i].trim();
          if (i == 0) {
            values[i] = values[i].substring(1);
          } else if (i == values.length - 1) {
            values[i] = values[i].substring(0, values[i].length() - 1);
          }
          col.add(values[i]);
        }
        pageDataVO.getValues().add(col);
        data.next();
      }
    } else {
      while (data.hasCurrent()) {
        List<String> col = new ArrayList<>();
        col.add(data.currentTime() + "");
        Object currValue = data.currentValue();
        col.add(currValue.toString());
        pageDataVO.getValues().add(col);
        data.next();
      }
    }
    return pageDataVO;
  }

  public PageDataVO getPageDataThroughTimeseriesIndex(
      TimeseriesIndexOffsetInfo timeseriesIndexOffsetInfo, String filePath, QueryByTimeReq req)
      throws IOException, InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    PageDataTableInfo table =
        parse.fetchBatchDataByTimeseriesIndexOffset(timeseriesIndexOffsetInfo);
    BatchData data = table.getData();
    PageDataVO pageDataVO = new PageDataVO();
    pageDataVO.setTitle(table.getTitle());
    if (timeseriesIndexOffsetInfo.isAligned()) {
      while (data.hasCurrent()) {
        List<String> col = new ArrayList<>();
        long time = data.currentTime();
        col.add(time + "");
        String[] values = data.currentTsPrimitiveType().getStringValue().split(",");
        for (int i = 0; i < values.length; i++) {
          values[i] = values[i].trim();
          if (i == 0) {
            values[i] = values[i].substring(1);
          } else if (i == values.length - 1) {
            values[i] = values[i].substring(0, values[i].length() - 1);
          }
          col.add(values[i]);
        }
        pageDataVO.getValues().add(col);
        data.next();
      }
    } else {
      while (data.hasCurrent()) {
        List<String> col = new ArrayList<>();
        col.add(data.currentTime() + "");
        Object currValue = data.currentValue();
        col.add(currValue.toString());
        pageDataVO.getValues().add(col);
        data.next();
      }
    }

    // 通过时间条件过滤一下
    pageDataVO.setValues(
        pageDataVO.getValues().stream()
            .filter(
                cols -> {
                  long timestamp = Long.parseLong(cols.get(0));
                  if (req.getBeginDate() != null && req.getBeginDate() != 0) {
                    if (req.getBeginDate() > timestamp) {
                      return false;
                    }
                  }

                  if (req.getEndDate() != null && req.getEndDate() != 0) {
                    if (req.getEndDate() < timestamp) {
                      return false;
                    }
                  }
                  return true;
                })
            .collect(Collectors.toList()));
    return pageDataVO;
  }

  public Map<String, List<TimeseriesIndexVO>> getTimeseriesIndexListNoPaging(
      String filePath, QueryByTimeseriesIndexReq req) throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    Map<Long, Pair<Path, ITimeSeriesMetadata>> timeseriesMap = parse.getTimeseriesMetadataMap();
    Map<String, List<TimeseriesIndexVO>> res = new HashMap<>();
    // 查询条件过滤
    res =
        timeseriesMap.entrySet().stream()
            .filter(
                s -> {
                  if (req.getDeviceNameLike() != null && !"".equals(req.getDeviceNameLike())) {
                    if (!s.getValue().left.getDevice().contains(req.getDeviceNameLike())) {
                      return false;
                    }
                  }
                  long start = s.getValue().right.getStatistics().getStartTime();
                  long end = s.getValue().right.getStatistics().getEndTime();

                  if (req.getBeginDate() != null && req.getBeginDate() != 0) {
                    if (req.getBeginDate() > end) {
                      return false;
                    }
                  }

                  if (req.getEndDate() != null && req.getEndDate() != 0) {
                    if (req.getEndDate() < start) {
                      return false;
                    }
                  }
                  return true;
                })
            .map(
                (longPairEntry -> {
                  TimeseriesIndexVO timeseriesIndexVO = new TimeseriesIndexVO();
                  timeseriesIndexVO.setOffset(longPairEntry.getKey());
                  Pair<Path, ITimeSeriesMetadata> pair = longPairEntry.getValue();
                  timeseriesIndexVO.setDeviceId(pair.left.getDevice());
                  timeseriesIndexVO.setMeasurementId(pair.left.getMeasurement());
                  if (pair.right instanceof TimeseriesMetadata) {
                    timeseriesIndexVO.setAligned(false);
                  } else {
                    timeseriesIndexVO.setAligned(true);
                  }
                  return timeseriesIndexVO;
                }))
            .collect(Collectors.groupingBy(TimeseriesIndexVO::getDeviceId));

    return res;
  }

  public Page<TimeseriesIndexVO> getTimeseriesIndexList(
      String filePath, PageModel pageModel, QueryByTimeseriesIndexReq req)
      throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    Map<Long, Pair<Path, ITimeSeriesMetadata>> timeseriesMap = parse.getTimeseriesMetadataMap();
    List<TimeseriesIndexVO> list = new ArrayList<>();

    // 查询条件过滤
    timeseriesMap =
        timeseriesMap.entrySet().stream()
            .filter(
                s -> {
                  if (req.getDeviceNameLike() != null && !"".equals(req.getDeviceNameLike())) {
                    if (!s.getValue().left.getDevice().contains(req.getDeviceNameLike())) {
                      return false;
                    }
                  }
                  long start = s.getValue().right.getStatistics().getStartTime();
                  long end = s.getValue().right.getStatistics().getEndTime();

                  if (req.getBeginDate() != null && req.getBeginDate() != 0) {
                    if (req.getBeginDate() > end) {
                      return false;
                    }
                  }

                  if (req.getEndDate() != null && req.getEndDate() != 0) {
                    if (req.getEndDate() < start) {
                      return false;
                    }
                  }
                  return true;
                })
            .collect(Collectors.toMap(p -> p.getKey(), p -> p.getValue()));

    double totalSize = timeseriesMap.size();
    double pageNo = pageModel.getPageNo();
    PageParam pageParam = new PageParam();
    pageParam.setPageNo(pageModel.getPageNo());
    pageParam.setPageSize(pageModel.getPageSize());
    pageParam.setMaxPageNum((int) Math.ceil(totalSize / pageNo));
    pageParam.setTotalCount(timeseriesMap.size());

    int start = (pageModel.getPageNo() - 1) * pageModel.getPageSize();
    int end = pageModel.getPageNo() * pageModel.getPageSize();
    if (end > timeseriesMap.size()) {
      end = timeseriesMap.size();
    }

    List<Long> pagingKeys = new ArrayList<>(timeseriesMap.keySet()).subList(start, end);

    for (Long offset : pagingKeys) {
      TimeseriesIndexVO timeseriesIndexVO = new TimeseriesIndexVO();
      timeseriesIndexVO.setOffset(offset);
      Pair<Path, ITimeSeriesMetadata> pair = timeseriesMap.get(offset);
      timeseriesIndexVO.setDeviceId(pair.left.getDevice());
      timeseriesIndexVO.setMeasurementId(pair.left.getMeasurement());
      if (pair.right instanceof TimeseriesMetadata) {
        timeseriesIndexVO.setAligned(false);
      } else {
        timeseriesIndexVO.setAligned(true);
      }
      list.add(timeseriesIndexVO);
    }

    Page<TimeseriesIndexVO> res = new Page(list, pageParam);
    return res;
  }

  public TimeseriesIndexBriefVO getTimeseriesIndexInfoBrief(Long offset, String filePath)
      throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    Map<Long, Pair<Path, ITimeSeriesMetadata>> timeseriesMap = parse.getTimeseriesMetadataMap();
    TimeseriesIndexBriefVO timeseriesIndexBriefVO = new TimeseriesIndexBriefVO();
    TimeseriesMetadataBriefVO tm = new TimeseriesMetadataBriefVO();
    ChunkMetadataBriefVO cm = new ChunkMetadataBriefVO();
    timeseriesIndexBriefVO.setCm(cm);
    timeseriesIndexBriefVO.setTm(tm);
    Pair<Path, ITimeSeriesMetadata> pair;
    if (offset == null || offset == 0) {
      pair = timeseriesMap.get(new ArrayList<>(timeseriesMap.keySet()).get(0));
    } else {
      pair = timeseriesMap.get(offset);
    }
    if (pair.right instanceof AlignedTimeSeriesMetadata) {
      AlignedTimeSeriesMetadata data = (AlignedTimeSeriesMetadata) pair.right;
      tm.setTimeSeriesMetadataType(data.getTimeseriesMetadata().getTimeSeriesMetadataType());
      tm.setMeasurementId(data.getTimeseriesMetadata().getMeasurementId());
      tm.setTsDataType(data.getTimeseriesMetadata().getTSDataType());
      tm.setStatistic(data.getTimeseriesMetadata().getStatistics().toString());
      tm.setChunkMetaDataListSize(data.getTimeseriesMetadata().getDataSizeOfChunkMetaDataList());
      cm.setOffsetOfChunkHeader(
          data.getTimeseriesMetadata().getChunkMetadataList().get(0).getOffsetOfChunkHeader());
      cm.setcStatistic(
          data.getTimeseriesMetadata().getChunkMetadataList().get(0).getStatistics().toString());
    } else {
      TimeseriesMetadata data = (TimeseriesMetadata) pair.right;
      tm.setTimeSeriesMetadataType(data.getTimeSeriesMetadataType());
      tm.setMeasurementId(data.getMeasurementId());
      tm.setTsDataType(data.getTSDataType());
      tm.setStatistic(data.getStatistics().toString());
      tm.setChunkMetaDataListSize(data.getDataSizeOfChunkMetaDataList());
      cm.setOffsetOfChunkHeader(data.getChunkMetadataList().get(0).getOffsetOfChunkHeader());
      cm.setcStatistic(data.getChunkMetadataList().get(0).getStatistics().toString());
    }
    return timeseriesIndexBriefVO;
  }

  public TsfileMetadataVO getFileMetadata(String filePath)
      throws IOException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    TsFileMetadata tsFileMetadata = parse.getReader().readFileMetadata();

    TsfileMetadataVO tsfileMetadataVO = new TsfileMetadataVO();
    tsfileMetadataVO.setMetaOffset(tsFileMetadata.getMetaOffset());
    MetadataIndexNodeVo metadataIndexNodeVo = new MetadataIndexNodeVo();
    tsfileMetadataVO.setMetadataIndexNodeVo(metadataIndexNodeVo);

    metadataIndexNodeVo.setChildSize(tsFileMetadata.getMetadataIndex().getChildren().size());
    metadataIndexNodeVo.setOffset(tsFileMetadata.getMetadataIndex().getEndOffset());
    metadataIndexNodeVo.setNodeType(tsFileMetadata.getMetadataIndex().getNodeType());
    // 简易信息，不把childrenEntry全部放入返回对象中，只放第一个
    metadataIndexNodeVo.setMetadataIndexEntryList(new ArrayList<>());
    metadataIndexNodeVo
        .getMetadataIndexEntryList()
        .add(tsFileMetadata.getMetadataIndex().getChildren().get(0));

    return tsfileMetadataVO;
  }

  public int getFileMetadataSize(String filePath) throws TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    return parse.getReader().getFileMetadataSize();
  }

  public List<ITITreeNode> getIndexOfTimeseriesIndexList(
      Long parentOffset, String filePath, QueryByTimeseriesIndexReq req)
      throws InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    TimeSeriesMetadataNode root = parse.getTimeSeriesMetadataNode();
    List<ITITreeNode> itiTreeNodes = new ArrayList<>();
    List<TimeSeriesMetadataNode> childrenNode;
    if (parentOffset == null || parentOffset == 0) {
      childrenNode = root.getChildren();
    } else {
      childrenNode = fetchChildrenByParentOffset(root, parentOffset);
    }
    final int[] i = {0};
    Optional.ofNullable(childrenNode)
        .ifPresent(
            timeSeriesMetadataNodes -> {
              List<ITITreeNode> result =
                  timeSeriesMetadataNodes.stream()
                      .map(
                          node -> {
                            ITITreeNode itiTreeNode = new ITITreeNode(node);
                            if (itiTreeNode.getDeviceId() == null
                                && itiTreeNode.getMeasurementId() == null) {
                              itiTreeNode.setTitle(
                                  itiTreeNode.getNodeType().toString() + "[" + i[0] + "]");
                              i[0]++;
                            } else if (itiTreeNode.getMeasurementId() != null) {
                              itiTreeNode.setTitle(itiTreeNode.getMeasurementId());
                            } else if (itiTreeNode.getDeviceId() != null) {
                              itiTreeNode.setTitle(itiTreeNode.getDeviceId());
                            }
                            return itiTreeNode;
                          })
                      .collect(Collectors.toList());
              itiTreeNodes.addAll(result);
            });
    return itiTreeNodes;
  }

  private List<TimeSeriesMetadataNode> fetchChildrenByParentOffset(
      TimeSeriesMetadataNode root, Long parentOffset) {
    TimeSeriesMetadataNode node = searchTimeSeriesMetadataNode(root.getChildren(), parentOffset);
    if (node != null) {
      return node.getChildren();
    }
    return null;
  }

  private TimeSeriesMetadataNode searchTimeSeriesMetadataNode(
      List<TimeSeriesMetadataNode> root, Long offset) {
    for (TimeSeriesMetadataNode node : root) {
      if (node.getPosition() == offset) {
        return node;
      } else {
        TimeSeriesMetadataNode resultNode =
            searchTimeSeriesMetadataNode(node.getChildren(), offset);
        if (resultNode == null) {
          continue;
        }
        if (resultNode.getPosition() == offset) {
          return resultNode;
        }
      }
    }
    return null;
  }

  public PageDataVO fetchDataByDeviceAndMeasurement(
      String filePath, PageModel pageModel, SearchDataReq dataReq)
      throws IOException, InterruptedException, TsfileViewerException {
    filePath = getFullPath(filePath);
    TsFileAnalyserV13 parse = tsfileViewerContainer.getTsfileParser(filePath);
    long startTime = dataReq.getBeginDate();
    long endTime = dataReq.getEndDate();
    QueryDataSet queryDataSet =
        parse.queryResult(
            startTime, endTime, dataReq.getDevice(), dataReq.getMeasurement(), "", 0, 0);

    PageDataVO pageDataVO = new PageDataVO();
    pageDataVO.setTitle(Arrays.asList("timestamp", "value"));

    while (queryDataSet.hasNext()) {
      List<String> col = new ArrayList<>();
      RowRecord next = queryDataSet.next();
      long timestamp = next.getTimestamp();
      col.add(timestamp + "");
      for (Field f : next.getFields()) {
        col.add(f.getStringValue());
      }
      pageDataVO.getValues().add(col);
    }

    return pageDataVO;
  }

  public Map<String, Object> getBaseInfo(String path) throws TsfileViewerException {
    String version = getVersion(path).getVersion();
    int metadataSize = getFileMetadataSize(path);

    PageModel pageModel = new PageModel();
    pageModel.setPageNo(1);
    pageModel.setPageSize(3);
    Page<ChunkGroupInfo> pageChunkGroup = getChunkGroupList(path, pageModel, null);
    Page<TimeseriesIndexVO> pageTimeseriesIndex =
        getTimeseriesIndexList(path, pageModel, new QueryByTimeseriesIndexReq());
    Map<String, Object> res = new HashMap<>();
    res.put("version", version);
    res.put("metadataSize", metadataSize);
    res.put("chunkGroupList", pageChunkGroup.getPageItems());
    res.put("timeseriesIndexList", pageTimeseriesIndex.getPageItems());
    return res;
  }

  private String getFullPath(String path) throws TsfileViewerException {
    path = baseDirectoryPath + File.separator + path;
    File file = new File(path);
    if (file.exists()) {
      return file.getPath();
    } else {
      throw new TsfileViewerException(TsfileViewerException.PATH_NOT_EXIST, "");
    }
  }
}
