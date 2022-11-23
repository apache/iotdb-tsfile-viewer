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
import { Card, Layout, Button, Drawer, Tree, Input, Tooltip, DatePicker, PageHeader, notification, Table } from 'antd';
import { Tree as TreeArborist } from "react-arborist";
import styles from '../style.less'
import { RightOutlined, GroupOutlined, MinusSquareOutlined, PlusSquareOutlined, CopyOutlined, RetweetOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
    getChunkListUsingPOST, getPageListUsingPOST, getIndexOfTimeseriesIndexTreeUsingPOST
    , getPageInfoThroughTimeseriesIndexOffsetUsingPOST, getTimeseriesIndexListNoPagingUsingPOST
} from '@/services/swagger1/tsfileViewerController'
import moment from 'moment';
import { useIntl } from 'umi';

const { Content } = Layout;
const { Search } = Input;

const MoreIndexOfTimeseriesIndex = (props) => {
    const [openChunk, setopenChunk] = useState(false)
    const [openPage, setopenPage] = useState(false)
    const [chunkTreeData, setChunkTreeData] = useState([])
    const [indexTreeData, setIndexTreeData] = useState([])
    const [columns, setColumns] = useState();
    const [columnsLength, setColumnsLength] = useState();
    const [pageData, setPageData] = useState()
    const [beginDateCache, setBeginDateCache] = useState()
    const [endDateCache, setEndDateCache] = useState();
    const [beginDate, setBeginDate] = useState()
    const [endDate, setEndDate] = useState();
    const [deviceNameLike, setDeviceNameLike] = useState()
    const [randomFlag, setRandomFlag] = useState()
    const [indexTreeHeight, setIndexTreeHeight] = useState()
    const { fileName, filePath, cardList, setCardList } = props;
    const intl = useIntl();

    var pageDataCache;

    const gridStyle = {
        width: '20%',
        height: '100px',
        textAlign: 'center',
        background: "#f2f2f2",
        border: '1px solid grey'
    };


    const showChunk = async (node) => {
        if (!node.isLeaf) {
            return
        }
        let res = await getChunkListUsingPOST({ offset: node.position, filePath: filePath, offsetType: 'TS_INDEX', beginDate: beginDate, endDate: endDate })
        if (res.code == 0) {
            setChunkTreeData(Object.values(res.data).map((chunkInfo) => {
                let tree = {};
                tree['title'] = chunkInfo.measurementId;
                tree['key'] = chunkInfo.offset;
                tree['icon'] = <GroupOutlined />
                tree['timeseriesIndexOffset'] = node.position;
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

    const onChunkSelect = async (selectedKeys, info) => {
        if (info.node.isLeaf == true) {
            let param = info.node.pageInfo;
            param['timeseriesIndexOffset'] = info.node.timeseriesIndexOffset;
            param['chunkOffset'] = info.node.chunkOffset;
            param['filePath'] = filePath;
            param['beginDate'] = beginDate;
            param['endDate'] = endDate;
            let res = await getPageInfoThroughTimeseriesIndexOffsetUsingPOST(param)
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

    const onCloseChunk = () => {
        setopenChunk(false);
    };

    const showPage = () => {
        setopenPage(true);
    };

    const onClosePage = () => {
        setopenPage(false);
    };

    const updateIndexTreeData = (list, id, children) => {
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
                    children: updateIndexTreeData(node.children, id, children),
                };
            }
            return node;
        });
    }

    const updateTreeData = (list, key, children) => {
        return list.map((node) => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            //这个应该是用来加载子节点的子节点的，应该需要修改children对象
            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }
            return node;
        });
    }


    const onLoadChunkTreeData = async ({ key, children, timeseriesIndexOffset }) => {
        let res = await getPageListUsingPOST({ offset: key, filePath: filePath, beginDate: beginDateCache, endDate: endDateCache })
        if (res.code == 0) {
            let pages = Object.values(res.data).map((pageInfo) => {
                let tree = {};
                tree['title'] = pageInfo.pageNo;
                tree['key'] = pageInfo.offset;
                tree['icon'] = <CopyOutlined />
                tree['isLeaf'] = true;
                tree['chunkOffset'] = key;
                tree['pageInfo'] = pageInfo;
                tree['timeseriesIndexOffset'] = timeseriesIndexOffset
                return tree;
            })
            setChunkTreeData(origin =>
                updateTreeData(origin, key, pages),
            );
        } else {
            notification.error({
                message: res.message,
            });
        }

    }

    const onLoadIndexTreeData = async (expanded, node) => {
        if (expanded && node.children == undefined) {
            let res = await getIndexOfTimeseriesIndexTreeUsingPOST({ parentOffset: node.position, filePath: filePath })
            if (res.code == 0) {
                let newTree = Object.values(res.data).map((child) => {
                    let tree = {};
                    tree['name'] = child.title;
                    tree['id'] = child.measurementId + '-' + child.position + randomFlag;
                    // tree['icon'] = <RightOutlined />
                    tree['isLeaf'] = child.leaf;
                    tree['position'] = child.position;
                    return tree;
                })
                // not work
                // setIndexTreeData(origin =>
                //     updateTreeData(origin, node.id, newTree),
                // );
                let data = indexTreeData;
                let pa = updateIndexTreeData(data, node.id, newTree);
                console.log(pa)
                setIndexTreeData(pa)
            } else {
                notification.error({
                    message: res.message,
                });
            }
        }
    }

    const generateITITrees = async () => {
        let res = await getIndexOfTimeseriesIndexTreeUsingPOST({ parentOffset: 0, filePath: filePath })
        if (res.code == 0) {
            setRandomFlag(moment(new Date()).valueOf())
            let tree = Object.values(res.data).map((node) => {
                let tree = {};
                tree['name'] = node.title;
                tree['id'] = node.title + '-' + node.position + randomFlag;
                // tree['icon'] = <RightOutlined />
                tree['isLeaf'] = node.leaf;
                tree['position'] = node.position;
                return tree;
            })
            setIndexTreeData(tree)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    function Node({ node, style, dragHandle, tree }) {
        if (!node.isOpen && !node.data.isLeaf && node.data.children == undefined && node.isSelected) {
            onLoadIndexTreeData(!node.isOpen, node.data)
        }
        /* This node instance can do many things. See the API reference. */
        return (
            <div style={{ ...style, overflow: "hidden", width: "155vh", textOverflow: "ellipsis", whiteSpace: "nowrap" }} ref={dragHandle} onClick={() => (showChunk(node.data))}>
                {node.data.isLeaf ? "" : node.isOpen ? <MinusSquareOutlined onClick={() => (node.toggle())} /> : <PlusSquareOutlined onClick={() => (node.toggle())} />} <span style={{ background: node.isSelected ? "#FFDFD4" : "white" }}>{node.data.isLeaf ? <RightOutlined /> : ""}{node.data.name}</span>
            </div>
        );
    }

    const searchIndexTree = async (value) => {
        let res = await getTimeseriesIndexListNoPagingUsingPOST({
            filePath: filePath, deviceNameLike: value,
            beginDate: beginDate, endDate: endDate
        });
        let treeList = []
        if (res.code == 0) {
            for (let item in res.data) {
                let tree = {};
                tree['name'] = item;
                tree['id'] = item + randomFlag;
                // tree['icon'] = <RightOutlined />
                tree['isLeaf'] = false;
                tree['children'] = Object.values(res.data[item]).map((arr, key) => {
                    let node = {};
                    node['name'] = arr.measurementId;
                    node['id'] = arr.measurementId + arr.offset + randomFlag;
                    // node['icon'] = <RightOutlined />
                    node['isLeaf'] = true;
                    node['position'] = arr.offset;
                    return node;
                })
                treeList.push(tree);
            }
            setIndexTreeData(treeList)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const onSearchIndexTree = async (value) => {
        //暂存 开始和结束时间
        setBeginDateCache(beginDate)
        setEndDateCache(endDate)
        if ((beginDate == null || beginDate == undefined || beginDate == '') && (endDate == null || endDate == undefined || endDate == '') && (value == null || value == undefined || value == '')) {
            generateITITrees();
        } else {
            searchIndexTree(value);
        }
    }

    useEffect(() => {
        var div = document.getElementById('modal-div');
        setIndexTreeHeight(div.offsetHeight)
        generateITITrees();
    }, [])

    return (
        <div className={styles.sitedrawerrenderincurrentwrapper}>
            <Layout>
                <Layout>
                    <Content width="40%" style={{ height: "60vh" }}>
                        <PageHeader style={{ background: "white" }}
                            extra={(
                                <Button.Group>
                                    <DatePicker
                                        format='YYYY-MM-DD HH:mm:ss'
                                        placeholder={intl.formatMessage({ id: 'tsviewer.more.beginDate', })}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        onChange={(date) => {
                                            if (date != null) {
                                                date = date.set({ millisecond: 0 })
                                            }
                                            setBeginDate(isNaN(moment(date).valueOf()) ? '' : moment(date).valueOf())
                                        }}
                                    />

                                    <DatePicker
                                        format='YYYY-MM-DD HH:mm:ss'
                                        placeholder={intl.formatMessage({ id: 'tsviewer.more.endDate', })}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        onChange={(date) => {
                                            if (date != null) {
                                                date = date.set({ millisecond: 0 })
                                            }
                                            setEndDate(isNaN(moment(date).valueOf()) ? '' : moment(date).valueOf())
                                        }}
                                    />
                                    <Search
                                        placeholder="device"
                                        allowClear
                                        onChange={(e) => {
                                            setDeviceNameLike(e.target.value)
                                        }}
                                        onSearch={(value) => onSearchIndexTree(value)}
                                        style={{
                                            width: 400,
                                        }}
                                    />
                                    {/* <Button type="primary" onClick={() => showChunk(details)}>结构图谱</Button> */}
                                </Button.Group>
                            )}
                        >
                        </PageHeader>
                        <div id="modal-div" style={{ height: "60vh", background: "white", margin: '4px 0px 0px 0px' }}>
                            <TreeArborist
                                openByDefault={false}
                                disableDrag={false}
                                width={"100%"}
                                height={indexTreeHeight}
                                // paddingBottom={200}
                                //height={400}
                                data={indexTreeData}
                            >
                                {Node}
                            </TreeArborist>
                        </div>
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
                {/* style={{ height: "80vh", overflow: "auto" }} */}
                <div >
                    <Tree
                        height={'78vh'}
                        showLine={{ showLeafIcon: false }}
                        showIcon={true}
                        onSelect={onChunkSelect}
                        loadData={onLoadChunkTreeData}
                        treeData={chunkTreeData}
                    />
                </div>

                <Drawer
                    title={<>
                        <Tooltip placement="bottom" title={<span>
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

        </div>
    )
}

export default MoreIndexOfTimeseriesIndex