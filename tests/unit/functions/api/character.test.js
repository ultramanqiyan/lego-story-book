const { onRequestGet, onRequestPost, onRequestDelete } = require('../../../../functions/api/character.js')

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

describe('Character API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/character?action=preset', () => {
        it('should return preset characters', async () => {
            mockDb.prepare().bind().all.mockReturnValue({
                results: [{ id: 'preset-001', name: '蝙蝠侠', personality: '勇敢', speaking_style: '低沉有力' }]
            })
            
            const request = createRequest('http://localhost/api/character?action=preset')
            
            global.Response = class {
                constructor(body, init) {
                    this.status = init?.status || 200
                    this._body = body
                }
                json() { return Promise.resolve(JSON.parse(this._body)) }
            }
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(200)
            expect(data.success).toBe(true)
            expect(Array.isArray(data.characters)).toBe(true)
        })
    })

    describe('GET /api/character?action=list', () => {
        it('should require user_id', async () => {
            const request = createRequest('http://localhost/api/character?action=list')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })

    describe('GET /api/character?action=detail', () => {
        it('should require id', async () => {
            const request = createRequest('http://localhost/api/character?action=detail')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should return 404 for non-existent character', async () => {
            mockDb.prepare().bind().first.mockReturnValue(null)
            
            const request = createRequest('http://localhost/api/character?action=detail&id=nonexistent')
            
            const response = await onRequestGet({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(404)
            expect(data.success).toBe(false)
        })
    })

    describe('POST /api/character?action=create', () => {
        it('should require name', async () => {
            const request = createRequest('http://localhost/api/character?action=create', {
                body: { image: 'base64image', personality: '勇敢', speaking_style: '低沉有力' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should require image', async () => {
            const request = createRequest('http://localhost/api/character?action=create', {
                body: { name: 'My Character', personality: '勇敢', speaking_style: '低沉有力' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should require personality', async () => {
            const request = createRequest('http://localhost/api/character?action=create', {
                body: { name: 'My Character', image: 'base64image', speaking_style: '低沉有力' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })

        it('should require speaking_style', async () => {
            const request = createRequest('http://localhost/api/character?action=create', {
                body: { name: 'My Character', image: 'base64image', personality: '勇敢' }
            })
            
            const response = await onRequestPost({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })

    describe('DELETE /api/character?action=delete', () => {
        it('should require id', async () => {
            const request = createRequest('http://localhost/api/character?action=delete')
            
            const response = await onRequestDelete({ request, env: mockEnv })
            const data = await response.json()
            
            expect(response.status).toBe(400)
            expect(data.success).toBe(false)
        })
    })
})
