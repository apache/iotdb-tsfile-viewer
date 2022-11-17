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

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;

public class MessageUtil extends ResourceBundleMessageSource {
  private static MessageSource messageSource;

  public static void setMessageSource(MessageSource source) {
    messageSource = source;
  }

  public MessageUtil() {
    super();
  }

  public static String get(String pvsKey) {
    try {
      return messageSource.getMessage(pvsKey, null, LocaleContextHolder.getLocale());
    } catch (Exception e) {
      return pvsKey;
    }
  }

  public static String get(String pvsKey, Object... pvParams) {
    try {
      return messageSource.getMessage(pvsKey, pvParams, LocaleContextHolder.getLocale());
    } catch (Exception e) {
      return pvsKey;
    }
  }
}
