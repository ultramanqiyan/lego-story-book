import apiClient from './client';

/**
 * @typedef {Object} CharacterData
 * @property {string} character_id - 角色ID
 * @property {string} custom_name - 自定义名称
 * @property {string} [personality] - 性格
 * @property {string} [speaking_style] - 说话方式
 */

/**
 * @typedef {Object} PuzzleData
 * @property {string} question - 谜题问题
 * @property {string} answer - 正确答案
 * @property {boolean} isCorrect - 是否答对
 */

/**
 * @typedef {Object} PlotSelection
 * @property {string} weather - 天气
 * @property {string} adventureType - 冒险类型
 * @property {string} terrain - 地形
 * @property {string} equipment - 装备
 */

/**
 * @typedef {Object} StoryGenerateParams
 * @property {CharacterData[]} characters - 角色列表
 * @property {string} plot - 情节类型
 * @property {CharacterData[]} [chapterCharacters] - 本章角色
 * @property {string} [previousSummary] - 前情提要
 * @property {PuzzleData} [previousPuzzle] - 上一章谜题
 * @property {PlotSelection} [plotSelection] - 情节选择
 * @property {boolean} [forcePuzzle] - 是否强制生成谜题
 */

/**
 * @typedef {Object} StoryGenerateResult
 * @property {string} title - 章节标题
 * @property {string} content - 章节内容
 * @property {Object} [puzzle] - 谜题数据
 * @property {string} [prompt] - 使用的提示词
 */

/**
 * 生成故事章节
 * @param {StoryGenerateParams} params - 生成参数
 * @returns {Promise<StoryGenerateResult>} 生成结果
 */
export const storyAPI = {
  async generate(params) {
    return apiClient.post('/story', {
      characters: params.characters,
      plot: params.plot,
      chapterCharacters: params.chapterCharacters,
      previousSummary: params.previousSummary,
      previousPuzzle: params.previousPuzzle,
      plotSelection: params.plotSelection,
      forcePuzzle: params.forcePuzzle,
    });
  },
};

export default storyAPI;
