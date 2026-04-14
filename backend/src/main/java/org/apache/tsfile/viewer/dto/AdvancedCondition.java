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

package org.apache.tsfile.viewer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Represents a single advanced filter condition.
 *
 * <p>Validates: FR-022 (field/operator/value selection)
 */
public class AdvancedCondition {

  @NotBlank(message = "Field name is required")
  private String field;

  @NotNull(message = "Operator is required")
  private ComparisonOperator operator;

  @NotNull(message = "Value is required")
  private Object value;

  private LogicalOperator logic = LogicalOperator.AND;

  /** Default constructor for JSON deserialization. */
  public AdvancedCondition() {}

  /**
   * Creates an advanced condition with the specified parameters.
   *
   * @param field the field name to filter on
   * @param operator the comparison operator
   * @param value the value to compare against
   */
  public AdvancedCondition(String field, ComparisonOperator operator, Object value) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  /**
   * Creates an advanced condition with all parameters including logic.
   *
   * @param field the field name to filter on
   * @param operator the comparison operator
   * @param value the value to compare against
   * @param logic the logical operator for combining with next condition
   */
  public AdvancedCondition(
      String field, ComparisonOperator operator, Object value, LogicalOperator logic) {
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.logic = logic;
  }

  public String getField() {
    return field;
  }

  public void setField(String field) {
    this.field = field;
  }

  public ComparisonOperator getOperator() {
    return operator;
  }

  public void setOperator(ComparisonOperator operator) {
    this.operator = operator;
  }

  public Object getValue() {
    return value;
  }

  public void setValue(Object value) {
    this.value = value;
  }

  public LogicalOperator getLogic() {
    return logic;
  }

  public void setLogic(LogicalOperator logic) {
    this.logic = logic;
  }
}
