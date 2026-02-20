const { onRequestGet, onRequestPost, onRequestDelete } = require('../../../../functions/api/user.js')

const mockDb = {
    prepare: jest.fn((query) => ({
        bind: jest.fn((...args) => ({
            run: jest.fn(),
            first: jest.fn(),
            all: jest.fn()
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

describe('User API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /api/user?action=register', () => {
        it('should reject short username', async () => {
            const request = createRequest('http://localhost/api/user?action=register', {
                body: { username: 'ab', password: 'Password123' }
            })
            
            global.Response = class {
                constructor(body, init) {
                    this.status = init?.status || 200
                    this._body = body
                }
                json() { return Promise.resolve(JSON.parse(this._body)) }
            }
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should reject short password', async () => {
            const request = createRequest('http://localhost/api/user?action=register', {
                body: { username: 'testuser', password: '12345' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should reject invalid email', async () => {
            const request = createRequest('http://localhost/api/user?action=register', {
                body: { username: 'testuser', email: 'invalid', password: 'Password123' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })

    describe('POST /api/user?action=login', () => {
        it('should reject missing credentials', async () => {
            const request = createRequest('http://localhost/api/user?action=login', {
                body: {}
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })

    describe('GET /api/user?action=info', () => {
        it('should reject without token', async () => {
            const request = createRequest('http://localhost/api/user?action=info', {
                headers: {}
            })
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(401)
            expect(data.success).toBe(false)
        })
    })
})
