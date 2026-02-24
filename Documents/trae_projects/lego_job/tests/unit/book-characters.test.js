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

describe('book-characters.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet', () => {
    it('应该成功获取书籍角色列表', async () => {
      const mockResults = [
        { id: 'bc_1', custom_name: '小蝙蝠', role_type: 'protagonist' },
        { id: 'bc_2', custom_name: '蜘蛛侠阿明', role_type: 'supporting' }
      ];
      
      mockDB._mockAll.mockResolvedValue({ results: mockResults });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { bookId: 'book_1' }));
      
      const { onRequestGet } = await import('../../functions/api/book-characters.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.characters).toEqual(mockResults);
    });

    it('应该拒绝没有bookId的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestGet } = await import('../../functions/api/book-characters.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功添加角色', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1' })
        .mockResolvedValueOnce({ character_id: 'char_1' })
        .mockResolvedValueOnce(null);
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'char_1',
        customName: '小蝙蝠',
        roleType: 'supporting'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    });

    it('应该拒绝参数不完整的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝过长的自定义名称', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1' })
        .mockResolvedValueOnce({ character_id: 'char_1' });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'char_1',
        customName: '这是一个超过二十个字符的自定义名称测试名称',
        roleType: 'supporting'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝重复的自定义名称', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1' })
        .mockResolvedValueOnce({ character_id: 'char_1' })
        .mockResolvedValueOnce({ id: 'bc_1', custom_name: '小蝙蝠' });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'char_1',
        customName: '小蝙蝠',
        roleType: 'supporting'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当书籍不存在', async () => {
      mockDB._mockFirst.mockResolvedValueOnce(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'nonexistent',
        characterId: 'char_1',
        customName: '小蝙蝠',
        roleType: 'protagonist'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该返回404当人仔不存在', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1' })
        .mockResolvedValueOnce(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'nonexistent',
        customName: '小蝙蝠',
        roleType: 'protagonist'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该自动降级原主角', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1' })
        .mockResolvedValueOnce({ character_id: 'char_1' })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'bc_old', role_type: 'protagonist' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'char_1',
        customName: '新主角',
        roleType: 'protagonist'
      }));
      
      const { onRequestPost } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });
  });

  describe('onRequestPut', () => {
    it('应该成功更新角色', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ id: 'bc_1', book_id: 'book_1', custom_name: '原名' })
        .mockResolvedValueOnce(null);
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        id: 'bc_1',
        customName: '新名',
        roleType: 'supporting'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该通过bookId和characterId查找并更新角色', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ id: 'bc_1', book_id: 'book_1', custom_name: '原名' })
        .mockResolvedValueOnce(null);
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        characterId: 'char_1',
        customName: '新名',
        roleType: 'supporting'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该成功更新角色为主角并降级原主角', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ id: 'bc_1', book_id: 'book_1', custom_name: '原名' })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'bc_old', role_type: 'protagonist' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        id: 'bc_1',
        customName: '新名',
        roleType: 'protagonist'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该拒绝更新时重复的自定义名称', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ id: 'bc_1', book_id: 'book_1', custom_name: '原名' })
        .mockResolvedValueOnce({ id: 'bc_2', custom_name: '重复名' });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        id: 'bc_1',
        customName: '重复名',
        roleType: 'supporting'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当角色不存在', async () => {
      mockDB._mockFirst.mockResolvedValueOnce(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        id: 'nonexistent',
        customName: '新名'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该拒绝没有查找参数的更新请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        customName: '新名'
      }));
      
      const { onRequestPut } = await import('../../functions/api/book-characters.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestDelete', () => {
    it('应该成功删除角色', async () => {
      mockDB._mockFirst.mockResolvedValueOnce({ id: 'bc_1', custom_name: '小蝙蝠' });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'bc_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/book-characters.js');
      const result = await onRequestDelete(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该拒绝没有id的删除请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({}, {}));
      
      const { onRequestDelete } = await import('../../functions/api/book-characters.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当角色不存在', async () => {
      mockDB._mockFirst.mockResolvedValueOnce(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'nonexistent' }));
      
      const { onRequestDelete } = await import('../../functions/api/book-characters.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(404);
    });
  });
});
