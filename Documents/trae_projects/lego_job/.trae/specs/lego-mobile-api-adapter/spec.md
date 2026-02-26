# Lego-Mobile API 接口适配规格说明

## 一、项目背景

lego-mobile 前端 API 接口与网页端后端 API 接口存在不一致，需要进行静态检查和适配修改。

## 二、接口差异分析

### 2.1 前端缺失的接口 (6个)

| 序号 | 接口 | HTTP 方法 | 功能说明 | 优先级 |
|-----|------|----------|---------|--------|
| 1 | `/book-characters` | GET | 获取书籍角色列表 | 高 |
| 2 | `/puzzle` | GET | 获取谜题详情 | 高 |
| 3 | `/share?code=${code}` | GET | 通过分享码获取分享信息 | 中 |
| 4 | `/share` | DELETE | 删除分享链接 | 中 |
| 5 | `/generate` | POST | 图像生成 | 低 |
| 6 | `/speech` | POST | 语音识别 | 低 |

### 2.2 存在参数差异的接口 (7个)

| 序号 | 接口 | 前端参数 | 后端参数 | 差异说明 |
|-----|------|---------|---------|---------|
| 1 | POST /users | `{ username, email }` | `{ username, email?, parentId? }` | 后端支持 parentId |
| 2 | PUT /users | `{ userId, timeUsed }` | `{ userId, username?, email?, avatar?, dailyTimeLimit? }` | 前端 timeUsed 后端不支持 |
| 3 | POST /characters | 无 imageBase64 | `{ name, imageBase64?, ... }` | 后端支持图片 |
| 4 | PUT /characters | 无 imageBase64 | `{ characterId, imageBase64?, ... }` | 后端支持图片 |
| 5 | PUT /book-characters | `{ id, ... }` | `{ id?, bookId?, characterId?, ... }` | 后端支持多种查找 |
| 6 | POST /story | 无 forcePuzzle | `{ ..., forcePuzzle? }` | 后端支持强制谜题 |
| 7 | POST /share | `{ bookId, userId }` | `{ bookId, userId, password?, isPublic? }` | 后端支持更多参数 |

### 2.3 完全匹配的接口 (9个)

1. `GET /books?userId=${userId}` - 获取书籍列表
2. `GET /books?bookId=${bookId}&userId=${userId}` - 获取书籍详情
3. `POST /books` - 创建书籍
4. `PUT /books` - 更新书籍
5. `DELETE /books` - 删除书籍
6. `POST /chapters-complete/books/${bookId}/chapters/${chapterId}` - 标记章节完成
7. `POST /chapters-generate/books/${bookId}` - 生成章节
8. `GET /plot-options` - 获取情节选项
9. `POST /puzzle` - 提交谜题答案

## 三、修改范围

### 3.1 需要修改的文件

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `lego-mobile/src/api/users.js` | 修改 | 适配 PUT 接口参数 |
| `lego-mobile/src/api/characters.js` | 修改 | 添加 imageBase64 支持 |
| `lego-mobile/src/api/chapters.js` | 检查 | 确认接口一致性 |
| `lego-mobile/src/api/story.js` | 修改 | 添加 forcePuzzle 参数 |
| `lego-mobile/src/api/share.js` | 修改 | 完善接口支持 |
| `lego-mobile/src/api/puzzle.js` | 修改 | 添加 GET 接口 |
| `lego-mobile/src/api/index.js` | 修改 | 导出新接口 |

### 3.2 需要新增的文件

| 文件路径 | 说明 |
|---------|------|
| `lego-mobile/src/api/bookCharacters.js` | 书籍角色 API (如不存在独立文件) |
| `lego-mobile/src/api/generate.js` | 图像生成 API (可选) |
| `lego-mobile/src/api/speech.js` | 语音识别 API (可选) |

## 四、详细修改方案

### 4.1 users.js 修改

**问题**: PUT 接口前端使用 `timeUsed` 参数，后端不支持

**解决方案**:
- 移除 `timeUsed` 参数的使用
- 添加 `username`, `email`, `avatar` 参数支持
- 保留 `dailyTimeLimit` 参数

```javascript
// 修改前
export const updateTimeUsed = async (userId, timeUsed) => {
  return client.put('/users', { userId, timeUsed });
};

// 修改后 - 移除 timeUsed，添加新参数
export const updateUser = async (userId, data) => {
  return client.put('/users', { userId, ...data });
  // data 可包含: username, email, avatar, dailyTimeLimit
};
```

### 4.2 characters.js 修改

**问题**: 缺少 `imageBase64` 参数支持

**解决方案**:
- POST 和 PUT 接口添加 `imageBase64` 参数

```javascript
// 修改后
export const createCharacter = async (data) => {
  return client.post('/characters', {
    name: data.name,
    imageBase64: data.imageBase64,  // 新增
    description: data.description,
    personality: data.personality,
    speakingStyle: data.speakingStyle,
    creatorId: data.creatorId,
  });
};

export const updateCharacter = async (characterId, data) => {
  return client.put('/characters', {
    characterId,
    name: data.name,
    imageBase64: data.imageBase64,  // 新增
    description: data.description,
    personality: data.personality,
    speakingStyle: data.speakingStyle,
  });
};
```

### 4.3 story.js 修改

**问题**: 缺少 `forcePuzzle` 参数

**解决方案**:
- 添加 `forcePuzzle` 可选参数

```javascript
// 修改后
export const generateStory = async (data) => {
  return client.post('/story', {
    characters: data.characters,
    plot: data.plot,
    chapter: data.chapter,
    chapterCharacters: data.chapterCharacters,
    previousSummary: data.previousSummary,
    previousPuzzle: data.previousPuzzle,
    plotSelection: data.plotSelection,
    forcePuzzle: data.forcePuzzle,  // 新增
  });
};
```

### 4.4 share.js 修改

**问题**: 
1. GET 接口不支持分享码查询
2. POST 接口缺少 `password`, `isPublic` 参数
3. 缺少 DELETE 接口

**解决方案**:

```javascript
// 修改后
export const getShareByBook = async (bookId, userId) => {
  return client.get(`/share?bookId=${bookId}&userId=${userId}`);
};

export const getShareByCode = async (code) => {
  return client.get(`/share?code=${code}`);
};

export const createShare = async (bookId, userId, options = {}) => {
  return client.post('/share', {
    bookId,
    userId,
    password: options.password,    // 新增
    isPublic: options.isPublic,    // 新增
  });
};

export const deleteShare = async (id) => {
  return client.delete(`/share?id=${id}`);
};
```

### 4.5 puzzle.js 修改

**问题**: 缺少 GET 接口

**解决方案**:

```javascript
// 修改后
export const getPuzzle = async (params) => {
  if (params.id) {
    return client.get(`/puzzle?id=${params.id}`);
  }
  if (params.chapterId) {
    return client.get(`/puzzle?chapterId=${params.chapterId}`);
  }
  throw new Error('Either id or chapterId is required');
};

export const submitPuzzleAnswer = async (puzzleId, userId, userAnswer) => {
  return client.post('/puzzle', { puzzleId, userId, userAnswer });
};
```

### 4.6 bookCharacters.js 新增/修改

**问题**: 缺少 GET 接口

**解决方案**:

```javascript
// 修改后
export const getBookCharacters = async (bookId) => {
  return client.get(`/book-characters?bookId=${bookId}`);
};

export const addBookCharacter = async (bookId, characterId, customName, roleType) => {
  return client.post('/book-characters', { bookId, characterId, customName, roleType });
};

export const updateBookCharacter = async (id, data) => {
  return client.put('/book-characters', { id, ...data });
};

export const deleteBookCharacter = async (id, force = false) => {
  return client.delete(`/book-characters?id=${id}&force=${force}`);
};
```

## 五、测试方案

### 5.1 单元测试

为每个修改的 API 文件编写单元测试，验证：
1. 请求参数正确性
2. 返回数据结构正确性
3. 错误处理正确性

### 5.2 集成测试

1. 启动后端服务
2. 运行前端 API 调用
3. 验证端到端功能

## 六、风险评估

| 风险 | 影响 | 缓解措施 |
|-----|------|---------|
| 后端接口变更 | 高 | 与后端确认接口稳定性 |
| 前端调用方未更新 | 中 | 全面搜索调用点并更新 |
| 参数类型不匹配 | 中 | 添加类型检查 |

## 七、验收标准

1. 所有 API 接口与后端定义一致
2. 单元测试覆盖率 > 80%
3. 无 TypeScript/ESLint 错误
4. 现有功能正常运行
