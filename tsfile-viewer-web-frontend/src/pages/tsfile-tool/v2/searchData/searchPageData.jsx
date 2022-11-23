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
import { PageHeader, DatePicker, Input, Table, notification, message } from "antd";
import {
    fetchDataByDeviceAndMeasurementUsingPOST
} from '@/services/swagger1/tsfileViewerController'
import moment from 'moment';
import { useIntl } from 'umi';

const { Search } = Input;


const SearchPageData = (props) => {

    const [columns, setColumns] = useState();
    const [pageData, setPageData] = useState()

    const [beginDate, setBeginDate] = useState()
    const [endDate, setEndDate] = useState();
    const [device, setDevice] = useState()
    const [measurement, setMeasureMent] = useState()
    const { filePath } = props;
    const intl = useIntl();


    const doQuery = async () => {


        if (device == undefined || device == null || device == '') {
            notification.info({ message: "device " + intl.formatMessage({ id: 'tsviewer.more.notNull', }) })
            return;
        }

        if (measurement == undefined || measurement == null || measurement == '') {
            notification.info({ message: "measurement " + intl.formatMessage({ id: 'tsviewer.more.notNull', }) })
            return;
        }

        if (beginDate == undefined || beginDate == null || beginDate == '') {
            notification.info({ message: "beginDate " } + intl.formatMessage({ id: 'tsviewer.more.notNull', }))
            return;
        }

        if (endDate == undefined || endDate == null || endDate == '') {
            notification.info({ message: "device " + intl.formatMessage({ id: 'tsviewer.more.notNull', }) })
            return;
        }

        let param = {};
        param['filePath'] = filePath;
        param['device'] = device;
        param['measurement'] = measurement;
        param['beginDate'] = beginDate;
        param['endDate'] = endDate;
        let res = await fetchDataByDeviceAndMeasurementUsingPOST(param);
        if (res.code == 0) {
            setColumns(Object.values(res.data.title).map((titleName, key) => {
                return {
                    title: titleName,
                    dataIndex: titleName,
                    key: titleName,
                    render: (text, record, index) => {
                        if (titleName == 'timestamp') {
                            return moment(Number(record[key])).format('YYYY-MM-DD HH:mm:ss.SSS')
                        }
                        return record[key]
                    }
                }
            }))
            setPageData(res.data.values);
        } else {
            notification.error({
                message: res.message,
            });
        }
    }


    return (
        <>
            <PageHeader
                style={{ background: "white" }}
                extra={(
                    <>
                        <DatePicker
                            format='YYYY-MM-DD HH:mm:ss'
                            placeholder={intl.formatMessage({ id: 'tsviewer.more.beginDate', })}
                            showTime={{ format: 'HH:mm:ss' }}
                            onChange={(date) => {
                                if (date != null) {
                                    date = date.set({millisecond: 0 })
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
                                    date = date.set({millisecond: 0 })
                                }
                                setEndDate(isNaN(moment(date).valueOf()) ? '' : moment(date).valueOf())
                            }}
                        />
                        <Input
                            placeholder="device"
                            allowClear
                            onChange={(e) => {
                                setDevice(e.target.value)
                            }}
                            style={{
                                width: 400,
                            }} />
                        <Search
                            placeholder="measurement"
                            allowClear
                            onChange={(e) => {
                                setMeasureMent(e.target.value)
                            }}
                            onSearch={() => doQuery()}
                            style={{
                                width: 200,
                            }}
                        />
                    </>
                )}>
            </PageHeader>
            <Table columns={columns} dataSource={pageData}
                pagination={{ defaultPageSize: 13, showQuickJumper: true, position: ["bottomCenter"] }}
                bordered />
        </>

    )
}

export default SearchPageData