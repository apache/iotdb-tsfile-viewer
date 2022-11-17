/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.iotdb.ui.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public final class IpUtils {

  private IpUtils() {}

  public static String getIPAddress(HttpServletRequest request) {
    String ip = null;

    // X-Forwarded-For：Squid 服务代理
    String ipAddresses = request.getHeader("X-Forwarded-For");
    if (ipAddresses == null
        || ipAddresses.length() == 0
        || "unknown".equalsIgnoreCase(ipAddresses)) {
      // Proxy-Client-IP：apache 服务代理
      ipAddresses = request.getHeader("Proxy-Client-IP");
    }
    if (ipAddresses == null
        || ipAddresses.length() == 0
        || "unknown".equalsIgnoreCase(ipAddresses)) {
      // WL-Proxy-Client-IP：weblogic 服务代理
      ipAddresses = request.getHeader("WL-Proxy-Client-IP");
    }
    if (ipAddresses == null
        || ipAddresses.length() == 0
        || "unknown".equalsIgnoreCase(ipAddresses)) {
      // HTTP_CLIENT_IP：有些代理服务器
      ipAddresses = request.getHeader("HTTP_CLIENT_IP");
    }
    if (ipAddresses == null
        || ipAddresses.length() == 0
        || "unknown".equalsIgnoreCase(ipAddresses)) {
      // X-Real-IP：nginx服务代理
      ipAddresses = request.getHeader("X-Real-IP");
    }

    // 有些网络通过多层代理，那么获取到的ip就会有多个，一般都是通过逗号（,）分割开来，并且第一个ip为客户端的真实IP
    if (ipAddresses != null && ipAddresses.length() != 0) {
      ip = ipAddresses.split(",")[0];
    }

    // 还是不能获取到，最后再通过request.getRemoteAddr();获取
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ipAddresses)) {
      ip = request.getRemoteAddr();
    }
    return ("0:0:0:0:0:0:0:1").equals(ip) ? "127.0.0.1" : ip;
  }

  public static String getCookieValue(HttpServletRequest request, String cookieName) {
    String ret = null;
    Cookie[] cookies = request.getCookies();
    if (cookies == null) {
      return null;
    } else {
      for (Cookie cookie : cookies) {
        if (cookieName.equals(cookie.getName())) {
          ret = cookie.getValue();
          break;
        }
      }
      return ret;
    }
  }
}
