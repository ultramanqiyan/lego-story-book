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

describe('chapters.js API 测试', () => {
  let mockDB;
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDB = createMockDB();
  });

  describe('onRequestGet - 章节详情', () => {
    it('应该成功获取章节详情', async () => {
      const mockChapter = { 
        chapter_id: 'ch_1', 
        title: '第一章',
        has_puzzle: 0 
      };
      
      mockDB._mockFirst.mockResolvedValue(mockChapter);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'ch_1' }));
      
      const { onRequestGet } = await import('../../functions/api/chapters.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.chapter).toEqual(mockChapter);
    });

    it('应该获取带谜题的章节', async () => {
      const mockChapter = { 
        chapter_id: 'ch_1', 
        title: '第一章',
        has_puzzle: 1 
      };
      const mockPuzzle = { 
        puzzle_id: 'pz_1', 
        question: '测试问题' 
      };
      
      mockDB._mockFirst
        .mockResolvedValueOnce(mockChapter)
        .mockResolvedValueOnce(mockPuzzle);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'ch_1' }));
      
      const { onRequestGet } = await import('../../functions/api/chapters.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.puzzle).toEqual(mockPuzzle);
    });

    it('应该返回404当章节不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'nonexistent' }));
      
      const { onRequestGet } = await import('../../functions/api/chapters.js');
      const result = await onRequestGet(mockContext);
      
      expect(result.status).toBe(404);
    });
  });

  describe('onRequestGet - 章节列表', () => {
    it('应该成功获取章节列表', async () => {
      const mockResults = [
        { chapter_id: 'ch_1', chapter_number: 1 },
        { chapter_id: 'ch_2', chapter_number: 2 }
      ];
      
      mockDB._mockAll.mockResolvedValue({ results: mockResults });
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { bookId: 'book_1' }));
      
      const { onRequestGet } = await import('../../functions/api/chapters.js');
      const result = await onRequestGet(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.chapters).toEqual(mockResults);
    });
  });

  describe('onRequestPost', () => {
    it('应该成功创建章节', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1', title: '测试书籍' })
        .mockResolvedValueOnce({ count: 0 });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '第一章',
        content: '这是章节内容'
      }));
      
      const { onRequestPost } = await import('../../functions/api/chapters.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.chapterId).toBeDefined();
    });

    it('应该拒绝空内容', async () => {
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        content: ''
      }));
      
      const { onRequestPost } = await import('../../functions/api/chapters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝超过100章的书籍', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1', title: '测试书籍' })
        .mockResolvedValueOnce({ count: 100 });
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        content: '新章节内容'
      }));
      
      const { onRequestPost } = await import('../../functions/api/chapters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该返回404当书籍不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'nonexistent',
        content: '内容'
      }));
      
      const { onRequestPost } = await import('../../functions/api/chapters.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(404);
    });

    it('应该成功创建带谜题的章节', async () => {
      mockDB._mockFirst
        .mockResolvedValueOnce({ book_id: 'book_1', title: '测试书籍' })
        .mockResolvedValueOnce({ count: 0 });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({
        bookId: 'book_1',
        title: '第一章',
        content: '这是章节内容',
        puzzle: {
          question: '测试问题',
          options: ['A. 选项1', 'B. 选项2'],
          answer: 'A',
          type: 'pattern'
        }
      }));
      
      const { onRequestPost } = await import('../../functions/api/chapters.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });
  });

  describe('onRequestDelete', () => {
    it('应该成功删除章节', async () => {
      mockDB._mockFirst.mockResolvedValue({ 
        chapter_id: 'ch_1', 
        book_id: 'book_1' 
      });
      mockDB._mockRun.mockResolvedValue({});
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'ch_1' }));
      
      const { onRequestDelete } = await import('../../functions/api/chapters.js');
      const result = await onRequestDelete(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
    });

    it('应该返回404当章节不存在', async () => {
      mockDB._mockFirst.mockResolvedValue(null);
      
      mockContext = createMockContext(mockDB, createMockRequest({}, { id: 'nonexistent' }));
      
      const { onRequestDelete } = await import('../../functions/api/chapters.js');
      const result = await onRequestDelete(mockContext);
      
      expect(result.status).toBe(404);
    });
  });
});
