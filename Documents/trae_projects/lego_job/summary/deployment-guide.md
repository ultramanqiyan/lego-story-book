# 乐高故事书项目部署文档

## 文档信息

| 项目名称 | 乐高故事书 |
|----------|------------|
| 文档版本 | V2.0 |
| 编写日期 | 2026年2月26日 |
| 文档状态 | 正式发布 |

---

## 一、快速开始（5分钟部署）

本章节提供最简化的部署步骤，帮助您快速完成项目部署。详细说明请参考后续章节。

### 1.1 前置条件检查

在开始部署前，请确保您已具备以下条件：

**必需条件**：
- Node.js 18.0.0 或更高版本
- npm 包管理器
- Git 版本控制工具
- Cloudflare 账户（免费账户即可）
- GitHub 账户（用于代码托管）

**验证命令**：
```bash
# 检查 Node.js 版本
node --version
# 预期输出：v18.x.x 或更高

# 检查 npm 版本
npm --version
# 预期输出：9.x.x 或更高

# 检查 Git 版本
git --version
# 预期输出：git version 2.x.x
```

### 1.2 克隆项目代码

```bash
# 克隆项目仓库
git clone https://github.com/ultramanqiyan/lego-story-book.git

# 进入项目目录
cd lego-story-book

# 安装依赖
npm install
```

### 1.3 登录 Cloudflare

```bash
# 安装 Wrangler CLI（如果未安装）
npm install -g wrangler

# 登录 Cloudflare 账户
npx wrangler login
```

执行登录命令后，浏览器会自动打开 Cloudflare 登录页面，请完成授权。

### 1.4 创建数据库

```bash
# 创建 D1 数据库
npx wrangler d1 create lego-story-db
```

**预期输出**：
```
✅ Successfully created DB 'lego-story-db'!

[[d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**重要**：请记录输出的 `database_id`，后续配置需要使用。

### 1.5 配置 wrangler.toml

打开项目根目录的 `wrangler.toml` 文件，将 `database_id` 替换为您刚才创建的数据库ID：

```toml
name = "lego-story-book"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "您的数据库ID"  # 替换这里

[vars]
ENVIRONMENT = "development"

[env.production]
name = "lego-story-book"

[[env.production.d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "您的数据库ID"  # 替换这里

[env.production.vars]
ENVIRONMENT = "production"
```

### 1.6 执行数据库迁移

```bash
# 执行本地数据库迁移（用于本地开发测试）
npx wrangler d1 migrations apply lego-story-db --local

# 执行远程数据库迁移（用于生产环境）
npx wrangler d1 migrations apply lego-story-db
```

**预期输出**：
```
🌀 Executing on local database:
🚣 Executed 3 migrations in XXXms.
```

### 1.7 配置环境变量

在 Cloudflare Pages 项目设置中配置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| DOUBAO_API_KEY | 您的API密钥 | 豆包大语言模型API |
| SEEDREAM_API_KEY | 您的API密钥 | 火山引擎图片生成API |
| SILICONFLOW_API_KEY | 您的API密钥 | SiliconFlow语音识别API |

**配置步骤**：
1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages > lego-story-book
3. 点击 Settings > Environment variables
4. 点击 Add variable，逐个添加上述变量
5. 分别配置 Production 和 Preview 环境

### 1.8 部署项目

```bash
# 部署到 Cloudflare Pages
npx wrangler pages deploy .
```

**预期输出**：
```
✨ Success! Uploaded 1 files and Deployed!
✨ Deployment URL: https://lego-story-book.pages.dev
```

### 1.9 验证部署

访问部署URL，检查以下功能：

1. **首页访问**：打开 `https://您的项目名.pages.dev`
2. **用户登录**：输入用户名测试登录功能
3. **创建书籍**：测试创建新书籍功能
4. **生成故事**：测试AI故事生成功能

---

## 二、环境准备

### 2.1 开发环境配置

#### 2.1.1 Node.js 安装

**Windows 系统**：
1. 访问 https://nodejs.org/
2. 下载 LTS 版本安装包
3. 运行安装程序，按提示完成安装
4. 打开命令提示符，验证安装

**macOS 系统**：
```bash
# 使用 Homebrew 安装
brew install node

# 或使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**Linux 系统**：
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### 2.1.2 Wrangler CLI 安装

```bash
# 全局安装 Wrangler
npm install -g wrangler

# 验证安装
npx wrangler --version
# 预期输出：⛅️ wrangler 3.x.x
```

#### 2.1.3 本地开发环境启动

```bash
# 进入项目目录
cd lego-story-book

# 安装项目依赖
npm install

# 启动本地开发服务器
npm run dev
```

**预期输出**：
```
Ready on http://localhost:8788
```

访问 `http://localhost:8788` 即可看到项目首页。

### 2.2 Cloudflare 账户准备

#### 2.2.1 注册 Cloudflare 账户

1. 访问 https://dash.cloudflare.com/sign-up
2. 输入邮箱和密码
3. 验证邮箱地址
4. 完成账户注册

#### 2.2.2 开通 Pages 服务

1. 登录 Cloudflare Dashboard
2. 点击左侧菜单 "Workers & Pages"
3. 点击 "Create application"
4. 选择 "Pages" 标签
5. 点击 "Connect to Git"

#### 2.2.3 开通 D1 数据库服务

1. 在 Cloudflare Dashboard 中
2. 点击左侧菜单 "Workers & Pages" > "D1 SQL Database"
3. 点击 "Create database"
4. 输入数据库名称并创建

### 2.3 第三方服务账户准备

本项目使用以下第三方服务，需要分别注册并获取API密钥。

#### 2.3.1 火山引擎（豆包API + Seedream API）

**注册步骤**：
1. 访问 https://www.volcengine.com/
2. 点击右上角 "登录/注册"
3. 完成账户注册和实名认证

**获取 API 密钥**：
1. 登录火山引擎控制台
2. 访问 https://console.volcengine.com/ark
3. 点击左侧菜单 "API Key管理"
4. 点击 "创建新的API Key"
5. 复制并保存API Key

**豆包大语言模型配置**：
1. 在 ARK 控制台中
2. 点击 "模型推理" > "推理"
3. 创建接入点，选择模型 `doubao-1-5-pro-32k-250115`
4. 记录接入点ID

**Seedream 图片生成配置**：
- Seedream 使用相同的火山引擎API Key
- 模型名称：`doubao-seedream-4-0-250828`

#### 2.3.2 SiliconFlow（语音识别）

**注册步骤**：
1. 访问 https://cloud.siliconflow.cn/
2. 点击 "注册/登录"
3. 完成账户注册

**获取 API 密钥**：
1. 登录 SiliconFlow 控制台
2. 点击左侧菜单 "API密钥"
3. 点击 "创建新密钥"
4. 复制并保存API Key

**语音识别模型**：
- 模型名称：`FunAudioLLM/SenseVoiceSmall`

---

## 三、数据库配置详解

### 3.1 数据库创建

#### 3.1.1 创建命令

```bash
npx wrangler d1 create lego-story-db
```

#### 3.1.2 预期输出详解

```
✅ Successfully created DB 'lego-story-db'!

[[d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "649c105f-87c8-4f75-82df-c9222ae0afcb"
```

**输出说明**：
- `binding`：代码中访问数据库的变量名，固定为 "DB"
- `database_name`：数据库名称，用于命令行操作
- `database_id`：数据库唯一标识，用于配置文件

#### 3.1.3 查看已有数据库

```bash
npx wrangler d1 list
```

**预期输出**：
```
┌─────────────────┬──────────────────────────────────────┐
│ Name            │ Database ID                          │
├─────────────────┼──────────────────────────────────────┤
│ lego-story-db   │ 649c105f-87c8-4f75-82df-c9222ae0afcb │
└─────────────────┴──────────────────────────────────────┘
```

### 3.2 数据库表结构

本项目包含以下数据表：

#### 3.2.1 users 表（用户表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| user_id | TEXT | 用户ID（主键） |
| username | TEXT | 用户名 |
| email | TEXT | 邮箱（可选） |
| avatar | TEXT | 头像（可选） |
| parent_id | TEXT | 家长ID（可选） |
| daily_time_limit | INTEGER | 每日时间限制（分钟） |
| time_used_today | INTEGER | 今日已用时间（分钟） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### 3.2.2 characters 表（人仔表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| character_id | TEXT | 人仔ID（主键） |
| name | TEXT | 人仔名称 |
| image_base64 | TEXT | 人仔图片（Base64） |
| description | TEXT | 描述 |
| personality | TEXT | 性格特点 |
| speaking_style | TEXT | 说话方式 |
| creator_id | TEXT | 创建者ID（system为系统预设） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### 3.2.3 books 表（书籍表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| book_id | TEXT | 书籍ID（主键） |
| user_id | TEXT | 用户ID（外键） |
| title | TEXT | 书籍标题 |
| chapter_count | INTEGER | 章节数量 |
| status | TEXT | 状态（active/archived） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

#### 3.2.4 chapters 表（章节表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| chapter_id | TEXT | 章节ID（主键） |
| book_id | TEXT | 书籍ID（外键） |
| chapter_number | INTEGER | 章节序号 |
| title | TEXT | 章节标题 |
| content | TEXT | 章节内容 |
| has_puzzle | INTEGER | 是否有谜题（0/1） |
| created_at | DATETIME | 创建时间 |

#### 3.2.5 puzzles 表（谜题表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| puzzle_id | TEXT | 谜题ID（主键） |
| chapter_id | TEXT | 章节ID（外键） |
| question | TEXT | 谜题问题 |
| options | TEXT | 选项（JSON数组） |
| answer | TEXT | 正确答案（A/B/C/D） |
| hint | TEXT | 提示（可选） |
| puzzle_type | TEXT | 谜题类型 |
| created_at | DATETIME | 创建时间 |

#### 3.2.6 其他表

- **book_characters**：书籍角色关联表
- **puzzle_records**：答题记录表
- **shares**：分享表

### 3.3 数据库迁移

#### 3.3.1 迁移文件说明

项目 `migrations` 目录包含以下迁移文件：

| 文件名 | 执行顺序 | 说明 |
|--------|----------|------|
| 0001_initial_schema.sql | 第1个 | 创建所有基础表结构 |
| 0002_seed_data.sql | 第2个 | 导入系统预设人份数据 |
| 0002_add_plot_selection.sql | 第3个 | 添加情节选择功能 |
| 0004_reset_database.sql | 可选 | 重置数据库（谨慎使用） |

#### 3.3.2 执行本地迁移

```bash
# 执行所有本地迁移
npx wrangler d1 migrations apply lego-story-db --local
```

**预期输出**：
```
Migrations to be applied:
  0001_initial_schema.sql
  0002_seed_data.sql
  0002_add_plot_selection.sql

🌀 Executing on local database:
🚣 Executed 3 migrations in XXXms.
```

#### 3.3.3 执行远程迁移

```bash
# 执行所有远程迁移
npx wrangler d1 migrations apply lego-story-db
```

**预期输出**：
```
Migrations to be applied:
  0001_initial_schema.sql
  0002_seed_data.sql
  0002_add_plot_selection.sql

🌀 Executing on remote database:
🚣 Executed 3 migrations in XXXms.
```

#### 3.3.4 验证迁移结果

```bash
# 查看本地数据库表
npx wrangler d1 execute lego-story-db --local --command "SELECT name FROM sqlite_master WHERE type='table';"

# 查看远程数据库表
npx wrangler d1 execute lego-story-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

**预期输出**：
```
┌────────────────────┐
│ name               │
├────────────────────┤
│ users              │
│ characters         │
│ books              │
│ chapters           │
│ book_characters    │
│ puzzles            │
│ puzzle_records     │
│ shares             │
│ _cf_KV             │
└────────────────────┘
```

### 3.4 数据库备份与恢复

#### 3.4.1 导出数据库

```bash
# 导出远程数据库
npx wrangler d1 export lego-story-db --output backup.sql
```

#### 3.4.2 导入数据库

```bash
# 导入到远程数据库
npx wrangler d1 execute lego-story-db --file backup.sql
```

---

## 四、环境变量配置详解

### 4.1 环境变量列表

本项目需要配置以下环境变量：

| 变量名 | 必需 | 用途 | 默认值 |
|--------|------|------|--------|
| DOUBAO_API_KEY | 是 | 豆包大语言模型API密钥，用于故事生成 | 无 |
| SEEDREAM_API_KEY | 是 | 火山引擎图片生成API密钥 | 无 |
| SILICONFLOW_API_KEY | 是 | SiliconFlow语音识别API密钥 | 无 |
| ENVIRONMENT | 否 | 环境标识 | development |

### 4.2 DOUBAO_API_KEY 配置

#### 4.2.1 用途说明

豆包大语言模型API用于：
- 生成故事内容
- 生成章节标题
- 生成谜题问题

#### 4.2.2 获取方式

1. 访问火山引擎控制台：https://console.volcengine.com/ark
2. 点击左侧菜单 "API Key管理"
3. 点击 "创建新的API Key"
4. 复制生成的API Key

#### 4.2.3 配置步骤

**Cloudflare Pages 配置**：
1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages > lego-story-book
3. 点击 Settings > Environment variables
4. 点击 Add variable
5. 输入变量名：`DOUBAO_API_KEY`
6. 输入变量值：您的API Key
7. 选择环境：Production 和 Preview
8. 点击 Save

### 4.3 SEEDREAM_API_KEY 配置

#### 4.3.1 用途说明

火山引擎图片生成API用于：
- 生成人仔头像图片
- 生成故事配图

#### 4.3.2 获取方式

与 DOUBAO_API_KEY 相同，使用同一个火山引擎API Key。

#### 4.3.3 配置步骤

同 DOUBAO_API_KEY 配置步骤，变量名为 `SEEDREAM_API_KEY`。

### 4.4 SILICONFLOW_API_KEY 配置

#### 4.4.1 用途说明

SiliconFlow语音识别API用于：
- 语音输入识别
- 语音转文字

#### 4.4.2 获取方式

1. 访问 SiliconFlow 控制台：https://cloud.siliconflow.cn/
2. 点击左侧菜单 "API密钥"
3. 点击 "创建新密钥"
4. 复制生成的API Key

#### 4.4.3 配置步骤

同 DOUBAO_API_KEY 配置步骤，变量名为 `SILICONFLOW_API_KEY`。

### 4.5 本地开发环境变量配置

#### 4.5.1 创建本地配置文件

在项目根目录创建 `.dev.vars` 文件：

```bash
# 创建 .dev.vars 文件
cat > .dev.vars << EOF
DOUBAO_API_KEY=您的豆包API密钥
SEEDREAM_API_KEY=您的火山引擎API密钥
SILICONFLOW_API_KEY=您的SiliconFlow API密钥
EOF
```

#### 4.5.2 验证配置

启动本地开发服务器后，检查日志确认环境变量已加载：

```bash
npm run dev
```

---

## 五、部署步骤详解

### 5.1 通过 Wrangler CLI 部署

#### 5.1.1 登录 Cloudflare

```bash
npx wrangler login
```

浏览器会自动打开授权页面，点击 "Allow" 完成授权。

#### 5.1.2 部署项目

```bash
# 部署到 Cloudflare Pages
npx wrangler pages deploy .
```

**预期输出**：
```
✨ Success! Uploaded XXX files and Deployed!
✨ Deployment URL: https://xxxxxx.lego-story-book.pages.dev
```

### 5.2 通过 GitHub 自动部署

#### 5.2.1 连接 GitHub 仓库

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 点击 "Create application" > "Pages" > "Connect to Git"
4. 选择 GitHub 并授权
5. 选择 `lego-story-book` 仓库
6. 点击 "Begin setup"

#### 5.2.2 配置构建设置

| 设置项 | 值 |
|--------|-----|
| Production branch | main |
| Build command | 留空 |
| Build output directory | / |
| Root directory | 留空 |

#### 5.2.3 配置环境变量

在项目设置中添加环境变量（参考第四章）。

#### 5.2.4 触发部署

每次推送到 main 分支，Cloudflare Pages 会自动触发部署。

### 5.3 部署状态检查

#### 5.3.1 查看部署列表

```bash
npx wrangler pages deployment list
```

#### 5.3.2 查看部署日志

```bash
npx wrangler pages deployment tail
```

---

## 六、部署验证

### 6.1 页面访问验证

#### 6.1.1 首页验证

访问部署URL，检查：
- [ ] 页面正常加载
- [ ] 样式正确显示
- [ ] 图片正常加载
- [ ] 无控制台错误

#### 6.1.2 登录页面验证

访问登录页面，检查：
- [ ] 登录表单正常显示
- [ ] 输入用户名后可以登录
- [ ] 登录后跳转到书架页面

### 6.2 功能验证

#### 6.2.1 用户登录验证

```bash
# 使用 curl 测试登录API
curl -X POST https://您的域名/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user"}'
```

**预期响应**：
```json
{
  "success": true,
  "data": {
    "user_id": "id_xxx",
    "username": "test_user"
  }
}
```

#### 6.2.2 创建书籍验证

```bash
# 使用 curl 测试创建书籍API
curl -X POST https://您的域名/api/books \
  -H "Content-Type: application/json" \
  -d '{"user_id":"您的用户ID","title":"测试书籍"}'
```

**预期响应**：
```json
{
  "success": true,
  "data": {
    "book_id": "id_xxx",
    "title": "测试书籍"
  }
}
```

#### 6.2.3 故事生成验证

1. 在书籍详情页点击"生成下一章"
2. 选择角色后点击确认
3. 等待故事生成完成
4. 检查生成的故事内容

#### 6.2.4 谜题功能验证

1. 阅读章节后点击"去解谜"
2. 检查谜题是否正确显示
3. 选择答案并提交
4. 检查答案验证结果

### 6.3 API端点验证

使用以下命令测试各API端点：

```bash
# 测试用户API
curl https://您的域名/api/users

# 测试书籍API
curl https://您的域名/api/books?user_id=您的用户ID

# 测试角色API
curl https://您的域名/api/characters

# 测试情节选项API
curl https://您的域名/api/plot-options
```

---

## 七、API端点列表

### 7.1 用户相关API

#### POST /api/users

创建或获取用户

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |

**请求示例**：
```json
{
  "username": "test_user"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "user_id": "id_xxx",
    "username": "test_user",
    "daily_time_limit": 120,
    "time_used_today": 0
  }
}
```

### 7.2 书籍相关API

#### GET /api/books

获取用户书籍列表

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| user_id | string | 是 | 用户ID |

#### POST /api/books

创建新书籍

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| user_id | string | 是 | 用户ID |
| title | string | 是 | 书籍标题 |

### 7.3 章节相关API

#### GET /api/chapters

获取章节列表

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| book_id | string | 是 | 书籍ID |

#### POST /api/chapters-generate

生成新章节

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| book_id | string | 是 | 书籍ID |
| characters | array | 是 | 角色列表 |

### 7.4 角色相关API

#### GET /api/characters

获取角色列表

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| user_id | string | 否 | 用户ID（用于获取用户自定义角色） |

#### POST /api/characters

创建新角色

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| name | string | 是 | 角色名称 |
| personality | string | 否 | 性格特点 |
| speaking_style | string | 否 | 说话方式 |

### 7.5 谜题相关API

#### POST /api/puzzle

验证谜题答案

**请求参数**：
| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| puzzle_id | string | 是 | 谜题ID |
| user_answer | string | 是 | 用户答案（A/B/C/D） |

### 7.6 其他API

| 端点 | 方法 | 功能 |
|------|------|------|
| /api/speech | POST | 语音识别 |
| /api/generate | POST | 图片生成 |
| /api/share | GET/POST | 分享管理 |
| /api/plot-options | GET | 获取情节选项 |
| /api/book-characters | GET/POST | 书籍角色管理 |
| /api/chapters-complete | POST | 标记章节完成 |

---

## 八、常见问题排查

### 8.1 环境变量问题

#### 问题：API调用返回401错误

**症状**：
```json
{
  "success": false,
  "error": "API认证失败"
}
```

**原因**：环境变量未正确配置

**解决方案**：
1. 检查 Cloudflare Pages 项目设置中的环境变量
2. 确认变量名拼写正确（区分大小写）
3. 确认变量值正确（无多余空格）
4. 重新部署项目使环境变量生效

#### 问题：本地开发时API调用失败

**原因**：本地环境变量未配置

**解决方案**：
1. 创建 `.dev.vars` 文件
2. 添加所有必需的环境变量
3. 重启开发服务器

### 8.2 数据库问题

#### 问题：查询返回空结果

**症状**：
```json
{
  "success": true,
  "data": []
}
```

**原因**：数据库迁移未执行或数据未导入

**解决方案**：
```bash
# 检查迁移状态
npx wrangler d1 migrations apply lego-story-db --local

# 检查表是否存在
npx wrangler d1 execute lego-story-db --local --command "SELECT name FROM sqlite_master WHERE type='table';"
```

#### 问题：数据库绑定错误

**症状**：
```
Error: D1 database not found
```

**原因**：wrangler.toml 配置错误

**解决方案**：
1. 检查 wrangler.toml 中的 database_id
2. 确认数据库已创建
3. 确认 binding 名称正确（应为 "DB"）

### 8.3 部署问题

#### 问题：部署超时

**症状**：
```
Error: Deployment timed out
```

**原因**：文件过多或网络问题

**解决方案**：
1. 检查项目文件大小
2. 确认网络连接正常
3. 重试部署命令

#### 问题：构建失败

**症状**：
```
Error: Build failed
```

**原因**：依赖安装失败或配置错误

**解决方案**：
1. 检查 package.json 配置
2. 确认 Node.js 版本兼容
3. 查看详细错误日志

### 8.4 功能问题

#### 问题：故事生成失败

**症状**：点击"生成下一章"后无响应或报错

**原因**：豆包API调用失败

**解决方案**：
1. 检查 DOUBAO_API_KEY 配置
2. 检查 API 余额是否充足
3. 查看 Cloudflare 日志确认错误详情

#### 问题：谜题不显示

**症状**：章节阅读后谜题区域为空

**原因**：谜题数据未正确生成或显示

**解决方案**：
1. 检查章节的 has_puzzle 字段
2. 检查 puzzles 表中是否有对应记录
3. 查看浏览器控制台错误

---

## 附录

### 附录A：常用命令速查表

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run deploy` | 部署到生产环境 |
| `npx wrangler login` | 登录 Cloudflare |
| `npx wrangler d1 create <name>` | 创建数据库 |
| `npx wrangler d1 list` | 列出所有数据库 |
| `npx wrangler d1 migrations apply <db>` | 执行迁移 |
| `npx wrangler d1 execute <db> --command "SQL"` | 执行SQL |
| `npx wrangler d1 export <db>` | 导出数据库 |
| `npx wrangler pages deploy .` | 部署Pages项目 |

### 附录B：配置文件模板

#### wrangler.toml

```toml
name = "lego-story-book"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "您的数据库ID"

[vars]
ENVIRONMENT = "development"

[env.production]
name = "lego-story-book"

[[env.production.d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "您的数据库ID"

[env.production.vars]
ENVIRONMENT = "production"
```

#### .dev.vars

```
DOUBAO_API_KEY=您的豆包API密钥
SEEDREAM_API_KEY=您的火山引擎API密钥
SILICONFLOW_API_KEY=您的SiliconFlow API密钥
```

### 附录C：修订历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-02-25 | 初始版本 | 项目团队 |
| V2.0 | 2026-02-26 | 优化文档，添加详细配置步骤和验证方法 | 项目团队 |

---

**文档结束**
