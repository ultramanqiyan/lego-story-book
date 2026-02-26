import apiClient from './client';

/**
 * 谜题 API 模块
 * @module puzzleAPI
 */

/**
 * 谜题 API
 */
export const puzzleAPI = {
  /**
   * 通过ID获取谜题
   * @param {string} puzzleId - 谜题ID
   * @returns {Promise<{puzzle: Object}>} 谜题详情
   */
  async getById(puzzleId) {
    return apiClient.get(`/puzzle?id=${puzzleId}`);
  },

  /**
   * 通过章节ID获取谜题
   * @param {string} chapterId - 章节ID
   * @returns {Promise<{puzzle: Object}>} 谜题详情
   */
  async getByChapter(chapterId) {
    return apiClient.get(`/puzzle?chapterId=${chapterId}`);
  },

  /**
   * 提交谜题答案
   * @param {string} puzzleId - 谜题ID
   * @param {string} userId - 用户ID
   * @param {string} userAnswer - 用户答案
   * @returns {Promise<{isCorrect: boolean, attempts: number, attemptsRemaining: number, hint?: string, message: string}>} 提交结果
   */
  async submit(puzzleId, userId, userAnswer) {
    return apiClient.post('/puzzle', {
      puzzleId,
      userId,
      userAnswer,
    });
  },
};

/**
 * 情节选项 API
 * @module plotOptionsAPI
 */
export const plotOptionsAPI = {
  /**
   * 获取情节选项
   * @returns {Promise<{plotOptions: Object}>} 情节选项（天气、冒险类型、地形、装备等）
   */
  async get() {
    return apiClient.get('/plot-options');
  },
};

export default puzzleAPI;
