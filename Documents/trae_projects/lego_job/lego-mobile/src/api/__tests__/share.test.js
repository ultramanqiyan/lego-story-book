/**
 * Share API 单元测试
 */

import { shareAPI } from '../share';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('shareAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该创建分享（带所有选项）', async () => {
      const mockResponse = { shareId: 'new-share-id', shareCode: 'ABC123', message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);
      const options = { password: '123456', isPublic: true };

      const result = await shareAPI.create('book-123', 'user-123', options);

      expect(apiClient.post).toHaveBeenCalledWith('/share', {
        bookId: 'book-123',
        userId: 'user-123',
        password: '123456',
        isPublic: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该创建分享（不带选项）', async () => {
      const mockResponse = { shareId: 'new-share-id', shareCode: 'ABC123', message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await shareAPI.create('book-123', 'user-123');

      expect(apiClient.post).toHaveBeenCalledWith('/share', {
        bookId: 'book-123',
        userId: 'user-123',
        password: undefined,
        isPublic: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByBook', () => {
    it('应该通过书籍ID获取分享信息', async () => {
      const mockResponse = { shares: [{ share_id: '1', book_id: 'book-123' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await shareAPI.getByBook('book-123', 'user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/share?bookId=book-123&userId=user-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByCode', () => {
    it('应该通过分享码获取分享信息', async () => {
      const mockResponse = { share: { share_id: '1', share_code: 'ABC123' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await shareAPI.getByCode('ABC123');

      expect(apiClient.get).toHaveBeenCalledWith('/share?code=ABC123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('应该删除分享', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await shareAPI.delete('share-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/share?id=share-123');
      expect(result).toEqual(mockResponse);
    });
  });
});
