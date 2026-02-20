# 乐高故事书籍功能 - 设计文档

## 1. 系统架构

### 1.1 整体架构
```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   静态页面   │  │  Page       │  │  Cloudflare │         │
│  │  (Next.js)  │  │  Functions  │  │      D1     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ 火山引擎  │ │ SiliconFlow│ │  其他API │
        │ Doubao   │ │  语音识别  │ │         │
        └──────────┘ └──────────┘ └──────────┘
```

### 1.2 技术栈
- **前端框架**: Next.js 14 (静态导出)
- **UI组件**: React 18
- **样式**: Tailwind CSS
- **数据库**: Cloudflare D1
- **部署**: Cloudflare Pages
- **AI服务**: 火山引擎 Doubao、Seedream、SiliconFlow

### 1.3 目录结构
```
renzai_create/
├── doc/                          # 文档目录
│   ├── requirements.md           # 需求文档
│   ├── design.md                 # 设计文档
│   ├── test.md                   # 测试文档
│   └── deploy.md                 # 部署文档
├── functions/                    # Cloudflare Page Functions
│   └── api/
│       ├── generate.js           # 图生图API
│       ├── speech.js             # 语音识别API
│       ├── story.js              # 故事生成API
│       ├── chapter.js            # 章节管理API
│       ├── book.js               # 书籍管理API
│       ├── character.js          # 人仔管理API
│       ├── share.js              # 分享管理API
│       ├── user.js               # 用户管理API
│       └── parent.js             # 家长控制API
├── public/                       # 静态资源
│   └── characters/               # 预设人仔图片
├── src/                          # 源代码
│   ├── app/                      # Next.js App Router
│   │   ├── page.js               # 主页
│   │   ├── layout.js             # 布局
│   │   ├── story-create/         # 故事创作页面
│   │   ├── bookshelf/            # 书架页面
│   │   ├── book/                 # 书籍详情页面
│   │   ├── characters/           # 人仔管理页面
│   │   ├── adventure/            # 冒险工坊页面
│   │   ├── parent/               # 家长控制页面
│   │   ├── share/                # 分享访问页面
│   │   └── login/                # 登录页面
│   ├── components/               # 组件
│   │   ├── ui/                   # UI基础组件
│   │   ├── layout/               # 布局组件
│   │   ├── story/                # 故事相关组件
│   │   ├── book/                 # 书籍相关组件
│   │   ├── character/            # 人仔相关组件
│   │   └── shared/               # 共享组件
│   ├── lib/                      # 工具库
│   │   ├── db.js                 # 数据库操作
│   │   ├── api.js                # API调用
│   │   ├── auth.js               # 认证相关
│   │   └── utils.js              # 工具函数
│   ├── hooks/                    # 自定义Hooks
│   └── styles/                   # 样式文件
├── tests/                        # 测试文件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── wrangler.toml                 # Cloudflare配置
├── package.json                  # 项目配置
└── README.md                     # 项目说明
```

## 2. 数据库设计

### 2.1 用户表 (users)
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'child',
    parent_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id)
);
```

### 2.2 人仔表 (characters)
```sql
CREATE TABLE characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    personality TEXT NOT NULL,
    speaking_style TEXT NOT NULL,
    creator_id TEXT DEFAULT 'system',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);
```

### 2.3 书籍表 (books)
```sql
CREATE TABLE books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    user_id TEXT NOT NULL,
    chapter_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 2.4 章节表 (chapters)
```sql
CREATE TABLE chapters (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    characters TEXT NOT NULL,
    plot TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

### 2.5 分享表 (shares)
```sql
CREATE TABLE shares (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    share_code TEXT UNIQUE NOT NULL,
    password TEXT,
    is_public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);
```

### 2.6 家长控制表 (parent_controls)
```sql
CREATE TABLE parent_controls (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    daily_time_limit INTEGER DEFAULT 60,
    allowed_start_hour INTEGER DEFAULT 8,
    allowed_end_hour INTEGER DEFAULT 21,
    break_reminder_interval INTEGER DEFAULT 30,
    content_filter_level TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id),
    FOREIGN KEY (child_id) REFERENCES users(id)
);
```

### 2.7 使用记录表 (usage_logs)
```sql
CREATE TABLE usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    duration INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 3. API设计

### 3.1 用户管理API (/api/user)

#### 3.1.1 用户注册
- **URL**: `/api/user?action=register`
- **Method**: POST
- **Request Body**:
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "child|parent"
}
```
- **Response**:
```json
{
    "success": true,
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```

#### 3.1.2 用户登录
- **URL**: `/api/user?action=login`
- **Method**: POST
- **Request Body**:
```json
{
    "username": "string",
    "password": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "token": "string",
    "user": {
        "id": "string",
        "username": "string",
        "role": "string"
    }
}
```

#### 3.1.3 获取用户信息
- **URL**: `/api/user?action=info`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```

### 3.2 人仔管理API (/api/character)

#### 3.2.1 获取预设人仔列表
- **URL**: `/api/character?action=preset`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "characters": [
        {
            "id": "string",
            "name": "string",
            "image": "string",
            "description": "string",
            "personality": "string",
            "speaking_style": "string"
        }
    ]
}
```

#### 3.2.2 获取用户人仔列表
- **URL**: `/api/character?action=list&user_id={user_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "characters": [
        {
            "id": "string",
            "name": "string",
            "image": "string",
            "description": "string",
            "personality": "string",
            "speaking_style": "string"
        }
    ]
}
```

#### 3.2.3 创建自定义人仔
- **URL**: `/api/character?action=create`
- **Method**: POST
- **Request Body**:
```json
{
    "name": "string",
    "image": "base64_string",
    "description": "string",
    "personality": "string",
    "speaking_style": "string",
    "creator_id": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "character": {
        "id": "string",
        "name": "string",
        "image": "string"
    }
}
```

#### 3.2.4 删除人仔
- **URL**: `/api/character?action=delete&id={character_id}`
- **Method**: DELETE
- **Response**:
```json
{
    "success": true
}
```

### 3.3 书籍管理API (/api/book)

#### 3.3.1 创建书籍
- **URL**: `/api/book?action=create`
- **Method**: POST
- **Request Body**:
```json
{
    "title": "string",
    "user_id": "string"
}
```
- **Response**:
```json
{
    "success": true,
    "book": {
        "id": "string",
        "title": "string",
        "chapter_count": 0
    }
}
```

#### 3.3.2 获取书籍列表
- **URL**: `/api/book?action=list&user_id={user_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "books": [
        {
            "id": "string",
            "title": "string",
            "chapter_count": 1,
            "created_at": "string",
            "updated_at": "string"
        }
    ]
}
```

#### 3.3.3 获取书籍详情
- **URL**: `/api/book?action=detail&id={book_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "book": {
        "id": "string",
        "title": "string",
        "chapter_count": 1,
        "chapters": [
            {
                "id": "string",
                "chapter_number": 1,
                "title": "string",
                "content": "string"
            }
        ]
    }
}
```

#### 3.3.4 更新书籍
- **URL**: `/api/book?action=update`
- **Method**: PUT
- **Request Body**:
```json
{
    "id": "string",
    "title": "string"
}
```
- **Response**:
```json
{
    "success": true
}
```

#### 3.3.5 删除书籍
- **URL**: `/api/book?action=delete&id={book_id}`
- **Method**: DELETE
- **Response**:
```json
{
    "success": true
}
```

### 3.4 章节管理API (/api/chapter)

#### 3.4.1 生成章节
- **URL**: `/api/chapter?action=generate`
- **Method**: POST
- **Request Body**:
```json
{
    "book_id": "string",
    "characters": [
        {
            "id": "string",
            "name": "string",
            "role": "protagonist|supporting|villain|passerby",
            "nickname": "string"
        }
    ],
    "plot": "string",
    "previous_chapters": [
        {
            "chapter_number": 1,
            "title": "string",
            "content": "string"
        }
    ]
}
```
- **Response**:
```json
{
    "success": true,
    "chapter": {
        "id": "string",
        "chapter_number": 1,
        "title": "string",
        "content": "string"
    }
}
```

#### 3.4.2 获取章节详情
- **URL**: `/api/chapter?action=detail&id={chapter_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "chapter": {
        "id": "string",
        "book_id": "string",
        "chapter_number": 1,
        "title": "string",
        "content": "string",
        "characters": "json_string",
        "plot": "string"
    }
}
```

### 3.5 分享管理API (/api/share)

#### 3.5.1 创建分享
- **URL**: `/api/share?action=create`
- **Method**: POST
- **Request Body**:
```json
{
    "book_id": "string",
    "is_public": true,
    "password": "string (optional)"
}
```
- **Response**:
```json
{
    "success": true,
    "share": {
        "id": "string",
        "share_code": "string",
        "share_url": "string"
    }
}
```

#### 3.5.2 访问分享
- **URL**: `/api/share?action=access&code={share_code}`
- **Method**: POST
- **Request Body**:
```json
{
    "password": "string (optional)"
}
```
- **Response**:
```json
{
    "success": true,
    "book": {
        "id": "string",
        "title": "string",
        "chapters": []
    }
}
```

#### 3.5.3 获取分享列表
- **URL**: `/api/share?action=list&book_id={book_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "shares": [
        {
            "id": "string",
            "share_code": "string",
            "is_public": true,
            "created_at": "string"
        }
    ]
}
```

#### 3.5.4 删除分享
- **URL**: `/api/share?action=delete&id={share_id}`
- **Method**: DELETE
- **Response**:
```json
{
    "success": true
}
```

### 3.6 家长控制API (/api/parent)

#### 3.6.1 绑定儿童账户
- **URL**: `/api/parent?action=bind`
- **Method**: POST
- **Request Body**:
```json
{
    "parent_id": "string",
    "child_username": "string"
}
```
- **Response**:
```json
{
    "success": true
}
```

#### 3.6.2 设置控制规则
- **URL**: `/api/parent?action=settings`
- **Method**: POST
- **Request Body**:
```json
{
    "parent_id": "string",
    "child_id": "string",
    "daily_time_limit": 60,
    "allowed_start_hour": 8,
    "allowed_end_hour": 21,
    "break_reminder_interval": 30,
    "content_filter_level": "low|medium|high"
}
```
- **Response**:
```json
{
    "success": true
}
```

#### 3.6.3 获取使用统计
- **URL**: `/api/parent?action=stats&child_id={child_id}`
- **Method**: GET
- **Response**:
```json
{
    "success": true,
    "stats": {
        "total_time": 120,
        "stories_created": 5,
        "books_created": 2,
        "daily_usage": [
            {
                "date": "string",
                "duration": 30
            }
        ]
    }
}
```

### 3.7 图生图API (/api/generate)

#### 3.7.1 生成乐高风格图片
- **URL**: `/api/generate`
- **Method**: POST
- **Request Body**:
```json
{
    "image": "base64_string",
    "prompt": "LEGO style character"
}
```
- **Response**:
```json
{
    "success": true,
    "imageUrl": "string"
}
```

### 3.8 语音识别API (/api/speech)

#### 3.8.1 语音转文字
- **URL**: `/api/speech`
- **Method**: POST
- **Request Body**: FormData with audio file
- **Response**:
```json
{
    "success": true,
    "text": "string"
}
```

## 4. 页面设计

### 4.1 主页 (/)
- 展示项目介绍
- 快速入口按钮
- 特色功能展示

### 4.2 故事创作页面 (/story-create)
- 步骤导航条
- 书籍选择/创建步骤
- 角色选择步骤
- 情节选择步骤
- 故事生成步骤
- 故事预览区域

### 4.3 书架页面 (/bookshelf)
- 书籍网格展示
- 书籍卡片（封面、标题、章节数）
- 创建新书按钮
- 搜索/筛选功能

### 4.4 书籍详情页面 (/book)
- 书籍标题
- 章节列表
- 阅读模式
- 章节导航
- 继续生成按钮

### 4.5 人仔管理页面 (/characters)
- 预设人仔展示
- 自定义人仔列表
- 创建人仔按钮
- 人仔编辑/删除

### 4.6 冒险工坊页面 (/adventure)
- 预设情节展示
- 自定义情节输入
- 语音输入按钮

### 4.7 家长控制页面 (/parent)
- 儿童账户绑定
- 使用时长设置
- 时段限制设置
- 内容过滤设置
- 使用统计查看

### 4.8 分享访问页面 (/share)
- 分享链接展示
- 二维码展示
- 密码输入（私密分享）
- 书籍内容展示

### 4.9 登录页面 (/login)
- 用户名/密码登录
- 注册入口
- 第三方登录（可选）

## 5. 组件设计

### 5.1 布局组件
- `Layout`: 主布局容器
- `Navbar`: 导航栏
- `Sidebar`: 侧边栏
- `Footer`: 页脚

### 5.2 UI基础组件
- `Button`: 按钮组件
- `Input`: 输入框组件
- `Select`: 下拉选择组件
- `Modal`: 弹窗组件
- `Card`: 卡片组件
- `Toast`: 提示组件
- `Loading`: 加载组件
- `StepIndicator`: 步骤指示器

### 5.3 故事相关组件
- `StoryDisplay`: 故事展示组件
- `CharacterSelector`: 角色选择组件
- `PlotSelector`: 情节选择组件
- `VoiceInput`: 语音输入组件
- `KeywordHighlight`: 关键词高亮组件

### 5.4 书籍相关组件
- `BookCard`: 书籍卡片组件
- `BookList`: 书籍列表组件
- `ChapterList`: 章节列表组件
- `ChapterReader`: 章节阅读组件

### 5.5 人仔相关组件
- `CharacterCard`: 人仔卡片组件
- `CharacterList`: 人仔列表组件
- `CharacterCreateModal`: 创建人仔弹窗
- `CharacterImage`: 人仔图片组件

### 5.6 共享组件
- `ShareModal`: 分享弹窗
- `QRCode`: 二维码组件
- `ParentControlPanel`: 家长控制面板

## 6. 状态管理

### 6.1 全局状态
- 用户信息状态
- 认证状态
- 主题状态

### 6.2 页面状态
- 故事创作步骤状态
- 书籍列表状态
- 人仔列表状态

### 6.3 使用React Context + useReducer进行状态管理

## 7. 安全设计

### 7.1 认证机制
- 使用JWT Token进行用户认证
- Token存储在localStorage
- 每次API请求携带Token

### 7.2 数据隔离
- 所有数据操作基于user_id
- 用户只能访问自己的数据
- 家长可访问绑定儿童的数据

### 7.3 内容过滤
- 敏感词过滤
- 暴力内容检测
- 年龄分级控制

## 8. 性能优化

### 8.1 前端优化
- 静态资源CDN加速
- 图片懒加载
- 代码分割
- 缓存策略

### 8.2 API优化
- 请求合并
- 响应缓存
- 错误重试机制

### 8.3 数据库优化
- 索引优化
- 查询优化
- 分页查询
