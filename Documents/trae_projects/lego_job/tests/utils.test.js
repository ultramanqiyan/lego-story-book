import { describe, it, expect } from 'vitest';
import { generateId, createResponse, createErrorResponse, createSuccessResponse } from '../functions/api/utils.js';

describe('utils.js 工具函数测试', () => {
  describe('generateId', () => {
    it('应该生成唯一ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('应该以 "id_" 开头', () => {
      const id = generateId();
      expect(id.startsWith('id_')).toBe(true);
    });

    it('应该包含时间戳部分', () => {
      const id = generateId();
      const parts = id.split('_');
      expect(parts.length).toBe(3);
    });
  });

  describe('createResponse', () => {
    it('应该创建默认状态码200的响应', () => {
      const data = { test: 'value' };
      const response = createResponse(data);
      expect(response.status).toBe(200);
    });

    it('应该创建指定状态码的响应', () => {
      const data = { error: 'not found' };
      const response = createResponse(data, 404);
      expect(response.status).toBe(404);
    });

    it('应该设置正确的Content-Type头', () => {
      const response = createResponse({});
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('应该正确序列化响应数据', async () => {
      const data = { message: 'hello' };
      const response = createResponse(data);
      const text = await response.text();
      expect(JSON.parse(text)).toEqual(data);
    });
  });

  describe('createErrorResponse', () => {
    it('应该创建错误响应', () => {
      const response = createErrorResponse('发生错误', 400);
      expect(response.status).toBe(400);
    });

    it('应该包含success: false', async () => {
      const response = createErrorResponse('发生错误', 400);
      const data = JSON.parse(await response.text());
      expect(data.success).toBe(false);
    });

    it('应该包含错误消息', async () => {
      const response = createErrorResponse('发生错误', 400);
      const data = JSON.parse(await response.text());
      expect(data.error).toBe('发生错误');
    });

    it('应该默认使用500状态码', () => {
      const response = createErrorResponse('服务器错误');
      expect(response.status).toBe(500);
    });
  });

  describe('createSuccessResponse', () => {
    it('应该创建成功响应', async () => {
      const response = createSuccessResponse({ data: 'test' });
      expect(response.status).toBe(200);
      const body = JSON.parse(await response.text());
      expect(body.success).toBe(true);
    });

    it('应该合并传入的数据', async () => {
      const response = createSuccessResponse({ message: '操作成功', id: '123' });
      const body = JSON.parse(await response.text());
      expect(body.success).toBe(true);
      expect(body.message).toBe('操作成功');
      expect(body.id).toBe('123');
    });
  });
});
