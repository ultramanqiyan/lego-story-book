import apiClient from './client';

/**
 * 章节 API 模块
 * @module chaptersAPI
 */

/**
 * 章节 API
 */
export const chaptersAPI = {
  /**
   * 获取章节详情
   * @param {string} chapterId - 章节ID
   * @param {string} [userId] - 用户ID（可选）
   * @returns {Promise<{chapter: Object, puzzle: Object, puzzleRecord: Object}>} 章节详情
   */
  async getDetail(chapterId, userId) {
    return apiClient.get(`/chapters?id=${chapterId}&userId=${userId || ''}`);
  },

  /**
   * 获取书籍的章节列表
   * @param {string} bookId - 书籍ID
   * @param {string} [userId] - 用户ID（可选）
   * @returns {Promise<{chapters: Array}>} 章节列表
   */
  async getListByBook(bookId, userId) {
    return apiClient.get(`/chapters?bookId=${bookId}&userId=${userId || ''}`);
  },

  /**
   * 创建章节
   * @param {string} bookId - 书籍ID
   * @param {string} title - 章节标题
   * @param {string} content - 章节内容
   * @param {Object} [puzzle] - 谜题数据
   * @returns {Promise<{chapterId: string, chapterNumber: number, message: string}>} 创建结果
   */
  async create(bookId, title, content, puzzle = null) {
    return apiClient.post('/chapters', {
      bookId,
      title,
      content,
      puzzle,
    });
  },

  /**
   * 删除章节
   * @param {string} chapterId - 章节ID
   * @returns {Promise<{message: string}>} 删除结果
   */
  async delete(chapterId) {
    return apiClient.delete(`/chapters?id=${chapterId}`);
  },

  /**
   * 标记章节完成
   * @param {string} bookId - 书籍ID
   * @param {string} chapterId - 章节ID
   * @param {string} userId - 用户ID
   * @returns {Promise<{message: string}>} 完成结果
   */
  async complete(bookId, chapterId, userId) {
    return apiClient.post(`/chapters-complete/books/${bookId}/chapters/${chapterId}`, {
      userId,
    });
  },

  /**
   * 生成新章节
   * @param {string} bookId - 书籍ID
   * @param {string} userId - 用户ID
   * @param {Object} [plotSelection] - 情节选择
   * @param {string[]} [characterIds] - 角色ID列表
   * @returns {Promise<{chapterId: string, chapterNumber: number, title: string, hasPuzzle: boolean, prompt: string, message: string}>} 生成结果
   */
  async generate(bookId, userId, plotSelection = null, characterIds = null) {
    const body = { userId };
    if (plotSelection) {
      body.plotSelection = plotSelection;
    }
    if (characterIds) {
      body.characterIds = characterIds;
    }
    return apiClient.post(`/chapters-generate?bookId=${bookId}`, body);
  },
};

export default chaptersAPI;
