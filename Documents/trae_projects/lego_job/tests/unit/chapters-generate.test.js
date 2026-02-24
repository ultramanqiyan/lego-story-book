import { describe, it, expect, beforeEach, vi } from 'vitest';

var mockDB = {
  _mockRunResult: { success: true },
  _mockAllResult: { results: [] },
  _mockFirstResult: null,
  _mockAll: null,
  _mockFirst: null,
  _mockRun: null,
  
  prepare: function(sql) {
    var self = this;
    return {
      bind: function() {
        return {
          all: self._mockAll || function() { return Promise.resolve(self._mockAllResult); },
          first: self._mockFirst || function() { return Promise.resolve(self._mockFirstResult); },
          run: self._mockRun || function() { return Promise.resolve(self._mockRunResult); }
        };
      },
      all: self._mockAll || function() { return Promise.resolve(self._mockAllResult); },
      first: self._mockFirst || function() { return Promise.resolve(self._mockFirstResult); },
      run: self._mockRun || function() { return Promise.resolve(self._mockRunResult); }
    };
  }
};

function createMockContext(db, request) {
  return {
    env: { 
      DB: db,
      DOUBAO_API_KEY: 'test-api-key'
    },
    request: request
  };
}

function createMockRequest(data) {
  return {
    json: function() { return Promise.resolve(data); },
    method: 'POST',
    url: 'http://localhost/api/chapters-generate/books/book_1'
  };
}

describe('章节生成API测试', function() {
  
  describe('onRequestPost', function() {
    
    it('应该成功生成章节', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [
            { character_id: 'char_1', custom_name: '小明', personality: '勇敢', speaking_style: '洪亮' }
          ] 
        });
      };
      
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: JSON.stringify({
                  title: '第一章：冒险开始',
                  content: '很久很久以前，有一个勇敢的小英雄...',
                  puzzle: {
                    question: '小英雄的武器是什么颜色？',
                    options: ['红色', '蓝色', '绿色', '黄色'],
                    answer: 'A',
                    hint: '仔细看故事开头',
                    type: 'knowledge'
                  }
                })
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.chapterId).toBeDefined();
      expect(data.hasPuzzle).toBe(1);
    });
    
    it('书籍不存在时应该返回404', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, {
        json: function() { return Promise.resolve({}); },
        method: 'POST',
        url: 'http://localhost/api/chapters-generate/books/nonexistent'
      });
      
      var result = await onRequestPost(context);
      expect(result.status).toBe(404);
    });
    
    it('缺少书籍ID时应该返回错误', async function() {
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, {
        json: function() { return Promise.resolve({}); },
        method: 'POST',
        url: 'http://localhost/api/chapters-generate/books/'
      });
      
      var result = await onRequestPost(context);
      expect(result.status).toBe(404);
    });
    
    it('没有角色时应该返回错误', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ results: [] });
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('章节数达到100时应该返回错误', async function() {
      var firstCallCount = 0;
      var originalMockFirst = mockDB._mockFirst;
      
      mockDB._mockFirst = function() {
        firstCallCount++;
        if (firstCallCount === 1) {
          return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
        }
        if (firstCallCount === 2) {
          return Promise.resolve({ count: 100 });
        }
        return Promise.resolve(null);
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ results: [{ character_id: 'char_1', custom_name: '小明' }] });
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
      expect(data.error).toContain('100');
      
      mockDB._mockFirst = originalMockFirst;
    });
    
    it('AI服务不可用时应该返回错误', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('AI返回格式错误时应该返回错误', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: '这不是JSON格式'
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('AI返回无效JSON时应该返回错误', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: '{"invalid": json}'
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('AI返回空内容时应该返回错误', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {}
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('生成无谜题的章节应该成功', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: JSON.stringify({
                  title: '第一章',
                  content: '故事内容...'
                })
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.hasPuzzle).toBe(0);
    });
    
    it('有前一章时应该获取前情提要', async function() {
      var firstCallCount = 0;
      var originalMockFirst = mockDB._mockFirst;
      
      mockDB._mockFirst = function() {
        firstCallCount++;
        if (firstCallCount === 1) {
          return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
        }
        if (firstCallCount === 2) {
          return Promise.resolve({ count: 1 });
        }
        if (firstCallCount === 3) {
          return Promise.resolve({ 
            chapter_id: 'ch_prev', 
            content: '前一章内容，这是一段很长的故事内容，需要截取前300个字符作为前情提要...',
            has_puzzle: 0 
          });
        }
        return Promise.resolve(null);
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: JSON.stringify({
                  title: '第二章',
                  content: '故事继续...'
                })
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      
      mockDB._mockFirst = originalMockFirst;
    });
    
    it('前一章有谜题时应该获取谜题信息', async function() {
      var firstCallCount = 0;
      var originalMockFirst = mockDB._mockFirst;
      
      mockDB._mockFirst = function() {
        firstCallCount++;
        if (firstCallCount === 1) {
          return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
        }
        if (firstCallCount === 2) {
          return Promise.resolve({ count: 1 });
        }
        if (firstCallCount === 3) {
          return Promise.resolve({ 
            chapter_id: 'ch_prev', 
            content: '前一章内容',
            has_puzzle: 1 
          });
        }
        if (firstCallCount === 4) {
          return Promise.resolve({ 
            puzzle_id: 'pz_prev',
            question: '前一章谜题',
            answer: 'A'
          });
        }
        return Promise.resolve(null);
      };
      
      mockDB._mockAll = function() {
        return Promise.resolve({ 
          results: [{ character_id: 'char_1', custom_name: '小明' }] 
        });
      };
      
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: function() {
          return Promise.resolve({
            choices: [{
              message: {
                content: JSON.stringify({
                  title: '第二章',
                  content: '故事继续...'
                })
              }
            }]
          });
        }
      });
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      
      mockDB._mockFirst = originalMockFirst;
    });
    
    it('数据库错误时应该返回500错误', async function() {
      mockDB.prepare = function() {
        throw new Error('数据库连接失败');
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters-generate.js');
      var context = createMockContext(mockDB, createMockRequest({}));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
      expect(result.status).toBe(500);
    });
  });
  
  describe('onRequestOptions', function() {
    it('应该返回CORS响应', async function() {
      var { onRequestOptions } = await import('../../functions/api/chapters-generate.js');
      var result = await onRequestOptions();
      
      expect(result.status).toBe(204);
    });
  });
});
