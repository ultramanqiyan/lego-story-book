# 乐高故事书项目接口文档（优化版）

## 文档信息

| 项目名称 | 乐高故事书 |
|----------|------------|
| 文档版本 | V2.0 |
| 编写日期 | 2026年2月26日 |
| 文档状态 | 正式发布 |
| 优化说明 | 基于苏格拉底式提问深度反思，结合项目实际API代码实现 |

---

## 一、苏格拉底式提问与回答（30问）

### 1.1 关于API设计（10问）

**Q1：实际存在哪些API端点？**

**回答**：项目实际存在以下API端点：

| 端点 | 文件 | 功能 |
|------|------|------|
| /api/users | users.js | 用户管理 |
| /api/books | books.js | 书籍管理 |
| /api/chapters | chapters.js | 章节管理 |
| /api/chapters-generate | chapters-generate.js | 章节生成 |
| /api/chapters-complete | chapters-complete.js | 章节完成 |
| /api/characters | characters.js | 角色管理 |
| /api/book-characters | book-characters.js | 书籍角色管理 |
| /api/puzzle | puzzle.js | 谜题验证 |
| /api/speech | speech.js | 语音识别 |
| /api/generate | generate.js | 图片生成 |
| /api/share | share.js | 分享管理 |
| /api/plot-options | plot-options.js | 情节选项 |
| /api/story | story.js | 故事相关 |

**Q2：每个API的请求方法是什么？**

**回答**：每个API支持的方法如下：

| 端点 | GET | POST | PUT | DELETE |
|------|-----|------|-----|--------|
| /api/users | ✅ | ✅ | ✅ | ❌ |
| /api/books | ✅ | ✅ | ✅ | ✅ |
| /api/chapters | ✅ | ❌ | ❌ | ❌ |
| /api/chapters-generate | ❌ | ✅ | ❌ | ❌ |
| /api/characters | ✅ | ✅ | ✅ | ✅ |
| /api/puzzle | ✅ | ✅ | ❌ | ❌ |

**Q3：请求参数的实际格式是什么？**

**回答**：请求参数格式：
- GET请求：参数通过URL查询字符串传递
- POST/PUT请求：参数通过JSON格式的请求体传递

**代码依据**：
```javascript
// GET请求获取参数
const url = new URL(context.request.url);
const userId = url.searchParams.get('userId');

// POST请求获取参数
const body = await context.request.json();
const { username, email } = body;
```

**Q4：响应数据的实际格式是什么？**

**回答**：响应数据统一使用JSON格式：

**成功响应**：
```json
{
  "success": true,
  "data": { ... }
}
```

**错误响应**：
```json
{
  "success": false,
  "error": "错误信息"
}
```

**代码依据**：
```javascript
// utils.js
export function createSuccessResponse(data) {
  return createResponse({ success: true, ...data });
}

export function createErrorResponse(message, status = 500) {
  return createResponse({ success: false, error: message }, status);
}
```

**Q5：错误响应的格式是什么？**

**回答**：错误响应格式：

| HTTP状态码 | 说明 | 示例 |
|------------|------|------|
| 400 | 参数错误 | {"success":false,"error":"用户ID不能为空"} |
| 404 | 资源不存在 | {"success":false,"error":"书籍不存在"} |
| 500 | 服务器错误 | {"success":false,"error":"获取书籍失败"} |

**Q6：API是否有版本控制？**

**回答**：当前API没有版本控制。所有API直接位于/api路径下，没有v1/v2等版本前缀。如果未来需要升级API，建议：
1. 添加版本前缀（如/api/v1/）
2. 保持向后兼容
3. 提供版本迁移指南

**Q7：API是否有速率限制？**

**回答**：当前API没有实现速率限制。Cloudflare Pages Functions默认有一定的请求限制，但应用层没有额外的速率限制。建议：
1. 对AI生成接口添加速率限制
2. 防止单用户过度调用
3. 保护第三方API配额

**Q8：API如何处理跨域请求？**

**回答**：API通过CORS头处理跨域请求：

**代码依据**：
```javascript
// utils.js
export function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
```

每个API都实现了onRequestOptions方法处理预检请求。

**Q9：API是否有认证机制？**

**回答**：当前API使用简单的用户ID认证：
1. 用户登录后获得用户ID
2. 用户ID存储在浏览器localStorage
3. 每次请求时携带用户ID参数
4. 服务端验证用户ID是否存在

这是一种简化的认证机制，适合儿童用户场景。

**Q10：API请求超时时间是多少？**

**回答**：API请求超时时间：
- 普通API：Cloudflare Pages Functions默认限制
- AI生成API：取决于豆包API响应时间（通常5-15秒）
- 前端建议设置30秒超时

---

### 1.2 关于用户API（5问）

**Q11：用户创建API的实际请求体是什么？**

**回答**：

**请求**：
```bash
POST /api/users
Content-Type: application/json

{
  "username": "小明"
}
```

**代码依据**：
```javascript
// users.js
const { username, email, parentId } = body;
```

**Q12：用户创建API的实际响应体是什么？**

**回答**：

**新用户响应**：
```json
{
  "success": true,
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "message": "用户创建成功",
  "isNewUser": true
}
```

**已存在用户响应**：
```json
{
  "success": true,
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "message": "登录成功",
  "isNewUser": false
}
```

**Q13：用户查询API需要哪些参数？**

**回答**：

**请求**：
```bash
GET /api/users?userId=id_mm1s9h2e_oujn2xo9g
```

**响应**：
```json
{
  "success": true,
  "user": {
    "user_id": "id_mm1s9h2e_oujn2xo9g",
    "username": "小明",
    "email": null,
    "avatar": null,
    "parent_id": null,
    "daily_time_limit": 120,
    "time_used_today": 0,
    "created_at": "2026-02-26T10:00:00Z",
    "updated_at": "2026-02-26T10:00:00Z"
  }
}
```

**Q14：用户更新API可以更新哪些字段？**

**回答**：可以更新以下字段：
- username：用户名
- email：邮箱
- avatar：头像
- dailyTimeLimit：每日时间限制

**请求**：
```bash
PUT /api/users
Content-Type: application/json

{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "username": "新名字"
}
```

**Q15：用户删除API是否存在？**

**回答**：不存在。用户API没有实现删除功能。用户数据会永久保留在数据库中。

---

### 1.3 关于书籍API（5问）

**Q16：书籍创建API需要哪些参数？**

**回答**：

**请求**：
```bash
POST /api/books
Content-Type: application/json

{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "title": "我的冒险故事"
}
```

**响应**：
```json
{
  "success": true,
  "bookId": "id_book001",
  "message": "书籍创建成功"
}
```

**限制**：
- 标题不能为空
- 标题最多50个字符
- 每用户最多创建20本书籍

**代码依据**：
```javascript
if (!title || title.trim() === '') return createErrorResponse('书籍名称不能为空', 400);
if (title.length > 50) return createErrorResponse('书籍名称不能超过50个字符', 400);
const bookCount = await getBookCount(DB, userId);
if (bookCount.count >= 20) return createErrorResponse('每用户最多创建20本书籍', 400);
```

**Q17：书籍列表API如何分页？**

**回答**：当前书籍列表API没有实现分页，返回用户的所有书籍。

**请求**：
```bash
GET /api/books?userId=id_mm1s9h2e_oujn2xo9g
```

**响应**：
```json
{
  "success": true,
  "books": [
    {
      "book_id": "id_book001",
      "user_id": "id_mm1s9h2e_oujn2xo9g",
      "title": "我的冒险故事",
      "chapter_count": 5,
      "status": "active",
      "created_at": "2026-02-26T10:00:00Z"
    }
  ]
}
```

**Q18：书籍删除API如何处理关联数据？**

**回答**：书籍删除API采用软删除方式，将status设置为'archived'，不实际删除数据。

**请求**：
```bash
DELETE /api/books?id=id_book001
```

**响应**：
```json
{
  "success": true,
  "message": "书籍已归档"
}
```

**代码依据**：
```javascript
await DB.prepare('UPDATE books SET status = ?, updated_at = ? WHERE book_id = ?')
  .bind('archived', now, bookId).run();
```

**Q19：书籍归档功能是否实现？**

**回答**：是的，书籍归档功能已实现。删除操作实际上是将书籍状态设置为'archived'，查询时会过滤掉已归档的书籍。

**Q20：书籍分享API如何工作？**

**回答**：书籍分享通过/api/share端点实现：

**创建分享**：
```bash
POST /api/share
Content-Type: application/json

{
  "bookId": "id_book001",
  "userId": "id_mm1s9h2e_oujn2xo9g"
}
```

**响应**：
```json
{
  "success": true,
  "shareCode": "abc123",
  "shareUrl": "https://your-domain/share.html?code=abc123"
}
```

---

### 1.4 关于章节API（5问）

**Q21：章节生成API的实际流程是什么？**

**回答**：章节生成API流程：

1. 验证书籍ID
2. 检查章节数量限制（最多100章）
3. 获取书籍关联的角色
4. 获取前一章内容（如果有）
5. 构建AI提示词
6. 调用豆包API生成故事
7. 解析AI返回的JSON
8. 保存章节到数据库
9. 保存谜题到数据库（如果有）
10. 返回章节ID

**Q22：章节生成需要多长时间？**

**回答**：章节生成时间取决于：
- 豆包API响应时间：3-10秒
- 网络延迟：1-3秒
- 数据库写入：<1秒
- 总计：通常5-15秒

**Q23：章节内容如何存储？**

**回答**：章节内容存储在chapters表中：

| 字段 | 类型 | 说明 |
|------|------|------|
| chapter_id | TEXT | 章节ID |
| book_id | TEXT | 书籍ID |
| chapter_number | INTEGER | 章节序号 |
| title | TEXT | 章节标题 |
| content | TEXT | 故事内容 |
| has_puzzle | INTEGER | 是否有谜题 |
| created_at | DATETIME | 创建时间 |

**Q24：章节可以编辑吗？**

**回答**：不可以。章节一旦生成就不能编辑。这是设计决策，保持故事的连贯性和AI生成的原始性。

**Q25：章节删除如何处理？**

**回答**：当前没有实现章节删除功能。如果需要删除章节，需要删除整本书籍。

---

### 1.5 关于其他API（5问）

**Q26：角色创建API支持哪些字段？**

**回答**：

**请求**：
```bash
POST /api/characters
Content-Type: application/json

{
  "name": "勇敢骑士",
  "description": "一位勇敢的骑士",
  "personality": "勇敢、正义",
  "speaking_style": "正式、有礼貌",
  "creator_id": "id_mm1s9h2e_oujn2xo9g"
}
```

**Q27：谜题验证API如何判断答案正确？**

**回答**：谜题验证API通过字符串比较判断答案：

**代码依据**：
```javascript
// puzzle.js
const isCorrect = puzzle.answer === userAnswer;
```

答案格式为字母（A/B/C/D），区分大小写。

**Q28：语音识别API使用什么服务？**

**回答**：语音识别使用SiliconFlow服务，模型为FunAudioLLM/SenseVoiceSmall。

**Q29：图片生成API使用什么模型？**

**回答**：图片生成使用Seedream模型，具体为doubao-seedream-4-0-250828。

**Q30：分享API生成的链接有效期是多久？**

**回答**：分享链接没有设置有效期，永久有效。分享码存储在shares表中，没有过期时间字段。

---

## 二、API端点详细文档

### 2.1 用户API

#### POST /api/users

创建或登录用户

**请求体**：
```json
{
  "username": "小明"
}
```

**curl示例**：
```bash
curl -X POST https://your-domain/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"小明"}'
```

**成功响应**：
```json
{
  "success": true,
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "message": "用户创建成功",
  "isNewUser": true
}
```

#### GET /api/users

获取用户信息

**请求参数**：
- userId（必需）：用户ID

**curl示例**：
```bash
curl "https://your-domain/api/users?userId=id_mm1s9h2e_oujn2xo9g"
```

#### PUT /api/users

更新用户信息

**请求体**：
```json
{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "username": "新名字"
}
```

---

### 2.2 书籍API

#### POST /api/books

创建新书籍

**请求体**：
```json
{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "title": "我的冒险故事"
}
```

**curl示例**：
```bash
curl -X POST https://your-domain/api/books \
  -H "Content-Type: application/json" \
  -d '{"userId":"id_xxx","title":"我的冒险故事"}'
```

#### GET /api/books

获取书籍列表或书籍详情

**请求参数**：
- userId：用户ID（获取列表时必需）
- bookId：书籍ID（获取详情时使用）

**curl示例**：
```bash
# 获取书籍列表
curl "https://your-domain/api/books?userId=id_xxx"

# 获取书籍详情
curl "https://your-domain/api/books?bookId=id_book001"
```

#### DELETE /api/books

归档书籍

**请求参数**：
- id：书籍ID

**curl示例**：
```bash
curl -X DELETE "https://your-domain/api/books?id=id_book001"
```

---

### 2.3 章节API

#### POST /api/chapters-generate

生成新章节

**请求参数**：
- bookId（URL参数）：书籍ID

**请求体**：
```json
{
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "characterIds": ["id_char001", "id_char002"],
  "plotSelection": null
}
```

**curl示例**：
```bash
curl -X POST "https://your-domain/api/chapters-generate?bookId=id_book001" \
  -H "Content-Type: application/json" \
  -d '{"userId":"id_xxx"}'
```

**成功响应**：
```json
{
  "success": true,
  "chapterId": "id_chapter001",
  "chapterNumber": 1,
  "title": "神秘的开始",
  "hasPuzzle": 1,
  "message": "章节生成成功"
}
```

#### GET /api/chapters

获取章节列表

**请求参数**：
- book_id：书籍ID

---

### 2.4 谜题API

#### POST /api/puzzle

验证谜题答案

**请求体**：
```json
{
  "puzzleId": "id_puzzle001",
  "userId": "id_mm1s9h2e_oujn2xo9g",
  "userAnswer": "A"
}
```

**curl示例**：
```bash
curl -X POST https://your-domain/api/puzzle \
  -H "Content-Type: application/json" \
  -d '{"puzzleId":"id_puzzle001","userId":"id_xxx","userAnswer":"A"}'
```

**成功响应（正确）**：
```json
{
  "success": true,
  "isCorrect": true,
  "attempts": 1,
  "attemptsRemaining": 2,
  "hint": null,
  "message": "答对了！"
}
```

**成功响应（错误）**：
```json
{
  "success": true,
  "isCorrect": false,
  "attempts": 2,
  "attemptsRemaining": 1,
  "hint": "仔细观察规律",
  "message": "答案错误，请再试一次"
}
```

---

## 三、错误码参考

| HTTP状态码 | 错误信息 | 原因 |
|------------|----------|------|
| 400 | 用户ID不能为空 | 未提供userId参数 |
| 400 | 用户名不能为空 | 未提供username参数 |
| 400 | 用户名不能超过20个字符 | username长度超限 |
| 400 | 书籍名称不能为空 | 未提供title参数 |
| 400 | 书籍名称不能超过50个字符 | title长度超限 |
| 400 | 每用户最多创建20本书籍 | 达到书籍数量上限 |
| 400 | 单本书籍最多100章 | 达到章节数量上限 |
| 400 | 请先添加角色 | 书籍没有关联角色 |
| 400 | 参数不完整 | 缺少必需参数 |
| 404 | 用户不存在 | userId无效 |
| 404 | 书籍不存在 | bookId无效 |
| 404 | 谜题不存在 | puzzleId无效 |
| 500 | AI服务暂时不可用 | 豆包API调用失败 |
| 500 | AI返回格式错误 | AI返回数据解析失败 |

---

## 四、API调用最佳实践

### 4.1 错误处理

```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.success) {
      console.error('API Error:', data.error);
      return { error: data.error };
    }
    
    return data;
  } catch (error) {
    console.error('Network Error:', error);
    return { error: '网络错误，请稍后重试' };
  }
}
```

### 4.2 超时处理

```javascript
async function apiCallWithTimeout(url, options, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { error: '请求超时' };
    }
    throw error;
  }
}
```

---

## 附录：修订历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-02-25 | 初始版本 | 项目团队 |
| V2.0 | 2026-02-26 | 基于苏格拉底式提问深度优化，添加curl示例和代码依据 | 项目团队 |
