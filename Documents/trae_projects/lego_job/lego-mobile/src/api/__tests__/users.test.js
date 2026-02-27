/**
 * Users API 单元测试
 */

import { usersAPI } from '../users';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe('usersAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrLogin', () => {
    it('应该创建或登录用户（带email）', async () => {
      const mockResponse = { userId: 'new-user-id', message: '创建成功', isNewUser: true };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await usersAPI.createOrLogin('测试用户', 'test@example.com');

      expect(apiClient.post).toHaveBeenCalledWith('/users', {
        username: '测试用户',
        email: 'test@example.com',
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该创建或登录用户（不带email）', async () => {
      const mockResponse = { userId: 'new-user-id', message: '创建成功', isNewUser: true };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await usersAPI.createOrLogin('测试用户');

      expect(apiClient.post).toHaveBeenCalledWith('/users', {
        username: '测试用户',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUser', () => {
    it('应该获取用户信息', async () => {
      const mockResponse = { user: { user_id: '1', username: '测试用户' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await usersAPI.getUser('user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/users?userId=user-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateUser', () => {
    it('应该更新用户信息（带所有参数）', async () => {
      const mockResponse = { message: '更新成功' };
      apiClient.put.mockResolvedValue(mockResponse);

      const data = {
        username: '新用户名',
        email: 'new@example.com',
        avatar: 'avatar-url',
        dailyTimeLimit: 120,
      };

      const result = await usersAPI.updateUser('user-123', data);

      expect(apiClient.put).toHaveBeenCalledWith('/users', {
        userId: 'user-123',
        ...data,
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该更新用户信息（带部分参数）', async () => {
      const mockResponse = { message: '更新成功' };
      apiClient.put.mockResolvedValue(mockResponse);

      const data = { username: '新用户名' };

      const result = await usersAPI.updateUser('user-123', data);

      expect(apiClient.put).toHaveBeenCalledWith('/users', {
        userId: 'user-123',
        username: '新用户名',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
