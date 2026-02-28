import apiClient from './client';

/**
 * 人仔 API 模块
 * @module charactersAPI
 */

/**
 * 人仔 API
 */
export const charactersAPI = {
  /**
   * 获取人仔列表
   * @param {string} [userId] - 用户ID（可选，不传则获取所有公开人仔）
   * @returns {Promise<{characters: Array}>} 人仔列表
   */
  async getList(userId) {
    if (userId) {
      return apiClient.get(`/characters?userId=${userId}`);
    }
    return apiClient.get('/characters');
  },

  /**
   * 创建人仔
   * @param {Object} data - 人份数据
   * @param {string} data.name - 名称（必填，最大20字符）
   * @param {string} [data.imageBase64] - 图片Base64
   * @param {string} [data.description] - 描述
   * @param {string} [data.personality] - 性格
   * @param {string} [data.speakingStyle] - 说话方式
   * @param {string} [data.creatorId] - 创建者ID，默认'user'
   * @returns {Promise<{characterId: string, message: string}>} 创建结果
   */
  async create(data) {
    return apiClient.post('/characters', {
      name: data.name,
      imageBase64: data.imageBase64,
      description: data.description,
      personality: data.personality,
      speakingStyle: data.speakingStyle,
      creatorId: data.creatorId || 'user',
    });
  },

  /**
   * 更新人仔
   * @param {string} characterId - 人仔ID
   * @param {Object} data - 更新数据
   * @param {string} [data.name] - 名称
   * @param {string} [data.imageBase64] - 图片Base64
   * @param {string} [data.description] - 描述
   * @param {string} [data.personality] - 性格
   * @param {string} [data.speakingStyle] - 说话方式
   * @returns {Promise<{message: string}>} 更新结果
   */
  async update(characterId, data) {
    return apiClient.put('/characters', {
      characterId,
      name: data.name,
      imageBase64: data.imageBase64,
      description: data.description,
      personality: data.personality,
      speakingStyle: data.speakingStyle,
    });
  },

  /**
   * 删除人仔
   * @param {string} characterId - 人仔ID
   * @param {boolean} [force=false] - 是否强制删除（即使被使用）
   * @returns {Promise<{message: string}|{needsConfirm: boolean, message: string, usageCount: number}>} 删除结果
   */
  async delete(characterId, force = false) {
    return apiClient.delete(`/characters?id=${characterId}&force=${force}`);
  },
};

export default charactersAPI;
