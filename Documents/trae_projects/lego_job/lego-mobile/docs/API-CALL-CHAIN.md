# LEGO Mobile 调用链关系图

## 一、调用链概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APP 界面层 (Screens)                            │
│  LoginScreen / HomeScreen / BookshelfScreen / CharactersScreen /            │
│  ChapterScreen / StoryCreateScreen / StoryDirectorScreen / BookDetailScreen │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APP API 层 (src/api/)                             │
│  usersAPI / charactersAPI / booksAPI / chaptersAPI / puzzleAPI / storyAPI   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          后端 API 层 (functions/api/)                        │
│  /users /characters /books /chapters /puzzle /book-characters /chapters-... │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、用户认证调用链

### 2.1 登录/注册

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LoginScreen.handleLogin()                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: usersAPI.createOrLogin(username, email?)                            │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "username": string,    // 必填，最大20字符                                │
│     "email": string        // 可选                                           │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /users
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/users.js onRequestPost()                             │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - username: string (从body)                                                │
│   - email: string (从body, 可选)                                              │
│   - parentId: string (从body, 可选)                                           │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "userId": string,       // 用户ID                                        │
│     "message": string,      // "登录成功" 或 "用户创建成功"                    │
│     "isNewUser": boolean    // 是否新用户                                     │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

### 2.2 获取用户信息

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ AdventureScreen.loadData() / ParentControlScreen.loadData()                  │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: usersAPI.getUser(userId)                                            │
│ ────────────────────────────────────────────────                             │
│ 请求: GET /users?userId={userId}                                             │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ GET /users?userId=xxx
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/users.js onRequestGet()                              │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "user": {                                                                │
│       "user_id": string,           // 用户ID                                 │
│       "username": string,          // 用户名                                 │
│       "email": string,             // 邮箱 (可选)                             │
│       "avatar": string,            // 头像 (可选)                             │
│       "daily_time_limit": number,  // 每日时间限制(分钟)                       │
│       "time_used_today": number,   // 今日已用时间(分钟)                       │
│       "created_at": string,        // 创建时间                                │
│       "updated_at": string         // 更新时间                                │
│     }                                                                        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: 
- ⚠️ 后端返回 `daily_time_limit`，前端使用 `dailyTimeLimit`
- ⚠️ 后端返回 `time_used_today`，前端使用 `timeUsedToday`
- ✅ 已在AdventureScreen中添加兼容性处理

---

## 三、角色/人仔调用链

### 3.1 获取人仔列表

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CharactersScreen.loadCharacters() / HomeScreen.loadData()                    │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: charactersAPI.getList(userId?)                                      │
│ ────────────────────────────────────────────────                             │
│ 请求: GET /characters?userId={userId}                                        │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ GET /characters?userId=xxx
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/characters.js onRequestGet()                         │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "characters": [                                                          │
│       {                                                                      │
│         "character_id": string,    // 人仔ID                                 │
│         "name": string,            // 名称                                   │
│         "image_base64": string,    // 图片Base64 (可选)                       │
│         "description": string,     // 描述 (可选)                             │
│         "personality": string,     // 性格 (可选)                             │
│         "speaking_style": string,  // 说话方式 (可选)                          │
│         "creator_id": string,      // 创建者ID ("system" 或 userId)           │
│         "created_at": string       // 创建时间                                │
│       }                                                                      │
│     ]                                                                        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**:
- ⚠️ 后端返回 `character_id`，前端使用 `character_id || characterId || id`
- ⚠️ 后端返回 `creator_id`，前端使用 `creator_id || creatorId`
- ⚠️ 后端返回 `speaking_style`，前端使用 `speaking_style || speakingStyle`
- ✅ 已添加兼容性处理

---

### 3.2 创建人仔

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CharactersScreen.handleFormSubmit()                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: charactersAPI.create(data)                                          │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "name": string,              // 必填，最大20字符                           │
│     "imageBase64": string,       // 可选                                      │
│     "description": string,       // 可选                                      │
│     "personality": string,       // 可选                                      │
│     "speakingStyle": string,     // 可选                                      │
│     "creatorId": string          // 可选，默认"user"                          │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /characters
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/characters.js onRequestPost()                        │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - name: string                                                             │
│   - imageBase64: string (可选)                                                │
│   - description: string (可选)                                                │
│   - personality: string (可选)                                                │
│   - speakingStyle: string (可选)                                              │
│   - creatorId: string (可选)                                                  │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "characterId": string,   // 创建的人仔ID                                  │
│     "message": string        // "人仔创建成功"                                │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致 (驼峰命名)

---

### 3.3 更新人仔

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: charactersAPI.update(characterId, data)                             │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "characterId": string,       // 人仔ID                                   │
│     "name": string,              // 可选                                      │
│     "imageBase64": string,       // 可选                                      │
│     "description": string,       // 可选                                      │
│     "personality": string,       // 可选                                      │
│     "speakingStyle": string      // 可选                                      │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ PUT /characters
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/characters.js onRequestPut()                         │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - characterId: string                                                      │
│   - name: string (可选)                                                       │
│   - imageBase64: string (可选)                                                │
│   - description: string (可选)                                                │
│   - personality: string (可选)                                                │
│   - speakingStyle: string (可选)                                              │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   { "message": string }  // "人仔更新成功"                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

### 3.4 删除人仔

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: charactersAPI.delete(characterId, force?)                           │
│ ────────────────────────────────────────────────                             │
│ 请求: DELETE /characters?id={characterId}&force={force}                      │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ DELETE /characters?id=xxx&force=true
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/characters.js onRequestDelete()                      │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   成功: { "message": string }                                                │
│   需确认: {                                                                   │
│     "needsConfirm": true,                                                    │
│     "message": string,                                                       │
│     "usageCount": number                                                     │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

## 四、书籍调用链

### 4.1 获取书籍列表

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HomeScreen.loadData() / BookshelfScreen.loadBooks() / AdventureScreen.loadData() │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: booksAPI.getList(userId)                                            │
│ ────────────────────────────────────────────────                             │
│ 请求: GET /books?userId={userId}                                             │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ GET /books?userId=xxx
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/books.js onRequestGet()                              │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "books": [                                                               │
│       {                                                                      │
│         "book_id": string,         // 书籍ID                                 │
│         "user_id": string,         // 用户ID                                 │
│         "title": string,           // 标题                                   │
│         "chapter_count": number,   // 章节数                                 │
│         "status": string,          // 状态 ("active"/"archived")             │
│         "created_at": string,      // 创建时间                                │
│         "updated_at": string       // 更新时间                                │
│       }                                                                      │
│     ]                                                                        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**:
- ⚠️ 后端返回 `book_id`，前端使用 `book_id || bookId || id`
- ⚠️ 后端返回 `chapter_count`，前端使用 `chapter_count || chapterCount || 0`
- ✅ 已添加兼容性处理

---

### 4.2 获取书籍详情

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ BookDetailScreen.loadData()                                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: booksAPI.getDetail(bookId, userId?)                                 │
│ ────────────────────────────────────────────────                             │
│ 请求: GET /books?bookId={bookId}&userId={userId}                             │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ GET /books?bookId=xxx&userId=xxx
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/books.js onRequestGet()                              │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "book": {                                                                │
│       "book_id": string,                                                      │
│       "user_id": string,                                                      │
│       "title": string,                                                        │
│       "chapter_count": number,                                                │
│       "status": string,                                                       │
│       "plot_selection": object,  // 可选，JSON解析后的情节选择                 │
│       "created_at": string,                                                   │
│       "updated_at": string                                                    │
│     },                                                                       │
│     "chapters": [                                                            │
│       {                                                                      │
│         "chapter_id": string,                                                │
│         "book_id": string,                                                   │
│         "chapter_number": number,                                            │
│         "title": string,                                                     │
│         "has_puzzle": number,  // 0或1                                       │
│         "puzzle_result": number, // 可选，0/1/null                           │
│         "created_at": string                                                 │
│       }                                                                      │
│     ],                                                                       │
│     "characters": [                                                          │
│       {                                                                      │
│         "id": string,              // book_characters表ID                    │
│         "book_id": string,                                                   │
│         "character_id": string,                                              │
│         "custom_name": string,     // 自定义名称                              │
│         "role_type": string,       // 角色类型                                │
│         "original_name": string,   // 原始名称 (JOIN获取)                      │
│         "personality": string,     // 性格 (JOIN获取)                          │
│         "speaking_style": string,  // 说话方式 (JOIN获取)                      │
│         "created_at": string                                                 │
│       }                                                                      │
│     ]                                                                        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**:
- ⚠️ 后端返回 `chapter_id`，前端使用 `chapter_id || chapterId || id`
- ⚠️ 后端返回 `chapter_number`，前端使用 `chapter_number || chapterNumber`
- ⚠️ 后端返回 `has_puzzle`，前端使用 `has_puzzle || hasPuzzle`
- ⚠️ 后端返回 `custom_name`，前端使用 `custom_name || customName || name`
- ⚠️ 后端返回 `role_type`，前端使用 `role_type || roleType`
- ✅ 已添加兼容性处理

---

### 4.3 创建书籍

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ StoryCreateScreen.createNewBook()                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: booksAPI.create(userId, title)                                      │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "userId": string,    // 用户ID                                           │
│     "title": string      // 标题，最大50字符                                  │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /books
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/books.js onRequestPost()                             │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "bookId": string,    // 创建的书籍ID                                      │
│     "message": string    // "书籍创建成功"                                    │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

## 五、书籍角色调用链

### 5.1 添加角色到书籍

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ StoryCreateScreen.handleCreate() / BookDetailScreen.handleAddCharacter()     │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: bookCharactersAPI.add(bookId, characterId, customName, roleType?)   │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "bookId": string,         // 书籍ID                                      │
│     "characterId": string,    // 人仔ID                                      │
│     "customName": string,     // 自定义名称，最大20字符                        │
│     "roleType": string        // 可选，角色类型                               │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /book-characters
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/book-characters.js onRequestPost()                   │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - bookId: string                                                           │
│   - characterId: string                                                      │
│   - customName: string                                                       │
│   - roleType: string (可选，默认"supporting")                                 │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "message": string,   // "角色添加成功"                                    │
│     "id": string         // book_characters表的记录ID                         │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

### 5.2 更新书籍角色

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: bookCharactersAPI.update(id, data)                                  │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "id": string,               // 记录ID                                    │
│     "customName": string,       // 自定义名称 (从data.custom_name转换)        │
│     "roleType": string          // 角色类型 (从data.role_type转换)            │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ PUT /book-characters
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/book-characters.js onRequestPut()                    │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - id: string                                                               │
│   - customName: string (可选)                                                 │
│   - roleType: string (可选)                                                   │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   { "message": string }  // "角色更新成功"                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致 (APP API层已做字段名转换)

---

## 六、章节调用链

### 6.1 获取章节详情

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ChapterScreen.loadChapter()                                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: chaptersAPI.getDetail(chapterId, userId?)                           │
│ ────────────────────────────────────────────────                             │
│ 请求: GET /chapters?id={chapterId}&userId={userId}                           │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ GET /chapters?id=xxx&userId=xxx
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/chapters.js onRequestGet()                           │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "chapter": {                                                             │
│       "chapter_id": string,                                                  │
│       "book_id": string,                                                     │
│       "chapter_number": number,                                              │
│       "title": string,                                                       │
│       "content": string,         // 故事内容                                 │
│       "has_puzzle": number,      // 0或1                                     │
│       "created_at": string                                                   │
│     },                                                                       │
│     "puzzle": {                  // 可选，如果has_puzzle=1                   │
│       "puzzle_id": string,                                                   │
│       "chapter_id": string,                                                  │
│       "question": string,                                                    │
│       "options": string,         // JSON字符串                               │
│       "answer": string,                                                      │
│       "hint": string,            // 可选                                     │
│       "puzzle_type": string                                                  │
│     },                                                                       │
│     "puzzleRecord": {            // 可选，如果用户已作答                      │
│       "record_id": string,                                                   │
│       "user_id": string,                                                     │
│       "puzzle_id": string,                                                   │
│       "user_answer": string,                                                 │
│       "is_correct": number,      // 0或1                                     │
│       "attempts": number                                                     │
│     }                                                                        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**:
- ⚠️ 后端返回 `chapter_id`，前端使用 `chapter_id || chapterId || id`
- ⚠️ 后端返回 `chapter_number`，前端使用 `chapter_number || chapterNumber`
- ⚠️ 后端返回 `has_puzzle`，前端使用 `has_puzzle || hasPuzzle`
- ⚠️ 后端返回 `puzzle_id`，前端使用 `puzzle_id || puzzleId || id`
- ✅ 已添加兼容性处理

---

### 6.2 生成新章节

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ StoryDirectorScreen.handleGenerate()                                         │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: chaptersAPI.generate(bookId, userId, plotSelection?, characterIds?) │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "userId": string,                                                        │
│     "plotSelection": {             // 可选                                   │
│       "weather": string,                                                     │
│       "adventureType": string,                                               │
│       "terrain": string,                                                     │
│       "equipment": string[]                                                  │
│     },                                                                       │
│     "characterIds": string[]       // ⚠️ 必须是字符串数组，不是对象数组        │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /chapters-generate/books/{bookId}
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/chapters-generate.js onRequestPost()                 │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 接收参数:                                                                     │
│   - bookId: string (从URL)                                                   │
│   - userId: string (从body)                                                  │
│   - plotSelection: object (可选)                                              │
│   - characterIds: string[] (可选) - 后端用于过滤角色                          │
│                                                                              │
│ 后端处理逻辑:                                                                 │
│   1. 从book_characters表获取书籍所有角色                                       │
│   2. 如果characterIds有值，过滤出匹配的角色                                    │
│   3. 使用过滤后的角色生成故事                                                  │
│                                                                              │
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "chapterId": string,         // 创建的章节ID                              │
│     "chapterNumber": number,     // 章节序号                                  │
│     "title": string,             // 章节标题                                  │
│     "hasPuzzle": boolean,        // 是否有谜题                                │
│     "prompt": string,            // AI提示词                                  │
│     "message": string            // "章节生成成功"                            │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: 
- ⚠️ **发现问题**: 前端曾传递对象数组 `[{character_id, role_type, custom_name}]`
- ✅ **已修复**: 改为传递字符串数组 `['id1', 'id2', ...]`

---

## 七、谜题调用链

### 7.1 提交谜题答案

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ChapterScreen.handleAnswer()                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ APP API: puzzleAPI.submit(puzzleId, userId, userAnswer)                      │
│ ────────────────────────────────────────────────                             │
│ 请求体 (Request Body):                                                        │
│   {                                                                          │
│     "puzzleId": string,      // 谜题ID                                       │
│     "userId": string,        // 用户ID                                       │
│     "userAnswer": string     // 用户答案                                     │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼ POST /puzzle
┌──────────────────────────────────────────────────────────────────────────────┐
│ 后端 API: functions/api/puzzle.js onRequestPost()                            │
│ ─────────────────────────────────────────────────────────────────────────────│
│ 返回体 (Response Body):                                                       │
│   {                                                                          │
│     "isCorrect": boolean,         // 是否正确                                │
│     "attempts": number,           // 已尝试次数                              │
│     "attemptsRemaining": number,  // 剩余尝试次数                             │
│     "hint": string,               // 提示 (可选，尝试2次后)                    │
│     "message": string             // 结果消息                                │
│   }                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Schema一致性检查**: ✅ 一致

---

## 八、Schema一致性检查汇总

### 8.1 后端返回字段 vs 前端使用

| 后端字段 (snake_case) | 前端兼容处理 | 状态 |
|----------------------|-------------|------|
| `user_id` | 直接使用 | ✅ |
| `character_id` | `item.character_id \|\| item.characterId \|\| item.id` | ✅ 已修复 |
| `book_id` | `item.book_id \|\| item.bookId \|\| item.id` | ✅ 已修复 |
| `chapter_id` | `item.chapter_id \|\| item.chapterId \|\| item.id` | ✅ 已修复 |
| `puzzle_id` | `item.puzzle_id \|\| item.puzzleId \|\| item.id` | ✅ 已修复 |
| `chapter_number` | `item.chapter_number \|\| item.chapterNumber` | ✅ 已修复 |
| `has_puzzle` | `item.has_puzzle \|\| item.hasPuzzle` | ✅ 已修复 |
| `puzzle_result` | `item.puzzle_result \|\| item.puzzleResult` | ✅ 已修复 |
| `custom_name` | `item.custom_name \|\| item.customName \|\| item.name` | ✅ 已修复 |
| `role_type` | `item.role_type \|\| item.roleType` | ✅ 已修复 |
| `creator_id` | `item.creator_id \|\| item.creatorId` | ✅ 已修复 |
| `chapter_count` | `item.chapter_count \|\| item.chapterCount \|\| 0` | ✅ 已修复 |
| `daily_time_limit` | `item.daily_time_limit \|\| item.dailyTimeLimit \|\| 120` | ✅ 已修复 |
| `time_used_today` | `item.time_used_today \|\| item.timeUsedToday \|\| 0` | ✅ 已修复 |
| `speaking_style` | `item.speaking_style \|\| item.speakingStyle \|\| '正常'` | ✅ 已修复 |
| `word_count` | `item.word_count \|\| item.wordCount \|\| 0` | ✅ 已修复 |
| `story_context` | `item.story_context \|\| item.storyContext` | ✅ 已修复 |
| `weekly_data` | `item.weekly_data \|\| item.weeklyData \|\| []` | ✅ 已修复 |
| `stories_completed` | `item.stories_completed \|\| item.storiesCompleted \|\| 0` | ✅ 已修复 |
| `chapters_completed` | `item.chapters_completed \|\| item.chaptersCompleted \|\| 0` | ✅ 已修复 |
| `puzzles_solved` | `item.puzzles_solved \|\| item.puzzlesSolved \|\| 0` | ✅ 已修复 |

### 8.2 APP API请求字段 vs 后端接收

| APP API字段 (camelCase) | 后端接收字段 | 状态 |
|------------------------|-------------|------|
| `userId` | `userId` | ✅ 一致 |
| `bookId` | `bookId` | ✅ 一致 |
| `characterId` | `characterId` | ✅ 一致 |
| `customName` | `customName` | ✅ 一致 |
| `roleType` | `roleType` | ✅ 一致 |
| `plotSelection` | `plotSelection` | ✅ 一致 |
| `characterIds` | `characterIds` | ✅ 一致 |
| `puzzleId` | `puzzleId` | ✅ 一致 |
| `userAnswer` | `userAnswer` | ✅ 一致 |
| `speakingStyle` | `speakingStyle` | ✅ 一致 |
| `creatorId` | `creatorId` | ✅ 一致 |

---

## 九、结论

### 9.1 Schema一致性状态

- **请求参数**: APP API使用驼峰命名，后端接收也使用驼峰命名 ✅ 完全一致
- **响应数据**: 后端返回下划线命名，前端已添加兼容性处理 ✅ 已修复

### 9.2 修复措施

所有字段命名不一致的问题已通过以下方式修复：
1. 在Screen层添加字段兼容性处理
2. 在组件层添加字段兼容性处理
3. 保持APP API层的驼峰命名不变

### 9.3 建议

1. **统一命名规范**: 建议后端API统一使用驼峰命名，或在前端API层添加字段转换
2. **类型定义**: 建议创建TypeScript类型定义文件，明确字段命名规范
3. **自动化测试**: 添加Schema验证测试，确保前后端接口一致性
