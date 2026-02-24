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

describe('share.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet', () => {
    it('应该成功获取分享信息', async () => {
      mockDB._mockFirst.mockResolvedValue({
        share_id: 'share_1',
        book_id: 'book_1',
        share_code: 'ABC12345',
        is_public: 1
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { code: 'ABC12345' }));
      
      const { onRequestGet } = await import('../../functions/api/share.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.share.share_code).toBe('ABC12345');
    });

    it('应该返回404当分享链接不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { code: 'nonexistent' }));
      
      const { onRequestGet } = await import('../../functions/api/share.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该成功获取用户的分享列表', async () => {
      mockDB._mockAll.mockResolvedValue({
        results: [
          { share_id: 'share_1', book_id: 'book_1' },
          { share_id: 'share_2', book_id: 'book_2' }
        ]
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { bookId: 'book_1', userId: 'user_1' }));
      
      const { onRequestGet } = await import('../../functions/api/share.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.shares.length).toBe(2);
    });

    it('应该拒绝参数不完整的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestGet } = await import('../../functions/api/share.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功创建分享链接', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        userId: 'user_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/share.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.shareCode).toBeDefined();
    });

    it('应该拒绝缺少必要参数的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/share.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当书籍不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'nonexistent',
        userId: 'user_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/share.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该创建带密码的分享链接', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        userId: 'user_1',
        password: 'secret123'
      }));
      
      const { onRequestPost } = await import('../../functions/api/share.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });
  });

  describe('onRequestDelete', () => {
    it('应该成功删除分享链接', async () => {
      mockDB._mockFirst.mockResolvedValue({ share_id: 'share_1' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'share_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/share.js');
      const result = await onRequestDelete(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该拒绝没有分享ID的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestDelete } = await import('../../functions/api/share.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当分享链接不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'nonexistent' }));
      
      const { onRequestDelete } = await import('../../functions/api/share.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(404);
    });
  });
});
