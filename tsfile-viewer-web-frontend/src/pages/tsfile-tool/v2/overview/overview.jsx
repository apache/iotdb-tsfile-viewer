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
import React, { useState, useEffect } from "react";
import { Layout, Col, Row, Image, notification, Tooltip } from 'antd';
import styles from '../style.less'
import { getChunkGroupInfoUsingPOST, getTimeseriesIndexInfoUsingPOST, getVersionUsingPOST, getMetaDataSizeUsingPOST, getMetaDataUsingPOST } from '@/services/swagger1/tsfileViewerController'
import PopDetails from "./popDetails"
import { useIntl } from 'umi';

const { Sider, Content } = Layout;

const Tsfile = (props) => {

    const { fileName, baseInfo } = props;
    const intl = useIntl();

    const doMessageShow = (msg, offset) => {
        props.showStructureContext()
        props.doChange(msg, offset)
    }
    const getMessage = (wrap)=>{
        let message;
        let messageShow;
        if(wrap == undefined){
            message = "";
            messageShow = "";
        }else{
            message = <div className={styles.hcenter}>{wrap.deviceName }<br/>{"[" + wrap.offset + "]"}</div>;
            messageShow = wrap.deviceName +"\n[" + wrap.offset + "]";
        }
        return (
            <Tooltip placement="bottomLeft" title={<span style={{"whiteSpace":"pre-line"}}>{messageShow}</span>}>
                <h3 className={styles.hcenter}>{message}</h3>
            </Tooltip>
        )
    }
    const getMessageIndex = (wrap)=>{
        let message;
        let messageShow;
        if(wrap == undefined){
            message = "";
            messageShow = "";
        }else{
            if(!wrap.aligned){
                message = <div className={styles.hcenter}>{wrap.deviceId }<br/>{"[" + wrap.measurementId + "]"}<br/>{"[" + wrap.offset + "]"}</div>;
                messageShow = wrap.deviceId +"\n[" + wrap.measurementId + "]\n[" + wrap.offset + "]";
            }else{
                message = <div className={styles.hcenter}>{wrap.deviceId }<br/>{"[" + wrap.offset + "]"}</div>;
                messageShow = wrap.deviceId +"\n[" + wrap.offset + "]";
            }
        }
        return (
            <Tooltip placement="bottomLeft" title={<span style={{"whiteSpace":"pre-line"}}>{message}</span>}>
                <h3 className={styles.hcenter}>{message}</h3>
            </Tooltip>
        )
    }
    return (
        <>
            <div className={styles.row}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "50px" }}>
                    <Col span={23} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("TSFILE")}><h3 className={styles.hcenter}>TSFILE  VERSION{"[" + baseInfo.version + "]"}</h3></div>
                    </Col>
                </Row>
            </div>
            <div className={styles.notoplinerow}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "200px", padding: 5 }}>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("ChunkGroup", baseInfo.chunkGroupList[0] ? baseInfo.chunkGroupList[0].offset : undefined)}>{getMessage(baseInfo.chunkGroupList[0])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} hidden={baseInfo.chunkGroupList[1] ? false : true} onClick={() => doMessageShow("ChunkGroup", baseInfo.chunkGroupList[1] ? baseInfo.chunkGroupList[1].offset : undefined)}>{getMessage(baseInfo.chunkGroupList[1])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} hidden={baseInfo.chunkGroupList[2] ? false : true} onClick={() => doMessageShow("ChunkGroup", baseInfo.chunkGroupList[2] ? baseInfo.chunkGroupList[2].offset : undefined)}>{getMessage(baseInfo.chunkGroupList[2])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("CGMORE")}><h3 className={styles.hcenter}>more infos</h3></div>
                    </Col>
                </Row>
            </div>

            <div className={styles.notoplinerow}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "200px", padding: 5 }}>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("TimeseriesIndex", baseInfo.timeseriesIndexList[0] ? baseInfo.timeseriesIndexList[0].offset : undefined)}>{getMessageIndex(baseInfo.timeseriesIndexList[0])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} hidden={baseInfo.timeseriesIndexList[1] ? false : true} onClick={() => doMessageShow("TimeseriesIndex", baseInfo.timeseriesIndexList[1] ? baseInfo.timeseriesIndexList[1].offset : undefined)}>{getMessageIndex(baseInfo.timeseriesIndexList[1])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} hidden={baseInfo.timeseriesIndexList[2] ? false : true} onClick={() => doMessageShow("TimeseriesIndex", baseInfo.timeseriesIndexList[2] ? baseInfo.timeseriesIndexList[2].offset : undefined)}>{getMessageIndex(baseInfo.timeseriesIndexList[2])}</div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("TIMORE")}><h3 className={styles.hcenter}>more infos</h3></div>
                    </Col>
                </Row>
            </div>

            <div className={styles.rowEntry}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "45px" }}>
                    <Col span={17} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("IndexOfTimeseriesIndex")}><h3 className={styles.hcenter}>TsfileMetaData[IndexOfTimeseriesIndex]</h3></div>
                    </Col>
                    <Col span={5} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("ITIMORE")}><h3 className={styles.hcenter}>more infos</h3></div>
                    </Col>
                </Row>
            </div>
            {/* <div className={styles.row1}>
                <Row align="middle" justify="center" style={{ height: "45px" }}>
                    <Col span={22} style={{ height: "40px" }}>
                        <div className={styles.col1} onClick={() => doMessageShow("TsfileMetaData")}><h3 className={styles.hcenter}>TsfileMetaData</h3></div>
                    </Col>
                </Row>
            </div> */}
            <div className={styles.notoplinerow}>
                <Row align="middle" justify="center" style={{ height: "45px" }}>
                    <Col span={22} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("TsfileMetaDataSize")}><h3 className={styles.hcenter}>TsfileMetaDataSize{"[" + baseInfo.metadataSize + "]"}</h3></div>
                    </Col>
                </Row>
            </div>
            <div className={styles.notoplinerow}>
                <Row align="middle" justify="center" style={{ height: "45px" }}>
                    <Col span={22} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("TSFILE")}><h3 className={styles.hcenter}>TSFILE</h3></div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

const ImageMessage = (props) => {
    const { value, offset, showStructureContext, filePath } = props;
    const [version, setVersion] = useState();
    const [tsfileMetaDataSize, setTsfileMetaDataSize] = useState();

    const getVersion = async () => {
        let res = await getVersionUsingPOST({ filePath: filePath })
        if (res.code == 0) {
            setVersion(res.data.version)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const getTsFileMetada = async () => {
        let res = await getMetaDataSizeUsingPOST({ filePath: filePath })
        if (res.code == 0) {
            setTsfileMetaDataSize(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const showImage = (key, offset) => {
        if (key == "TSFILE") {
            getVersion();
            let message = '说明：\n' +
                'TSFILE 魔数 offset=0 size=6\n' +
                'VERSION:' + version + ' 版本 offset=6 size=1\n' +
                '文件末尾 TSFILE 标记结束 offset= 文件长度-6 size=6';
            return (<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{message}</pre>);
        }

        if (key == "ChunkGroup" && offset != undefined) {
            return (
                <div className={styles.detailRow}>
                    <div className={styles.chunkgroup} >
                        <Row style={{ height: "30vh" }}>
                            <Col span={3}><div className={styles.chunkgroupheader} onClick={() => { showStructureContext(key, 'CGH') }}>CGH</div></Col>
                            <Col span={16}>
                                <div className={styles.chunk1} >
                                    <Row style={{ height: "25vh" }}>
                                        <Col span={3}><div className={styles.chunkheader} onClick={() => { showStructureContext(key, 'CH') }}>CH</div></Col>
                                        <Col span={20}>
                                            <div className={styles.chunkdata} >
                                                <Row style={{ height: "20vh" }}>
                                                    <Col span={4}><div className={styles.pageheader} onClick={() => { showStructureContext(key, 'PH') }}>PH</div></Col>
                                                    <Col span={4}><div className={styles.pagedata} onClick={() => { showStructureContext('', '') }}>PD</div></Col>
                                                    <Col span={4}><div className={styles.pageheader1} onClick={() => { showStructureContext('', '') }}>PH</div></Col>
                                                    <Col span={4}><div className={styles.pagedata1} onClick={() => { showStructureContext('', '') }}>PD</div></Col>
                                                    <Col span={4}><div className={styles.pageheader1} onClick={() => { showStructureContext('', '') }}>more infos</div></Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={3}><div className={styles.chunk} >more infos</div></Col>
                        </Row>
                    </div>
                </div>
            )
        }

        if (key != undefined && key.indexOf("MORE") > -1) {
            return <div></div>
        }

        // || key == "TIMORE"
        if (key == "TimeseriesIndex" && offset != undefined) {
            return (
                <div className={styles.detailRow}>
                    <div className={styles.chunkgroup} >
                        <Row style={{ height: "30vh" }}>
                            <Col span={3}><div className={styles.timeseriesmetadata} onClick={() => { showStructureContext(key, 'TM') }}>TM</div></Col>
                            <Col span={3}>
                                <div className={styles.chunkmetadata} onClick={() => { showStructureContext(key, 'CM') }}>
                                    CM
                                </div>
                            </Col>
                            <Col span={3}><div className={styles.chunkmetadata1} onClick={() => { showStructureContext('', '') }}>CM</div></Col>
                            <Col span={3}><div className={styles.timeseriesmetadata1} onClick={() => { showStructureContext('', '') }}>TM</div></Col>
                            <Col span={3}>
                                <div className={styles.chunkmetadata1} onClick={() => { showStructureContext('', '') }}>
                                    CM
                                </div>
                            </Col>
                            <Col span={3}><div className={styles.chunkmetadata1} onClick={() => { showStructureContext('', '') }}>CM</div></Col>
                            <Col span={3}><div className={styles.timeseriesmetadata1} onClick={() => { showStructureContext('', '') }}>more infos</div></Col>

                        </Row>
                    </div>
                </div>
            )
        }

        // || key == "ITIMORE"
        if (key == "IndexOfTimeseriesIndex") {
            return (
                <div className={styles.detailRow}>
                    <div className={styles.chunkgroup} >
                        <Row style={{ height: "30vh" }}>
                            <Col span={17}>
                                <div className={styles.metadataIndexNode}>
                                    <Row style={{ height: "25vh" }}>
                                        <Col span={5}><div className={styles.childSize} onClick={() => { showStructureContext(key, 'childSize') }}>childSize</div></Col>
                                        <Col span={5}><div className={styles.list} onClick={() => { showStructureContext(key, 'list') }}>{'List<ITI>'}</div></Col>
                                        <Col span={5}><div className={styles.childSize} onClick={() => { showStructureContext(key, 'offset') }}>offset</div></Col>
                                        <Col span={5}><div className={styles.list} onClick={() => { showStructureContext(key, 'NodeType') }}>NodeType</div></Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className={styles.metaOffset} onClick={() => { showStructureContext(key, 'metaOffset') }}>metaOffset</div>
                            </Col>
                            <Col span={3}>
                                <div className={styles.bloomFilter} onClick={() => { showStructureContext('', '') }}>bloomFilter</div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        }

        // if (key == "TsfileMetaData") {  TsfileMetaData 中 包含IndexoftimeseriesIndex信息
        //     // return (<Image align="center" width="100%" height="100%" src={tsfilemetadata}></Image>);
        // }

        if (key == "TsfileMetaDataSize") {
            getTsFileMetada()
            return (<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>TsfileMetaDataSize:{tsfileMetaDataSize}</pre>);
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {showImage(value, offset)}
        </div>
    )
}


const Overview = (props) => {
    const [clickArea, setClickArea] = useState()
    const [clickAreaOffset, setClickAreaOffset] = useState(undefined)
    const [popShow, setPpoShow] = useState(false)
    const [chunkGroupBrief, setChunkGroupBrief] = useState()
    const [timeseriesIndexBrief, setTimeseriesIndexBrief] = useState()
    const [indexTimeseriesIndexBrief, setIndexTimeseriesIndexBrief] = useState()
    // 结构CGH/CH/PH点击所对应的内容
    const [structureContext, setStructureContext] = useState()

    const { fileName, filePath, baseInfo } = props;

    const doChange = (structureName, offset) => {
        setClickArea(structureName)
        setClickAreaOffset(offset)
        if (structureName.indexOf("MORE") > -1) {
            setStructureContext();
            setPpoShow({ flag: true, structureName: structureName, fileName: fileName, filePath: filePath })
        }

        if (structureName == 'ChunkGroup') {
            if (offset != undefined) {
                getCGBriefInfo(offset)
            } else {
                setStructureContext();
            }
        }

        if (structureName == 'TimeseriesIndex') {
            if (offset != undefined) {
                getTIBriefInfo(offset)
            } else {
                setStructureContext();
            }
        }

        if (structureName == 'IndexOfTimeseriesIndex') {
            getITIBriefInfo()
        }
    }

    const getCGBriefInfo = async (offset) => {
        let res = await getChunkGroupInfoUsingPOST({ offset: offset, filePath: filePath })
        if (res.code == 0) {
            setChunkGroupBrief(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const getTIBriefInfo = async (offset) => {
        let res = await getTimeseriesIndexInfoUsingPOST({ offset: offset, filePath: filePath })
        if (res.code == 0) {
            setTimeseriesIndexBrief(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const getITIBriefInfo = async () => {
        let res = await getMetaDataUsingPOST({ filePath: filePath })
        if (res.code == 0) {
            setIndexTimeseriesIndexBrief(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }

    }

    // flag1 代表chunkgroup、timeseriesIndex、等,flag2代表flag1下的二级标志
    const showStructureContext = (level1Flag, level2Flag) => {
        if (level1Flag == 'ChunkGroup') {
            if (level2Flag == 'CGH') {
                let info = "结构说明：\n"
                    + "\t CGH = ChunkGroupHeader \n"
                    + "\t CGD = ChunkGroupData \n"
                    + "\t CGD = n * Chunk \n"
                    + "\t ChunkGroup = CGH +CGD \n"
                    + "内容详情: \n"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(chunkGroupBrief.cgh, null, '\t')}</pre>)
            }
            if (level2Flag == 'CH') {
                let info = "结构说明：\n"
                    + "\t CH = ChunkHeader \n"
                    + "\t CD = ChunkData \n"
                    + "\t CD = n * Page \n"
                    + "\t Chunk = CH +CD \n"
                    + "内容详情: \n"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(chunkGroupBrief.ch, null, '\t')}</pre>)
            }
            if (level2Flag == 'PH') {
                let info = "结构说明：\n"
                    + "\t PH = PageHeader \n"
                    + "\t PD = PageData \n"
                    + "\t Page = PH + PD \n"
                    + "内容详情: \n"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(chunkGroupBrief.ph, null, '\t')}</pre>)
            }
        } else if (level1Flag == 'TimeseriesIndex') {
            if (level2Flag == 'TM') {
                let info = "结构说明：\n"
                    + "\t TM = TimeseriesMetadata \n"
                    + "\t TimeseriesIndex = TM + n*CM \n"
                    + "内容详情: \n"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(timeseriesIndexBrief.tm, null, '\t')}</pre>)
            }
            if (level2Flag == 'CM') {
                let info = "结构说明：\n"
                    + "\t CM = ChunkMetadata \n"
                    + "内容详情: \n"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(timeseriesIndexBrief.cm, null, '\t')}</pre>)
            }
        } else if (level1Flag == 'IndexOfTimeseriesIndex') {
            if (level2Flag == 'childSize') {
                let info = " \n  childSize:"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.childSize}</pre>)
            }
            if (level2Flag == 'list') {
                let info = " \n List<ITI>:"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{JSON.stringify(indexTimeseriesIndexBrief.metadataIndexNodeVo.metadataIndexEntryList, null, '\t')}</pre>)
            }
            if (level2Flag == 'offset') {
                let info = "\n offset:"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.offset}</pre>)
            }
            if (level2Flag == 'NodeType') {
                let info = "\n NodeType:"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.nodeType}</pre>)
            }
            if (level2Flag == 'metaOffset') {
                let info = "\n metaOffset:"
                setStructureContext(<pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>{info}{indexTimeseriesIndexBrief.metaOffset}</pre>)
            }
        } else {
            setStructureContext()
        }
    }

    const closePop = () => {
        setPpoShow({ flag: false })
    }

    return (
        <>
            <Layout>
                <Sider width="50%" style={{ height: "100vh", background: "white", paddingTop: 60, paddingLeft: 15, paddingRight: 15 }}>
                    <Tsfile doChange={doChange} showStructureContext={showStructureContext} fileName={fileName} baseInfo={baseInfo}></Tsfile>
                </Sider>
                <Layout style={{ background: "white", paddingTop: 60, paddingLeft: 15, paddingRight: 15 }}>
                    <Content style={{ height: "33vh", background: "white" }}>
                        <ImageMessage value={clickArea} offset={clickAreaOffset} showStructureContext={showStructureContext} filePath={filePath}></ImageMessage>
                    </Content>
                    <Content style={{ height: "60vh", background: "white" }}>
                        {structureContext}
                    </Content>
                    <PopDetails popShow={popShow} closePop={() => closePop()}></PopDetails>
                </Layout>
            </Layout>

        </>
    )
}

export default Overview