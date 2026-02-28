import apiClient from './client';

/**
 * 分享 API 模块
 * @module shareAPI
 */

/**
 * 分享 API
 */
export const shareAPI = {
  /**
   * 创建分享
   * @param {string} bookId - 书籍ID
   * @param {string} userId - 用户ID
   * @param {Object} [options] - 可选参数
   * @param {string} [options.password] - 密码保护
   * @param {boolean} [options.isPublic] - 是否公开
   * @returns {Promise<{shareId: string, shareCode: string, message: string}>} 创建结果
   */
  async create(bookId, userId, options = {}) {
    return apiClient.post('/share', {
      bookId,
      userId,
      password: options.password,
      isPublic: options.isPublic,
    });
  },

  /**
   * 通过书籍ID获取分享信息
   * @param {string} bookId - 书籍ID
   * @param {string} userId - 用户ID
   * @returns {Promise<{shares: Array}>} 分享列表
   */
  async getByBook(bookId, userId) {
    return apiClient.get(`/share?bookId=${bookId}&userId=${userId}`);
  },

  /**
   * 通过分享码获取分享信息
   * @param {string} code - 分享码
   * @returns {Promise<{share: Object}>} 分享信息
   */
  async getByCode(code) {
    return apiClient.get(`/share?code=${code}`);
  },

  /**
   * 删除分享
   * @param {string} shareId - 分享ID
   * @returns {Promise<{message: string}>} 删除结果
   */
  async delete(shareId) {
    return apiClient.delete(`/share?id=${shareId}`);
  },
};

export default shareAPI;
