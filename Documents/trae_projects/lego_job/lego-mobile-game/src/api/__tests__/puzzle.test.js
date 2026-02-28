/**
 * Puzzle API 单元测试
 */

import { puzzleAPI, plotOptionsAPI } from '../puzzle';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('puzzleAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('应该通过ID获取谜题', async () => {
      const mockResponse = { puzzle: { puzzle_id: '1', question: '问题' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await puzzleAPI.getById('puzzle-123');

      expect(apiClient.get).toHaveBeenCalledWith('/puzzle?id=puzzle-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByChapter', () => {
    it('应该通过章节ID获取谜题', async () => {
      const mockResponse = { puzzle: { puzzle_id: '1', question: '问题' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await puzzleAPI.getByChapter('chapter-123');

      expect(apiClient.get).toHaveBeenCalledWith('/puzzle?chapterId=chapter-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('submit', () => {
    it('应该提交谜题答案', async () => {
      const mockResponse = { isCorrect: true, attempts: 1, attemptsRemaining: 2, message: '回答正确' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await puzzleAPI.submit('puzzle-123', 'user-123', '答案');

      expect(apiClient.post).toHaveBeenCalledWith('/puzzle', {
        puzzleId: 'puzzle-123',
        userId: 'user-123',
        userAnswer: '答案',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('plotOptionsAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('应该获取情节选项', async () => {
      const mockResponse = { plotOptions: { weather: [], adventureType: [] } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await plotOptionsAPI.get();

      expect(apiClient.get).toHaveBeenCalledWith('/plot-options');
      expect(result).toEqual(mockResponse);
    });
  });
});
