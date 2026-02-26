# 乐高故事书项目接口文档

## 文档说明

本文档详细描述了乐高故事书项目的所有API接口。阅读本文档后，您将了解：
- 系统提供了哪些接口
- 每个接口的业务用途
- 如何调用这些接口
- 接口之间的关联关系

---

## 第一部分：接口概览

### 1.1 接口分类

系统接口按业务模块分为以下几类：

| 模块 | 接口数量 | 主要用途 |
|------|----------|----------|
| 用户管理 | 3个 | 登录、查询用户信息、更新用户信息 |
| 书籍管理 | 4个 | 创建书籍、查询书籍、删除书籍、分享书籍 |
| 章节管理 | 3个 | 生成章节、查询章节列表、查询章节详情 |
| 角色管理 | 4个 | 创建角色、查询角色、更新角色、删除角色 |
| 谜题管理 | 2个 | 查询谜题、验证答案 |
| 其他功能 | 3个 | 语音识别、图片生成、情节选项 |

### 1.2 接口调用基础信息

| 项目 | 说明 |
|------|------|
| 基础URL | https://your-domain.pages.dev |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | 通过请求参数传递用户ID |

### 1.3 通用响应格式

**成功响应**：
```
{
  "success": true,
  "data": { ... 具体数据 ... }
}
```

**失败响应**：
```
{
  "success": false,
  "error": "错误原因描述"
}
```

---

## 第二部分：用户管理接口

### 2.1 用户登录/注册接口

**接口名称**：用户登录或创建新用户

**业务场景**：
- 用户在登录页面输入用户名后点击"开始冒险"时调用
- 如果用户名已存在，则登录成功
- 如果用户名不存在，则自动创建新用户

**请求方式**：POST

**请求路径**：/api/users

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | 字符串 | 是 | 用户名，最多20个字符 |
| email | 字符串 | 否 | 邮箱地址，目前未使用 |
| parentId | 字符串 | 否 | 家长账号ID，目前未使用 |

**请求示例**：
```
POST /api/users
Content-Type: application/json

{
  "username": "小明"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| userId | 字符串 | 用户唯一标识，格式为"id_xxx_xxx" |
| message | 字符串 | 提示信息 |
| isNewUser | 布尔 | 是否是新创建的用户 |

**响应示例（新用户）**：
```
{
  "success": true,
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "message": "用户创建成功",
  "isNewUser": true
}
```

**响应示例（已存在用户）**：
```
{
  "success": true,
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "message": "登录成功",
  "isNewUser": false
}
```

**业务规则**：
1. 用户名不能为空，否则返回错误
2. 用户名不能超过20个字符
3. 同一用户名只能创建一个账号
4. 用户ID由系统自动生成，格式为"id_时间戳_随机字符串"

---

### 2.2 查询用户信息接口

**接口名称**：获取用户详细信息

**业务场景**：
- 用户进入设置页面时调用
- 需要显示用户信息时调用

**请求方式**：GET

**请求路径**：/api/users

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | 字符串 | 是 | 用户ID |

**请求示例**：
```
GET /api/users?userId=id_mm1s9h2e_oujn2xo9g
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| user | 对象 | 用户信息对象 |
| user.user_id | 字符串 | 用户ID |
| user.username | 字符串 | 用户名 |
| user.email | 字符串 | 邮箱（可能为空） |
| user.avatar | 字符串 | 头像（目前为空） |
| user.daily_time_limit | 数字 | 每日时间限制（分钟），默认120 |
| user.time_used_today | 数字 | 今日已用时间（分钟），默认0 |

**响应示例**：
```
{
  "success": true,
  "user": {
    "user_id": "id_mm1s9h2e_oujn2xo9g",
    "username": "小明",
    "email": null,
    "avatar": null,
    "daily_time_limit": 120,
    "time_used_today": 0,
    "created_at": "2026-02-26T10:00:00Z"
  }
}
```

---

### 2.3 更新用户信息接口

**接口名称**：修改用户信息

**业务场景**：
- 用户在设置页面修改自己的信息时调用

**请求方式**：PUT

**请求路径**：/api/users

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | 字符串 | 是 | 用户ID |
| username | 字符串 | 否 | 新用户名 |
| email | 字符串 | 否 | 新邮箱 |

**请求示例**：
```
PUT /api/users
Content-Type: application/json

{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "username": "小明同学"
}
```

**响应示例**：
```
{
  "success": true,
  "message": "用户信息更新成功"
}
```

---

## 第三部分：书籍管理接口

### 3.1 创建书籍接口

**接口名称**：创建新的故事书籍

**业务场景**：
- 用户在"创建故事"流程的第一步调用
- 用户输入书名后点击创建

**请求方式**：POST

**请求路径**：/api/books

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | 字符串 | 是 | 用户ID |
| title | 字符串 | 是 | 书籍标题，最多50个字符 |

**请求示例**：
```
POST /api/books
Content-Type: application/json

{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "title": "我的冒险故事"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| bookId | 字符串 | 新创建的书籍ID |
| message | 字符串 | 提示信息 |

**响应示例**：
```
{
  "success": true,
  "bookId": "id_book001",
  "message": "书籍创建成功"
}
```

**业务规则**：
1. 书名不能为空
2. 书名不能超过50个字符
3. 每个用户最多创建20本书籍
4. 超过限制时返回错误："每用户最多创建20本书籍"

---

### 3.2 查询书籍列表接口

**接口名称**：获取用户的所有书籍

**业务场景**：
- 用户进入"我的书架"页面时调用
- 显示用户创建的所有书籍

**请求方式**：GET

**请求路径**：/api/books

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | 字符串 | 是 | 用户ID |

**请求示例**：
```
GET /api/books?userId=id_mm1s9h2e_oujn2xo9g
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| books | 数组 | 书籍列表 |
| books[].book_id | 字符串 | 书籍ID |
| books[].title | 字符串 | 书籍标题 |
| books[].chapter_count | 数字 | 章节数量 |
| books[].status | 字符串 | 状态：active（正常）/ archived（已归档） |
| books[].created_at | 字符串 | 创建时间 |

**响应示例**：
```
{
  "success": true,
  "books": [
    {
      "book_id": "id_book001",
      "title": "我的冒险故事",
      "chapter_count": 5,
      "status": "active",
      "created_at": "2026-02-26T10:00:00Z"
    },
    {
      "book_id": "id_book002",
      "title": "魔法奇遇记",
      "chapter_count": 3,
      "status": "active",
      "created_at": "2026-02-25T15:30:00Z"
    }
  ]
}
```

---

### 3.3 查询书籍详情接口

**接口名称**：获取单本书籍的详细信息

**业务场景**：
- 用户点击书架中的某本书时调用
- 显示书籍的详细信息和章节列表

**请求方式**：GET

**请求路径**：/api/books

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bookId | 字符串 | 是 | 书籍ID |

**请求示例**：
```
GET /api/books?bookId=id_book001
```

**响应示例**：
```
{
  "success": true,
  "book": {
    "book_id": "id_book001",
    "user_id": "id_mm1s9h2e_oujn2xo9g",
    "title": "我的冒险故事",
    "chapter_count": 5,
    "status": "active",
    "created_at": "2026-02-26T10:00:00Z"
  }
}
```

---

### 3.4 删除书籍接口

**接口名称**：归档书籍（软删除）

**业务场景**：
- 用户在书架页面点击删除按钮时调用
- 注意：这是软删除，书籍状态变为"archived"，数据仍保留

**请求方式**：DELETE

**请求路径**：/api/books

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | 字符串 | 是 | 书籍ID |

**请求示例**：
```
DELETE /api/books?id=id_book001
```

**响应示例**：
```
{
  "success": true,
  "message": "书籍已归档"
}
```

---

## 第四部分：章节管理接口

### 4.1 生成章节接口

**接口名称**：AI生成新的故事章节

**业务场景**：
- 用户在创建故事的最后一步调用（生成第一章）
- 用户在书籍详情页点击"生成下一章"时调用
- 这是系统最核心的接口，调用AI生成故事

**请求方式**：POST

**请求路径**：/api/chapters-generate

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bookId | 字符串 | 是（URL参数） | 书籍ID |
| userId | 字符串 | 是（请求体） | 用户ID |
| characterIds | 数组 | 否 | 参与本章的角色ID列表 |
| plotSelection | 对象 | 否 | 用户选择的情节要素 |

**请求示例**：
```
POST /api/chapters-generate?bookId=id_book001
Content-Type: application/json

{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "characterIds": ["id_char001", "id_char002"],
  "plotSelection": {
    "weather": "晴天",
    "terrain": "森林",
    "adventureType": "探险",
    "equipment": "指南针"
  }
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| chapterId | 字符串 | 新章节的ID |
| chapterNumber | 数字 | 章节序号 |
| title | 字符串 | 章节标题 |
| hasPuzzle | 布尔 | 是否有谜题 |
| message | 字符串 | 提示信息 |

**响应示例**：
```
{
  "success": true,
  "chapterId": "id_chapter001",
  "chapterNumber": 1,
  "title": "神秘的开始",
  "hasPuzzle": true,
  "message": "章节生成成功"
}
```

**业务规则**：
1. 书籍必须至少有一个角色才能生成章节
2. 每本书最多100章
3. 生成时间约5-15秒（取决于AI服务响应）
4. AI会根据前一章内容和用户选择生成连贯的故事

**AI生成过程说明**：

| 步骤 | 说明 |
|------|------|
| 1. 收集上下文 | 获取书籍角色、前一章内容、前一章谜题结果 |
| 2. 构建提示词 | 组装角色信息、故事要求、谜题类型 |
| 3. 调用AI服务 | 发送请求到豆包大语言模型 |
| 4. 解析响应 | 提取标题、内容、谜题信息 |
| 5. 保存数据 | 存储章节和谜题到数据库 |

---

### 4.2 查询章节列表接口

**接口名称**：获取书籍的所有章节

**业务场景**：
- 用户进入书籍详情页时调用
- 显示左侧的章节列表

**请求方式**：GET

**请求路径**：/api/chapters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| book_id | 字符串 | 是 | 书籍ID |

**请求示例**：
```
GET /api/chapters?book_id=id_book001
```

**响应示例**：
```
{
  "success": true,
  "chapters": [
    {
      "chapter_id": "id_chapter001",
      "chapter_number": 1,
      "title": "神秘的开始",
      "has_puzzle": 1,
      "created_at": "2026-02-26T10:00:00Z"
    },
    {
      "chapter_id": "id_chapter002",
      "chapter_number": 2,
      "title": "森林探险",
      "has_puzzle": 1,
      "created_at": "2026-02-26T10:05:00Z"
    }
  ]
}
```

---

### 4.3 查询章节详情接口

**接口名称**：获取单个章节的完整内容

**业务场景**：
- 用户点击章节列表中的某章时调用
- 显示章节内容和谜题

**请求方式**：GET

**请求路径**：/api/chapters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| chapterId | 字符串 | 是 | 章节ID |

**请求示例**：
```
GET /api/chapters?chapterId=id_chapter001
```

**响应示例**：
```
{
  "success": true,
  "chapter": {
    "chapter_id": "id_chapter001",
    "book_id": "id_book001",
    "chapter_number": 1,
    "title": "神秘的开始",
    "content": "在一个阳光明媚的早晨，勇敢的骑士小明踏上了他的冒险之旅...",
    "has_puzzle": 1,
    "created_at": "2026-02-26T10:00:00Z"
  }
}
```

---

## 第五部分：角色管理接口

### 5.1 查询角色列表接口

**接口名称**：获取所有可用角色

**业务场景**：
- 用户进入"人仔角色"页面时调用
- 用户在创建故事选择角色时调用

**请求方式**：GET

**请求路径**：/api/characters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | 字符串 | 是 | 用户ID |

**请求示例**：
```
GET /api/characters?userId=id_mm1s9h2e_oujn2xo9g
```

**响应示例**：
```
{
  "success": true,
  "characters": [
    {
      "character_id": "id_char_system_001",
      "name": "勇敢骑士",
      "description": "一位勇敢的骑士，保护弱小",
      "personality": "勇敢、正义",
      "speaking_style": "正式、有礼貌",
      "creator_id": "system"
    },
    {
      "character_id": "id_char_user_001",
      "name": "我的角色",
      "description": "我自己创建的角色",
      "personality": "聪明、机智",
      "speaking_style": "幽默",
      "creator_id": "id_mm1s9h2e_oujn2xo9g"
    }
  ]
}
```

**业务规则**：
- 返回系统预设角色（creator_id为"system"）
- 返回用户自己创建的角色（creator_id为用户ID）
- 预设角色不可编辑删除
- 用户角色可编辑删除

---

### 5.2 创建角色接口

**接口名称**：创建自定义角色

**业务场景**：
- 用户在"人仔角色"页面点击"创建新人仔"时调用

**请求方式**：POST

**请求路径**：/api/characters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | 字符串 | 是 | 角色名称，最多20字符 |
| description | 字符串 | 否 | 角色描述，最多200字符 |
| personality | 字符串 | 否 | 性格特点，最多100字符 |
| speaking_style | 字符串 | 否 | 说话风格，最多100字符 |
| creator_id | 字符串 | 是 | 创建者用户ID |

**请求示例**：
```
POST /api/characters
Content-Type: application/json

{
  "name": "超级英雄",
  "description": "一个拥有超能力的英雄",
  "personality": "勇敢、善良、正义",
  "speaking_style": "自信、有力",
  "creator_id": "id_mm1s9h2e_oujn2xo9g"
}
```

**响应示例**：
```
{
  "success": true,
  "characterId": "id_char_user_002",
  "message": "角色创建成功"
}
```

---

### 5.3 更新角色接口

**接口名称**：修改自定义角色

**业务场景**：
- 用户在"人仔角色"页面编辑自己创建的角色时调用

**请求方式**：PUT

**请求路径**：/api/characters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| characterId | 字符串 | 是 | 角色ID |
| name | 字符串 | 否 | 新名称 |
| description | 字符串 | 否 | 新描述 |
| personality | 字符串 | 否 | 新性格 |
| speaking_style | 字符串 | 否 | 新说话风格 |

**请求示例**：
```
PUT /api/characters
Content-Type: application/json

{
  "characterId": "id_char_user_001",
  "name": "超级英雄改版",
  "personality": "更加勇敢"
}
```

**业务规则**：
- 只能修改自己创建的角色
- 不能修改系统预设角色

---

### 5.4 删除角色接口

**接口名称**：删除自定义角色

**业务场景**：
- 用户在"人仔角色"页面删除自己创建的角色时调用

**请求方式**：DELETE

**请求路径**：/api/characters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | 字符串 | 是 | 角色ID |

**请求示例**：
```
DELETE /api/characters?id=id_char_user_001
```

**业务规则**：
- 只能删除自己创建的角色
- 不能删除系统预设角色
- 删除前应检查角色是否在故事中使用

---

## 第六部分：谜题管理接口

### 6.1 查询谜题接口

**接口名称**：获取章节的谜题

**业务场景**：
- 用户阅读完章节后点击"去解谜"时调用
- 显示谜题供用户解答

**请求方式**：GET

**请求路径**：/api/puzzle

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| puzzleId | 字符串 | 是 | 谜题ID |
| chapterId | 字符串 | 否 | 章节ID（可选，用于查询章节谜题） |

**请求示例**：
```
GET /api/puzzle?puzzleId=id_puzzle001
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| puzzle | 对象 | 谜题信息 |
| puzzle.puzzle_id | 字符串 | 谜题ID |
| puzzle.question | 字符串 | 谜题问题 |
| puzzle.options | 数组 | 四个选项 |
| puzzle.hint | 字符串 | 提示（可能为空） |
| puzzle.puzzle_type | 字符串 | 谜题类型 |

**响应示例**：
```
{
  "success": true,
  "puzzle": {
    "puzzle_id": "id_puzzle001",
    "question": "下一个数字是什么？1, 2, 4, 7, 11, ?",
    "options": ["15", "16", "17", "18"],
    "hint": "观察相邻数字的差值变化",
    "puzzle_type": "pattern"
  }
}
```

**注意**：响应中不包含正确答案，防止泄露。

---

### 6.2 验证答案接口

**接口名称**：验证用户提交的谜题答案

**业务场景**：
- 用户在解谜界面选择答案后点击提交时调用

**请求方式**：POST

**请求路径**：/api/puzzle

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| puzzleId | 字符串 | 是 | 谜题ID |
| userId | 字符串 | 是 | 用户ID |
| userAnswer | 字符串 | 是 | 用户答案（A/B/C/D） |

**请求示例**：
```
POST /api/puzzle
Content-Type: application/json

{
  "puzzleId": "id_puzzle001",
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "userAnswer": "B"
}
```

**响应参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | 布尔 | 是否成功 |
| isCorrect | 布尔 | 答案是否正确 |
| attempts | 数字 | 已尝试次数 |
| attemptsRemaining | 数字 | 剩余尝试次数 |
| hint | 字符串 | 提示（第2次错误后返回） |
| message | 字符串 | 提示信息 |

**响应示例（正确）**：
```
{
  "success": true,
  "isCorrect": true,
  "attempts": 1,
  "attemptsRemaining": 2,
  "hint": null,
  "message": "答对了！你真聪明！"
}
```

**响应示例（错误，第1次）**：
```
{
  "success": true,
  "isCorrect": false,
  "attempts": 1,
  "attemptsRemaining": 2,
  "hint": null,
  "message": "答案错误，再想想看"
}
```

**响应示例（错误，第2次）**：
```
{
  "success": true,
  "isCorrect": false,
  "attempts": 2,
  "attemptsRemaining": 1,
  "hint": "观察相邻数字的差值变化",
  "message": "答案错误，给你一个提示吧"
}
```

**业务规则**：
1. 每道谜题最多尝试3次
2. 第2次错误后显示提示
3. 3次全错后显示正确答案
4. 答题记录保存在数据库中

---

## 第七部分：其他功能接口

### 7.1 书籍角色关联接口

**接口名称**：将角色添加到书籍中

**业务场景**：
- 用户在创建故事选择角色后调用
- 将选中的角色与书籍关联

**请求方式**：POST

**请求路径**：/api/book-characters

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bookId | 字符串 | 是 | 书籍ID |
| characterId | 字符串 | 是 | 角色ID |
| customName | 字符串 | 否 | 角色在故事中的自定义名称 |
| roleType | 字符串 | 否 | 角色类型：protagonist（主角）/supporting（配角）/antagonist（反派）/npc（路人） |

---

### 7.2 分享接口

**接口名称**：创建书籍分享链接

**业务场景**：
- 用户想要分享自己的故事给朋友时调用

**请求方式**：POST

**请求路径**：/api/share

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bookId | 字符串 | 是 | 书籍ID |
| userId | 字符串 | 是 | 用户ID |

**响应示例**：
```
{
  "success": true,
  "shareCode": "abc123",
  "shareUrl": "https://your-domain/share.html?code=abc123"
}
```

---

### 7.3 情节选项接口

**接口名称**：获取可用的情节选项

**业务场景**：
- 用户在生成新章节前选择情节要素时调用
- 提供天气、地形、冒险类型等选项

**请求方式**：GET

**请求路径**：/api/plot-options

**响应示例**：
```
{
  "success": true,
  "options": {
    "weather": ["晴天", "阴天", "雨天", "雪天", "雾天"],
    "terrain": ["森林", "沙漠", "海洋", "山脉", "城市"],
    "adventureType": ["探险", "解谜", "战斗", "社交", "收集"],
    "equipment": ["指南针", "地图", "宝剑", "魔法棒", "盾牌"]
  }
}
```

---

## 第八部分：错误码说明

| HTTP状态码 | 错误信息 | 原因 | 解决方法 |
|------------|----------|------|----------|
| 400 | 用户ID不能为空 | 未提供userId参数 | 确保请求包含userId |
| 400 | 用户名不能为空 | 未提供username参数 | 确保请求包含username |
| 400 | 用户名不能超过20个字符 | username长度超限 | 限制用户名长度 |
| 400 | 书籍名称不能为空 | 未提供title参数 | 确保请求包含title |
| 400 | 书籍名称不能超过50个字符 | title长度超限 | 限制书名长度 |
| 400 | 每用户最多创建20本书籍 | 达到书籍数量上限 | 删除不需要的书籍 |
| 400 | 单本书籍最多100章 | 达到章节数量上限 | 创建新书籍 |
| 400 | 请先添加角色 | 书籍没有关联角色 | 先添加角色再生成章节 |
| 404 | 用户不存在 | userId无效 | 使用正确的userId |
| 404 | 书籍不存在 | bookId无效 | 使用正确的bookId |
| 404 | 谜题不存在 | puzzleId无效 | 使用正确的puzzleId |
| 500 | AI服务暂时不可用 | 豆包API调用失败 | 稍后重试 |
| 500 | AI返回格式错误 | AI返回数据解析失败 | 稍后重试 |

---

## 附录：接口调用流程示例

### 完整创建故事流程

```
1. 用户登录
   POST /api/users {username: "小明"}
   响应: {userId: "id_xxx"}

2. 创建书籍
   POST /api/books {userId: "id_xxx", title: "我的冒险"}
   响应: {bookId: "id_book001"}

3. 查询角色
   GET /api/characters?userId=id_xxx
   响应: {characters: [...]}

4. 关联角色到书籍
   POST /api/book-characters {bookId: "id_book001", characterId: "id_char001"}

5. 生成第一章
   POST /api/chapters-generate?bookId=id_book001 {userId: "id_xxx"}
   响应: {chapterId: "id_chapter001"}

6. 查询章节内容
   GET /api/chapters?chapterId=id_chapter001
   响应: {chapter: {...}}

7. 查询谜题
   GET /api/puzzle?puzzleId=id_puzzle001
   响应: {puzzle: {...}}

8. 验证答案
   POST /api/puzzle {puzzleId: "id_puzzle001", userId: "id_xxx", userAnswer: "A"}
   响应: {isCorrect: true}
```
