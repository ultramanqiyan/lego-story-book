# 乐高故事书籍功能 - 测试文档

## 1. 测试概述

### 1.1 测试目标
- 确保所有功能正常运行
- 验证所有边界情况和异常情况
- 确保数据库操作正确
- 验证页面展示功能和Page Function的联调正常

### 1.2 测试范围
- 单元测试：每个函数的测试，代码分支覆盖
- 集成测试：模块间交互测试
- 端到端测试：完整用户流程测试

### 1.3 测试环境
- 测试框架：Jest + React Testing Library
- E2E测试：Playwright
- 数据库：真实Cloudflare D1数据库
- AI功能：Mock API

## 2. 单元测试

### 2.1 工具函数测试

#### 2.1.1 测试文件: `tests/unit/lib/utils.test.js`

```javascript
describe('Utils Functions', () => {
    describe('generateId', () => {
        it('should generate unique ID', () => {
            const id1 = generateId()
            const id2 = generateId()
            expect(id1).not.toBe(id2)
        })
        
        it('should generate ID with correct length', () => {
            const id = generateId()
            expect(id.length).toBe(16)
        })
    })
    
    describe('formatDate', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-01-15T10:30:00Z')
            expect(formatDate(date)).toBe('2024-01-15 10:30')
        })
        
        it('should handle invalid date', () => {
            expect(formatDate(null)).toBe('')
            expect(formatDate('invalid')).toBe('')
        })
    })
    
    describe('highlightKeywords', () => {
        it('should highlight character names in red', () => {
            const text = '蝙蝠侠飞向天空'
            const keywords = { names: ['蝙蝠侠'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: red')
        })
        
        it('should highlight action words in purple', () => {
            const text = '他快速奔跑'
            const keywords = { actions: ['奔跑'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: purple')
        })
        
        it('should highlight emotion words in green', () => {
            const text = '他感到快乐'
            const keywords = { emotions: ['快乐'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: green')
        })
        
        it('should highlight location words in yellow', () => {
            const text = '他来到城堡'
            const keywords = { locations: ['城堡'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: yellow')
        })
    })
    
    describe('validateInput', () => {
        it('should validate username', () => {
            expect(validateInput('username', 'test123')).toBe(true)
            expect(validateInput('username', 'ab')).toBe(false)
            expect(validateInput('username', '')).toBe(false)
        })
        
        it('should validate email', () => {
            expect(validateInput('email', 'test@example.com')).toBe(true)
            expect(validateInput('email', 'invalid')).toBe(false)
        })
        
        it('should validate password', () => {
            expect(validateInput('password', 'Password123')).toBe(true)
            expect(validateInput('password', '123')).toBe(false)
        })
    })
})
```

### 2.2 数据库操作测试

#### 2.2.1 测试文件: `tests/unit/lib/db.test.js`

```javascript
describe('Database Operations', () => {
    let db
    
    beforeAll(async () => {
        db = await getTestDatabase()
    })
    
    describe('User Operations', () => {
        it('should create user', async () => {
            const user = await createUser(db, {
                username: 'testuser',
                email: 'test@example.com',
                password_hash: 'hashedpassword',
                role: 'child'
            })
            expect(user.id).toBeDefined()
            expect(user.username).toBe('testuser')
        })
        
        it('should not create duplicate user', async () => {
            await createUser(db, {
                username: 'duplicate',
                email: 'dup@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await expect(createUser(db, {
                username: 'duplicate',
                email: 'dup2@example.com',
                password_hash: 'hash',
                role: 'child'
            })).rejects.toThrow()
        })
        
        it('should get user by id', async () => {
            const created = await createUser(db, {
                username: 'getuser',
                email: 'get@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const user = await getUserById(db, created.id)
            expect(user.username).toBe('getuser')
        })
        
        it('should return null for non-existent user', async () => {
            const user = await getUserById(db, 'nonexistent')
            expect(user).toBeNull()
        })
        
        it('should update user', async () => {
            const created = await createUser(db, {
                username: 'updateuser',
                email: 'update@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await updateUser(db, created.id, { email: 'newemail@example.com' })
            const user = await getUserById(db, created.id)
            expect(user.email).toBe('newemail@example.com')
        })
        
        it('should delete user', async () => {
            const created = await createUser(db, {
                username: 'deleteuser',
                email: 'delete@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await deleteUser(db, created.id)
            const user = await getUserById(db, created.id)
            expect(user).toBeNull()
        })
    })
    
    describe('Character Operations', () => {
        it('should create character', async () => {
            const character = await createCharacter(db, {
                name: 'Test Character',
                image: 'base64imagedata',
                personality: '勇敢',
                speaking_style: '低沉有力',
                creator_id: 'system'
            })
            expect(character.id).toBeDefined()
            expect(character.name).toBe('Test Character')
        })
        
        it('should get preset characters', async () => {
            const characters = await getPresetCharacters(db)
            expect(characters.length).toBe(12)
        })
        
        it('should get user characters', async () => {
            const user = await createUser(db, {
                username: 'charuser',
                email: 'char@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await createCharacter(db, {
                name: 'User Character',
                image: 'base64',
                personality: '活泼',
                speaking_style: '轻松俏皮',
                creator_id: user.id
            })
            
            const characters = await getUserCharacters(db, user.id)
            expect(characters.length).toBe(1)
            expect(characters[0].name).toBe('User Character')
        })
        
        it('should delete character', async () => {
            const character = await createCharacter(db, {
                name: 'Delete Character',
                image: 'base64',
                personality: '勇敢',
                speaking_style: '低沉',
                creator_id: 'system'
            })
            
            await deleteCharacter(db, character.id)
            const deleted = await getCharacterById(db, character.id)
            expect(deleted).toBeNull()
        })
    })
    
    describe('Book Operations', () => {
        it('should create book', async () => {
            const user = await createUser(db, {
                username: 'bookuser',
                email: 'book@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Test Book',
                user_id: user.id
            })
            expect(book.id).toBeDefined()
            expect(book.title).toBe('Test Book')
            expect(book.chapter_count).toBe(0)
        })
        
        it('should get user books', async () => {
            const user = await createUser(db, {
                username: 'booklistuser',
                email: 'booklist@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await createBook(db, { title: 'Book 1', user_id: user.id })
            await createBook(db, { title: 'Book 2', user_id: user.id })
            
            const books = await getUserBooks(db, user.id)
            expect(books.length).toBe(2)
        })
        
        it('should update book', async () => {
            const user = await createUser(db, {
                username: 'updatebookuser',
                email: 'updatebook@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Original Title',
                user_id: user.id
            })
            
            await updateBook(db, book.id, { title: 'New Title' })
            const updated = await getBookById(db, book.id)
            expect(updated.title).toBe('New Title')
        })
        
        it('should delete book and its chapters', async () => {
            const user = await createUser(db, {
                username: 'deletebookuser',
                email: 'deletebook@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Book to Delete',
                user_id: user.id
            })
            
            await createChapter(db, {
                book_id: book.id,
                chapter_number: 1,
                title: 'Chapter 1',
                content: 'Content',
                characters: '[]',
                plot: 'Plot'
            })
            
            await deleteBook(db, book.id)
            const deleted = await getBookById(db, book.id)
            expect(deleted).toBeNull()
            
            const chapters = await getBookChapters(db, book.id)
            expect(chapters.length).toBe(0)
        })
    })
    
    describe('Chapter Operations', () => {
        it('should create chapter', async () => {
            const user = await createUser(db, {
                username: 'chapteruser',
                email: 'chapter@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Chapter Book',
                user_id: user.id
            })
            
            const chapter = await createChapter(db, {
                book_id: book.id,
                chapter_number: 1,
                title: 'First Chapter',
                content: 'Once upon a time...',
                characters: JSON.stringify([{ name: 'Hero', role: 'protagonist' }]),
                plot: '冒险之旅'
            })
            
            expect(chapter.id).toBeDefined()
            expect(chapter.chapter_number).toBe(1)
            
            const updatedBook = await getBookById(db, book.id)
            expect(updatedBook.chapter_count).toBe(1)
        })
        
        it('should get book chapters in order', async () => {
            const user = await createUser(db, {
                username: 'chapterorderuser',
                email: 'chapterorder@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Ordered Book',
                user_id: user.id
            })
            
            await createChapter(db, {
                book_id: book.id,
                chapter_number: 2,
                title: 'Chapter 2',
                content: 'Content 2',
                characters: '[]',
                plot: 'Plot'
            })
            
            await createChapter(db, {
                book_id: book.id,
                chapter_number: 1,
                title: 'Chapter 1',
                content: 'Content 1',
                characters: '[]',
                plot: 'Plot'
            })
            
            const chapters = await getBookChapters(db, book.id)
            expect(chapters[0].chapter_number).toBe(1)
            expect(chapters[1].chapter_number).toBe(2)
        })
    })
    
    describe('Share Operations', () => {
        it('should create share', async () => {
            const user = await createUser(db, {
                username: 'shareuser',
                email: 'share@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Share Book',
                user_id: user.id
            })
            
            const share = await createShare(db, {
                book_id: book.id,
                is_public: true
            })
            
            expect(share.id).toBeDefined()
            expect(share.share_code).toBeDefined()
            expect(share.share_code.length).toBe(8)
        })
        
        it('should access public share', async () => {
            const user = await createUser(db, {
                username: 'publicshareuser',
                email: 'publicshare@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Public Book',
                user_id: user.id
            })
            
            const share = await createShare(db, {
                book_id: book.id,
                is_public: true
            })
            
            const sharedBook = await accessShare(db, share.share_code)
            expect(sharedBook.title).toBe('Public Book')
        })
        
        it('should require password for private share', async () => {
            const user = await createUser(db, {
                username: 'privateshareuser',
                email: 'privateshare@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            const book = await createBook(db, {
                title: 'Private Book',
                user_id: user.id
            })
            
            const share = await createShare(db, {
                book_id: book.id,
                is_public: false,
                password: 'secret123'
            })
            
            await expect(accessShare(db, share.share_code)).rejects.toThrow()
            
            const sharedBook = await accessShare(db, share.share_code, 'secret123')
            expect(sharedBook.title).toBe('Private Book')
        })
    })
    
    describe('Parent Control Operations', () => {
        it('should bind child account', async () => {
            const parent = await createUser(db, {
                username: 'parent1',
                email: 'parent1@example.com',
                password_hash: 'hash',
                role: 'parent'
            })
            
            const child = await createUser(db, {
                username: 'child1',
                email: 'child1@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await bindChild(db, parent.id, child.id)
            
            const updatedChild = await getUserById(db, child.id)
            expect(updatedChild.parent_id).toBe(parent.id)
        })
        
        it('should set control rules', async () => {
            const parent = await createUser(db, {
                username: 'parent2',
                email: 'parent2@example.com',
                password_hash: 'hash',
                role: 'parent'
            })
            
            const child = await createUser(db, {
                username: 'child2',
                email: 'child2@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await setParentControls(db, {
                parent_id: parent.id,
                child_id: child.id,
                daily_time_limit: 60,
                allowed_start_hour: 8,
                allowed_end_hour: 21,
                break_reminder_interval: 30,
                content_filter_level: 'medium'
            })
            
            const controls = await getParentControls(db, child.id)
            expect(controls.daily_time_limit).toBe(60)
            expect(controls.allowed_start_hour).toBe(8)
        })
        
        it('should log usage', async () => {
            const user = await createUser(db, {
                username: 'usageuser',
                email: 'usage@example.com',
                password_hash: 'hash',
                role: 'child'
            })
            
            await logUsage(db, {
                user_id: user.id,
                action: 'story_create',
                details: JSON.stringify({ book_id: 'book123' }),
                duration: 30
            })
            
            const logs = await getUsageLogs(db, user.id)
            expect(logs.length).toBe(1)
            expect(logs[0].action).toBe('story_create')
        })
    })
})
```

### 2.3 Page Function测试

#### 2.3.1 测试文件: `tests/unit/functions/api/user.test.js`

```javascript
describe('User API', () => {
    describe('POST /api/user?action=register', () => {
        it('should register new user', async () => {
            const request = new Request('http://localhost/api/user?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'Password123',
                    role: 'child'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.user.username).toBe('newuser')
        })
        
        it('should reject duplicate username', async () => {
            const userData = {
                username: 'duplicateuser',
                email: 'duplicate@example.com',
                password: 'Password123',
                role: 'child'
            }
            
            const request1 = new Request('http://localhost/api/user?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            
            const context1 = { request: request1, env: getTestEnv() }
            await onRequestPost(context1)
            
            const request2 = new Request('http://localhost/api/user?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...userData,
                    email: 'different@example.com'
                })
            })
            
            const context2 = { request: request2, env: getTestEnv() }
            const response = await onRequestPost(context2)
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
        
        it('should validate input fields', async () => {
            const request = new Request('http://localhost/api/user?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'ab',
                    email: 'invalid',
                    password: '123',
                    role: 'child'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })
    
    describe('POST /api/user?action=login', () => {
        it('should login with correct credentials', async () => {
            const request = new Request('http://localhost/api/user?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'Password123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.token).toBeDefined()
        })
        
        it('should reject wrong password', async () => {
            const request = new Request('http://localhost/api/user?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'wrongpassword'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
        
        it('should reject non-existent user', async () => {
            const request = new Request('http://localhost/api/user?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'nonexistent',
                    password: 'Password123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })
    
    describe('GET /api/user?action=info', () => {
        it('should return user info with valid token', async () => {
            const token = generateTestToken({ id: 'user123', username: 'testuser' })
            const request = new Request('http://localhost/api/user?action=info', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.user.username).toBe('testuser')
        })
        
        it('should reject without token', async () => {
            const request = new Request('http://localhost/api/user?action=info', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
        
        it('should reject invalid token', async () => {
            const request = new Request('http://localhost/api/user?action=info', {
                method: 'GET',
                headers: { 'Authorization': 'Bearer invalidtoken' }
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })
})
```

#### 2.3.2 测试文件: `tests/unit/functions/api/character.test.js`

```javascript
describe('Character API', () => {
    describe('GET /api/character?action=preset', () => {
        it('should return 12 preset characters', async () => {
            const request = new Request('http://localhost/api/character?action=preset', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.characters.length).toBe(12)
        })
        
        it('should include all required fields', async () => {
            const request = new Request('http://localhost/api/character?action=preset', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            const character = data.characters[0]
            expect(character.id).toBeDefined()
            expect(character.name).toBeDefined()
            expect(character.image).toBeDefined()
            expect(character.personality).toBeDefined()
            expect(character.speaking_style).toBeDefined()
        })
    })
    
    describe('GET /api/character?action=list', () => {
        it('should return user characters', async () => {
            const userId = 'test-user-123'
            const request = new Request(`http://localhost/api/character?action=list&user_id=${userId}`, {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(Array.isArray(data.characters)).toBe(true)
        })
    })
    
    describe('POST /api/character?action=create', () => {
        it('should create character with valid data', async () => {
            const request = new Request('http://localhost/api/character?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'My Character',
                    image: 'data:image/png;base64,testimagedata',
                    description: 'A test character',
                    personality: '勇敢',
                    speaking_style: '低沉有力',
                    creator_id: 'user123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.character.name).toBe('My Character')
        })
        
        it('should reject missing required fields', async () => {
            const request = new Request('http://localhost/api/character?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Incomplete Character'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })
    
    describe('DELETE /api/character?action=delete', () => {
        it('should delete existing character', async () => {
            const characterId = 'char-to-delete'
            const request = new Request(`http://localhost/api/character?action=delete&id=${characterId}`, {
                method: 'DELETE'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestDelete(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
        })
        
        it('should handle non-existent character', async () => {
            const request = new Request('http://localhost/api/character?action=delete&id=nonexistent', {
                method: 'DELETE'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestDelete(context)
            const data = await response.json()
            
            expect(response.status).toBe(404)
            expect(data.success).toBe(false)
        })
    })
})
```

#### 2.3.3 测试文件: `tests/unit/functions/api/book.test.js`

```javascript
describe('Book API', () => {
    describe('POST /api/book?action=create', () => {
        it('should create book', async () => {
            const request = new Request('http://localhost/api/book?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'My First Book',
                    user_id: 'user123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.book.title).toBe('My First Book')
            expect(data.book.chapter_count).toBe(0)
        })
        
        it('should reject empty title', async () => {
            const request = new Request('http://localhost/api/book?action=create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: '',
                    user_id: 'user123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })
    
    describe('GET /api/book?action=list', () => {
        it('should return user books', async () => {
            const request = new Request('http://localhost/api/book?action=list&user_id=user123', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(Array.isArray(data.books)).toBe(true)
        })
    })
    
    describe('GET /api/book?action=detail', () => {
        it('should return book with chapters', async () => {
            const bookId = 'book-with-chapters'
            const request = new Request(`http://localhost/api/book?action=detail&id=${bookId}`, {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.book.chapters).toBeDefined()
            expect(Array.isArray(data.book.chapters)).toBe(true)
        })
        
        it('should return 404 for non-existent book', async () => {
            const request = new Request('http://localhost/api/book?action=detail&id=nonexistent', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(404)
            expect(data.success).toBe(false)
        })
    })
    
    describe('PUT /api/book?action=update', () => {
        it('should update book title', async () => {
            const request = new Request('http://localhost/api/book?action=update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 'book-to-update',
                    title: 'Updated Title'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPut(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
        })
    })
    
    describe('DELETE /api/book?action=delete', () => {
        it('should delete book', async () => {
            const request = new Request('http://localhost/api/book?action=delete&id=book-to-delete', {
                method: 'DELETE'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestDelete(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
        })
    })
})
```

#### 2.3.4 测试文件: `tests/unit/functions/api/chapter.test.js`

```javascript
describe('Chapter API', () => {
    describe('POST /api/chapter?action=generate', () => {
        it('should generate chapter with mock API', async () => {
            const request = new Request('http://localhost/api/chapter?action=generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: 'book123',
                    characters: [
                        { id: 'char1', name: '蝙蝠侠', role: 'protagonist', nickname: '蝙蝠侠' }
                    ],
                    plot: '冒险之旅',
                    previous_chapters: []
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.chapter.title).toBeDefined()
            expect(data.chapter.content).toBeDefined()
            expect(data.chapter.chapter_number).toBe(1)
        })
        
        it('should continue story from previous chapters', async () => {
            const request = new Request('http://localhost/api/chapter?action=generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: 'book123',
                    characters: [
                        { id: 'char1', name: '蝙蝠侠', role: 'protagonist' }
                    ],
                    plot: '继续冒险',
                    previous_chapters: [
                        { chapter_number: 1, title: '开始', content: '故事开始了...' }
                    ]
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.chapter.chapter_number).toBe(2)
        })
        
        it('should handle API failure with fallback', async () => {
            const request = new Request('http://localhost/api/chapter?action=generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: 'book123',
                    characters: [
                        { id: 'char1', name: '蝙蝠侠', role: 'protagonist' }
                    ],
                    plot: '冒险之旅',
                    previous_chapters: [],
                    simulate_failure: true
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
        })
        
        it('should validate required fields', async () => {
            const request = new Request('http://localhost/api/chapter?action=generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: 'book123'
                })
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestPost(context)
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })
    
    describe('GET /api/chapter?action=detail', () => {
        it('should return chapter details', async () => {
            const request = new Request('http://localhost/api/chapter?action=detail&id=chapter123', {
                method: 'GET'
            })
            
            const context = { request, env: getTestEnv() }
            const response = await onRequestGet(context)
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.chapter.content).toBeDefined()
        })
    })
})
```

### 2.4 组件测试

#### 2.4.1 测试文件: `tests/unit/components/CharacterCard.test.js`

```javascript
describe('CharacterCard Component', () => {
    const mockCharacter = {
        id: 'char1',
        name: '蝙蝠侠',
        image: 'base64imagedata',
        personality: '勇敢、正义、严肃',
        speaking_style: '低沉有力'
    }
    
    it('should render character name', () => {
        render(<CharacterCard character={mockCharacter} />)
        expect(screen.getByText('蝙蝠侠')).toBeInTheDocument()
    })
    
    it('should render character image', () => {
        render(<CharacterCard character={mockCharacter} />)
        const image = screen.getByAltText('蝙蝠侠')
        expect(image).toBeInTheDocument()
        expect(image.src).toContain('base64imagedata')
    })
    
    it('should call onSelect when clicked', () => {
        const onSelect = jest.fn()
        render(<CharacterCard character={mockCharacter} onSelect={onSelect} />)
        
        fireEvent.click(screen.getByText('蝙蝠侠'))
        expect(onSelect).toHaveBeenCalledWith(mockCharacter)
    })
    
    it('should show selected state', () => {
        render(<CharacterCard character={mockCharacter} selected={true} />)
        const card = screen.getByTestId('character-card')
        expect(card).toHaveClass('selected')
    })
    
    it('should show delete button when deletable', () => {
        const onDelete = jest.fn()
        render(<CharacterCard character={mockCharacter} deletable={true} onDelete={onDelete} />)
        
        const deleteButton = screen.getByTestId('delete-button')
        expect(deleteButton).toBeInTheDocument()
        
        fireEvent.click(deleteButton)
        expect(onDelete).toHaveBeenCalledWith(mockCharacter.id)
    })
})
```

#### 2.4.2 测试文件: `tests/unit/components/StoryDisplay.test.js`

```javascript
describe('StoryDisplay Component', () => {
    const mockStory = {
        title: '第一章：冒险开始',
        content: '蝙蝠侠勇敢地飞向天空，来到了神秘的城堡。他感到兴奋，准备开始新的冒险。',
        characters: [
            { name: '蝙蝠侠', image: 'base64image' }
        ]
    }
    
    const mockKeywords = {
        names: ['蝙蝠侠'],
        actions: ['飞向', '来到'],
        emotions: ['兴奋'],
        locations: ['城堡', '天空']
    }
    
    it('should render story title', () => {
        render(<StoryDisplay story={mockStory} keywords={mockKeywords} />)
        expect(screen.getByText('第一章：冒险开始')).toBeInTheDocument()
    })
    
    it('should render story content', () => {
        render(<StoryDisplay story={mockStory} keywords={mockKeywords} />)
        expect(screen.getByText(/蝙蝠侠/)).toBeInTheDocument()
    })
    
    it('should highlight character names in red', () => {
        render(<StoryDisplay story={mockStory} keywords={mockKeywords} />)
        const highlightedName = screen.getByText('蝙蝠侠')
        expect(highlightedName).toHaveStyle({ color: 'red' })
    })
    
    it('should highlight action words in purple', () => {
        render(<StoryDisplay story={mockStory} keywords={mockKeywords} />)
        const highlightedAction = screen.getByText('飞向')
        expect(highlightedAction).toHaveStyle({ color: 'purple' })
    })
    
    it('should show character image next to name', () => {
        render(<StoryDisplay story={mockStory} keywords={mockKeywords} />)
        const image = screen.getByAltText('蝙蝠侠')
        expect(image).toBeInTheDocument()
    })
})
```

## 3. 集成测试

### 3.1 测试文件: `tests/integration/story-creation.test.js`

```javascript
describe('Story Creation Flow', () => {
    let db
    let testUser
    let testBook
    
    beforeAll(async () => {
        db = await getTestDatabase()
        testUser = await createUser(db, {
            username: 'integrationuser',
            email: 'integration@example.com',
            password_hash: await hashPassword('Password123'),
            role: 'child'
        })
        testBook = await createBook(db, {
            title: 'Integration Test Book',
            user_id: testUser.id
        })
    })
    
    it('should create complete story flow', async () => {
        const characters = await getPresetCharacters(db)
        const selectedCharacters = [
            { ...characters[0], role: 'protagonist', nickname: characters[0].name }
        ]
        
        const chapterRequest = {
            book_id: testBook.id,
            characters: selectedCharacters.map(c => ({
                id: c.id,
                name: c.name,
                role: c.role,
                nickname: c.nickname
            })),
            plot: '冒险之旅',
            previous_chapters: []
        }
        
        const request = new Request('http://localhost/api/chapter?action=generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapterRequest)
        })
        
        const context = { request, env: getTestEnv() }
        const response = await onRequestPost(context)
        const data = await response.json()
        
        expect(data.success).toBe(true)
        expect(data.chapter.chapter_number).toBe(1)
        
        const updatedBook = await getBookById(db, testBook.id)
        expect(updatedBook.chapter_count).toBe(1)
    })
    
    it('should continue story with existing chapters', async () => {
        const existingChapters = await getBookChapters(db, testBook.id)
        
        const chapterRequest = {
            book_id: testBook.id,
            characters: [{ id: 'char1', name: '蝙蝠侠', role: 'protagonist' }],
            plot: '神秘谜团',
            previous_chapters: existingChapters
        }
        
        const request = new Request('http://localhost/api/chapter?action=generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapterRequest)
        })
        
        const context = { request, env: getTestEnv() }
        const response = await onRequestPost(context)
        const data = await response.json()
        
        expect(data.success).toBe(true)
        expect(data.chapter.chapter_number).toBe(2)
    })
})
```

### 3.2 测试文件: `tests/integration/share-flow.test.js`

```javascript
describe('Share Flow', () => {
    let db
    let testUser
    let testBook
    
    beforeAll(async () => {
        db = await getTestDatabase()
        testUser = await createUser(db, {
            username: 'shareuser',
            email: 'share@example.com',
            password_hash: 'hash',
            role: 'child'
        })
        testBook = await createBook(db, {
            title: 'Share Test Book',
            user_id: testUser.id
        })
        await createChapter(db, {
            book_id: testBook.id,
            chapter_number: 1,
            title: 'Chapter 1',
            content: 'Content',
            characters: '[]',
            plot: 'Plot'
        })
    })
    
    it('should create and access public share', async () => {
        const createRequest = new Request('http://localhost/api/share?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                book_id: testBook.id,
                is_public: true
            })
        })
        
        const createContext = { request: createRequest, env: getTestEnv() }
        const createResponse = await onRequestPost(createContext)
        const createData = await createResponse.json()
        
        expect(createData.success).toBe(true)
        expect(createData.share.share_code).toBeDefined()
        
        const accessRequest = new Request(`http://localhost/api/share?action=access&code=${createData.share.share_code}`, {
            method: 'POST'
        })
        
        const accessContext = { request: accessRequest, env: getTestEnv() }
        const accessResponse = await onRequestPost(accessContext)
        const accessData = await accessResponse.json()
        
        expect(accessData.success).toBe(true)
        expect(accessData.book.title).toBe('Share Test Book')
    })
    
    it('should create and access private share with password', async () => {
        const createRequest = new Request('http://localhost/api/share?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                book_id: testBook.id,
                is_public: false,
                password: 'secret123'
            })
        })
        
        const createContext = { request: createRequest, env: getTestEnv() }
        const createResponse = await onRequestPost(createContext)
        const createData = await createResponse.json()
        
        expect(createData.success).toBe(true)
        
        const accessWithoutPassword = new Request(`http://localhost/api/share?action=access&code=${createData.share.share_code}`, {
            method: 'POST'
        })
        
        const noPasswordContext = { request: accessWithoutPassword, env: getTestEnv() }
        const noPasswordResponse = await onRequestPost(noPasswordContext)
        const noPasswordData = await noPasswordResponse.json()
        
        expect(noPasswordData.success).toBe(false)
        
        const accessWithPassword = new Request(`http://localhost/api/share?action=access&code=${createData.share.share_code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'secret123' })
        })
        
        const passwordContext = { request: accessWithPassword, env: getTestEnv() }
        const passwordResponse = await onRequestPost(passwordContext)
        const passwordData = await passwordResponse.json()
        
        expect(passwordData.success).toBe(true)
    })
})
```

## 4. 端到端测试

### 4.1 测试文件: `tests/e2e/user-journey.spec.js`

```javascript
import { test, expect } from '@playwright/test'

test.describe('User Journey', () => {
    test('should complete full story creation flow', async ({ page }) => {
        await page.goto('/login')
        
        await page.fill('input[name="username"]', 'testuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await expect(page).toHaveURL('/story-create')
        
        await page.fill('input[name="bookTitle"]', 'My First Story')
        await page.click('button:has-text("创建新书")')
        
        await page.click('[data-testid="character-batman"]')
        await page.selectOption('select[name="role"]', 'protagonist')
        await page.click('button:has-text("下一步")')
        
        await page.click('[data-testid="plot-adventure"]')
        await page.click('button:has-text("下一步")')
        
        await page.click('button:has-text("生成故事")')
        
        await expect(page.locator('[data-testid="story-content"]')).toBeVisible()
        
        await expect(page.locator('[data-testid="chapter-title"]')).toContainText('第1章')
    })
    
    test('should view and continue book', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'testuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/bookshelf')
        
        await page.click('[data-testid="book-card"]:first-child')
        
        await expect(page.locator('[data-testid="book-title"]')).toBeVisible()
        
        await page.click('button:has-text("继续生成故事")')
        
        await expect(page).toHaveURL(/\/story-create\?bookId=/)
    })
    
    test('should create custom character', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'testuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/characters')
        
        await page.click('button:has-text("创建人仔")')
        
        await page.setInputFiles('input[type="file"]', 'tests/fixtures/test-image.png')
        
        await page.click('button:has-text("生成乐高人仔")')
        
        await expect(page.locator('[data-testid="generated-image"]')).toBeVisible()
        
        await page.fill('input[name="characterName"]', 'My Hero')
        await page.selectOption('select[name="personality"]', '勇敢')
        await page.selectOption('select[name="speakingStyle"]', '低沉有力')
        
        await page.click('button:has-text("创建")')
        
        await expect(page.locator('text=My Hero')).toBeVisible()
    })
    
    test('should share book', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'testuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/bookshelf')
        await page.click('[data-testid="book-card"]:first-child')
        
        await page.click('button:has-text("分享")')
        
        await page.click('input[value="public"]')
        await page.click('button:has-text("生成分享链接")')
        
        await expect(page.locator('[data-testid="share-link"]')).toBeVisible()
        await expect(page.locator('[data-testid="qr-code"]')).toBeVisible()
    })
})
```

### 4.2 测试文件: `tests/e2e/parent-controls.spec.js`

```javascript
import { test, expect } from '@playwright/test'

test.describe('Parent Controls', () => {
    test('should bind child account', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'parentuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/parent')
        
        await page.fill('input[name="childUsername"]', 'childuser')
        await page.click('button:has-text("绑定")')
        
        await expect(page.locator('text=绑定成功')).toBeVisible()
    })
    
    test('should set time limits', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'parentuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/parent')
        
        await page.fill('input[name="dailyTimeLimit"]', '60')
        await page.fill('input[name="startHour"]', '8')
        await page.fill('input[name="endHour"]', '21')
        
        await page.click('button:has-text("保存设置")')
        
        await expect(page.locator('text=设置已保存')).toBeVisible()
    })
    
    test('should view usage statistics', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="username"]', 'parentuser')
        await page.fill('input[name="password"]', 'Password123')
        await page.click('button[type="submit"]')
        
        await page.goto('/parent')
        
        await page.click('button:has-text("查看使用统计")')
        
        await expect(page.locator('[data-testid="usage-stats"]')).toBeVisible()
    })
})
```

## 5. Mock API配置

### 5.1 Mock配置文件: `tests/mocks/api-mocks.js`

```javascript
export const mockStoryResponse = {
    title: '第一章：冒险开始',
    content: '蝙蝠侠勇敢地飞向天空，来到了神秘的城堡。他感到兴奋，准备开始新的冒险。这是一个充满未知的世界，等待着他去探索。',
    chapter_number: 1
}

export const mockImageResponse = {
    success: true,
    imageUrl: 'data:image/png;base64,mockimagedata'
}

export const mockSpeechResponse = {
    success: true,
    text: '这是一个测试的语音识别结果'
}

export function setupMocks() {
    global.fetch = jest.fn((url, options) => {
        if (url.includes('chat/completions')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    choices: [{
                        message: {
                            content: JSON.stringify(mockStoryResponse)
                        }
                    }]
                })
            })
        }
        
        if (url.includes('images/generations')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockImageResponse)
            })
        }
        
        if (url.includes('audio/transcriptions')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSpeechResponse)
            })
        }
        
        return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Not mocked' })
        })
    })
}
```

## 6. 测试覆盖率要求

### 6.1 覆盖率目标
- 语句覆盖率: >= 80%
- 分支覆盖率: >= 75%
- 函数覆盖率: >= 80%
- 行覆盖率: >= 80%

### 6.2 覆盖率配置: `jest.config.js`

```javascript
module.exports = {
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 75,
            functions: 80,
            lines: 80
        }
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        'functions/**/*.js',
        '!**/node_modules/**',
        '!**/tests/**'
    ]
}
```

## 7. 测试执行

### 7.1 运行命令
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

### 7.2 CI配置
```yaml
name: Tests
on: [push, pull_request]
jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm ci
            - run: npm run test:coverage
            - run: npm run test:e2e
```
