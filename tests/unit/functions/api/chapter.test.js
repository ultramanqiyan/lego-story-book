const { onRequestGet, onRequestPost } = require('../../../../functions/api/chapter.js')

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
    DB: mockDb,
    DOUBAO_API_KEY: 'test-api-key'
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

describe('Chapter API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/chapter?action=detail', () => {
        it('should require id', async () => {
            const request = createRequest('http://localhost/api/chapter?action=detail')
            
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

        it('should return 404 for non-existent chapter', async () => {
            mockDb.prepare().bind().first.mockReturnValue(null)
            
            const request = createRequest('http://localhost/api/chapter?action=detail&id=nonexistent')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(404)
            expect(data.success).toBe(false)
        })
    })

    describe('POST /api/chapter?action=generate', () => {
        it('should require authorization', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                body: {
                    book_id: 'book-001',
                    characters: [{ id: 'char-001', role: 'protagonist' }],
                    plot: '冒险之旅'
                }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even without book_id', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: {
                    characters: [{ id: 'char-001', role: 'protagonist' }],
                    plot: '冒险之旅'
                }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even without characters', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: { book_id: 'book-001', plot: '冒险之旅' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even with empty characters', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: { book_id: 'book-001', characters: [], plot: '冒险之旅' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even without protagonist', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: {
                    book_id: 'book-001',
                    characters: [{ id: 'char-001', role: 'supporting' }],
                    plot: '冒险之旅'
                }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })

        it('should require authorization even without plot', async () => {
            const request = createRequest('http://localhost/api/chapter?action=generate', {
                headers: { 'Authorization': 'Bearer validtoken' },
                body: {
                    book_id: 'book-001',
                    characters: [{ id: 'char-001', role: 'protagonist' }]
                }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })
})
