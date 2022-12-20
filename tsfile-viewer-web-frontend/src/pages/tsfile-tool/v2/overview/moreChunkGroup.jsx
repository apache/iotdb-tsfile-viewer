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
import { GroupOutlined, RetweetOutlined, MinusSquareOutlined, PlusSquareOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
    getChunkGroupsListUsingPOST, getChunkGroupInfoUsingPOST, getChunkListUsingPOST, getPageListUsingPOST
    , getPageInfoUsingPOST
} from '@/services/swagger1/tsfileViewerController'
import moment from 'moment';
import { useIntl } from 'umi';
import { Tree as TreeArborist } from "react-arborist";

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
    const [structureMapLoading, setStructureMapLoading] = useState();
    const [treeHeight, setTreeHeight] = useState()
    const [randomFlag, setRandomFlag] = useState()

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
        setStructureMapLoading(true)
        let res = await getChunkListUsingPOST({ offset: details.offset, filePath: filePath, offsetType: 'CG' })
        if (res.code == 0) {
            setRandomFlag(moment(new Date()).valueOf())
            let tree = Object.values(res.data).map((node) => {
                let tree = {};
                tree['name'] = node.measurementId;
                tree['id'] = node.measurementId + '-' + node.offset + randomFlag;
                // tree['icon'] = <RightOutlined />
                tree['isLeaf'] = false;
                tree['position'] = node.offset;
                return tree;
            })
            setTreeData(tree)
            setopenChunk(true);
            var div = document.getElementById('tree-div');
            setTreeHeight(div.offsetHeight)
            setStructureMapLoading(false);
        } else {
            notification.error({
                message: res.message,
            });
        }

    };

    const onCloseChunk = () => {
        setopenChunk(false);
    };

    const showPage = () => {
        setopenPage(true);
    };

    const onClosePage = () => {
        setopenPage(false);
    };

    const onSelect = async (info) => {
        if (!info.isLeaf) {
            return
        }
        let param = info.pageInfo;
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
                                        pageDataCache = Object.values(pageDataCache).map((item) => {
                                            if ((item[0] + "").indexOf("-") > -1) {
                                                item[0] = moment(item[0], 'YYYY-MM-DD HH:mm:ss.SSS').valueOf()
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

    const updateTreeData = (list, id, children) => {
        return list.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    children,
                };
            }
            //这个应该是用来加载子节点的子节点的，应该需要修改children对象
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, id, children),
                };
            }
            return node;
        });
    }

    const onLoadTreeData = async (expanded, node) => {
        if (expanded && node.children == undefined) {
            let res = await getPageListUsingPOST({ offset: node.position, filePath: filePath })
            if (res.code == 0) {
                let newTree = Object.values(res.data).map((child) => {
                    let tree = {};
                    tree['name'] = child.pageNo;
                    tree['id'] = child.pageNo + '-' + child.offset + randomFlag;
                    tree['isLeaf'] = true;
                    tree['position'] = child.offset;
                    tree['pageInfo'] = child;
                    return tree;
                })
                let data = treeData;
                let pa = updateTreeData(data, node.id, newTree);
                setTreeData(pa)
            } else {
                notification.error({
                    message: res.message,
                });
            }
        }
    }

    function Node({ node, style, dragHandle, tree }) {
        if (!node.isOpen && !node.data.isLeaf && node.data.children == undefined && node.isSelected) {
            onLoadTreeData(!node.isOpen, node.data)
        }
        /* This node instance can do many things. See the API reference. */
        return (
            <div style={{ ...style, overflow: "hidden", width: "155vh", textOverflow: "ellipsis", whiteSpace: "nowrap" }} ref={dragHandle} onClick={() => (onSelect(node.data))}>
                {node.data.isLeaf ? "" : node.isOpen ? <MinusSquareOutlined onClick={() => (node.toggle())} /> : <PlusSquareOutlined onClick={() => (node.toggle())} />} <span style={{ background: node.isSelected && node.data.isLeaf ? "#FFDFD4" : "white" }}>{node.data.isLeaf ? <CopyOutlined /> : <GroupOutlined />}{node.data.name}</span>
            </div>
        );
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
                                    onSearch={() => { setCardList([]),generateChunkGroupCards(1, pageSize) }}
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
                                <Button type="primary" loading={structureMapLoading} onClick={() => showChunk(details)}>{intl.formatMessage({ id: 'tsviewer.more.structureMap', })}</Button>
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
                <div id="tree-div" style={{ height: "80vh", background: "white", margin: '4px 0px 0px 0px' }}>
                    <TreeArborist
                        openByDefault={false}
                        disableDrag={false}
                        width={"100%"}
                        height={treeHeight}
                        // paddingBottom={200}
                        //height={400}
                        data={treeData}
                    >
                        {Node}
                    </TreeArborist>
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
                        rowKey={(record) => {
                            return record[0];
                        }}
                        pagination={{ defaultPageSize: 100, showQuickJumper: true, position: ["bottomCenter"] }}
                        bordered />
                </Drawer>
            </Drawer>

        </div >
    )
}

export default MoreChunkGroup