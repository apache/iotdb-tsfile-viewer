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
package org.apache.iotdb.ui.model.tsviewer;

import org.apache.iotdb.tool.core.model.TimeSeriesMetadataNode;
import org.apache.iotdb.tsfile.file.metadata.enums.MetadataIndexNodeType;

/** @Author: LL @Description: IndexOfTimeSeriesIndex Node @Date: create in 2022/10/28 15:25 */
public class ITITreeNode {

  private MetadataIndexNodeType nodeType;

  private String deviceId;

  private String measurementId;

  private long position;

  private boolean aligned;

  private boolean isLeaf;

  private boolean isRoot;

  private String title;

  public ITITreeNode() {}

  public ITITreeNode(TimeSeriesMetadataNode node) {
    this.aligned = node.isAligned();
    this.deviceId = node.getDeviceId();
    this.measurementId = node.getMeasurementId();
    this.nodeType = node.getNodeType();
    this.position = node.getPosition();
    this.isLeaf = node.getChildren().size() == 0;
    this.isRoot = false;
  }

  public ITITreeNode(TimeSeriesMetadataNode node, boolean isRoot) {
    this.aligned = node.isAligned();
    this.deviceId = node.getDeviceId();
    this.measurementId = node.getMeasurementId();
    this.nodeType = node.getNodeType();
    this.position = node.getPosition();
    this.isLeaf = node.getChildren().size() == 0;
    this.isRoot = isRoot;
  }

  public MetadataIndexNodeType getNodeType() {
    return nodeType;
  }

  public void setNodeType(MetadataIndexNodeType nodeType) {
    this.nodeType = nodeType;
  }

  public String getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(String deviceId) {
    this.deviceId = deviceId;
  }

  public String getMeasurementId() {
    return measurementId;
  }

  public void setMeasurementId(String measurementId) {
    this.measurementId = measurementId;
  }

  public long getPosition() {
    return position;
  }

  public void setPosition(long position) {
    this.position = position;
  }

  public boolean isAligned() {
    return aligned;
  }

  public void setAligned(boolean aligned) {
    this.aligned = aligned;
  }

  public boolean isLeaf() {
    return isLeaf;
  }

  public void setLeaf(boolean leaf) {
    isLeaf = leaf;
  }

  public String getTitle() {
    return title;
  }

  public boolean isRoot() {
    return isRoot;
  }

  public void setRoot(boolean root) {
    isRoot = root;
  }

  public void setTitle(String title) {
    this.title = title;
  }
}
