const { onRequestGet, onRequestPost, onRequestPut, onRequestDelete } = require('../../../../functions/api/book.js')

const mockDb = {
    prepare: jest.fn((query) => ({
        bind: jest.fn((...args) => ({
            run: jest.fn(),
            first: jest.fn(),
            all: jest.fn(() => ({ results: [] }))
        }))
    }))
}

const mockEnv = {
    DB: mockDb
}

function createRequest(url, options = {}) {
    return {
        url,
        headers: {
            get: jest.fn((name) => options.headers?.[name] || null)
        },
        json: jest.fn(() => Promise.resolve(options.body || {}))
    }
}

describe('Book API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/book?action=list', () => {
        it('should require user_id', async () => {
            const request = createRequest('http://localhost/api/book?action=list')
            
            global.Response = class {
                constructor(body, init) {
                    this.status = init?.status || 200
                    this._body = body
                }
                json() { return Promise.resolve(JSON.parse(this._body)) }
            }
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should return books for user', async () => {
            mockDb.prepare().bind().all.mockReturnValue({
                results: [{ id: 'book-001', title: 'My Book', chapter_count: 2 }]
            })
            
            const request = createRequest('http://localhost/api/book?action=list&user_id=user123')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(Array.isArray(data.books)).toBe(true)
        })
    })

    describe('GET /api/book?action=detail', () => {
        it('should require id', async () => {
            const request = createRequest('http://localhost/api/book?action=detail')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should return 404 for non-existent book', async () => {
            mockDb.prepare().bind().first.mockReturnValue(null)
            
            const request = createRequest('http://localhost/api/book?action=detail&id=nonexistent')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(404)
            expect(data.success).toBe(false)
        })
    })

    describe('POST /api/book?action=create', () => {
        it('should require authorization', async () => {
            const request = createRequest('http://localhost/api/book?action=create', {
                body: { title: 'New Book' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even with empty title', async () => {
            const request = createRequest('http://localhost/api/book?action=create', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: { title: '' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })

    describe('PUT /api/book?action=update', () => {
        it('should require authorization', async () => {
            const request = createRequest('http://localhost/api/book?action=update', {
                body: { id: 'book-001', title: 'Updated Title' }
            })
            
            const response = await onRequestPut({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })

    describe('DELETE /api/book?action=delete', () => {
        it('should require authorization', async () => {
            const request = createRequest('http://localhost/api/book?action=delete&id=book-001')
            
            const response = await onRequestDelete({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even without id', async () => {
            const request = createRequest('http://localhost/api/book?action=delete', {
                headers: { 'Authorization': 'Bearer validtoken' }
            })
            
            const response = await onRequestDelete({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })
})
