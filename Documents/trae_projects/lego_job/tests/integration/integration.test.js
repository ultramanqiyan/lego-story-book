import { describe, it, expect, beforeEach } from 'vitest';

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
    env: { DB: db },
    request: request
  };
}

function createMockRequest(data) {
  return {
    json: function() { return Promise.resolve(data); },
    method: 'POST',
    url: 'http://localhost/api'
  };
}

describe('集成测试 - 核心功能验证', function() {
  
  describe('API响应格式验证', function() {
    
    it('所有API成功响应应该包含success: true', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ user_id: 'test_user', username: '测试用户' });
      };
      
      var { onRequestGet } = await import('../../functions/api/users.js');
      var context = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/users?userId=test_user',
        json: function() { return Promise.resolve({}); }
      });
      
      var result = await onRequestGet(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
    });
    
    it('所有API错误响应应该包含success: false和error', async function() {
      var { onRequestPost } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, createMockRequest({
        title: '测试书籍'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });
  
  describe('数据验证', function() {
    
    it('创建用户时应该验证用户名不为空', async function() {
      var { onRequestPost } = await import('../../functions/api/users.js');
      var context = createMockContext(mockDB, createMockRequest({
        username: ''
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('创建用户时应该验证用户名长度', async function() {
      var { onRequestPost } = await import('../../functions/api/users.js');
      var context = createMockContext(mockDB, createMockRequest({
        username: '这是一个超过二十个字符的用户名测试名称啊哈哈哈哈'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('创建书籍时应该验证标题不为空', async function() {
      var { onRequestPost } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: ''
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
    
    it('创建章节时应该验证内容不为空', async function() {
      var { onRequestPost } = await import('../../functions/api/chapters.js');
      var context = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '测试章节',
        content: ''
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(false);
    });
  });
  
  describe('ID生成验证', function() {
    
    it('创建用户应该返回userId', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/users.js');
      var context = createMockContext(mockDB, createMockRequest({
        username: '新用户'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.userId).toBeDefined();
      expect(data.userId).toMatch(/^id_/);
    });
    
    it('创建书籍应该返回bookId', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ user_id: 'user_1' });
      };
      mockDB._mockAll = function() {
        return Promise.resolve({ results: [] });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: '测试书籍'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.bookId).toBeDefined();
      expect(data.bookId).toMatch(/^id_/);
    });
    
    it('创建章节应该返回chapterId', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      mockDB._mockAll = function() {
        return Promise.resolve({ results: [] });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/chapters.js');
      var context = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '第一章',
        content: '测试内容'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.chapterId).toBeDefined();
    });
    
    it('创建分享应该返回shareCode', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/share.js');
      var context = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        userId: 'user_1'
      }));
      
      var result = await onRequestPost(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.shareCode).toBeDefined();
      expect(data.shareCode.length).toBe(8);
    });
  });
  
  describe('404错误处理', function() {
    
    it('获取不存在的用户应该返回404', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      
      var { onRequestGet } = await import('../../functions/api/users.js');
      var context = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/users?userId=nonexistent',
        json: function() { return Promise.resolve({}); }
      });
      
      var result = await onRequestGet(context);
      expect(result.status).toBe(404);
    });
    
    it('获取不存在的书籍应该返回404', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      
      var { onRequestGet } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/books?bookId=nonexistent&userId=user1',
        json: function() { return Promise.resolve({}); }
      });
      
      var result = await onRequestGet(context);
      expect(result.status).toBe(404);
    });
    
    it('获取不存在的章节应该返回404', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      
      var { onRequestGet } = await import('../../functions/api/chapters.js');
      var context = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/chapters?id=nonexistent',
        json: function() { return Promise.resolve({}); }
      });
      
      var result = await onRequestGet(context);
      expect(result.status).toBe(404);
    });
  });
  
  describe('业务规则验证', function() {
    
    it('删除书籍应该软删除到回收站', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', title: '测试书籍' });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestDelete } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, {
        method: 'DELETE',
        url: 'http://localhost/api/books?id=book_1',
        json: function() { return Promise.resolve({}); }
      });
      
      var result = await onRequestDelete(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toContain('回收站');
    });
    
    it('恢复书籍应该将状态改为active', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ book_id: 'book_1', status: 'archived' });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPut } = await import('../../functions/api/books.js');
      var context = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        action: 'restore'
      }));
      
      var result = await onRequestPut(context);
      var data = await result.json();
      
      expect(data.success).toBe(true);
      expect(data.message).toContain('恢复');
    });
    
    it('分享密码验证应该正确', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({
          share_id: 'share_1',
          share_code: 'ABC123',
          password: 'secret',
          book_id: 'book_1'
        });
      };
      
      var { onRequestGet } = await import('../../functions/api/share.js');
      
      var correctContext = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/share?code=ABC123&password=secret',
        json: function() { return Promise.resolve({}); }
      });
      var correctResult = await onRequestGet(correctContext);
      var correctData = await correctResult.json();
      expect(correctData.success).toBe(true);
      
      var wrongContext = createMockContext(mockDB, {
        method: 'GET',
        url: 'http://localhost/api/share?code=ABC123&password=wrong',
        json: function() { return Promise.resolve({}); }
      });
      var wrongResult = await onRequestGet(wrongContext);
      expect(wrongResult.status).toBe(403);
    });
  });
  
  describe('并发安全验证', function() {
    
    it('同时创建多个用户应该返回不同的userId', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve(null);
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/users.js');
      
      var contexts = [
        createMockContext(mockDB, createMockRequest({ username: '用户1' })),
        createMockContext(mockDB, createMockRequest({ username: '用户2' })),
        createMockContext(mockDB, createMockRequest({ username: '用户3' }))
      ];
      
      var results = await Promise.all(contexts.map(function(ctx) {
        return onRequestPost(ctx);
      }));
      
      var data = await Promise.all(results.map(function(r) { return r.json(); }));
      
      var ids = data.map(function(d) { return d.userId; });
      var uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(3);
    });
    
    it('同时创建多本书籍应该返回不同的bookId', async function() {
      mockDB._mockFirst = function() {
        return Promise.resolve({ user_id: 'user_1' });
      };
      mockDB._mockAll = function() {
        return Promise.resolve({ results: [] });
      };
      mockDB._mockRun = function() {
        return Promise.resolve({ success: true });
      };
      
      var { onRequestPost } = await import('../../functions/api/books.js');
      
      var contexts = [
        createMockContext(mockDB, createMockRequest({ userId: 'user_1', title: '书1' })),
        createMockContext(mockDB, createMockRequest({ userId: 'user_1', title: '书2' }))
      ];
      
      var results = await Promise.all(contexts.map(function(ctx) {
        return onRequestPost(ctx);
      }));
      
      var data = await Promise.all(results.map(function(r) { return r.json(); }));
      
      expect(data[0].bookId).not.toBe(data[1].bookId);
    });
  });
});
