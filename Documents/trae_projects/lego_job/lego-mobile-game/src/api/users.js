import apiClient from './client';

/**
 * 用户 API 模块
 * @module usersAPI
 */

/**
 * 创建或登录用户
 * @param {string} username - 用户名（必填，最大20字符）
 * @param {string} [email] - 邮箱（可选）
 * @returns {Promise<{userId: string, message: string, isNewUser: boolean}>} 用户信息
 */
export const usersAPI = {
  async createOrLogin(username, email = null) {
    const body = { username };
    if (email) {
      body.email = email;
    }
    return apiClient.post('/users', body);
  },

  /**
   * 获取用户信息
   * @param {string} userId - 用户ID
   * @returns {Promise<{user: Object}>} 用户信息
   */
  async getUser(userId) {
    return apiClient.get(`/users?userId=${userId}`);
  },

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} data - 更新数据
   * @param {string} [data.username] - 用户名
   * @param {string} [data.email] - 邮箱
   * @param {string} [data.avatar] - 头像
   * @param {number} [data.dailyTimeLimit] - 每日时间限制（分钟）
   * @returns {Promise<{message: string}>} 结果信息
   */
  async updateUser(userId, data) {
    return apiClient.put('/users', { userId, ...data });
  },
};

export default usersAPI;
