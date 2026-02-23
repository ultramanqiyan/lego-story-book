# 乐高故事书籍功能 - 技术规范文档

## 一、项目概述

### 1.1 项目背景
创建一个乐高小镇故事书籍功能，让用户可以创建、管理和阅读自己的乐高主题故事书籍。

### 1.2 目标用户
- 主要用户：儿童（6-12 岁）
- 次要用户：家长辅助创作

### 1.3 核心价值
- 激发儿童创造力和想象力
- 提供个性化的故事创作体验
- 培养儿童的叙事能力
- 通过互动解密增强学习趣味性

---

## 二、技术架构

### 2.1 部署架构
```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
├─────────────────────────────────────────────────────────────┤
│  静态资源 (HTML/CSS/JS)                                      │
│  ├── /                      主页                             │
│  ├── /story-create          故事制作页面                     │
│  ├── /bookshelf             书架页面                         │
│  ├── /book                  书籍详情页面                     │
│  ├── /characters            人仔管理页面                     │
│  ├── /adventure             冒险工坊页面                     │
│  ├── /parent                家长控制页面                     │
│  ├── /share                 分享访问页面                     │
│  └── /login                 用户登录页面                     │
├─────────────────────────────────────────────────────────────┤
│  Page Functions (functions/api/*.js)                        │
│  ├── /api/speech            语音识别                         │
│  ├── /api/generate          图片生成                         │
│  ├── /api/story             故事生成                         │
│  ├── /api/books             书籍管理                         │
│  ├── /api/chapters          章节管理                         │
│  ├── /api/characters        人仔管理                         │
│  ├── /api/puzzle            谜题验证                         │
│  └── /api/share             分享管理                         │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare D1 数据库                                        │
│  ├── users                  用户表                           │
│  ├── characters             人仔表                           │
│  ├── books                  书籍表                           │
│  ├── chapters               章节表                           │
│  ├── book_characters        书籍角色关联表                   │
│  ├── puzzles                谜题表                           │
│  ├── puzzle_records         答题记录表                       │
│  └── shares                 分享表                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈
- **前端**: 原生 HTML/CSS/JavaScript（无框架）
- **后端**: Cloudflare Page Functions
- **数据库**: Cloudflare D1 (SQLite)
- **AI服务**: 
  - 火山引擎 Doubao API（文本生成）
  - 火山引擎 Seedream API（图片生成）
  - SiliconFlow API（语音识别）
- **代码托管**: GitHub
- **部署平台**: Cloudflare Pages

---

## 三、数据库设计

### 3.1 用户表 (users)
```sql
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  parent_id TEXT,
  daily_time_limit INTEGER DEFAULT 120,
  time_used_today INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 人仔表 (characters)
```sql
CREATE TABLE characters (
  character_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_base64 TEXT,
  description TEXT,
  personality TEXT,
  speaking_style TEXT,
  creator_id TEXT DEFAULT 'system',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 书籍表 (books)
```sql
CREATE TABLE books (
  book_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  chapter_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### 3.4 章节表 (chapters)
```sql
CREATE TABLE chapters (
  chapter_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  has_puzzle INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);
```

### 3.5 书籍角色关联表 (book_characters)
```sql
CREATE TABLE book_characters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  custom_name TEXT NOT NULL,
  role_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (character_id) REFERENCES characters(character_id)
);
```

### 3.6 谜题表 (puzzles)
```sql
CREATE TABLE puzzles (
  puzzle_id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT,
  puzzle_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id)
);
```

### 3.7 答题记录表 (puzzle_records)
```sql
CREATE TABLE puzzle_records (
  record_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  puzzle_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL,
  attempts INTEGER DEFAULT 1,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id)
);
```

### 3.8 分享表 (shares)
```sql
CREATE TABLE shares (
  share_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  share_code TEXT UNIQUE NOT NULL,
  password TEXT,
  is_public INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## 四、API 接口设计

### 4.1 故事生成 API
**路径**: `/api/story`
**方法**: POST
**功能**: 根据角色和情节生成故事

```javascript
// 请求体
{
  "bookId": "书籍ID",
  "characterIds": ["角色ID数组"],
  "customNames": {"角色ID": "自定义名称"},
  "roleTypes": {"角色ID": "角色类型"},
  "plotId": "情节ID",
  "customPlot": "自定义情节描述"
}

// 响应体
{
  "success": true,
  "chapter": {
    "chapterId": "章节ID",
    "title": "章节名称",
    "content": "故事内容",
    "puzzle": {
      "question": "谜题问题",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "answer": "B",
      "hint": "提示内容",
      "type": "pattern"
    }
  }
}
```

### 4.2 谜题验证 API
**路径**: `/api/puzzle/verify`
**方法**: POST
**功能**: 验证用户答题

```javascript
// 请求体
{
  "puzzleId": "谜题ID",
  "userAnswer": "A"
}

// 响应体
{
  "success": true,
  "isCorrect": true,
  "message": "答对了！",
  "attemptsRemaining": 3
}
```

### 4.3 书籍管理 API
**路径**: `/api/books`
**方法**: GET/POST/PUT/DELETE
**功能**: 书籍 CRUD 操作

### 4.4 章节管理 API
**路径**: `/api/chapters`
**方法**: GET/POST/PUT/DELETE
**功能**: 章节 CRUD 操作

### 4.5 人仔管理 API
**路径**: `/api/characters`
**方法**: GET/POST/PUT/DELETE
**功能**: 人仔 CRUD 操作

### 4.6 分享管理 API
**路径**: `/api/share`
**方法**: POST/GET/DELETE
**功能**: 分享链接管理

---

## 五、前端页面设计

### 5.1 页面结构
```
/
├── index.html              主页
├── story-create.html       故事制作页面
├── bookshelf.html          书架页面
├── book.html               书籍详情页面
├── characters.html         人仔管理页面
├── adventure.html          冒险工坊页面
├── parent.html             家长控制页面
├── share.html              分享访问页面
├── login.html              用户登录页面
├── css/
│   ├── common.css          公共样式
│   ├── lego-theme.css      乐高主题样式
│   └── components.css      组件样式
├── js/
│   ├── common.js           公共函数
│   ├── api.js              API 调用封装
│   ├── auth.js             认证相关
│   └── components.js       组件封装
└── assets/
    └── images/             静态图片资源
```

### 5.2 乐高风格设计规范
- **颜色**: 鲜艳的红、黄、蓝、绿为主色调
- **边框**: 圆角边框 (border-radius: 8px-16px)
- **阴影**: 盒阴影效果 (box-shadow)
- **按钮**: 积木风格按钮，有立体感
- **字体**: 清晰易读，适合儿童

---

## 六、AI 功能实现

### 6.1 文本生成 (Doubao API)
- **接口**: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
- **模型**: `doubao-1-5-pro-32k-250115`
- **功能**: 故事生成、章节名称生成、谜题生成

### 6.2 图片生成 (Seedream API)
- **接口**: `https://ark.cn-beijing.volces.com/api/v3/images/generations`
- **模型**: `doubao-seedream-4-0-250828`
- **功能**: 乐高风格人仔图片生成

### 6.3 语音识别 (SiliconFlow API)
- **接口**: `https://api.siliconflow.cn/v1/audio/transcriptions`
- **模型**: `FunAudioLLM/SenseVoiceSmall`
- **功能**: 语音转文字，支持情节语音输入

---

## 七、性能需求指标

| 指标 | 要求 |
|------|------|
| 页面加载时间 | < 3秒 |
| API 响应时间 | < 2秒（非AI接口） |
| 故事生成时间 | < 30秒 |
| 图片生成时间 | < 60秒 |
| 语音识别时间 | < 10秒 |

---

## 八、安全要求

### 8.1 数据安全
- 敏感信息通过环境变量配置
- API Key 不硬编码在代码中
- 数据库查询使用参数化查询

### 8.2 内容安全
- 敏感词过滤
- 暴力内容过滤
- 年龄分级

### 8.3 访问控制
- 用户身份验证
- 家长控制功能
- 分享权限管理

---

## 九、兼容性要求

### 9.1 浏览器兼容
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 9.2 移动端适配
- 响应式设计
- 触摸操作支持
- 移动端布局优化

---

## 十、开发规范

### 10.1 代码规范
- ESLint 代码检查
- 单文件不超过 800 行
- 单函数不超过 50 行
- 高内聚低耦合

### 10.2 测试规范
- 单元测试覆盖率 > 90%
- 行覆盖率 >= 95%
- 所有测试必须通过
- 测试断言验证内容符合预期

### 10.3 部署规范
- 仅使用 Cloudflare Pages
- 仅使用 Cloudflare D1 数据库
- 仅使用静态路由
- 代码提交到 GitHub 自动部署
