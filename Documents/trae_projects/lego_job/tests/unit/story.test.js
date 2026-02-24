import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const createMockRequest = (data) => ({
  json: vi.fn().mockResolvedValue(data)
});

const createMockContext = (request, env = {}) => ({
  env: { ...env },
  request
});

describe('story.js API 测试', () => {
  let mockContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('onRequestPost', () => {
    it('应该成功生成故事', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "神秘森林", "content": "这是生成的故事内容..."}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.title).toBe('神秘森林');
      expect(data.content).toBeDefined();
    });

    it('应该拒绝没有角色的请求', async () => {
      mockContext = createMockContext(createMockRequest({
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该拒绝没有故事类型的请求', async () => {
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }]
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该处理API错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({
          error: { message: 'Invalid request' }
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }],
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(500);
    });

    it('应该处理服务器错误', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }],
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(500);
    });

    it('应该使用环境变量中的API Key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: '{"title": "测试", "content": "内容"}' } }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }],
        plot: '冒险之旅'
      }), { DOUBAO_API_KEY: 'custom-api-key' });
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      await onRequestPost(mockContext);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom-api-key'
          })
        })
      );
    });

    it('应该处理空角色数组', async () => {
      mockContext = createMockContext(createMockRequest({
        characters: [],
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      
      expect(result.status).toBe(400);
    });

    it('应该处理无消息返回的情况', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: []
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }],
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.content).toBe('故事生成中，请稍后...');
    });

    it('应该解析AI返回的JSON格式', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "勇闯迷宫", "content": "小蝙蝠勇敢地走进了神秘的迷宫..."}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.title).toBe('勇闯迷宫');
      expect(data.content).toContain('小蝙蝠勇敢地走进了神秘的迷宫');
    });

    it('应该处理JSON解析失败的情况', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '纯文本内容，不是JSON' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.title).toBe('新章节');
      expect(data.content).toBe('纯文本内容，不是JSON');
    });

    it('应该返回提示词', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "测试", "content": "内容"}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toBeDefined();
      expect(data.prompt).toContain('书籍角色');
    });

    it('应该支持强制生成谜题', async () => {
      const puzzleData = {
        question: '问题', 
        options: ['A. 1', 'B. 2'], 
        answer: 'A', 
        type: 'pattern'
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { 
              content: JSON.stringify({
                title: '测试', 
                content: '内容', 
                puzzle: puzzleData
              })
            }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1,
        forcePuzzle: true
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toContain('解谜要求');
    });

    it('应该支持前情提要参数', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "续章", "content": "继续的故事..."}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 2,
        previousSummary: '上一章小蝙蝠进入了森林'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toContain('前情提要');
    });

    it('应该支持上一章谜题回顾参数', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "续章", "content": "继续的故事..."}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 2,
        previousSummary: '上一章小蝙蝠进入了森林',
        previousPuzzle: {
          question: '哪个是水果？',
          answer: 'A',
          isCorrect: true
        }
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toContain('上一章谜题回顾');
      expect(data.prompt).toContain('哪个是水果？');
      expect(data.prompt).toContain('主角成功解开了谜题');
    });

    it('应该根据答题结果显示不同的提示词', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "续章", "content": "继续的故事..."}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 2,
        previousSummary: '上一章小蝙蝠进入了森林',
        previousPuzzle: {
          question: '哪个是水果？',
          answer: 'A',
          isCorrect: false
        }
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toContain('主角答错了谜题');
    });

    it('默认情况下应该100%生成谜题', async () => {
      const puzzleData = {
        question: '测试问题',
        options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
        answer: 'A',
        type: 'pattern'
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { 
              content: JSON.stringify({
                title: '测试', 
                content: '内容', 
                puzzle: puzzleData
              })
            }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠', personality: '勇敢' }],
        plot: '冒险之旅',
        chapter: 1
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      const result = await onRequestPost(mockContext);
      const data = JSON.parse(await result.text());
      
      expect(data.success).toBe(true);
      expect(data.prompt).toContain('解谜要求');
    });

    it('应该使用正确的AI模型', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: { content: '{"title": "测试", "content": "内容"}' }
          }]
        })
      });
      
      mockContext = createMockContext(createMockRequest({
        characters: [{ custom_name: '小蝙蝠' }],
        plot: '冒险之旅'
      }));
      
      const { onRequestPost } = await import('../../functions/api/story.js');
      await onRequestPost(mockContext);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        expect.objectContaining({
          body: expect.stringContaining('doubao-1-5-pro-32k-250115')
        })
      );
    });
  });
});
