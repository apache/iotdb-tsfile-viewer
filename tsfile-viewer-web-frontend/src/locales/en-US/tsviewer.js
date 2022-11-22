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
    'tsviewer.fileSelect.file': 'File',
    'tsviewer.fileSelect.status': 'Status',
    'tsviewer.fileSelect.unload': 'Unload',
    'tsviewer.fileSelect.loaded': 'Loaded',
    'tsviewer.fileSelect.operation': 'Operation',
    'tsviewer.fileSelect.accessDirectory': 'Access',
    'tsviewer.fileSelect.openFile': 'OpenFile',
    'tsviewer.fileSelect.loadFile': 'LoadFile',
    'tsviewer.fileSelect.unloadFile': 'UnloadFile',
    'tsviewer.fileSelect.fileUnloaded': 'FileUnloaded',
    'tsviewer.fileSelect.fileManagement': 'FileManagement',
    'tsviewer.fileSelect.path': 'Path',
    'tsviewer.fileSelect.openPath': 'OpenPath',
    'tsviewer.fileSelect.fileName': 'FileName',

    'tsviewer.more.briefInfo': 'BriefInfo',
    'tsviewer.more.structureMap': 'StructureMap',
    'tsviewer.more.beginDate': 'BeginDate',
    'tsviewer.more.endDate': 'EndDate',
    'tsviewer.more.notNull': 'Not Null',

    'tsviewer.overview': 'Overview',
    'tsviewer.search': 'Search',
    'tsviewer.opened': 'opended',
    'tsviewer.index.explanation': '1. click the FileManagement button，select a file',
    'tsviewer.index.explanation1': '2. Overview tab, you can view the structure and data of the tsfile file',
    'tsviewer.index.explanation2': '3. Search tab, you can query all the data of a measurement',
    'tsviewer.fileManagement.explanation': '1. Select the tsfile to open, this page only displays files ending with .tsfile and folders',
    'tsviewer.fileManagement.explanation1': '2. The breadcrumbs display the corresponding file path, you can click on the breadcrumbs to jump to the corresponding path',

    'tsviewer.popDetail.chunkgroup.explanation': '1. On the chunkGroup display page, the left side is the chunkgroup list. The content in the list, when the time series is aligned at that time, is deviceId, and when the time series is not aligned, it is deviceId+measurementId',
    'tsviewer.popDetail.chunkgroup.explanation1': '2. Click on the left side of the chunkgroup and the right side displays the detailed information of the current chunkgroup; click on the structure map on the right side to view more detailed content of the current chunkgroup',

    'tsviewer.popDetail.timeseriesIndex.explanation': '1. The timeseriesIndex display page, the left side is the timeseriesIndex list, the content in the list, when the time series is aligned at that time, it is deviceId, and when the time series is not aligned, it is deviceId+measurementId',
    'tsviewer.popDetail.timeseriesIndex.explanation1': '2. Click on the left side of timeseriesIndex and the right side displays the detailed information of the current timeseriesIndex; click on the structure map on the right side to view more detailed content of the current timeseriesIndex',

    'tsviewer.popDetail.indexOfTimeseriesIndex.explanation': '1. IndexOfTimeseriesIndex display page, the following tree structure represents the IndexOfTimeseriesIndex index; the most leaf node represents the index to timeseriesIndex; click the leaf node to open its corresponding chunkGroup information',

    'tsviewer.moreChunkGroup.chunk.explanation': '1. Display the corresponding chunk information in a tree structure. The first tree represents the chunk. Click the chunk to display the page information under the chunk. Click the page information; the corresponding pageData will pop up',
    'tsviewer.moreChunkGroup.chunk.explanation1': '2. Example: 1. targetHost[8], 1. is the serial number, which is convenient for viewing; before [] represents offset, that is, the position in tsfile',
    'tsviewer.moreChunkGroup.chunk.explanation2': '3. The chunk displayed by the aligned time series is a logical aggregation chunk, and its corresponding structure is timeseriesChunk and valueChunk',

    'tsviewer.moreChunkGroup.pageData.explanation': '1. Display pageData in table form, add serial number column for easy viewing; date format can be switched in timestamp',

}