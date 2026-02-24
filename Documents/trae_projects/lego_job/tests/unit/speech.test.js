import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockFormData = {
  get: vi.fn()
};

const mockRequest = {
  formData: vi.fn()
};

const mockContext = {
  env: {
    SILICONFLOW_API_KEY: 'test-api-key'
  },
  request: mockRequest
};

describe('speech.js API 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.formData.mockReset();
    mockFormData.get.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('onRequestPost', () => {
    it('应该成功处理语音识别请求', async () => {
      const mockAudioFile = new File(['audio-data'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ text: '识别的文字内容' })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);

      expect(result.status).toBe(200);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(true);
      expect(responseData.text).toBe('识别的文字内容');
    });

    it('应该处理没有音频文件的情况', async () => {
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(null);

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);

      expect(result.status).toBe(400);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('没有收到音频文件');
    });

    it('应该处理 API 错误响应', async () => {
      const mockAudioFile = new File(['audio-data'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({
          error: { message: 'Unauthorized' }
        })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);

      expect(result.status).toBe(401);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
    });

    it('应该处理服务器错误', async () => {
      mockRequest.formData.mockRejectedValue(new Error('Form parse error'));

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);

      expect(result.status).toBe(500);
      const responseData = JSON.parse(await result.text());
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('语音识别服务错误');
    });
  });

  describe('getApiKey', () => {
    it('应该从环境变量获取 API Key', async () => {
      const context = { 
        env: { SILICONFLOW_API_KEY: 'custom-api-key' },
        request: mockRequest
      };
      
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ text: 'test' })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      await onRequestPost(context);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.siliconflow.cn/v1/audio/transcriptions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom-api-key'
          })
        })
      );
    });

    it('应该使用默认 API Key 当环境变量未设置时', async () => {
      const context = { 
        env: {},
        request: mockRequest
      };
      
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ text: 'test' })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      await onRequestPost(context);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.siliconflow.cn/v1/audio/transcriptions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer sk-zisdkmqynswnsnikguvbkegwyunykggaenzekxocuukeaotz'
          })
        })
      );
    });
  });

  describe('buildAudioFormData', () => {
    it('应该构建正确的 FormData', async () => {
      const mockAudioFile = new File(['audio-data'], 'test.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ text: 'test' })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      await onRequestPost(mockContext);

      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1].body;
      
      expect(formData).toBeInstanceOf(FormData);
    });
  });

  describe('handleSuccess', () => {
    it('应该正确处理成功响应', async () => {
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ text: '识别成功' })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);
      const responseData = JSON.parse(await result.text());

      expect(responseData.success).toBe(true);
      expect(responseData.text).toBe('识别成功');
    });

    it('应该处理空文本响应', async () => {
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({})
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);
      const responseData = JSON.parse(await result.text());

      expect(responseData.success).toBe(true);
      expect(responseData.text).toBe('');
    });
  });

  describe('handleApiError', () => {
    it('应该处理有错误消息的 API 错误', async () => {
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({
          error: { message: 'API Key 无效' }
        })
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);
      const responseData = JSON.parse(await result.text());

      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('API Key 无效');
    });

    it('应该处理没有错误消息的 API 错误', async () => {
      const mockAudioFile = new File(['audio'], 'audio.webm', { type: 'audio/webm' });
      
      mockRequest.formData.mockResolvedValue(mockFormData);
      mockFormData.get.mockReturnValue(mockAudioFile);
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({})
      });

      const { onRequestPost } = await import('../../functions/api/speech.js');
      const result = await onRequestPost(mockContext);
      const responseData = JSON.parse(await result.text());

      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('语音识别失败');
    });
  });
});
