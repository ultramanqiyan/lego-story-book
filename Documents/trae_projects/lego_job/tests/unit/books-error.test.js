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

describe('books.js API 错误分支测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet 错误处理', () => {
    it('应该处理数据库查询错误', async () => {
      mockDB._mockAll.mockRejectedValue(new Error('DB Error'));
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { userId: 'user_1' }));
      
      const { onRequestGet } = await import('../../functions/api/books.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(500);
    });
  });

  describe('onRequestPost 错误处理', () => {
    it('应该处理数据库创建错误', async () => {
      mockDB._mockFirst.mockResolvedValue({ count: 0 });
      mockDB._mockRun.mockRejectedValue(new Error('DB Error'));
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: '新书籍'
      }));
      
      const { onRequestPost } = await import('../../functions/api/books.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(500);
    });
  });

  describe('onRequestPut 错误处理', () => {
    it('应该处理数据库更新错误', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1' });
      mockDB._mockRun.mockRejectedValue(new Error('DB Error'));
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '新标题'
      }));
      
      const { onRequestPut } = await import('../../functions/api/books.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(500);
    });
  });

  describe('onRequestDelete 错误处理', () => {
    it('应该处理数据库删除错误', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1' });
      mockDB._mockRun.mockRejectedValue(new Error('DB Error'));
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'book_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/books.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(500);
    });
  });
});
