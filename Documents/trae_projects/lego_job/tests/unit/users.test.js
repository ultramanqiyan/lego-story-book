import { describe, it, expect, vi, beforeEach } from 'vitest';

const createMockDB = () => {
  const mockPrepare = vi.fn();
  const mockBind = vi.fn();
  const mockFirst = vi.fn();
  const mockAll = vi.fn();
  const mockRun = vi.fn();
  
  mockBind.mockReturnValue({
    first: mockFirst,
    all: mockAll,
    run: mockRun
  });
  
  mockPrepare.mockReturnValue({
    bind: mockBind,
    first: mockFirst,
    all: mockAll,
    run: mockRun
  });
  
  return {
    prepare: mockPrepare,
    _mockBind: mockBind,
    _mockFirst: mockFirst,
    _mockAll: mockAll,
    _mockRun: mockRun
  };
};

const createMockRequest = (data, params = {}) => ({
  json: vi.fn().mockResolvedValue(data),
  url: `http://localhost/api?${new URLSearchParams(params).toString()}`
});

const createMockContext = (db, request) => ({
  env: { DB: db },
  request
});

describe('users.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet', () => {
    it('应该成功获取用户信息', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '测试用户',
        email: 'test@example.com'
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { userId: 'user_1' }));
      
      const { onRequestGet } = await import('../../functions/api/users.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.user.username).toBe('测试用户');
    });

    it('应该拒绝没有userId的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestGet } = await import('../../functions/api/users.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当用户不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { userId: 'nonexistent' }));
      
      const { onRequestGet } = await import('../../functions/api/users.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功创建用户', async () => {
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        username: '新用户',
        email: 'new@example.com'
      }));
      
      const { onRequestPost } = await import('../../functions/api/users.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.userId).toBeDefined();
    });

    it('应该拒绝空用户名', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        username: ''
      }));
      
      const { onRequestPost } = await import('../../functions/api/users.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝过长的用户名', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        username: '这是一个超过二十个字符的用户名测试名称啊哈哈哈哈'
      }));
      
      const { onRequestPost } = await import('../../functions/api/users.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestPut', () => {
    it('应该成功更新用户', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '原用户名'
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        username: '新用户名'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该拒绝没有userId的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当用户不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'nonexistent'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该拒绝过长的用户名', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '原用户名'
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        username: '这是一个超过二十个字符的用户名测试名称啊哈哈哈哈'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该处理没有更新字段的情况', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '原用户名'
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该成功更新邮箱', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '用户名'
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        email: 'new@example.com'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该成功更新头像', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '用户名'
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        avatar: 'avatar_1'
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该成功更新每日时间限制', async () => {
      mockDB._mockFirst.mockResolvedValue({
        user_id: 'user_1',
        username: '用户名'
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        dailyTimeLimit: 60
      }));
      
      const { onRequestPut } = await import('../../functions/api/users.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该成功创建用户带parentId', async () => {
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        username: '新用户',
        email: 'new@example.com',
        parentId: 'parent_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/users.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.userId).toBeDefined();
    });
  });
});
