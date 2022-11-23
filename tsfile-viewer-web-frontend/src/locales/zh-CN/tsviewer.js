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
export default {
    'tsviewer.fileSelect.file': '文件',
    'tsviewer.fileSelect.status': '状态',
    'tsviewer.fileSelect.unload': '未加载',
    'tsviewer.fileSelect.loaded': '已加载',
    'tsviewer.fileSelect.operation': '操作',
    'tsviewer.fileSelect.accessDirectory': '打开文件夹',
    'tsviewer.fileSelect.openFile': '打开文件',
    'tsviewer.fileSelect.loadFile': '加载文件',
    'tsviewer.fileSelect.unloadFile': '卸载文件',
    'tsviewer.fileSelect.fileUnloaded': '文件已经卸载',
    'tsviewer.fileSelect.fileManagement': '文件管理',
    'tsviewer.fileSelect.path': '路径',
    'tsviewer.fileSelect.openPath': '打开路径',
    'tsviewer.fileSelect.fileName': '文件名称',

    'tsviewer.more.briefInfo': '简略信息',
    'tsviewer.more.structureMap': '结构图谱',
    'tsviewer.more.beginDate': '开启日期',
    'tsviewer.more.endDate': '结束日期',
    'tsviewer.more.notNull': '不能为空',

    'tsviewer.overview': '总览',
    'tsviewer.search': '数据查询',
    'tsviewer.opened': '已打开',
    'tsviewer.index.explanation': '1、点击文件管理，选择一个文件',
    'tsviewer.index.explanation1': '2、总览页签，可以查看tsfile文件的结构以及数据',
    'tsviewer.index.explanation2': '3、数据查询页签，可以查询某个measurement的所有数据',
    'tsviewer.fileManagement.explanation': '1、选择要打开的tsfile，本页面只展示文件夹和以.tsfile结尾的文件',
    'tsviewer.fileManagement.explanation1': '2、面包屑展示对应的文件路径，你可以点击面包屑来跳转到对应的路径里',

    'tsviewer.popDetail.chunkgroup.explanation': '1、chunkGroup展示页面，左侧为chunkgroup列表，列表中的内容，当时对齐时间序列时，为deviceId,非对齐时间序列则是deviceId+measurementId',
    'tsviewer.popDetail.chunkgroup.explanation1': '2、点击左侧chunkgroup右侧展示当前chunkgroup的详情信息；点击右侧的结构图谱，可以查看当前chunkgroup更加详细的内容',

    'tsviewer.popDetail.timeseriesIndex.explanation': '1、timeseriesIndex展示页面，左侧为timeseriesIndex列表，列表中的内容，当时对齐时间序列时，为deviceId,非对齐时间序列则是deviceId+measurementId',
    'tsviewer.popDetail.timeseriesIndex.explanation1': '2、点击左侧timeseriesIndex右侧展示当前timeseriesIndex的详情信息；点击右侧的结构图谱，可以查看当前timeseriesIndex更加详细的内容',

    'tsviewer.popDetail.indexOfTimeseriesIndex.explanation': '1、IndexOfTimeseriesIndex展示页面，以下的树结构表示IndexOfTimeseriesIndex索引；最叶子节点表示索引到timeseriesIndex；点击叶子结点，打开其对应的chunkGroup信息',

    'tsviewer.moreChunkGroup.chunk.explanation': '1、以树状结构展示对应的chunk信息，第一层树为代表chunk，点击chunk，显示chunk下的page信息，点击page信息；会弹出对应的pageData',
    'tsviewer.moreChunkGroup.chunk.explanation1': '2、例子：1. targetHost[8], 1. 是序号，方便查看；[]之前代表的是offset，即tsfile中的位置',
    'tsviewer.moreChunkGroup.chunk.explanation2': '3、对齐时间序列展示的chunk为逻辑聚合chunk，其对应的结构为timeseriesChunk和valueChunk',

    'tsviewer.moreChunkGroup.pageData.explanation': '1、以table表格展示pageData，添加序号列，方便查看；timestamp中可以切换日期格式',
}