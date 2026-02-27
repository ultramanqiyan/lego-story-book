/**
 * Story API 单元测试
 */

import { storyAPI } from '../story';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  post: jest.fn(),
}));

describe('storyAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('应该生成故事（带所有参数）', async () => {
      const mockResponse = { title: '新章节', content: '章节内容', puzzle: { question: '问题' } };
      apiClient.post.mockResolvedValue(mockResponse);

      const params = {
        characters: [{ character_id: '1', custom_name: '角色1' }],
        plot: '冒险',
        chapterCharacters: [{ character_id: '1', custom_name: '角色1' }],
        previousSummary: '前情提要',
        previousPuzzle: { question: '问题', answer: '答案', isCorrect: true },
        plotSelection: { weather: 'sunny', adventureType: 'exploration', terrain: 'forest', equipment: 'sword' },
        forcePuzzle: true,
      };

      const result = await storyAPI.generate(params);

      expect(apiClient.post).toHaveBeenCalledWith('/story', {
        characters: params.characters,
        plot: '冒险',
        chapterCharacters: params.chapterCharacters,
        previousSummary: '前情提要',
        previousPuzzle: params.previousPuzzle,
        plotSelection: params.plotSelection,
        forcePuzzle: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it('应该生成故事（带最少参数）', async () => {
      const mockResponse = { title: '新章节', content: '章节内容' };
      apiClient.post.mockResolvedValue(mockResponse);

      const params = {
        characters: [{ character_id: '1', custom_name: '角色1' }],
        plot: '冒险',
      };

      const result = await storyAPI.generate(params);

      expect(apiClient.post).toHaveBeenCalledWith('/story', {
        characters: params.characters,
        plot: '冒险',
        chapterCharacters: undefined,
        previousSummary: undefined,
        previousPuzzle: undefined,
        plotSelection: undefined,
        forcePuzzle: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
