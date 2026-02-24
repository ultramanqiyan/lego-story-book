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

describe('books.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet - 书籍列表', () => {
    it('应该成功获取书籍列表', async () => {
      const mockResults = [
        { book_id: 'book_1', title: '测试书籍1' },
        { book_id: 'book_2', title: '测试书籍2' }
      ];
      
      mockDB._mockAll.mockResolvedValue({ results: mockResults });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { userId: 'user_1' }));
      
      const { onRequestGet } = await import('../../functions/api/books.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.books).toEqual(mockResults);
    });

    it('应该拒绝没有userId的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestGet } = await import('../../functions/api/books.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestGet - 书籍详情', () => {
    it('应该成功获取书籍详情', async () => {
      const mockBook = { book_id: 'book_1', title: '测试书籍' };
      
      mockDB._mockFirst.mockResolvedValueOnce(mockBook);
      mockDB._mockAll
        .mockResolvedValueOnce({ results: [{ chapter_id: 'ch_1' }] })
        .mockResolvedValueOnce({ results: [{ id: 'bc_1' }] });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { bookId: 'book_1' }));
      
      const { onRequestGet } = await import('../../functions/api/books.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.book.book_id).toBe('book_1');
      expect(data.book.title).toBe('测试书籍');
      expect(data.book.plotSelection).toBe(null);
    });

    it('应该返回404当书籍不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { bookId: 'nonexistent' }));
      
      const { onRequestGet } = await import('../../functions/api/books.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功创建书籍', async () => {
      mockDB._mockFirst.mockResolvedValue({ count: 0 });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: '新书籍'
      }));
      
      const { onRequestPost } = await import('../../functions/api/books.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.bookId).toBeDefined();
    });

    it('应该拒绝空标题', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: ''
      }));
      
      const { onRequestPost } = await import('../../functions/api/books.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝超过20本书的用户', async () => {
      mockDB._mockFirst.mockResolvedValue({ count: 20 });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        userId: 'user_1',
        title: '新书籍'
      }));
      
      const { onRequestPost } = await import('../../functions/api/books.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestPut', () => {
    it('应该成功更新书籍标题', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1', title: '原标题' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '新标题'
      }));
      
      const { onRequestPut } = await import('../../functions/api/books.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该返回404当书籍不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'nonexistent',
        title: '新标题'
      }));
      
      const { onRequestPut } = await import('../../functions/api/books.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestDelete', () => {
    it('应该成功归档书籍', async () => {
      mockDB._mockFirst.mockResolvedValue({ book_id: 'book_1', title: '测试书籍' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'book_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/books.js');
      const result = await onRequestDelete(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });
  });
});
