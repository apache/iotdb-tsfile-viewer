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
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => {
  const intl = useIntl();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: (
          <div style={{ whiteSpace: "pre-wrap" }}>
            {intl.formatMessage({
              id: 'pages.welcome.message',
              defaultMessage: 'Welcome to Tsfile viewer',
            })}
          </div>
        ),
        ghost: true,
      }}
    >
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'The front-end project build depends on antd and antdpro',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.antd" defaultMessage={intl.formatMessage({
            id: 'pages.welcome.antd',
            defaultMessage: 'antd URL',
          })} />{' '}
        </Typography.Text>
        <CodePreview>https://ant.design/index-cn</CodePreview>

        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.antdpro" defaultMessage={intl.formatMessage({
            id: 'pages.welcome.antdpro',
            defaultMessage: ' antd pro URL',
          })} />{' '}
        </Typography.Text>
        <CodePreview>https://pro.ant.design/zh-CN/</CodePreview>

        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.git" defaultMessage={intl.formatMessage({
            id: 'pages.welcome.git',
            defaultMessage: 'The git address of this project',
          })} />{' '}
        </Typography.Text>
        <CodePreview>https://github.com/apache/iotdb-tsfile-viewer</CodePreview>
      </Card>
    </PageContainer>
  );
};
