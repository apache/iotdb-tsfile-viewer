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

import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { Alert, Input, Spin, Tree } from "antdv-next";

import { fileApi } from "@/api/tsfile";
import { encodeFileId } from "@/utils/fileId";

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
const searchValue = ref("");

// 虚拟滚动需要一个明确的像素高度；用 ResizeObserver 测量树区域可用高度，
// 传给 <Tree :height>，antdv 检测到 height 后自动启用虚拟滚动，只渲染可视节点。
const treeContainer = ref<HTMLElement | null>(null);
const treeHeight = ref(400);
let resizeObserver: ResizeObserver | null = null;

// 搜索时自动展开命中节点的祖先路径。展开态在搜索期间由 expandedKeys 接管，
// 清空搜索后恢复用户手动展开的状态。
const manualExpandedKeys = ref<string[]>([]);

/**
 * 收集所有 title 命中搜索词的节点 key，及其祖先 key（用于自动展开）。
 * 树是懒加载的：只在已加载（已展开过）的节点范围内匹配。
 */
function collectMatchedKeys(nodes: FlatNode[], keyword: string, ancestors: string[], out: Set<string>): boolean {
  let anyMatch = false;
  for (const node of nodes) {
    const selfMatch = node.title.toLowerCase().includes(keyword);
    let childMatch = false;
    if (node.children && node.children.length > 0) {
      childMatch = collectMatchedKeys(node.children, keyword, [...ancestors, node.key], out);
    }
    if (selfMatch || childMatch) {
      // 命中节点的所有祖先都要展开才能看到它
      for (const a of ancestors) out.add(a);
      if (childMatch) out.add(node.key);
      anyMatch = true;
    }
  }
  return anyMatch;
}

const matchedKeys = computed<Set<string>>(() => {
  const keyword = searchValue.value.trim().toLowerCase();
  if (!keyword) return new Set();
  const out = new Set<string>();
  collectMatchedKeys(treeData.value, keyword, [], out);
  return out;
});

/**
 * 按搜索词把树裁剪为「命中节点 + 其祖先路径」的子树。
 * 保留规则：节点自身 title 命中，或其后代中有命中项（祖先需保留以展示路径）。
 */
function filterTree(nodes: FlatNode[], keyword: string): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    const selfMatch = node.title.toLowerCase().includes(keyword);
    const filteredChildren =
      node.children && node.children.length > 0 ? filterTree(node.children, keyword) : [];
    if (selfMatch || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
  }
  return result;
}

// 传给 <Tree> 的数据：无搜索词时是完整树，有搜索词时是裁剪后的子树。
const displayTreeData = computed<FlatNode[]>(() => {
  const keyword = searchValue.value.trim().toLowerCase();
  if (!keyword) return treeData.value;
  return filterTree(treeData.value, keyword);
});

// 有搜索词时用命中祖先集合展开树；无搜索词时使用用户手动展开的状态。
function syncExpandedForSearch() {
  const keyword = searchValue.value.trim();
  if (keyword) {
    expandedKeys.value = Array.from(matchedKeys.value);
  } else {
    expandedKeys.value = [...manualExpandedKeys.value];
  }
}

function measureTreeHeight() {
  if (treeContainer.value) {
    treeHeight.value = Math.max(200, treeContainer.value.clientHeight);
  }
}

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
  const stringKeys = keys.map(k => String(k));
  expandedKeys.value = stringKeys;
  // 记录用户手动展开的状态，供清空搜索后恢复
  if (!searchValue.value.trim()) {
    manualExpandedKeys.value = stringKeys;
  }

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

/**
 * 将文件路径编码为 URL-safe 的 Base64 fileId，见 utils/fileId.ts。
 */
function handleSelect(_selectedKeys: (string | number)[], info: any) {
  const data = info.node;
  if (data.isDirectory) {
    emit("selectDirectory", data.path || data.key, data.title);
  } else {
    const fileId = encodeFileId(data.path || data.key);
    emit("select", fileId, data.path || data.key, data.title);
  }
}

function getNodeIconClass(node: any): string {
  if (node.isDirectory) return "i-mdi:folder text-yellow-500";
  if (String(node.title).endsWith(".tsfile")) return "i-mdi:file-document text-blue-500";
  return "i-mdi:file text-blue-500";
}

/**
 * 渲染节点标题；搜索时把命中的关键词片段高亮显示。
 */
function renderTitle(node: any) {
  const title = String(node.title);
  const keyword = searchValue.value.trim();
  let titleContent: any = title;

  if (keyword) {
    const lowerTitle = title.toLowerCase();
    const idx = lowerTitle.indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      const before = title.slice(0, idx);
      const match = title.slice(idx, idx + keyword.length);
      const after = title.slice(idx + keyword.length);
      titleContent = [
        before,
        h("span", { class: "bg-yellow-200 text-yellow-900 rounded px-0.5" }, match),
        after,
      ];
    }
  }

  return h("span", { class: "inline-flex items-center gap-2" }, [
    h("span", { class: getNodeIconClass(node) }),
    h("span", null, titleContent),
  ]);
}

function handleSearch(value: string) {
  searchValue.value = value;
  syncExpandedForSearch();
}

onMounted(() => {
  loadRootTree();
  if (treeContainer.value) {
    measureTreeHeight();
    resizeObserver = new ResizeObserver(() => measureTreeHeight());
    resizeObserver.observe(treeContainer.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div class="file-tree">
    <div class="mb-3 flex-shrink-0">
      <h3 class="mb-2 text-lg font-semibold">{{ t("tsfile.file.browser") }}</h3>
      <Input
        :value="searchValue"
        :placeholder="t('tsfile.file.searchPlaceholder')"
        allow-clear
        @update:value="handleSearch"
      >
        <template #prefix>
          <span class="i-mdi:magnify text-gray-400" />
        </template>
      </Input>
    </div>

    <Alert v-if="hasError" type="warning" :message="t('tsfile.file.loadTreeError')" show-icon class="mb-3 flex-shrink-0" />

    <div ref="treeContainer" class="min-h-0 flex-1">
      <Spin :spinning="loading">
        <Tree
          v-if="displayTreeData.length > 0"
          :tree-data="displayTreeData"
          :expanded-keys="expandedKeys"
          :height="treeHeight"
          :selectable="true"
          :title-render="renderTitle"
          block-node
          @expand="handleExpand"
          @select="handleSelect"
        />
        <div
          v-else-if="searchValue.trim() && treeData.length > 0"
          class="py-6 text-center text-gray-500"
        >
          <span class="i-mdi:file-search-outline mb-2 inline-block text-4xl text-gray-400 opacity-70" />
          <p class="mx-2 text-sm leading-relaxed">{{ t("tsfile.file.searchNoResult") }}</p>
        </div>
      </Spin>
    </div>

    <div v-if="!loading && !hasError && treeData.length === 0" class="py-6 text-center text-gray-500">
      <span class="i-mdi:folder-alert mb-2 inline-block text-4xl text-yellow-400 opacity-70" />
      <p class="mx-2 text-sm leading-relaxed">{{ t("tsfile.file.emptyTreeHint") }}</p>
    </div>
  </div>
</template>

<style scoped>
.file-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
}
</style>
