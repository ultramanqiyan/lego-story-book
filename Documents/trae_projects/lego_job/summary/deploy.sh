#!/bin/bash

# 乐高故事书项目一键部署脚本
# 使用方法：./deploy.sh
# 功能：自动完成Cloudflare Pages部署的所有步骤

set -e

echo "=========================================="
echo "  乐高故事书项目 - 一键部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印函数
print_step() {
    echo -e "${GREEN}[步骤 $1]${NC} $2"
}

print_warning() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

print_error() {
    echo -e "${RED}[错误]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[成功]${NC} $1"
}

# 步骤1：检查必要工具
print_step 1 "检查必要工具..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    print_error "未安装Node.js，请先安装Node.js"
    exit 1
fi
echo "  - Node.js: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    print_error "未安装npm，请先安装Node.js"
    exit 1
fi
echo "  - npm: $(npm --version)"

# 检查wrangler
if ! command -v npx wrangler &> /dev/null; then
    print_warning "未安装wrangler，正在安装..."
    npm install -g wrangler
fi
echo "  - wrangler: 已安装"

print_success "工具检查完成"
echo ""

# 步骤2：检查Cloudflare登录状态
print_step 2 "检查Cloudflare登录状态..."

if npx wrangler whoami &> /dev/null; then
    echo "  - 已登录Cloudflare"
else
    print_warning "未登录Cloudflare，正在打开登录页面..."
    npx wrangler login
    print_success "登录成功"
fi
echo ""

# 步骤3：检查并创建数据库
print_step 3 "检查数据库..."

DB_NAME="lego-story-db"
DB_EXISTS=$(npx wrangler d1 list 2>/dev/null | grep -c "$DB_NAME" || echo "0")

if [ "$DB_EXISTS" -gt 0 ]; then
    echo "  - 数据库 $DB_NAME 已存在"
else
    print_warning "数据库不存在，正在创建..."
    npx wrangler d1 create $DB_NAME
    print_success "数据库创建成功"
    
    # 提示用户更新wrangler.toml
    print_warning "请将数据库ID更新到wrangler.toml文件中"
    print_warning "数据库ID已显示在上方输出中"
    echo ""
    echo "按任意键继续（请确保已更新数据库ID）..."
    read -n 1 -s
fi
echo ""

# 步骤4：执行数据库迁移
print_step 4 "执行数据库迁移..."

if [ -d "migrations" ]; then
    echo "  - 正在执行本地迁移..."
    npx wrangler d1 migrations apply $DB_NAME --local
    echo "  - 正在执行远程迁移..."
    npx wrangler d1 migrations apply $DB_NAME
    print_success "数据库迁移完成"
else
    print_warning "未找到migrations目录，跳过迁移"
fi
echo ""

# 步骤5：检查环境变量
print_step 5 "检查环境变量配置..."

print_warning "请确保已在Cloudflare Dashboard中配置以下环境变量："
echo "  - DOUBAO_API_KEY（豆包AI密钥）"
echo "  - SEEDREAM_API_KEY（图片生成密钥）"
echo "  - SILICONFLOW_API_KEY（语音识别密钥，可选）"
echo ""
echo "配置方法："
echo "  1. 登录 https://dash.cloudflare.com"
echo "  2. 进入 Workers & Pages > 您的项目 > Settings > Environment variables"
echo "  3. 添加上述变量"
echo ""
echo "按任意键继续部署..."
read -n 1 -s
echo ""

# 步骤6：部署到Cloudflare Pages
print_step 6 "部署到Cloudflare Pages..."

echo "  - 正在部署..."
npx wrangler pages deploy . --project-name=lego-story-book

print_success "部署完成！"
echo ""

# 步骤7：显示部署信息
print_step 7 "部署信息"

echo ""
echo "=========================================="
echo "  部署成功！"
echo "=========================================="
echo ""
echo "访问地址："
echo "  https://lego-story-book.pages.dev"
echo ""
echo "管理控制台："
echo "  https://dash.cloudflare.com"
echo ""
echo "数据库管理："
echo "  npx wrangler d1 execute lego-story-db --command=\"SELECT * FROM users\""
echo ""
print_success "一键部署完成！"
