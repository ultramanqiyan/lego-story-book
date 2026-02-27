/**
 * Chapters API 单元测试
 */

import { chaptersAPI } from '../chapters';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('chaptersAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDetail', () => {
    it('应该获取章节详情（带userId）', async () => {
      const mockResponse = { chapter: { chapter_id: '1', title: '第一章' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.getDetail('chapter-123', 'user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/chapters?id=chapter-123&userId=user-123');
      expect(result).toEqual(mockResponse);
    });

    it('应该获取章节详情（不带userId）', async () => {
      const mockResponse = { chapter: { chapter_id: '1', title: '第一章' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.getDetail('chapter-123');

      expect(apiClient.get).toHaveBeenCalledWith('/chapters?id=chapter-123&userId=');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getListByBook', () => {
    it('应该获取书籍的章节列表（带userId）', async () => {
      const mockResponse = { chapters: [{ chapter_id: '1', title: '第一章' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.getListByBook('book-123', 'user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/chapters?bookId=book-123&userId=user-123');
      expect(result).toEqual(mockResponse);
    });

    it('应该获取书籍的章节列表（不带userId）', async () => {
      const mockResponse = { chapters: [{ chapter_id: '1', title: '第一章' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.getListByBook('book-123');

      expect(apiClient.get).toHaveBeenCalledWith('/chapters?bookId=book-123&userId=');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('应该创建章节（带puzzle）', async () => {
      const mockResponse = { chapterId: 'new-chapter-id', chapterNumber: 1, message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);
      const puzzle = { question: '问题', answer: '答案' };

      const result = await chaptersAPI.create('book-123', '新章节', '章节内容', puzzle);

      expect(apiClient.post).toHaveBeenCalledWith('/chapters', {
        bookId: 'book-123',
        title: '新章节',
        content: '章节内容',
        puzzle,
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该创建章节（不带puzzle）', async () => {
      const mockResponse = { chapterId: 'new-chapter-id', chapterNumber: 1, message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.create('book-123', '新章节', '章节内容');

      expect(apiClient.post).toHaveBeenCalledWith('/chapters', {
        bookId: 'book-123',
        title: '新章节',
        content: '章节内容',
        puzzle: null,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('应该删除章节', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.delete('chapter-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/chapters?id=chapter-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('complete', () => {
    it('应该标记章节完成', async () => {
      const mockResponse = { message: '完成成功' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.complete('book-123', 'chapter-123', 'user-123');

      expect(apiClient.post).toHaveBeenCalledWith('/chapters-complete/books/book-123/chapters/chapter-123', {
        userId: 'user-123',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('generate', () => {
    it('应该生成新章节（带所有参数）', async () => {
      const mockResponse = { chapterId: 'new-id', chapterNumber: 2, title: '新章节' };
      apiClient.post.mockResolvedValue(mockResponse);
      const plotSelection = { weather: 'sunny' };
      const characterIds = ['char-1', 'char-2'];

      const result = await chaptersAPI.generate('book-123', 'user-123', plotSelection, characterIds);

      expect(apiClient.post).toHaveBeenCalledWith('/chapters-generate/books/book-123', {
        userId: 'user-123',
        plotSelection,
        characterIds,
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该生成新章节（不带可选参数）', async () => {
      const mockResponse = { chapterId: 'new-id', chapterNumber: 2, title: '新章节' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chaptersAPI.generate('book-123', 'user-123');

      expect(apiClient.post).toHaveBeenCalledWith('/chapters-generate/books/book-123', {
        userId: 'user-123',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
