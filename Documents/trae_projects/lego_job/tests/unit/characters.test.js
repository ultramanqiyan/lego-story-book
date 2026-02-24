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

describe('characters.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet', () => {
    it('应该成功获取人仔列表', async () => {
      const mockResults = [
        { character_id: 'char_1', name: '乐高蝙蝠侠' },
        { character_id: 'char_2', name: '乐高蜘蛛侠' }
      ];
      
      mockDB._mockAll.mockResolvedValue({ results: mockResults });
      
      mockContext = createMockContext(mockDB, createMockRequest({}));
      
      const { onRequestGet } = await import('../../functions/api/characters.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.characters).toEqual(mockResults);
    });

    it('应该处理获取失败的情况', async () => {
      mockDB.prepare.mockImplementation(() => {
        throw new Error('DB Error');
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({}));
      
      const { onRequestGet } = await import('../../functions/api/characters.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(500);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功创建人仔', async () => {
      mockDB._mockRun.mockResolvedValue({});
      
      const requestData = {
        name: '测试人仔',
        description: '测试描述',
        personality: '勇敢',
        speakingStyle: '低沉'
      };
      
      mockContext = createMockContext(mockDB, createMockRequest(requestData));
      
      const { onRequestPost } = await import('../../functions/api/characters.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.characterId).toBeDefined();
    });

    it('应该拒绝空名称', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({ name: '' }));
      
      const { onRequestPost } = await import('../../functions/api/characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝过长的名称', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({ 
        name: '这是一个超过二十个字符的名称测试用例名称啊' 
      }));
      
      const { onRequestPost } = await import('../../functions/api/characters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });
  });

  describe('onRequestPut', () => {
    it('应该成功更新人仔', async () => {
      mockDB._mockFirst.mockResolvedValue({
        character_id: 'char_1',
        name: '原名称',
        creator_id: 'user'
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        characterId: 'char_1',
        name: '新名称'
      }));
      
      const { onRequestPut } = await import('../../functions/api/characters.js');
      const result = await onRequestPut(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该拒绝修改预设人仔', async () => {
      mockDB._mockFirst.mockResolvedValue({
        character_id: 'char_1',
        name: '乐高蝙蝠侠',
        creator_id: 'system'
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        characterId: 'char_1',
        name: '新名称'
      }));
      
      const { onRequestPut } = await import('../../functions/api/characters.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(403);
    });

    it('应该返回404当人仔不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        characterId: 'nonexistent',
        name: '新名称'
      }));
      
      const { onRequestPut } = await import('../../functions/api/characters.js');
      const result = await onRequestPut(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestDelete', () => {
    it('应该成功删除人仔', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ character_id: 'char_1', creator_id: 'user' })
        .mockResolvedValueOnce({ count: 0 });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'char_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/characters.js');
      const result = await onRequestDelete(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该提示删除正在使用的人仔需要确认', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ character_id: 'char_1', creator_id: 'user' })
        .mockResolvedValueOnce({ count: 1 });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'char_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/characters.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(200);
      const data = await result.json();
      expect(data.success).toBe(true);
      expect(data.needsConfirm).toBe(true);
    });

    it('应该拒绝删除预设人仔', async () => {
      mockDB._mockFirst.mockResolvedValue({
        character_id: 'char_1',
        creator_id: 'system'
      });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'char_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/characters.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(403);
    });
  });
});
