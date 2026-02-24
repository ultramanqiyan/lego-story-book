import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockContext = {
  env: {
    SEEDREAM_API_KEY: 'test-api-key'
  },
  request: {
    json: vi.fn()
  }
};

describe('generate.js API 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('onRequestPost', () => {
    it('应该成功处理图片生成请求', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          image: 'base64-image-data',
          prompt: '乐高风格人仔'
        })
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          data: [{ url: 'https://example.com/image.png' }]
        })
      });

      const { onRequestPost } = await import('../../functions/api/generate.js');
      const result = await onRequestPost({ ...mockContext, request: mockRequest });

      expect(result.status).toBe(200);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(true);
      expect(responseData.imageUrl).toBe('https://example.com/image.png');
    });

    it('应该处理 API 错误响应', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          image: 'base64-image-data',
          prompt: '乐高风格人仔'
        })
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid request' }
        })
      });

      const { onRequestPost } = await import('../../functions/api/generate.js');
      const result = await onRequestPost({ ...mockContext, request: mockRequest });

      expect(result.status).toBe(400);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
    });

    it('应该处理服务器错误', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Parse error'))
      };

      const { onRequestPost } = await import('../../functions/api/generate.js');
      const result = await onRequestPost({ ...mockContext, request: mockRequest });

      expect(result.status).toBe(500);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
    });
  });

  describe('getApiKey', () => {
    it('应该从环境变量获取 API Key', async () => {
      const context = { env: { SEEDREAM_API_KEY: 'custom-api-key' } };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: [{ url: 'test-url' }] })
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({ image: 'test', prompt: 'test' })
      };

      const { onRequestPost } = await import('../../functions/api/generate.js');
      await onRequestPost({ ...context, request: mockRequest });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ark.cn-beijing.volces.com/api/v3/images/generations',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom-api-key'
          })
        })
      );
    });

    it('应该使用默认 API Key 当环境变量未设置时', async () => {
      const context = { env: {} };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: [{ url: 'test-url' }] })
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({ image: 'test', prompt: 'test' })
      };

      const { onRequestPost } = await import('../../functions/api/generate.js');
      await onRequestPost({ ...context, request: mockRequest });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ark.cn-beijing.volces.com/api/v3/images/generations',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer ee51832f-f233-45ec-9262-00e1d2a66ba1'
          })
        })
      );
    });
  });

  describe('buildPayload', () => {
    it('应该构建正确的请求载荷', async () => {
      const image = 'base64-image';
      const prompt = '测试提示词';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: [{ url: 'test-url' }] })
      });

      const mockRequest = {
        json: vi.fn().mockResolvedValue({ image, prompt })
      };

      const { onRequestPost } = await import('../../functions/api/generate.js');
      await onRequestPost({ ...mockContext, request: mockRequest });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.model).toBe('doubao-seedream-4-0-250828');
      expect(body.prompt).toBe(prompt);
      expect(body.image).toBe(image);
      expect(body.size).toBe('1024x1024');
    });
  });

  describe('handleApiError', () => {
    it('应该处理没有错误消息的 API 错误', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          image: 'base64-image-data',
          prompt: '乐高风格人仔'
        })
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({})
      });

      const { onRequestPost } = await import('../../functions/api/generate.js');
      const result = await onRequestPost({ ...mockContext, request: mockRequest });

      expect(result.status).toBe(500);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('API调用失败');
    });

    it('应该处理有错误消息的 API 错误', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          image: 'base64-image-data',
          prompt: '乐高风格人仔'
        })
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({
          error: { message: '图片格式不支持' }
        })
      });

      const { onRequestPost } = await import('../../functions/api/generate.js');
      const result = await onRequestPost({ ...mockContext, request: mockRequest });

      expect(result.status).toBe(400);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('图片格式不支持');
    });
  });
});
