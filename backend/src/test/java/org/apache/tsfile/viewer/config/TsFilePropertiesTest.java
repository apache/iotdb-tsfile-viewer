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

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Tests for {@link TsFileProperties} configuration binding.
 *
 * <p>Validates: Requirement 7.6 (Directory whitelist security)
 */
@SpringBootTest
class TsFilePropertiesTest {

  @Autowired private TsFileProperties tsFileProperties;

  @Test
  @DisplayName("Should load allowed directories from configuration")
  void shouldLoadAllowedDirectories() {
    List<String> allowedDirectories = tsFileProperties.getAllowedDirectories();

    assertThat(allowedDirectories).isNotNull();
    assertThat(allowedDirectories).isNotEmpty();
    // Verify at least some directories are configured (environment-specific paths)
    assertThat(allowedDirectories).hasSizeGreaterThanOrEqualTo(1);
  }

  @Test
  @DisplayName("Should load upload directory from configuration")
  void shouldLoadUploadDirectory() {
    String uploadDirectory = tsFileProperties.getUploadDirectory();

    assertThat(uploadDirectory).isNotNull();
    assertThat(uploadDirectory).isNotBlank();
    // Verify it's a valid path format (environment-specific)
    assertThat(uploadDirectory).matches("^/.*|^[A-Za-z]:[\\\\/].*");
  }

  @Test
  @DisplayName("Should load metadata cache settings from configuration")
  void shouldLoadMetadataCacheSettings() {
    TsFileProperties.MetadataCacheProperties metadataCache =
        tsFileProperties.getCache().getMetadata();

    assertThat(metadataCache.getMaxSize()).isEqualTo(1000);
    assertThat(metadataCache.getTtlMinutes()).isEqualTo(60);
  }

  @Test
  @DisplayName("Should load reader cache settings from configuration")
  void shouldLoadReaderCacheSettings() {
    TsFileProperties.ReaderCacheProperties readerCache = tsFileProperties.getCache().getReader();

    assertThat(readerCache.getMaxSize()).isEqualTo(100);
    assertThat(readerCache.getTtlMinutes()).isEqualTo(30);
  }

  @Test
  @DisplayName("Should load query settings from configuration")
  void shouldLoadQuerySettings() {
    TsFileProperties.QueryProperties query = tsFileProperties.getQuery();

    assertThat(query.getTimeoutSeconds()).isEqualTo(30);
    assertThat(query.getMaxResultSize()).isEqualTo(10000);
    assertThat(query.getDefaultPageSize()).isEqualTo(100);
  }

  @Test
  @DisplayName("Should allow setting allowed directories programmatically")
  void shouldAllowSettingAllowedDirectories() {
    TsFileProperties properties = new TsFileProperties();
    List<String> directories = Arrays.asList("/custom/path1", "/custom/path2");

    properties.setAllowedDirectories(directories);

    assertThat(properties.getAllowedDirectories())
        .containsExactly("/custom/path1", "/custom/path2");
  }

  @Test
  @DisplayName("Should allow setting upload directory programmatically")
  void shouldAllowSettingUploadDirectory() {
    TsFileProperties properties = new TsFileProperties();

    properties.setUploadDirectory("/custom/uploads");

    assertThat(properties.getUploadDirectory()).isEqualTo("/custom/uploads");
  }

  @Test
  @DisplayName("Should have default values for cache properties")
  void shouldHaveDefaultValuesForCacheProperties() {
    TsFileProperties properties = new TsFileProperties();

    assertThat(properties.getCache()).isNotNull();
    assertThat(properties.getCache().getMetadata()).isNotNull();
    assertThat(properties.getCache().getReader()).isNotNull();
  }

  @Test
  @DisplayName("Should have default values for query properties")
  void shouldHaveDefaultValuesForQueryProperties() {
    TsFileProperties properties = new TsFileProperties();

    assertThat(properties.getQuery()).isNotNull();
    assertThat(properties.getQuery().getTimeoutSeconds()).isEqualTo(30);
    assertThat(properties.getQuery().getMaxResultSize()).isEqualTo(10000);
    assertThat(properties.getQuery().getDefaultPageSize()).isEqualTo(100);
  }
}
