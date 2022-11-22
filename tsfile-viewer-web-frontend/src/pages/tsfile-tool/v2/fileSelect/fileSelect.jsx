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
import { Button, Modal, Input, Col, Row, Breadcrumb, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { Space, Table, Tooltip, Progress } from 'antd';
import { FolderOpenTwoTone, FileTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import {
    loadFileUsingPOST, getProcessUsingPOST, showFileListUsingPOST, unLoadFileUsingPOST,
    getBaseinfoUsingPOST, showLoadedFileListUsingPOST
} from '@/services/swagger1/tsfileViewerController'
import { useIntl } from 'umi';

const FileSelect = (props) => {
    const [visible, setVisible] = useState(false);
    const [breadData, setBreadData] = useState();
    const [directoryPath, setDirectoryPath] = useState('')
    const [tableData, setTableData] = useState()
    const [breadArray, setBreadArray] = useState([])
    const [progressTitle, setProgressTitle] = useState()
    const [progressVisible, setProgressVisible] = useState(false)
    const [progressRate, setProgressRate] = useState(0)
    const { setFilePath, setFileName, currentKey, renderChilderByTabKey, setTabSelect, setBaseInfo } = props;
    const intl = useIntl();
    const [tableFilters, setTableFilters] = useState()
    const [isSameFolder, setIsSameFolder] = useState(true)

    const columns = [
        {
            title: intl.formatMessage({ id: 'tsviewer.fileSelect.file', }),
            dataIndex: 'name',
            key: 'name',
            render(text, record, index) {
                if (record.type == 'DIRECTORY') {
                    return <><FolderOpenTwoTone />  {record.name}</>
                } else {
                    return <><FileTwoTone />  {record.name}</>
                }
            }
        },
        // {
        //     title: 'FileType',
        //     dataIndex: 'type',
        //     key: 'type',
        //     render: (text) => {
        //         if (text == 'DIRECTORY') {
        //             return 'DIRECTORY';
        //         } else {
        //             return 'FILE'
        //         }
        //     }
        // },
        // {
        //     title: 'CanRead',
        //     dataIndex: 'canRead',
        //     key: 'canRead',
        //     render: (text) => {
        //         if (text == true) {
        //             return 'Y';
        //         } else {
        //             return 'N'
        //         }
        //     }
        // },
        {
            title: intl.formatMessage({ id: 'tsviewer.fileSelect.status', }),
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: intl.formatMessage({ id: 'tsviewer.fileSelect.loaded', }), value: "LOADED" },
            ],
            render(text, record, index) {
                if (record.status == 'EXCLUDED') {
                    return
                } else if (record.status == 'UNLOAD') {
                    return intl.formatMessage({ id: 'tsviewer.fileSelect.unload', })
                } else if (record.status == 'LOADED') {
                    return intl.formatMessage({ id: 'tsviewer.fileSelect.loaded', })
                } else {
                    return record.status
                }
            }
        },
        {
            title: intl.formatMessage({ id: 'tsviewer.fileSelect.operation', }),
            key: 'operation',
            render: (text, record, index) => {
                let operationValue;
                if (record.type == 'DIRECTORY') {
                    operationValue = (
                        <>
                            <a onClick={() => {
                                let b = breadArray
                                b.push(record.name)
                                openDrictory(b)
                            }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.accessDirectory', })}</a>
                        </>
                    )
                } else if (record.status == 'UNLOAD') {
                    operationValue = (<>
                        <a onClick={() => { loadFile(record.name, record.sameFolder) }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.loadFile', })}</a>
                    </>)
                } else {
                    operationValue = (<>
                        <a onClick={() => { loadFile(record.name, record.sameFolder) }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.openFile', })}</a>
                        <a onClick={() => { unLoadFile(record.name, record.sameFolder) }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.unloadFile', })}</a>
                    </>)
                }
                return (
                    <Space size="middle">
                        {operationValue}
                    </Space>
                )
            }
        },

    ];

    const handleClick = () => {
        setVisible(true)
    }
    const handleCancel = () => {
        setVisible(false);
        setProgressVisible(false);
    };

    const openDrictory = async (newBreadArray) => {
        let path = directoryPath;
        let arr = Object.values(newBreadArray);
        arr.map(str => {
            if (path == '') {
                path = str
            } else {
                path = path + "/" + str;
            }
        })

        let res = await showFileListUsingPOST({ directoryPath: path });
        if (res.code == 0) {
            setTableData(res.data)
            setBreadArray(arr)
            setBreadData(arr.map((item, key) => {
                return <><div style={{ cursor: "pointer", background: "#f7e0e0" }}><Breadcrumb.Item key={key} onClick={() => { openDrictory(generateBreadArray(arr, key)) }}>{item}</Breadcrumb.Item></div><Breadcrumb.Separator>{'>'}</Breadcrumb.Separator></>;
            }))
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const generateBreadArray = (param, key) => {
        let array = []
        for (var i = 0; i <= key; i++) {
            array.push(param[i])
        }
        return array
    }

    const loadFile = async (name, sameFolder) => {
        setProgressRate(0)
        let path = directoryPath;
        let arr = Object.values(breadArray);
        arr.map(str => {
            if (path == '') {
                path = str
            } else {
                path = path + "/" + str;
            }
        })
        if (path == '') {
            path = name;
        } else {
            path = path + "/" + name;
        }
        setFilePath(path)
        setFileName(name)
        setProgressTitle(name)
        setProgressVisible(true)
        if (currentKey == undefined) {
            renderChilderByTabKey("overview", true)
        } else {
            renderChilderByTabKey(currentKey, true)
        }
        let res = await loadFileUsingPOST({ filePath: path });
        if (res.code == 0) {
            //刷新table
            if (sameFolder) {
                openDrictory(breadArray)
            } else {
                filtersResult();
            }

            let intervalId = setInterval(() => { loadingProcessor(path, name, intervalId) }, 1000)
        } else {
            setProgressVisible(false)
            notification.error({
                message: res.message,
            });
        }
    }

    const loadingProcessor = async (path, name, intervalId) => {
        let res = await getProcessUsingPOST({ filePath: path });
        if (res.code == 0) {
            setProgressRate(res.data.rateOfProcess)
            if (res.data.rateOfProcess == 100) {
                let res1 = await getBaseinfoUsingPOST({ filePath: path });
                if (res1.code == 0) {
                    setBaseInfo({
                        version: res1.data.version, metadataSize: res1.data.metadataSize,
                        chunkGroupList: res1.data.chunkGroupList, timeseriesIndexList: res1.data.timeseriesIndexList
                    })
                }
                clearInterval(intervalId)
                handleCancel()
                notification.success({ message: name + intl.formatMessage({ id: 'tsviewer.opened', }) })
            }
        } else {
            notification.error({
                message: res.message,
            });
        }
    }



    const unLoadFile = async (name, sameFolder) => {
        let path = directoryPath;
        let arr = Object.values(breadArray);
        arr.map(str => {
            if (path == '') {
                path = str
            } else {
                path = path + "/" + str;
            }
        })
        if (path == '') {
            path = name;
        } else {
            path = path + "/" + name;
        }
        let res = await unLoadFileUsingPOST({ filePath: path });
        if (res.code == 0) {
            setFileName('')
            setFilePath('')
            setTabSelect('')
            //刷新table
            if (sameFolder) {
                openDrictory(breadArray)
            } else {
                filtersResult();
            }
            notification.success({
                message: path + intl.formatMessage({ id: 'tsviewer.fileSelect.fileUnloaded', }),
            })
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    const handelTableChanged = async (pagenation, filters) => {
        setTableFilters(filters)
        setIsSameFolder(false)
    }

    const filtersResult = async () => {
        if (tableFilters == undefined || tableFilters.status == null) {
            openDrictory([])
            return
        }
        let res = await showLoadedFileListUsingPOST();
        if (res.code == 0) {
            setBreadArray([])
            setBreadData()
            setTableData(res.data)
        } else {
            notification.error({
                message: res.message,
            });
        }
    }

    useEffect(() => {
        //刷新table
        if (isSameFolder) {
            openDrictory(breadArray)
        } else {
            filtersResult();
        }
    }, [tableFilters])

    return (
        <>
            <Button key="1" type="primary" onClick={() => handleClick()}>{intl.formatMessage({ id: 'tsviewer.fileSelect.fileManagement', })}</Button>
            <Modal
                title={<>
                    <Tooltip placement="bottom" title={<span>
                        {intl.formatMessage({ id: 'tsviewer.fileManagement.explanation', })}<br />
                        {intl.formatMessage({ id: 'tsviewer.fileManagement.explanation1', })}<br />
                    </span>}>
                        <QuestionCircleOutlined />
                    </Tooltip>
                    <span>
                        {"\u00A0\u00A0" + intl.formatMessage({ id: 'tsviewer.fileSelect.fileManagement', })}
                    </span>
                </>}
                centered
                visible={visible}
                onCancel={handleCancel}
                maskClosable={false}
                width={"70%"}

                footer={[]}
            >
                {/* <Row align="middle" justify="center">
                    <Col span={1} style={{ margin: '5px 0px 0px 0px' }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.path', })}:</Col>
                    <Col span={21}><Input placeholder="Path" onChange={(e) => { setDirectoryPath(e.target.value) }} /></Col>
                    <Col span={2}><Button key="accessPath" type='primary' onClick={() => { openDrictory([]) }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.openPath', })}</Button></Col>
                </Row> */}
                <Breadcrumb style={{ margin: '0px 0px 0px 0px' }} separator="">
                    <div style={{ cursor: "pointer", background: "#f7e0e0" }}><Breadcrumb.Item onClick={() => { openDrictory([]) }}>{intl.formatMessage({ id: 'tsviewer.fileSelect.path', })}</Breadcrumb.Item></div>
                    <Breadcrumb.Separator>{'>'}</Breadcrumb.Separator>
                    {breadData}
                </Breadcrumb>
                <div style={{ height: "65vh" }}>
                    <Table columns={columns} dataSource={tableData} onChange={handelTableChanged}
                        pagination={{ defaultPageSize: 50, showQuickJumper: true, position: ["bottomCenter"] }} bordered scroll={{ y: '53vh' }} />
                </div>
            </Modal>

            <Modal
                title={intl.formatMessage({ id: 'tsviewer.fileSelect.fileName', }) + progressTitle}
                centered
                visible={progressVisible}
                onCancel={handleCancel}
                maskClosable={false}
                closable={false}
                width={"50%"}
                footer={[]}
            >
                <Progress style={{ margin: '25px 0px 0px 0px' }} percent={progressRate} />
            </Modal>

        </>
    );
}

export default FileSelect