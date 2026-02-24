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

describe('puzzle.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet - 谜题详情', () => {
    it('应该成功获取谜题详情', async () => {
      const mockPuzzle = { 
        puzzle_id: 'pz_1', 
        question: '测试问题',
        options: '["A. 选项1", "B. 选项2"]',
        hint: '提示信息',
        puzzle_type: 'pattern'
      };
      
      mockDB._mockFirst.mockResolvedValue(mockPuzzle);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'pz_1' }));
      
      const { onRequestGet } = await import('../../functions/api/puzzle.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.puzzle).toEqual(mockPuzzle);
    });

    it('应该返回404当谜题不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'nonexistent' }));
      
      const { onRequestGet } = await import('../../functions/api/puzzle.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestGet - 按章节获取谜题', () => {
    it('应该成功获取章节的谜题', async () => {
      const mockPuzzle = { 
        puzzle_id: 'pz_1', 
        question: '测试问题'
      };
      
      mockDB._mockFirst.mockResolvedValue(mockPuzzle);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { chapterId: 'ch_1' }));
      
      const { onRequestGet } = await import('../../functions/api/puzzle.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.puzzle).toEqual(mockPuzzle);
    });

    it('应该返回null当章节没有谜题', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { chapterId: 'ch_1' }));
      
      const { onRequestGet } = await import('../../functions/api/puzzle.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.puzzle).toBeNull();
    });
  });

  describe('onRequestPost - 验证答案', () => {
    it('应该正确验证正确答案', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ 
          puzzle_id: 'pz_1', 
          answer: 'A',
          hint: '提示信息'
        })
        .mockResolvedValueOnce(null);
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'pz_1',
        userId: 'user_1',
        userAnswer: 'A'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.isCorrect).toBe(true);
      expect(data.message).toBe('答对了！');
    });

    it('应该正确验证错误答案', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ 
          puzzle_id: 'pz_1', 
          answer: 'A',
          hint: '提示信息'
        })
        .mockResolvedValueOnce(null);
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'pz_1',
        userId: 'user_1',
        userAnswer: 'B'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.isCorrect).toBe(false);
      expect(data.message).toBe('答案错误，请再试一次');
    });

    it('应该拒绝参数不完整的请求', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'pz_1'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当谜题不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'nonexistent',
        userId: 'user_1',
        userAnswer: 'A'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该更新现有答题记录', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ 
          puzzle_id: 'pz_1', 
          answer: 'A',
          hint: '提示信息'
        })
        .mockResolvedValueOnce({
          record_id: 'rec_1',
          attempts: 1
        });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'pz_1',
        userId: 'user_1',
        userAnswer: 'A'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.attempts).toBe(2);
    });

    it('应该在第二次错误后显示提示', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ 
          puzzle_id: 'pz_1', 
          answer: 'A',
          hint: '这是提示信息'
        })
        .mockResolvedValueOnce({
          record_id: 'rec_1',
          attempts: 1
        });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        puzzleId: 'pz_1',
        userId: 'user_1',
        userAnswer: 'B'
      }));
      
      const { onRequestPost } = await import('../../functions/api/puzzle.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.hint).toBe('这是提示信息');
    });
  });
});
