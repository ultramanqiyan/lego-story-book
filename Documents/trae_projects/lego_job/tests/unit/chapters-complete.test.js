import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

var mockDB = {
  prepare: function(sql) {
    var self = this;
    return {
      bind: function() {
        return {
          all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
          first: function() { return Promise.resolve(self._mockFirstResult); },
          run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
        };
      },
      all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
      first: function() { return Promise.resolve(self._mockFirstResult); },
      run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
    };
  },
  _mockFirstResult: null,
  _mockAllResult: null,
  _mockRunResult: null
};

function createMockContext(db, request) {
  return {
    env: { DB: db },
    request: request
  };
}

function createMockRequest(data) {
  return {
    json: function() { return Promise.resolve(data); },
    method: 'POST',
    url: 'http://localhost/api/chapters-complete/books/book_1/chapters/chapter_1'
  };
}

function resetMocks() {
  mockDB._mockFirstResult = null;
  mockDB._mockAllResult = null;
  mockDB._mockRunResult = null;
}

describe('章节完成标记API测试', function() {
  
  beforeEach(function() {
    resetMocks();
  });
  
  describe('onRequestPost', function() {
    
    it('应该成功标记章节完成（无谜题）', async function() {
      mockDB._mockFirstResult = { 
        chapter_id: 'chapter_1', 
        book_id: 'book_1',
        has_puzzle: 0 
      };
      mockDB._mockRunResult = { success: true };
      
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toContain('完成');
    });
    
    it('有谜题的章节应该记录答题结果', async function() {
      var firstCallCount = 0;
      var originalPrepare = mockDB.prepare;
      
      mockDB.prepare = function(sql) {
        var self = this;
        return {
          bind: function() {
            return {
              all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
              first: function() { 
                firstCallCount++;
                if (firstCallCount === 1) {
                  return Promise.resolve({ 
                    chapter_id: 'chapter_1', 
                    book_id: 'book_1',
                    has_puzzle: 1 
                  });
                }
                if (firstCallCount === 2) {
                  return Promise.resolve({ 
                    puzzle_id: 'puzzle_1',
                    question: '问题',
                    answer: 'A'
                  });
                }
                return Promise.resolve(null);
              },
              run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
            };
          },
          all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
          first: function() { return Promise.resolve(self._mockFirstResult); },
          run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
        };
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      
      mockDB.prepare = originalPrepare;
    });
    
    it('缺少书籍ID时应该返回错误', async function() {
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, {
        json: function() { return Promise.resolve({ userId: 'user_1' }); },
        method: 'POST',
        url: 'http://localhost/api/chapters-complete/books//chapters/chapter_1'
      });
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('缺少章节ID时应该返回错误', async function() {
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, {
        json: function() { return Promise.resolve({ userId: 'user_1' }); },
        method: 'POST',
        url: 'http://localhost/api/chapters-complete/books/book_1/chapters/'
      });
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('缺少用户ID时应该返回错误', async function() {
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('章节不存在时应该返回404', async function() {
      mockDB._mockFirstResult = null;
      
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      expect(result.status).toBe(404);
    });
    
    it('数据库错误时应该返回500错误', async function() {
      mockDB.prepare = function() {
        throw new Error('数据库连接失败');
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
      expect(result.status).toBe(500);
    });
    
    it('章节有谜题但谜题不存在时应该成功', async function() {
      var firstCallCount = 0;
      var originalPrepare = mockDB.prepare;
      
      mockDB.prepare = function(sql) {
        var self = this;
        return {
          bind: function() {
            return {
              all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
              first: function() { 
                firstCallCount++;
                if (firstCallCount === 1) {
                  return Promise.resolve({ 
                    chapter_id: 'chapter_1', 
                    book_id: 'book_1',
                    has_puzzle: 1 
                  });
                }
                if (firstCallCount === 2) {
                  return Promise.resolve(null);
                }
                return Promise.resolve(null);
              },
              run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
            };
          },
          all: function() { return Promise.resolve(self._mockAllResult || { results: [] }); },
          first: function() { return Promise.resolve(self._mockFirstResult); },
          run: function() { return Promise.resolve(self._mockRunResult || { success: true }); }
        };
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-complete.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      
      mockDB.prepare = originalPrepare;
    });
  });
  
  describe('onRequestOptions', function() {
    it('应该返回CORS响应', async function() {
      var { onRequestOptions } = await import('../../functions/api/chapters-complete.js');
      var result = await onRequestOptions();
      
      expect(result.status).toBe(204);
    });
  });
});
