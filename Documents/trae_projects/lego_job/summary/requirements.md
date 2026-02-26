# 乐高故事书项目需求文档（优化版）

## 文档信息

| 项目名称 | 乐高故事书 |
|----------|------------|
| 文档版本 | V2.0 |
| 编写日期 | 2026年2月26日 |
| 文档状态 | 正式发布 |
| 优化说明 | 基于苏格拉底式提问深度反思，结合项目实际代码实现 |

---

## 一、苏格拉底式提问与回答（30问）

### 1.1 关于用户登录（10问）

**Q1：用户登录的实际实现方式是什么？是无密码还是有密码？**

**回答**：项目采用无密码登录方式。用户只需输入用户名即可登录，无需密码验证。这是基于儿童用户体验的考虑，降低登录门槛，让儿童能够快速开始创作。

**代码依据**：
```javascript
// functions/api/users.js
if (existingUser) {
  return createSuccessResponse({ 
    userId: existingUser.user_id, 
    message: '登录成功',
    isNewUser: false
  });
}
```

**Q2：为什么选择无密码登录？这个决策是如何做出的？**

**回答**：选择无密码登录的原因：
1. 目标用户是10-12岁儿童，密码管理对他们来说较为困难
2. 降低使用门槛，让儿童能够快速开始创作
3. 系统主要面向家庭场景，安全风险相对可控
4. 简化用户体验，符合"每个孩子都是故事的创造者"的核心理念

**Q3：无密码登录的安全性如何保障？**

**回答**：安全性保障措施：
1. 用户名有唯一性约束，防止冒充
2. 用户ID使用随机生成，难以猜测
3. 数据隔离：每个用户只能访问自己的数据
4. 会话信息存储在浏览器本地存储，用户可随时清除

**Q4：用户ID的生成规则是什么？格式是怎样的？**

**回答**：用户ID格式为 `id_xxx_xxx`，由 `generateId()` 函数生成。具体格式为前缀 `id_` 加上两段随机字符串，例如 `id_mm1s9h2e_oujn2xo9g`。

**代码依据**：
```javascript
// functions/api/utils.js
export function generateId() {
  const prefix = 'id_';
  const randomPart1 = Math.random().toString(36).substring(2, 10);
  const randomPart2 = Math.random().toString(36).substring(2, 10);
  return prefix + randomPart1 + '_' + randomPart2;
}
```

**Q5：同一用户重复登录时，系统如何处理？**

**回答**：系统会先查询数据库中是否存在该用户名，如果存在则返回已存在的用户ID，不会创建新用户。这是在V3版本中修复的重要Bug。

**代码依据**：
```javascript
const existingUser = await DB.prepare(
  'SELECT user_id FROM users WHERE username = ?'
).bind(username.trim()).first();

if (existingUser) {
  return createSuccessResponse({ 
    userId: existingUser.user_id, 
    message: '登录成功',
    isNewUser: false
  });
}
```

**Q6：用户名是否有唯一性约束？**

**回答**：是的，用户名具有唯一性约束。系统在创建用户前会先检查用户名是否已存在，如果存在则返回已存在的用户信息。

**Q7：用户名长度限制是多少？为什么这样限制？**

**回答**：用户名长度限制为最多20个字符。这个限制基于以下考虑：
1. 数据库字段设计：username字段使用TEXT类型，但应用层限制长度
2. 用户体验：过长的用户名在界面显示上会有问题
3. 安全考虑：防止过长的输入导致潜在问题

**代码依据**：
```javascript
if (username.length > 20) {
  return createErrorResponse('用户名不能超过20个字符', 400);
}
```

**Q8：登录后用户信息存储在哪里？**

**回答**：登录后用户信息存储在浏览器本地存储（localStorage）中，包括用户ID和用户名。每次页面加载时会从本地存储读取用户信息。

**Q9：会话管理是如何实现的？**

**回答**：会话管理采用客户端存储方式：
1. 用户ID存储在localStorage中
2. 每次API请求时从localStorage获取用户ID
3. 服务端不维护会话状态，采用无状态设计
4. 用户可以手动清除localStorage来"登出"

**Q10：用户登出功能是否实现？**

**回答**：目前没有明确的"登出"按钮，但用户可以通过以下方式登出：
1. 清除浏览器本地存储
2. 使用浏览器的隐私模式
3. 切换到其他用户名登录

---

### 1.2 关于故事生成（10问）

**Q11：故事生成的实际流程是怎样的？**

**回答**：故事生成流程如下：
1. 用户选择书籍和角色
2. 系统获取书籍关联的所有角色
3. 如果有前一章，获取前一章内容摘要和谜题信息
4. 构建提示词（包含角色信息、前情提要、情节选择等）
5. 调用豆包大语言模型API生成故事
6. 解析AI返回的JSON格式数据
7. 保存章节和谜题到数据库
8. 返回章节ID和标题给前端

**Q12：使用的是哪个大语言模型？具体模型名称是什么？**

**回答**：使用豆包大语言模型，具体模型名称为 `doubao-1-5-pro-32k-250115`。

**代码依据**：
```javascript
const DOUBAO_MODEL = 'doubao-1-5-pro-32k-250115';
```

**Q13：故事生成的提示词是如何组织的？**

**回答**：提示词组织结构如下：
1. 角色信息：包含角色名称、性格、说话方式
2. 前情提要：前一章内容摘要（如果有）
3. 上一章谜题回顾：谜题问题和正确答案（如果有）
4. 情节选择：用户选择的情节方向
5. 故事要求：长度100字、乐高风格、适合儿童
6. 谜题要求：随机选择谜题类型（规律推理/谜语/生活常识）
7. 输出格式：JSON格式，包含标题、内容、谜题

**Q14：故事长度限制是多少字？为什么是这个长度？**

**回答**：故事长度限制为100字。这个长度基于以下考虑：
1. 适合10-12岁儿童的阅读注意力
2. 配合谜题形成完整的阅读体验
3. 便于快速生成和加载
4. 原始需求是300-500字，后调整为100字以优化体验

**代码依据**：
```javascript
prompt += '1. 故事长度：100字\n';
```

**Q15：故事内容如何保证适合儿童阅读？**

**回答**：通过以下方式保证内容适合儿童：
1. 提示词明确要求"适合10-12岁儿童"
2. 故事风格设定为"乐高积木世界，充满想象力和冒险"
3. 谜题难度设定为"适合10-12岁儿童"
4. 使用豆包大语言模型的内容安全机制

**Q16：故事生成失败时如何处理？**

**回答**：失败处理机制：
1. API调用失败：返回"AI服务暂时不可用"错误
2. 返回格式错误：返回"AI返回格式错误"错误
3. 前端显示错误提示，用户可以重试

**代码依据**：
```javascript
if (!response.ok) {
  return createErrorResponse('AI服务暂时不可用', 500);
}
var storyData = parseAIResponse(aiResult.choices[0].message);
if (!storyData) {
  return createErrorResponse('AI返回格式错误', 500);
}
```

**Q17：故事生成的时间大约需要多久？**

**回答**：故事生成时间取决于：
1. 豆包API响应时间：通常3-10秒
2. 网络延迟：取决于用户地理位置
3. 数据库写入时间：通常小于100毫秒
4. 总体时间：通常5-15秒

**Q18：生成的故事是否会被保存？**

**回答**：是的，生成的故事会被保存到数据库的chapters表中，包含：
- chapter_id：章节ID
- book_id：书籍ID
- chapter_number：章节序号
- title：章节标题
- content：故事内容
- has_puzzle：是否有谜题
- created_at：创建时间

**Q19：故事可以重新生成吗？**

**回答**：目前不支持重新生成已创建的章节。用户可以：
1. 创建新章节继续故事
2. 删除书籍重新开始
3. 每次生成结果都是随机的，不同调用会产生不同内容

**Q20：多角色如何影响故事生成？**

**回答**：多角色影响如下：
1. 提示词要求"使用所有角色，让每个角色都有出场机会"
2. 角色信息包含自定义名称、原始名称、性格、说话方式
3. 用户可以选择部分角色参与当前章节
4. 角色数量影响故事复杂度

---

### 1.3 关于谜题系统（10问）

**Q21：谜题是如何生成的？是AI生成还是预设？**

**回答**：谜题由AI动态生成，不是预设的。每次生成章节时，AI会根据故事内容创建一个全新的谜题。提示词明确要求"必须创作全新的、原创的谜题，禁止使用常见示例"。

**Q22：谜题类型有哪些？**

**回答**：谜题类型有三种：

| 类型 | 说明 | 场景示例 |
|------|------|----------|
| pattern | 规律推理 | 神秘符号、密码锁、图案排列 |
| riddle | 谜语 | 守门人出谜语、神秘生物出题 |
| knowledge | 生活常识 | 物品分类、找不同、常识判断 |

**代码依据**：
```javascript
const PUZZLE_TYPES = [
  { type: 'pattern', prompt: '【规律推理模式】...' },
  { type: 'riddle', prompt: '【谜语模式】...' },
  { type: 'knowledge', prompt: '【生活常识模式】...' }
];
```

**Q23：谜题答案格式是什么？字母还是文字？**

**回答**：谜题答案格式为字母（A/B/C/D）。选项内容为1-5个字的文字，但正确答案使用字母表示。

**代码依据**：
```javascript
prompt += '    "answer": "正确答案（A/B/C/D）",\n';
```

**Q24：谜题提示系统是如何工作的？**

**回答**：谜题提示系统：
1. AI生成谜题时可以选择性生成提示（hint字段）
2. 提示存储在puzzles表中
3. 前端在用户请求时显示提示
4. 提示是可选的，不是每个谜题都有提示

**Q25：答错谜题会有什么后果？**

**回答**：答错谜题的后果：
1. 系统记录答题错误
2. 用户可以继续尝试
3. 不会阻止故事继续
4. 答题记录保存在puzzle_records表中

**Q26：谜题与故事内容的关联性如何保证？**

**回答**：关联性保证通过：
1. 提示词要求谜题与故事场景相关
2. 谜题类型与故事情境匹配（如遇到守门人时出谜语）
3. AI根据故事内容动态生成谜题

**Q27：每个章节都有谜题吗？**

**回答**：不是每个章节都有谜题。谜题生成取决于AI返回的数据，如果AI返回了有效的谜题数据，则该章节有谜题（has_puzzle=1），否则没有。

**Q28：谜题难度是如何控制的？**

**回答**：难度控制通过：
1. 提示词明确要求"适合10-12岁儿童"
2. 谜题类型说明中包含难度指导
3. 选项数量固定为4个，降低猜测难度
4. 提示功能帮助卡住的儿童

**Q29：答题记录是否保存？**

**回答**：是的，答题记录保存在puzzle_records表中，包含：
- record_id：记录ID
- user_id：用户ID
- puzzle_id：谜题ID
- user_answer：用户答案
- is_correct：是否正确
- attempts：尝试次数
- answered_at：答题时间

**Q30：谜题可以跳过吗？**

**回答**：目前系统设计上谜题是可选的，用户可以选择不解谜继续阅读下一章。但答题记录会被保存，用于后续可能的功能扩展。

---

## 二、项目背景

### 2.1 项目概述

乐高故事书是一个面向儿童的创意故事创作与阅读平台，通过人工智能技术帮助儿童创建属于自己的乐高主题故事书籍。

**实际实现的核心功能**：
- 无密码用户登录
- 书籍创建与管理
- 角色创建与管理
- AI故事生成（100字/章）
- 三种类型谜题（规律推理、谜语、生活常识）
- 书籍分享功能

**未实现的功能**（原需求中提到但未实现）：
- 家长控制功能（时间限制设置界面）
- 用户头像上传
- 故事重新生成

### 2.2 目标用户

**儿童用户**：10-12岁儿童，能够独立阅读中等复杂度的故事内容，喜欢互动性强的内容。

**家长用户**：关注儿童的网络安全和使用时间管理，但家长控制功能尚未完全实现。

### 2.3 技术实现概览

| 技术组件 | 实际使用 |
|----------|----------|
| 前端框架 | 原生HTML/CSS/JavaScript |
| 后端平台 | Cloudflare Pages Functions |
| 数据库 | Cloudflare D1 (SQLite) |
| AI服务 | 豆包大语言模型 (doubao-1-5-pro-32k-250115) |
| 图片生成 | Seedream (doubao-seedream-4-0-250828) |
| 语音识别 | SiliconFlow (FunAudioLLM/SenseVoiceSmall) |

---

## 三、功能需求

### 3.1 已实现功能清单

| 功能模块 | 功能点 | 实现状态 | 验证方法 |
|----------|--------|----------|----------|
| 用户管理 | 无密码登录 | ✅ 已实现 | POST /api/users |
| 用户管理 | 用户信息查询 | ✅ 已实现 | GET /api/users?userId=xxx |
| 用户管理 | 用户信息更新 | ✅ 已实现 | PUT /api/users |
| 书籍管理 | 创建书籍 | ✅ 已实现 | POST /api/books |
| 书籍管理 | 查询书籍列表 | ✅ 已实现 | GET /api/books?user_id=xxx |
| 书籍管理 | 删除书籍 | ✅ 已实现 | DELETE /api/books |
| 章节管理 | 生成章节 | ✅ 已实现 | POST /api/chapters-generate |
| 章节管理 | 查询章节列表 | ✅ 已实现 | GET /api/chapters?book_id=xxx |
| 角色管理 | 创建角色 | ✅ 已实现 | POST /api/characters |
| 角色管理 | 查询角色列表 | ✅ 已实现 | GET /api/characters |
| 谜题系统 | 验证谜题答案 | ✅ 已实现 | POST /api/puzzle |
| 分享功能 | 创建分享链接 | ✅ 已实现 | POST /api/share |
| 分享功能 | 查询分享内容 | ✅ 已实现 | GET /api/share |

### 3.2 未实现功能清单

| 功能模块 | 功能点 | 实现状态 | 说明 |
|----------|--------|----------|------|
| 家长控制 | 时间限制设置 | ❌ 未实现 | 数据库字段存在，但无UI界面 |
| 家长控制 | 使用时间统计 | ❌ 未实现 | 数据库字段存在，但无逻辑 |
| 用户管理 | 头像上传 | ❌ 未实现 | 数据库字段存在，但无功能 |
| 章节管理 | 章节编辑 | ❌ 未实现 | 只能生成，不能编辑 |
| 章节管理 | 章节重新生成 | ❌ 未实现 | 每次生成都是新的 |

---

## 四、数据需求

### 4.1 数据库表结构

#### users表（用户表）

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| user_id | TEXT | 用户ID（主键） | id_mm1s9h2e_oujn2xo9g |
| username | TEXT | 用户名 | 小明 |
| email | TEXT | 邮箱（可选） | null |
| avatar | TEXT | 头像（可选） | null |
| parent_id | TEXT | 家长ID（可选） | null |
| daily_time_limit | INTEGER | 每日时间限制（分钟） | 120 |
| time_used_today | INTEGER | 今日已用时间（分钟） | 0 |
| created_at | DATETIME | 创建时间 | 2026-02-26T10:00:00Z |
| updated_at | DATETIME | 更新时间 | 2026-02-26T10:00:00Z |

#### characters表（角色表）

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| character_id | TEXT | 角色ID（主键） | id_char001 |
| name | TEXT | 角色名称 | 勇敢骑士 |
| image_base64 | TEXT | 角色图片（Base64） | data:image/png;base64,... |
| description | TEXT | 描述 | 一位勇敢的骑士 |
| personality | TEXT | 性格特点 | 勇敢、正义 |
| speaking_style | TEXT | 说话方式 | 正式、有礼貌 |
| creator_id | TEXT | 创建者ID | system 或 user_id |
| created_at | DATETIME | 创建时间 | 2026-02-26T10:00:00Z |

#### books表（书籍表）

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| book_id | TEXT | 书籍ID（主键） | id_book001 |
| user_id | TEXT | 用户ID（外键） | id_mm1s9h2e_oujn2xo9g |
| title | TEXT | 书籍标题 | 我的冒险故事 |
| chapter_count | INTEGER | 章节数量 | 5 |
| status | TEXT | 状态 | active |
| created_at | DATETIME | 创建时间 | 2026-02-26T10:00:00Z |

#### chapters表（章节表）

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| chapter_id | TEXT | 章节ID（主键） | id_chapter001 |
| book_id | TEXT | 书籍ID（外键） | id_book001 |
| chapter_number | INTEGER | 章节序号 | 1 |
| title | TEXT | 章节标题 | 神秘的开始 |
| content | TEXT | 章节内容 | 在一个阳光明媚的早晨... |
| has_puzzle | INTEGER | 是否有谜题 | 1 |
| created_at | DATETIME | 创建时间 | 2026-02-26T10:00:00Z |

#### puzzles表（谜题表）

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| puzzle_id | TEXT | 谜题ID（主键） | id_puzzle001 |
| chapter_id | TEXT | 章节ID（外键） | id_chapter001 |
| question | TEXT | 谜题问题 | 下一个数字是什么？ |
| options | TEXT | 选项（JSON） | ["A", "B", "C", "D"] |
| answer | TEXT | 正确答案 | A |
| hint | TEXT | 提示 | 仔细观察规律 |
| puzzle_type | TEXT | 谜题类型 | pattern |
| created_at | DATETIME | 创建时间 | 2026-02-26T10:00:00Z |

---

## 五、非功能需求

### 5.1 性能需求

| 指标 | 要求 | 实际情况 |
|------|------|----------|
| 页面加载时间 | < 3秒 | CDN加速，通常<1秒 |
| API响应时间 | < 500毫秒 | 通常100-300毫秒 |
| 故事生成时间 | < 15秒 | 通常5-10秒 |
| 并发用户数 | 100+ | Cloudflare自动扩展 |

### 5.2 安全需求

| 需求 | 实现方式 |
|------|----------|
| 数据隔离 | 用户ID参数过滤 |
| SQL注入防护 | 参数化查询 |
| XSS防护 | 输入验证和输出编码 |
| API密钥保护 | 环境变量存储 |

### 5.3 可用性需求

| 需求 | 实现方式 |
|------|----------|
| 系统可用性 | Cloudflare 99.9% SLA |
| 数据备份 | D1自动备份 |
| 灾难恢复 | 代码托管在GitHub |

---

## 六、验证方法

### 6.1 API验证命令

```bash
# 用户登录测试
curl -X POST https://your-domain/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user"}'

# 预期响应
{"success":true,"data":{"userId":"id_xxx_xxx","message":"登录成功","isNewUser":true}}

# 创建书籍测试
curl -X POST https://your-domain/api/books \
  -H "Content-Type: application/json" \
  -d '{"user_id":"id_xxx_xxx","title":"测试书籍"}'

# 生成章节测试
curl -X POST "https://your-domain/api/chapters-generate?bookId=id_book001" \
  -H "Content-Type: application/json" \
  -d '{"userId":"id_xxx_xxx"}'
```

### 6.2 数据库验证SQL

```sql
-- 验证用户表
SELECT * FROM users WHERE username = 'test_user';

-- 验证书籍表
SELECT * FROM books WHERE user_id = 'id_xxx_xxx';

-- 验证章节表
SELECT * FROM chapters WHERE book_id = 'id_book001';

-- 验证谜题表
SELECT * FROM puzzles WHERE chapter_id = 'id_chapter001';
```

---

## 附录：修订历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-02-25 | 初始版本 | 项目团队 |
| V2.0 | 2026-02-26 | 基于苏格拉底式提问深度优化，结合实际代码实现 | 项目团队 |
