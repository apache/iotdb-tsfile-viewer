<!--
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
-->

<script setup lang="ts">
/**
 * FileTree 组件 - 文件树浏览器
 * 手动管理展开状态和子节点加载，避免 antdv loadData 的响应式问题
 */
import type { TreeNode } from "@/api/tsfile/types";

import { h, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { Alert, Spin, Tree } from "antdv-next";

import { fileApi } from "@/api/tsfile";

const { t } = useI18n();

const emit = defineEmits<{
  select: [fileId: string, path: string, name: string];
  selectDirectory: [path: string, name: string];
}>();

interface FlatNode {
  key: string;
  title: string;
  path: string;
  isDirectory: boolean;
  isLeaf: boolean;
  children?: FlatNode[];
}

const treeData = ref<FlatNode[]>([]);
const expandedKeys = ref<string[]>([]);
const loadingKeys = ref<Set<string>>(new Set());
const loading = ref(false);
const hasError = ref(false);

function transformNode(node: TreeNode): FlatNode {
  const result: FlatNode = {
    key: node.path,
    title: node.name,
    path: node.path,
    isDirectory: node.isDirectory,
    isLeaf: !node.isDirectory,
  };
  if (node.children && node.children.length > 0) {
    result.children = node.children.map((child) => transformNode(child));
  }
  return result;
}

function extractChildren(response: any): TreeNode[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object" && "children" in response) {
    return response.children ?? [];
  }
  return [];
}

/**
 * 递归查找节点并设置 children
 */
function setNodeChildren(nodes: FlatNode[], key: string, children: FlatNode[]): FlatNode[] {
  return nodes.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return { ...node, children: setNodeChildren(node.children, key, children) };
    }
    return node;
  });
}

async function loadRootTree() {
  loading.value = true;
  hasError.value = false;
  try {
    const response = await fileApi.getTree();
    const children = extractChildren(response);
    treeData.value = children.map((node: TreeNode) => transformNode(node));
  } catch {
    treeData.value = [];
    hasError.value = true;
  } finally {
    loading.value = false;
  }
}

/**
 * 展开节点时加载子目录
 */
async function handleExpand(keys: (string | number)[], info: { expanded: boolean; node: any }) {
  expandedKeys.value = keys.map(k => String(k));

  if (!info.expanded) return;

  const node = info.node;
  // 已有子节点则不重复加载
  if (!node.isDirectory || (node.children && node.children.length > 0)) return;

  const nodeKey = node.key as string;
  loadingKeys.value.add(nodeKey);

  try {
    const response = await fileApi.getTree(undefined, nodeKey);
    const children = extractChildren(response);
    const childNodes = children.map((n: TreeNode) => transformNode(n));
    treeData.value = setNodeChildren(treeData.value, nodeKey, childNodes);
  } catch {
    treeData.value = setNodeChildren(treeData.value, nodeKey, []);
  } finally {
    loadingKeys.value.delete(nodeKey);
  }
}

function handleSelect(_selectedKeys: (string | number)[], info: any) {
  const data = info.node;
  if (data.isDirectory) {
    emit("selectDirectory", data.path || data.key, data.title);
  } else {
    const fileId = btoa(data.path || data.key);
    emit("select", fileId, data.path || data.key, data.title);
  }
}

function getNodeIconClass(node: any): string {
  if (node.isDirectory) return "i-mdi:folder text-yellow-500";
  if (String(node.title).endsWith(".tsfile")) return "i-mdi:file-document text-blue-500";
  return "i-mdi:file text-blue-500";
}

function renderTitle(node: any) {
  return h("span", { class: "inline-flex items-center gap-2" }, [
    h("span", { class: getNodeIconClass(node) }),
    h("span", null, node.title),
  ]);
}

onMounted(() => {
  loadRootTree();
});
</script>

<template>
  <div class="file-tree">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">{{ t("tsfile.file.browser") }}</h3>
    </div>

    <Alert v-if="hasError" type="warning" :message="t('tsfile.file.loadTreeError')" show-icon class="mb-4" />

    <Spin :spinning="loading">
      <Tree
        v-if="treeData.length > 0"
        :tree-data="treeData"
        :expanded-keys="expandedKeys"
        :selectable="true"
        :title-render="renderTitle"
        block-node
        @expand="handleExpand"
        @select="handleSelect"
      />
    </Spin>

    <div v-if="!loading && !hasError && treeData.length === 0" class="py-6 text-center text-gray-500">
      <span class="i-mdi:folder-alert mb-2 inline-block text-4xl text-yellow-400 opacity-70" />
      <p class="mx-2 text-sm leading-relaxed">{{ t("tsfile.file.emptyTreeHint") }}</p>
    </div>
  </div>
</template>

<style scoped>
.file-tree {
  user-select: none;
}
</style>
