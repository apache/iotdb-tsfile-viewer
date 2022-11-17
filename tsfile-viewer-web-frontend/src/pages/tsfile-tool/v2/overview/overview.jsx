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
import { Layout, Col, Row, Image, notification } from 'antd';
import styles from '../style.less'
import { getChunkGroupInfoUsingPOST, getTimeseriesIndexInfoUsingPOST, getVersionUsingPOST, getMetaDataSizeUsingPOST, getMetaDataUsingPOST } from '@/services/swagger1/tsfileViewerController'
import PopDetails from "./popDetails"
import { useIntl } from 'umi';

const { Sider, Content } = Layout;

const Tsfile = (props) => {

    const { fileName,baseInfo } = props;
    const intl = useIntl();

    const doMessageShow = (msg) => {
        props.showStructureContext()
        props.doChange(msg)
    }
    return (
        <>
            <div className={styles.row}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "50px" }}>
                    <Col span={23} style={{ height: "40px" }}>
                        <div className={styles.shortStyle} onClick={() => doMessageShow("TSFILE")}><h3 className={styles.hcenter}>TSFILE  VERSION{"["+baseInfo.version+"]"}</h3></div>
                    </Col>
                </Row>
            </div>
            <div className={styles.notoplinerow}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "200px", padding: 5 }}>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("ChunkGroup")}><h3 className={styles.hcenter}>ChunkGroup</h3></div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("ChunkGroup")}><h3 className={styles.hcenter}>ChunkGroup</h3></div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("ChunkGroup")}><h3 className={styles.hcenter}>ChunkGroup</h3></div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("CGMORE")}><h3 className={styles.hcenter}>more infos</h3></div>
                    </Col>
                </Row>
            </div>

            <div className={styles.notoplinerow}>
                <Row gutter={[8, 8]} align="middle" justify="center" style={{ height: "200px", padding: 5 }}>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("TimeseriesIndex")}><h3 className={styles.hcenter}>TimeseriesIndex</h3></div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("TimeseriesIndex")}><h3 className={styles.hcenter}>TimeseriesIndex</h3></div>
                    </Col>
                    <Col span={6} style={{ height: "160px" }}>
                        <div className={styles.longStyle} onClick={() => doMessageShow("TimeseriesIndex")}><h3 className={styles.hcenter}>TimeseriesIndex</h3></div>
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
                        <div className={styles.shortStyle} onClick={() => doMessageShow("TsfileMetaDataSize")}><h3 className={styles.hcenter}>TsfileMetaDataSize{"["+baseInfo.metadataSize+"]"}</h3></div>
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
    const { value, showStructureContext, filePath } = props;
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

    const getTsfileMetaDataSize = async () => {

    }

    const showImage = (key) => {
        if (key == "TSFILE") {
            getVersion();
            let message = '说明：\n' +
                'TSFILE 魔数 offset=0 size=6\n' +
                'VERSION:' + version + ' 版本 offset=6 size=1\n' +
                '文件末尾 TSFILE 标记结束 offset= 文件长度-6 size=6';
            return (<pre>{message}</pre>);
        }

        if (key == "ChunkGroup") {
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
        if (key == "TimeseriesIndex") {
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
            return (<pre>TsfileMetaDataSize:{tsfileMetaDataSize}</pre>);
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {showImage(value)}
        </div>
    )
}


const Overview = (props) => {
    const [clickArea, setClickArea] = useState()
    const [popShow, setPpoShow] = useState(false)
    const [chunkGroupBrief, setChunkGroupBrief] = useState()
    const [timeseriesIndexBrief, setTimeseriesIndexBrief] = useState()
    const [indexTimeseriesIndexBrief, setIndexTimeseriesIndexBrief] = useState()
    // 结构CGH/CH/PH点击所对应的内容
    const [structureContext, setStructureContext] = useState()

    const { fileName, filePath, baseInfo } = props;

    const doChange = (structureName) => {
        setClickArea(structureName)
        if (structureName.indexOf("MORE") > -1) {
            setStructureContext();
            setPpoShow({ flag: true, structureName: structureName, fileName: fileName, filePath: filePath })
        }

        if (structureName == 'ChunkGroup') {
            getCGBriefInfo()
        }

        if (structureName == 'TimeseriesIndex') {
            getTIBriefInfo()
        }

        if (structureName == 'IndexOfTimeseriesIndex') {
            getITIBriefInfo()
        }
    }

    const getCGBriefInfo = async () => {
        let res = await getChunkGroupInfoUsingPOST({ offset: 0, filePath: filePath })
        if (res.code == 0) {
            setChunkGroupBrief(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const getTIBriefInfo = async () => {
        let res = await getTimeseriesIndexInfoUsingPOST({ offset: 0, filePath: filePath })
        if (res.code == 0) {
            setTimeseriesIndexBrief(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const getITIBriefInfo = async () => {
        let res = await getMetaDataUsingPOST({filePath: filePath })
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
                setStructureContext(<pre>{info}{JSON.stringify(chunkGroupBrief.cgh, null, '\t')}</pre>)
            }
            if (level2Flag == 'CH') {
                let info = "结构说明：\n"
                    + "\t CH = ChunkHeader \n"
                    + "\t CD = ChunkData \n"
                    + "\t CD = n * Page \n"
                    + "\t Chunk = CH +CD \n"
                    + "内容详情: \n"
                setStructureContext(<pre>{info}{JSON.stringify(chunkGroupBrief.ch, null, '\t')}</pre>)
            }
            if (level2Flag == 'PH') {
                let info = "结构说明：\n"
                    + "\t PH = PageHeader \n"
                    + "\t PD = PageData \n"
                    + "\t Page = PH + PD \n"
                    + "内容详情: \n"
                setStructureContext(<pre>{info}{JSON.stringify(chunkGroupBrief.ph, null, '\t')}</pre>)
            }
        } else if (level1Flag == 'TimeseriesIndex') {
            if (level2Flag == 'TM') {
                let info = "结构说明：\n"
                    + "\t TM = TimeseriesMetadata \n"
                    + "\t TimeseriesIndex = TM + n*CM \n"
                    + "内容详情: \n"
                setStructureContext(<pre>{info}{JSON.stringify(timeseriesIndexBrief.tm, null, '\t')}</pre>)
            }
            if (level2Flag == 'CM') {
                let info = "结构说明：\n"
                    + "\t CM = ChunkMetadata \n"
                    + "内容详情: \n"
                setStructureContext(<pre>{info}{JSON.stringify(timeseriesIndexBrief.cm, null, '\t')}</pre>)
            }
        }else if(level1Flag == 'IndexOfTimeseriesIndex'){
            if (level2Flag == 'childSize') {
                let info = " \n  childSize:"
                setStructureContext(<pre>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.childSize}</pre>)
            }
            if (level2Flag == 'list') {
                let info = " \n List<ITI>:"
                setStructureContext(<pre>{info}{JSON.stringify(indexTimeseriesIndexBrief.metadataIndexNodeVo.metadataIndexEntryList, null, '\t')}</pre>)
            }
            if (level2Flag == 'offset') {
                let info = "\n offset:"
                setStructureContext(<pre>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.offset}</pre>)
            }
            if (level2Flag == 'NodeType') {
                let info =  "\n NodeType:"
                setStructureContext(<pre>{info}{indexTimeseriesIndexBrief.metadataIndexNodeVo.nodeType}</pre>)
            }
            if (level2Flag == 'metaOffset') {
                let info = "\n metaOffset:"
                setStructureContext(<pre>{info}{indexTimeseriesIndexBrief.metaOffset}</pre>)
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
                        <ImageMessage value={clickArea} showStructureContext={showStructureContext} filePath={filePath}></ImageMessage>
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