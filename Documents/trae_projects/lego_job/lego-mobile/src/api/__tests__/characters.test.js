/**
 * Characters API 单元测试
 */

import { charactersAPI } from '../characters';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('charactersAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('应该获取人仔列表（带userId）', async () => {
      const mockResponse = { characters: [{ character_id: '1', name: '角色1' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await charactersAPI.getList('user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/characters?userId=user-123');
      expect(result).toEqual(mockResponse);
    });

    it('应该获取所有人仔列表（不带userId）', async () => {
      const mockResponse = { characters: [{ character_id: '1', name: '角色1' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await charactersAPI.getList();

      expect(apiClient.get).toHaveBeenCalledWith('/characters');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('应该创建人仔（带所有参数）', async () => {
      const mockResponse = { characterId: 'new-char-id', message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);
      const data = {
        name: '新角色',
        imageBase64: 'base64string',
        description: '描述',
        personality: '性格',
        speakingStyle: '说话方式',
        creatorId: 'user-123',
      };

      const result = await charactersAPI.create(data);

      expect(apiClient.post).toHaveBeenCalledWith('/characters', {
        name: '新角色',
        imageBase64: 'base64string',
        description: '描述',
        personality: '性格',
        speakingStyle: '说话方式',
        creatorId: 'user-123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该创建人仔（使用默认creatorId）', async () => {
      const mockResponse = { characterId: 'new-char-id', message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);
      const data = { name: '新角色' };

      const result = await charactersAPI.create(data);

      expect(apiClient.post).toHaveBeenCalledWith('/characters', {
        name: '新角色',
        imageBase64: undefined,
        description: undefined,
        personality: undefined,
        speakingStyle: undefined,
        creatorId: 'user',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('应该更新人仔', async () => {
      const mockResponse = { message: '更新成功' };
      apiClient.put.mockResolvedValue(mockResponse);
      const data = {
        name: '更新后的名称',
        imageBase64: 'new-base64',
        description: '新描述',
        personality: '新性格',
        speakingStyle: '新说话方式',
      };

      const result = await charactersAPI.update('char-123', data);

      expect(apiClient.put).toHaveBeenCalledWith('/characters', {
        characterId: 'char-123',
        name: '更新后的名称',
        imageBase64: 'new-base64',
        description: '新描述',
        personality: '新性格',
        speakingStyle: '新说话方式',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('应该删除人仔（不带force）', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await charactersAPI.delete('char-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/characters?id=char-123&force=false');
      expect(result).toEqual(mockResponse);
    });

    it('应该强制删除人仔（带force）', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await charactersAPI.delete('char-123', true);

      expect(apiClient.delete).toHaveBeenCalledWith('/characters?id=char-123&force=true');
      expect(result).toEqual(mockResponse);
    });
  });
});
