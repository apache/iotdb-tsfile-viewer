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
import React, { useState } from "react";
import { notification, Tooltip } from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import FileSelect from "./fileSelect/fileSelect";
import Overview from "./overview/overview";
import { QuestionCircleOutlined } from '@ant-design/icons';
import SearchPageData from "./searchData/searchPageData"
import { useIntl } from 'umi';

const v2 = (props) => {
    const [fileName, setFileName] = useState('')
    const [filePath, setFilePath] = useState('')
    const [currentKey, setCurrentKey] = useState()
    const [tabSelect, setTabSelect] = useState()
    const [baseInfo, setBaseInfo] = useState({ version: "", metadataSize: "", chunkGroupList: [], timeseriesIndexList: [] })
    const intl = useIntl();

    const renderChilderByTabKey = (key, skipFileNameCheck) => {
        setCurrentKey(key)
        if (fileName == '' || fileName == undefined) {
            if (!skipFileNameCheck) {
                return;
            }
        }
        setTabSelect(key)
    }

    return (
        <div
            style={{
                background: '#F5F7FA',
            }}
        >
            <PageContainer
                fixedHeader
                header={{
                    title: (
                        <div style={{ whiteSpace: "pre-wrap" }}>
                            <Tooltip placement="bottom" title={<span>
                                {intl.formatMessage({ id: 'tsviewer.index.explanation', })}<br/>
                                {intl.formatMessage({ id: 'tsviewer.index.explanation1', })}<br/>
                                {intl.formatMessage({ id: 'tsviewer.index.explanation2', })}<br/>
                            </span>}>
                                <QuestionCircleOutlined />
                            </Tooltip>
                            {"\u00A0\u00A0"+filePath}
                        </div>
                    ),
                    ghost: true,
                    extra: [
                        <FileSelect setFileName={setFileName} setFilePath={setFilePath} currentKey={currentKey}
                            renderChilderByTabKey={renderChilderByTabKey} setTabSelect={setTabSelect} setBaseInfo={setBaseInfo}></FileSelect>
                    ],
                }}
                tabList={[
                    {
                        tab: intl.formatMessage({ id: 'tsviewer.overview', }),
                        key: 'overview',
                        closable: false,
                    },
                    {
                        tab: intl.formatMessage({ id: 'tsviewer.search', }),
                        key: 'search',
                        closable: false,
                    },
                ]}
                tabProps={{
                    type: 'line',
                    onChange: (s) => renderChilderByTabKey(s),

                }}
            >
                <div id="overview" style={{ display: tabSelect == 'overview' ? 'block' : 'none', background: "white", height: "100vh" }}>
                    <Overview fileName={fileName} filePath={filePath} baseInfo={baseInfo}></Overview>
                </div>
                <div id="search" style={{ display: tabSelect == 'search' ? 'block' : 'none', background: "white", height: "100vh" }}>
                    <SearchPageData filePath={filePath}></SearchPageData>
                </div>
            </PageContainer>
        </div>
    )
}

export default v2