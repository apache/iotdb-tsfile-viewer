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

package org.apache.tsfile.viewer.service;

import java.util.List;
import java.util.Map;

import org.apache.tsfile.viewer.dto.AdvancedCondition;
import org.apache.tsfile.viewer.dto.ComparisonOperator;
import org.apache.tsfile.viewer.dto.LogicalOperator;

/**
 * Shared utility for evaluating advanced filter conditions against row data.
 *
 * <p>Extracted from DataService and TableService to eliminate ~120 lines of duplicated condition
 * evaluation logic. Supports numeric (with epsilon tolerance), string, and boolean comparisons.
 */
public final class ConditionEvaluator {

  private static final double EPSILON = 1e-9;

  private ConditionEvaluator() {}

  /**
   * Checks if a row (represented as a map of field values) matches all advanced conditions.
   *
   * @param rowValues the row values as a map
   * @param conditions the advanced conditions
   * @return true if the row matches all conditions
   */
  public static boolean matchesAdvancedConditions(
      Map<String, Object> rowValues, List<AdvancedCondition> conditions) {
    if (conditions == null || conditions.isEmpty()) {
      return true;
    }

    boolean result = evaluateCondition(rowValues, conditions.get(0));

    for (int i = 1; i < conditions.size(); i++) {
      AdvancedCondition prev = conditions.get(i - 1);
      AdvancedCondition curr = conditions.get(i);
      boolean currResult = evaluateCondition(rowValues, curr);

      if (prev.getLogic() == LogicalOperator.AND) {
        result = result && currResult;
      } else {
        result = result || currResult;
      }
    }

    return result;
  }

  /**
   * Evaluates a single condition against row values.
   *
   * @param rowValues the row values
   * @param condition the condition to evaluate
   * @return true if the condition is satisfied
   */
  public static boolean evaluateCondition(
      Map<String, Object> rowValues, AdvancedCondition condition) {
    Object fieldValue = rowValues.get(condition.getField());
    if (fieldValue == null) {
      return false;
    }

    Object conditionValue = condition.getValue();

    // Handle numeric comparisons
    if (fieldValue instanceof Number && conditionValue instanceof Number) {
      double fieldNum = ((Number) fieldValue).doubleValue();
      double condNum = ((Number) conditionValue).doubleValue();
      return evaluateNumericCondition(fieldNum, condNum, condition.getOperator());
    }

    // Handle string comparisons
    if (fieldValue instanceof String || conditionValue instanceof String) {
      String fieldStr = String.valueOf(fieldValue);
      String condStr = String.valueOf(conditionValue);
      return evaluateStringCondition(fieldStr, condStr, condition.getOperator());
    }

    // Handle boolean comparisons
    if (fieldValue instanceof Boolean && conditionValue instanceof Boolean) {
      boolean fieldBool = (Boolean) fieldValue;
      boolean condBool = (Boolean) conditionValue;
      return evaluateBooleanCondition(fieldBool, condBool, condition.getOperator());
    }

    return false;
  }

  /**
   * Evaluates a numeric condition with epsilon tolerance for EQUAL/NOT_EQUAL.
   *
   * @param fieldValue the field value
   * @param conditionValue the condition value
   * @param operator the comparison operator
   * @return true if the condition is satisfied
   */
  public static boolean evaluateNumericCondition(
      double fieldValue, double conditionValue, ComparisonOperator operator) {
    return switch (operator) {
      case EQUAL -> Math.abs(fieldValue - conditionValue) < EPSILON;
      case NOT_EQUAL -> Math.abs(fieldValue - conditionValue) >= EPSILON;
      case GREATER -> fieldValue > conditionValue;
      case LESS -> fieldValue < conditionValue;
      case GREATER_EQUAL -> fieldValue >= conditionValue;
      case LESS_EQUAL -> fieldValue <= conditionValue;
    };
  }

  /**
   * Evaluates a string condition.
   *
   * @param fieldValue the field value
   * @param conditionValue the condition value
   * @param operator the comparison operator
   * @return true if the condition is satisfied
   */
  public static boolean evaluateStringCondition(
      String fieldValue, String conditionValue, ComparisonOperator operator) {
    return switch (operator) {
      case EQUAL -> fieldValue.equals(conditionValue);
      case NOT_EQUAL -> !fieldValue.equals(conditionValue);
      case GREATER -> fieldValue.compareTo(conditionValue) > 0;
      case LESS -> fieldValue.compareTo(conditionValue) < 0;
      case GREATER_EQUAL -> fieldValue.compareTo(conditionValue) >= 0;
      case LESS_EQUAL -> fieldValue.compareTo(conditionValue) <= 0;
    };
  }

  /**
   * Evaluates a boolean condition.
   *
   * @param fieldValue the field value
   * @param conditionValue the condition value
   * @param operator the comparison operator
   * @return true if the condition is satisfied
   */
  public static boolean evaluateBooleanCondition(
      boolean fieldValue, boolean conditionValue, ComparisonOperator operator) {
    return switch (operator) {
      case EQUAL -> fieldValue == conditionValue;
      case NOT_EQUAL -> fieldValue != conditionValue;
      default -> false; // Other operators don't make sense for booleans
    };
  }
}
