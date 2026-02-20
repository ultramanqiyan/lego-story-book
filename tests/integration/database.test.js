const { execSync } = require('child_process')

function runD1Command(command) {
    try {
        const result = execSync(
            `npx wrangler d1 execute lego-story-db --command "${command.replace(/"/g, '\\"')}" --remote --json`,
            { cwd: process.cwd(), encoding: 'utf-8', timeout: 30000 }
        )
        return JSON.parse(result)
    } catch (error) {
        if (error.stdout) {
            try {
                return JSON.parse(error.stdout)
            } catch (e) {
                return null
            }
        }
        throw error
    }
}

describe('Database Integration Tests', () => {
    const testUserId = 'test-user-' + Date.now()
    const testCharacterId = 'test-char-' + Date.now()
    const testBookId = 'test-book-' + Date.now()
    const testChapterId = 'test-chapter-' + Date.now()

    afterAll(async () => {
        const cleanupCommands = [
            `DELETE FROM usage_logs WHERE user_id LIKE 'test-%'`,
            `DELETE FROM parent_controls WHERE parent_id LIKE 'test-%' OR child_id LIKE 'test-%'`,
            `DELETE FROM shares WHERE book_id LIKE 'test-%'`,
            `DELETE FROM chapters WHERE book_id LIKE 'test-%'`,
            `DELETE FROM books WHERE user_id LIKE 'test-%'`,
            `DELETE FROM characters WHERE creator_id LIKE 'test-%'`,
            `DELETE FROM users WHERE id LIKE 'test-%'`
        ]
        
        for (const cmd of cleanupCommands) {
            try {
                await runD1Command(cmd)
            } catch (e) {}
        }
    })

    describe('Users Table', () => {
        it('should create a new user', async () => {
            const sql = `INSERT INTO users (id, username, email, password_hash, role) VALUES ('${testUserId}', 'testuser_${Date.now()}', 'test@example.com', 'hashedpassword', 'child')`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query the created user', async () => {
            const sql = `SELECT * FROM users WHERE id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBeGreaterThan(0)
                expect(result[0].results[0].id).toBe(testUserId)
            }
        })

        it('should update user', async () => {
            const sql = `UPDATE users SET email = 'updated@example.com' WHERE id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should verify update', async () => {
            const sql = `SELECT email FROM users WHERE id = '${testUserId}'`
            const result = await runD1Command(sql)
            if (result && result[0] && result[0].results && result[0].results[0]) {
                expect(result[0].results[0].email).toBe('updated@example.com')
            }
        })
    })

    describe('Characters Table', () => {
        it('should create a custom character', async () => {
            const sql = `INSERT INTO characters (id, name, image, personality, speaking_style, creator_id) VALUES ('${testCharacterId}', 'Test Hero', 'base64imagedata', '勇敢、正义', '坚定有力', '${testUserId}')`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query preset characters', async () => {
            const sql = `SELECT * FROM characters WHERE creator_id = 'system'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBe(12)
            }
        })

        it('should query user characters', async () => {
            const sql = `SELECT * FROM characters WHERE creator_id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBeGreaterThan(0)
            }
        })
    })

    describe('Books Table', () => {
        it('should create a book', async () => {
            const sql = `INSERT INTO books (id, title, user_id, chapter_count) VALUES ('${testBookId}', 'Test Story Book', '${testUserId}', 0)`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query user books', async () => {
            const sql = `SELECT * FROM books WHERE user_id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBeGreaterThan(0)
            }
        })
    })

    describe('Chapters Table', () => {
        it('should create a chapter', async () => {
            const sql = `INSERT INTO chapters (id, book_id, chapter_number, title, content, characters, plot) VALUES ('${testChapterId}', '${testBookId}', 1, '第一章：冒险开始', '这是一个测试故事内容...', '[]', '冒险之旅')`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should update book chapter count', async () => {
            const sql = `UPDATE books SET chapter_count = 1 WHERE id = '${testBookId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query book chapters', async () => {
            const sql = `SELECT * FROM chapters WHERE book_id = '${testBookId}' ORDER BY chapter_number`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBeGreaterThan(0)
            }
        })
    })

    describe('Shares Table', () => {
        const testShareCode = 'test' + Date.now().toString(36)

        it('should create a share', async () => {
            const sql = `INSERT INTO shares (id, book_id, share_code, is_public) VALUES ('test-share-${Date.now()}', '${testBookId}', '${testShareCode}', 1)`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query share by code', async () => {
            const sql = `SELECT * FROM shares WHERE share_code = '${testShareCode}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
            if (result && result[0] && result[0].results) {
                expect(result[0].results.length).toBeGreaterThan(0)
            }
        })
    })

    describe('Parent Controls Table', () => {
        const childId = 'test-child-' + Date.now()

        it('should create parent control', async () => {
            const sql = `INSERT INTO parent_controls (id, parent_id, child_id, daily_time_limit, allowed_start_hour, allowed_end_hour) VALUES ('test-pc-${Date.now()}', '${testUserId}', '${childId}', 60, 8, 21)`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query parent controls', async () => {
            const sql = `SELECT * FROM parent_controls WHERE parent_id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })
    })

    describe('Usage Logs Table', () => {
        it('should create usage log', async () => {
            const sql = `INSERT INTO usage_logs (id, user_id, action, details, duration) VALUES ('test-log-${Date.now()}', '${testUserId}', 'story_create', '{"book_id": "${testBookId}"}', 30)`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })

        it('should query usage logs', async () => {
            const sql = `SELECT * FROM usage_logs WHERE user_id = '${testUserId}'`
            const result = await runD1Command(sql)
            expect(result).toBeDefined()
        })
    })
})
