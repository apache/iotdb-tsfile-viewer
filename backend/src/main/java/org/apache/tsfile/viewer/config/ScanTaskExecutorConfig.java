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

package org.apache.tsfile.viewer.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Configuration for the scan task async thread pool executor.
 *
 * <p>Provides a dedicated thread pool for executing scan tasks asynchronously. The pool is
 * configured with limited concurrency to prevent resource exhaustion during file scanning.
 *
 * <p>Validates: Requirements 3.1
 */
@Configuration
@EnableAsync
public class ScanTaskExecutorConfig {

  private static final Logger logger = LoggerFactory.getLogger(ScanTaskExecutorConfig.class);

  /**
   * Creates a thread pool executor bean for scan tasks.
   *
   * <p>The executor is configured with:
   *
   * <ul>
   *   <li>Core pool size: 2 (matches max concurrent scan tasks)
   *   <li>Max pool size: 4 (allows burst capacity)
   *   <li>Queue capacity: 20 (FIFO queue for pending tasks)
   *   <li>Thread name prefix: "scan-" (for easy identification in logs)
   *   <li>Rejection policy: CallerRunsPolicy (prevents task loss under load)
   * </ul>
   *
   * @return configured thread pool executor for scan tasks
   */
  @Bean(name = "scanExecutorThreadPool")
  public Executor scanExecutorThreadPool() {
    logger.info(
        "Initializing scan task executor with corePoolSize=2, maxPoolSize=4, queueCapacity=20");

    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(4);
    executor.setQueueCapacity(20);
    executor.setThreadNamePrefix("scan-");
    executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(60);
    executor.initialize();
    return executor;
  }
}
