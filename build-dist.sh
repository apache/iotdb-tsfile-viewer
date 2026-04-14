#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#


# =========================================
# TSFile Viewer 发布包构建脚本
# =========================================
# 构建嵌入式 JAR 并通过 Maven Assembly Plugin 打包为 zip
# 包含：JAR + 启动脚本 + 配置文件 + 用户手册

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  构建 TSFile Viewer 发布包"
echo "========================================="
echo ""

# Step 1: 构建前端
echo "Step 1/3: 构建前端..."
cd frontend
pnpm install
pnpm build
cd "$SCRIPT_DIR"
echo "前端构建完成。"
echo ""

# Step 2: 复制前端资源到后端
echo "Step 2/3: 复制前端资源到后端..."
rm -rf backend/src/main/resources/static/view
mkdir -p backend/src/main/resources/static/view
cp -R frontend/dist/. backend/src/main/resources/static/view/
if [ ! -f backend/src/main/resources/static/view/index.html ]; then
    echo "错误: index.html 未复制成功！"
    exit 1
fi
echo "前端资源复制完成。"
echo ""

# Step 3: 构建后端 JAR + Assembly 打包
echo "Step 3/3: 构建后端并打包发布包 (Maven Assembly Plugin)..."
cd backend
mvn clean package -DskipTests
cd "$SCRIPT_DIR"

# 查找 Assembly 生成的 zip
ZIP_PATH=$(ls backend/target/tsfile-viewer-*.zip 2>/dev/null | head -n 1)
if [ -z "$ZIP_PATH" ]; then
    echo "错误: 未找到 Assembly 生成的 zip 文件！"
    exit 1
fi

ZIP_NAME=$(basename "$ZIP_PATH")

# 复制到 release 目录
mkdir -p release
cp "$ZIP_PATH" "release/$ZIP_NAME"

ZIP_SIZE=$(du -h "release/$ZIP_NAME" | awk '{print $1}')
echo ""
echo "========================================="
echo "  构建完成！"
echo "========================================="
echo ""
echo "  发布包: release/$ZIP_NAME ($ZIP_SIZE)"
echo ""
echo "  包内容:"
echo "  tsfile-viewer/"
echo "  ├── tsfile-viewer.jar    # 应用主程序"
echo "  ├── application.yml      # 配置文件"
echo "  ├── start.sh             # Linux/macOS 启动脚本"
echo "  ├── start.bat            # Windows 启动脚本"
echo "  ├── 用户手册.md           # 中文用户手册"
echo "  ├── data/                # 数据目录"
echo "  └── logs/                # 日志目录"
echo ""
echo "  使用方法:"
echo "    1. 解压 tsfile-viewer.zip"
echo "    2. 编辑 application.yml 配置文件"
echo "    3. 运行 ./start.sh (Linux/macOS) 或 start.bat (Windows)"
echo "    4. 浏览器访问 http://localhost:8080/view/"
echo ""
