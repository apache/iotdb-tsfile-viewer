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
import { Modal,Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import MoreChunkGroup from './moreChunkGroup';
import MoreIndexOfTimeseriesIndex from './moreIndexOfTimeseriesIndex';
import MoreTimeseriesIndex from './moreTimeseriesIndex';
import { useIntl } from 'umi';

const PopDetails = (props) => {

    const [cardList, setCardList] = useState()
    const intl = useIntl();

    const doOnCancel = () => {
        props.closePop();
        setCardList()
    }

    const showtitle = (key) => {
        if (key == "ITIMORE") {
            return <>
                <Tooltip placement="bottom" title={<span>
                    {intl.formatMessage({ id: 'tsviewer.popDetail.indexOfTimeseriesIndex.explanation', })}<br />
                </span>}>
                    <QuestionCircleOutlined />
                </Tooltip>
                <span>
                    {"\u00A0\u00A0 IndexOfTimeseriesIndex"}
                </span>
            </>
        }
        if (key == "CGMORE") {
            return <>
                <Tooltip placement="bottom" title={<span>
                    {intl.formatMessage({ id: 'tsviewer.popDetail.chunkgroup.explanation', })}<br />
                    {intl.formatMessage({ id: 'tsviewer.popDetail.chunkgroup.explanation1', })}<br />
                </span>}>
                    <QuestionCircleOutlined />
                </Tooltip>
                <span>
                    {"\u00A0\u00A0 ChunkGroup"}
                </span>
            </>
        }
        if (key == "TIMORE") {
            return <>
                <Tooltip placement="bottom" title={<span>
                    {intl.formatMessage({ id: 'tsviewer.popDetail.timeseriesIndex.explanation', })}<br />
                    {intl.formatMessage({ id: 'tsviewer.popDetail.timeseriesIndex.explanation1', })}<br />
                </span>}>
                    <QuestionCircleOutlined />
                </Tooltip>
                <span>
                    {"\u00A0\u00A0 TimeseriesIndex"}
                </span>
            </>
        }
    }

    const getBlock = (key) => {
        if (key == "ITIMORE") {
            return <MoreIndexOfTimeseriesIndex fileName={props.popShow.fileName} filePath={props.popShow.filePath}></MoreIndexOfTimeseriesIndex>;
        }
        if (key == "CGMORE") {
            return <MoreChunkGroup fileName={props.popShow.fileName} filePath={props.popShow.filePath} cardList={cardList} setCardList={setCardList}></MoreChunkGroup>;
        }
        if (key == "TIMORE") {
            return <MoreTimeseriesIndex fileName={props.popShow.fileName} filePath={props.popShow.filePath} cardList={cardList} setCardList={setCardList}></MoreTimeseriesIndex>;
        }
    }


    return (
        <div>
            <Modal
                title={showtitle(props.popShow.structureName)}
                centered
                visible={props.popShow.flag}
                onCancel={() => doOnCancel()}
                maskClosable={false}
                destroyOnClose={true}
                width={"80%"}
                footer={[]}
            >
                {getBlock(props.popShow.structureName)}
            </Modal>
        </div >
    );
}

export default PopDetails