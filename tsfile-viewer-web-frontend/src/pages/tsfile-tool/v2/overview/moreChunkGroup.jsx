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
import { Card, Layout, Button, Drawer, Tree, Input, PageHeader, notification, Pagination, Table, Tooltip } from 'antd';
import styles from '../style.less'
import { GroupOutlined, RetweetOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
    getChunkGroupsListUsingPOST, getChunkGroupInfoUsingPOST, getChunkListUsingPOST, getPageListUsingPOST
    , getPageInfoUsingPOST
} from '@/services/swagger1/tsfileViewerController'
import moment from 'moment';
import { useIntl } from 'umi';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const MoreChunkGroup = (props) => {

    const [details, setDetails] = useState()
    const [openChunk, setopenChunk] = useState(false)
    const [openPage, setopenPage] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [pageNo, setPageNo] = useState(1)
    const [totalSize, setTotalSize] = useState()
    const [deviceNameLike, setDeviceNameLike] = useState()
    const [treeData, setTreeData] = useState([])
    const [columns, setColumns] = useState();
    const [columnsLength, setColumnsLength] = useState();
    const [pageData, setPageData] = useState()
    const intl = useIntl();

    var pageDataCache;

    const { fileName, filePath, cardList, setCardList } = props;

    const gridStyle = {
        width: '100%',
        background: "#f2f2f2",
    };

    const showChunkGroupDetails = async (cg) => {
        let info = JSON.parse(cg)
        let res = await getChunkGroupInfoUsingPOST({ offset: info.offset, filePath: filePath })
        if (res.code == 0) {
            let data = res.data;
            data['offset'] = info.offset;
            setDetails(data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const showChunk = async () => {
        if (details == undefined) {
            return
        }
        let res = await getChunkListUsingPOST({ offset: details.offset, filePath: filePath, offsetType: 'CG' })
        if (res.code == 0) {
            setTreeData(Object.values(res.data).map((chunkInfo) => {
                let tree = {};
                tree['title'] = chunkInfo.measurementId;
                tree['key'] = chunkInfo.offset;
                tree['icon'] = <GroupOutlined />
                tree['isLeaf'] = false;
                return tree;
            }))
            setopenChunk(true);
        } else {
            notification.error({
                message: res.message,
            });
        }

    };

    const updateTreeData = (list, key, children) => {
        return list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            // 这个应该是用来加载子节点的子节点的，应该需要修改children对象
            // if (node.children) {
            //     return {
            //         ...node,
            //         children: updateTreeData(node.children, key, children),
            //     };
            // }
            return node;
        });
    }


    const onLoadData = async ({ key, children }) => {
        let res = await getPageListUsingPOST({ offset: key, filePath: filePath })

        if (res.code == 0) {
            let pages = Object.values(res.data).map((pageInfo) => {
                let tree = {};
                tree['title'] = pageInfo.pageNo;
                tree['key'] = pageInfo.offset;
                tree['icon'] = <CopyOutlined />
                tree['isLeaf'] = true;
                tree['pageInfo'] = pageInfo;
                return tree;
            })
            setTreeData(origin =>
                updateTreeData(origin, key, pages),
            );
        } else {
            notification.error({
                message: res.message,
            });
        }

    }

    const onCloseChunk = () => {
        setopenChunk(false);
    };

    const showPage = () => {
        setopenPage(true);
    };

    const onClosePage = () => {
        setopenPage(false);
    };

    const onSelect = async (selectedKeys, info) => {
        if (info.node.isLeaf == true) {
            let param = info.node.pageInfo;
            param['chunkGroupOffset'] = details.offset;
            param['filePath'] = filePath;
            let res = await getPageInfoUsingPOST(param)
            if (res.code == 0) {
                //pagedata信息
                let cols = [{
                    title: 'No',
                    fixed: 'left',
                    width: '100px',
                    // render: (text, record, index) => `${index + 1}`,  //每一页都从1开始
                    render: (text, record, index) => {
                        return index + 1
                    }

                }]
                cols.push(...Object.values(res.data.title).map((titleName, key) => {
                    if (titleName == 'timestamp') {
                        return {
                            title: (
                                <>
                                    {titleName}<span>{'\u00A0\u00A0\u00A0\u00A0'}</span>
                                    <RetweetOutlined
                                        onClick={() => {
                                            pageDataCache = Object.values(pageDataCache).map((item)=>{
                                                if((item[0]+"").indexOf("-") > -1){
                                                    item[0] = moment(item[0],'YYYY-MM-DD HH:mm:ss.SSS').valueOf()
                                                } else {
                                                    item[0] = moment(Number(item[0])).format('YYYY-MM-DD HH:mm:ss.SSS')
                                                }
                                                return item
                                            })
                                            setPageData(pageDataCache)
                                        }}
                                    />
                                </>),
                            dataIndex: titleName,
                            key: titleName,
                            fixed: 'left',
                            width: '250px',
                            render: (text, record, index) => {
                                return (
                                    <>
                                        <span id={index}>
                                            {record[key]}
                                        </span>
                                        {/* <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>
                                        <RetweetOutlined
                                            onClick={(e) => {
                                                if (document.getElementById(index).innerText.indexOf("-") > -1) {
                                                    document.getElementById(index).innerText = record[key]
                                                } else {
                                                    document.getElementById(index).innerText = moment(Number(record[key])).format('YYYY-MM-DD HH:mm:ss.SSS')
                                                }
                                            }} /> */}
                                    </>
                                )

                                // return moment(Number(record[key])).format('YYYY-MM-DD HH:mm:ss.SSS')
                            }
                        }
                    } else {
                        return {
                            title: titleName,
                            dataIndex: titleName,
                            key: titleName,
                            render: (text, record, index) => {
                                return record[key]
                            }
                        }
                    }
                }))
                setColumnsLength(cols.length)
                setColumns(cols)
                setPageData(res.data.values);
                pageDataCache = res.data.values;
                showPage()
            } else {
                notification.error({
                    message: res.message,
                });
            }
        }
    };

    const Details = () => {
        const show = () => {
            if (details != undefined && details != '') {
                return (
                    <pre style={{ height: "55vh", overflow: "auto", whiteSpace: "pre-wrap" }}>
                        {"ChunkGroup " + intl.formatMessage({ id: 'tsviewer.more.briefInfo', }) + "：\n"}
                        {"offset:"}{details.offset + "\n"}
                        {"CGH:\n"}{JSON.stringify(details.cgh, null, '\t')}{"\n"}
                        {"FIRST CH:\n"}{JSON.stringify(details.ch, null, '\t')}{"\n"}
                        {"FIRST PH:\n"}{JSON.stringify(details.ph, null, '\t')}{"\n"}</pre>
                )
            }
        }
        return (
            <div style={{ background: "#f2f2f2", padding: 20, height: "100%" }}>
                {show()}
            </div>
        )
    }

    const generateChunkGroupCards = async (page, pSize) => {
        let res = await getChunkGroupsListUsingPOST({ filePath: filePath, pageNo: page, pageSize: pSize, deviceLike: deviceNameLike });
        if (res.code == 0) {
            let list = Object.values(res.data.pageItems)
            setTotalSize(res.data.totalCount)
            setDetails()
            setCardList(list.map((cg, key) => {
                return (
                    <div style={{ backgroud: "white", margin: '4px 0px 0px 0px' }}>
                        <Card.Grid key={key} id={"cardgrid" + key}
                            style={gridStyle}
                            hoverable={false}
                            onClick={() => { selectCard("cardgrid" + key), showChunkGroupDetails(JSON.stringify(cg)) }}>
                            <strong>{cg.deviceName}</strong>
                        </Card.Grid>
                    </div>

                )
            }))
            setPageNo(page)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }
    //记录card选中项
    var cardSelect;
    const selectCard = (id) => {
        if (id == cardSelect) {
            return
        }
        var card = document.getElementById(id);
        card.style.background = "#FC4C2F"
        var oldCard = document.getElementById(cardSelect);
        if (oldCard != null) {
            oldCard.style.background = "#f2f2f2";
        }
        cardSelect = id;
    }

    useEffect(() => {
        generateChunkGroupCards(1, pageSize);
    }, [])

    return (
        <div className={styles.sitedrawerrenderincurrentwrapper}>
            <Layout>
                <Sider width="55%" style={{ height: "70vh", width: "60%", background: "white", padding: 5 }}>
                    <div style={{ height: "70vh", overflow: "auto" }}>
                        <PageHeader
                            extra={(
                                <Search
                                    placeholder="deviceName"
                                    allowClear
                                    onChange={(e) => { setDeviceNameLike(e.target.value) }}
                                    onSearch={() => { generateChunkGroupCards(1, pageSize) }}
                                    style={{
                                        width: 500,
                                    }}
                                />
                            )}>
                        </PageHeader>
                        <Card style={{ height: "54vh", overflow: "auto" }}>
                            {cardList}
                        </Card>
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <Pagination style={{ margin: '20px 0px 0px 0px' }} current={pageNo} pageSize={pageSize} total={totalSize}
                                showQuickJumper={true}
                                onChange={(page, pSize) => { setCardList([]), generateChunkGroupCards(page, pSize) }} showSizeChanger={false} />
                        </div>
                    </div>
                </Sider>
                <Layout>
                    <Content width="40%" style={{ height: "55vh", background: "white" }}>
                        <PageHeader
                            style={{ background: "#f2f2f2" }}
                            extra={(
                                <Button type="primary" onClick={() => showChunk(details)}>{intl.formatMessage({ id: 'tsviewer.more.structureMap', })}</Button>
                            )}>
                        </PageHeader>
                        <Details></Details>
                    </Content>
                </Layout>
            </Layout>
            <Drawer
                title={<>
                    <Tooltip placement="bottom" title={<span>
                        {intl.formatMessage({ id: 'tsviewer.moreChunkGroup.chunk.explanation', })}<br />
                        {intl.formatMessage({ id: 'tsviewer.moreChunkGroup.chunk.explanation1', })}<br />
                        {intl.formatMessage({ id: 'tsviewer.moreChunkGroup.chunk.explanation2', })}<br />
                    </span>}>
                        <QuestionCircleOutlined />
                    </Tooltip>
                    <span>
                        {"\u00A0\u00A0 ChunkInfo"}
                    </span>
                </>}
                width={"80%"}
                closable={false}
                destroyOnClose={true}
                onClose={onCloseChunk}
                open={openChunk}
            >
                <div style={{ height: "80vh", overflow: "auto" }}>
                    <Tree
                        showLine={{ showLeafIcon: false }}
                        showIcon={true}
                        onSelect={onSelect}
                        loadData={onLoadData}
                        treeData={treeData}
                    />
                </div>

                <Drawer
                    title={<>
                        <Tooltip placement="bottom" title={
                            <span>
                                {intl.formatMessage({ id: 'tsviewer.moreChunkGroup.pageData.explanation', })}<br />
                            </span>}>
                            <QuestionCircleOutlined />
                        </Tooltip>
                        <span>
                            {"\u00A0\u00A0 PageData"}
                        </span>
                    </>}
                    width={"75%"}
                    closable={false}
                    destroyOnClose={true}
                    onClose={onClosePage}
                    open={openPage}
                >
                    <Table columns={columns} dataSource={pageData} scroll={{ x: 150 * columnsLength, y: "80vh" }}
                        rowKey={(record)=>{
                            return record[0];
                        }}
                        pagination={{ pageSize: 100, showQuickJumper: true, position: ["bottomCenter"] }}
                        bordered />
                </Drawer>
            </Drawer>

        </div >
    )
}

export default MoreChunkGroup