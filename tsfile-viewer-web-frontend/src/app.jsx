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
import { PageLoading } from '@ant-design/pro-layout';
import { message } from 'antd';
import { history,SelectLang } from 'umi';
import Footer from '@/components/Footer';
import { forwardRef } from 'react';
const fowardPath = '/tsfile-tool/v2/';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * 异常处理程序
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
 //-----English
    200: The server successfully returned the requested data. ',
    201: New or modified data is successful. ',
    202: A request has entered the background queue (asynchronous task). ',
    204: Data deleted successfully. ',
    400: 'There was an error in the request sent, and the server did not create or modify data. ',
    401: The user does not have permission (token, username, password error). ',
    403: The user is authorized, but access is forbidden. ',
    404: The request sent was for a record that did not exist. ',
    405: The request method is not allowed. ',
    406: The requested format is not available. ',
    410':
        'The requested resource is permanently deleted and will no longer be available. ',
    422: When creating an object, a validation error occurred. ',
    500: An error occurred on the server, please check the server. ',
    502: Gateway error. ',
    503: The service is unavailable. ',
    504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */

export const request = {
  errorHandler: (error) => {
    const { response } = error;
    if(response.status == '404'){
      history.push("/exception/404")
    }
    if(response.status == '500' || response.status == '502' || response.status == '503' || response.status == '504'){
      history.push("/exception/500")
    }
    throw error;
  },
}; // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <SelectLang />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      let pathname = location.pathname.endsWith('/') ?
       location.pathname.substring(0, location.pathname.length - 1):
       location.pathname;
      if(pathname == ''){
        history.push(fowardPath);
      }
    },
    menuHeaderRender: undefined,
    itemRender: (route, params, routes) => {
      if(routes.indexOf(route) == route.length -1){
        return <span>{route.breadcrumbName}</span>;
      }
      return <span>{route.breadcrumbName}</span>;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
