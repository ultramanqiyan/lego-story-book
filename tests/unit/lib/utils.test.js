const { 
    generateId, 
    formatDate, 
    highlightKeywords, 
    validateInput, 
    extractKeywords,
    generateShareCode,
    sanitizeInput,
    parseJsonSafely
} = require('../../../src/lib/utils.js')

describe('Utils Functions', () => {
    describe('generateId', () => {
        it('should generate unique ID', () => {
            const id1 = generateId()
            const id2 = generateId()
            expect(id1).not.toBe(id2)
        })
        
        it('should generate ID with default length 16', () => {
            const id = generateId()
            expect(id.length).toBe(16)
        })
        
        it('should generate ID with custom length', () => {
            const id = generateId(8)
            expect(id.length).toBe(8)
        })
        
        it('should only contain alphanumeric characters', () => {
            const id = generateId()
            expect(id).toMatch(/^[A-Za-z0-9]+$/)
        })
    })
    
    describe('formatDate', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-01-15T10:30:00Z')
            const result = formatDate(date)
            expect(result).toMatch(/2024-01-15/)
        })
        
        it('should return empty string for null', () => {
            expect(formatDate(null)).toBe('')
        })
        
        it('should return empty string for undefined', () => {
            expect(formatDate(undefined)).toBe('')
        })
        
        it('should return empty string for invalid date string', () => {
            expect(formatDate('invalid')).toBe('')
        })
    })
    
    describe('highlightKeywords', () => {
        it('should highlight character names in red', () => {
            const text = '蝙蝠侠飞向天空'
            const keywords = { names: ['蝙蝠侠'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: red')
            expect(result).toContain('蝙蝠侠')
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
        
        it('should highlight location words in yellow/gold', () => {
            const text = '他来到城堡'
            const keywords = { locations: ['城堡'] }
            const result = highlightKeywords(text, keywords)
            expect(result).toContain('color: #DAA520')
        })
        
        it('should return original text if no keywords', () => {
            const text = '这是一段普通文字'
            const result = highlightKeywords(text, null)
            expect(result).toBe(text)
        })
    })
    
    describe('validateInput', () => {
        it('should accept valid username', () => {
            expect(validateInput('username', 'test123')).toBe(true)
        })
        
        it('should reject short username', () => {
            expect(validateInput('username', 'ab')).toBe(false)
        })
        
        it('should accept valid email', () => {
            expect(validateInput('email', 'test@example.com')).toBe(true)
        })
        
        it('should reject invalid email', () => {
            expect(validateInput('email', 'invalid')).toBe(false)
        })
        
        it('should accept valid password', () => {
            expect(validateInput('password', '123456')).toBe(true)
        })
        
        it('should reject short password', () => {
            expect(validateInput('password', '12345')).toBe(false)
        })
    })
    
    describe('generateShareCode', () => {
        it('should generate code with default length 8', () => {
            const code = generateShareCode()
            expect(code.length).toBe(8)
        })
        
        it('should only contain alphanumeric characters', () => {
            const code = generateShareCode()
            expect(code).toMatch(/^[A-Za-z0-9]+$/)
        })
    })
    
    describe('sanitizeInput', () => {
        it('should remove HTML tags', () => {
            expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")')
        })
        
        it('should trim whitespace', () => {
            expect(sanitizeInput('  hello  ')).toBe('hello')
        })
    })
    
    describe('parseJsonSafely', () => {
        it('should parse valid JSON', () => {
            const result = parseJsonSafely('{"key": "value"}')
            expect(result).toEqual({ key: 'value' })
        })
        
        it('should return default value for invalid JSON', () => {
            const result = parseJsonSafely('invalid json', { default: true })
            expect(result).toEqual({ default: true })
        })
    })
})
