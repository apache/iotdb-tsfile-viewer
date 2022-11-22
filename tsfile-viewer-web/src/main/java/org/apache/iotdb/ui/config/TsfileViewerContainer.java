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
package org.apache.iotdb.ui.config;

import org.apache.iotdb.tool.core.service.TsFileAnalyserV13;
import org.apache.iotdb.ui.exception.TsfileViewerException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Author: LL @Description: tsfile viewer 加载容器，加载后的TsFileAnalyserV13，放在容器中 @Date: create in
 * 2022/9/22 17:41
 */
@Configuration
public class TsfileViewerContainer {

  private Map<String, TsFileAnalyserV13> container = new ConcurrentHashMap(5);

  /**
   * 向容器中添加 parser
   *
   * @param key
   * @param tsFileAnalyserV13
   * @throws TsfileViewerException
   */
  public void addTsfileParser(String key, TsFileAnalyserV13 tsFileAnalyserV13)
      throws TsfileViewerException {
    synchronized (container) {
      if (container.size() == 5) {
        throw new TsfileViewerException(TsfileViewerException.CONTAINER_SIZE_REACHED_MAXIMUM, "");
      }
    }
    container.put(key, tsFileAnalyserV13);
  }

  /**
   * 获取key对应的 parser
   *
   * @param key
   * @return
   */
  public TsFileAnalyserV13 getTsfileParser(String key) {
    return container.get(key);
  }

  /**
   * 判断key对应的文件 是否已经加载
   *
   * @param key
   * @return
   */
  public boolean contain(String key) {
    if (container.keySet().contains(key)) {
      return true;
    }
    return false;
  }

  /**
   * 卸载 parser
   *
   * @param key
   */
  public void removeTsfileParser(String key) {
    container.remove(key);
  }

  /**
   * 判断加载的内容是否达到最大值
   *
   * @return
   */
  public boolean hasReachedMaximum() {
    if (container.size() >= 5) {
      return true;
    }
    return false;
  }

  @Bean
  public TsfileViewerContainer tsFileViewerContainer() {
    return new TsfileViewerContainer();
  }

  public Map<String, TsFileAnalyserV13> getContainer() {
    return container;
  }

  public void setContainer(Map<String, TsFileAnalyserV13> container) {
    this.container = container;
  }
}
