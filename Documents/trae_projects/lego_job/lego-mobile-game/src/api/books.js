import apiClient from './client';

/**
 * 书籍 API 模块
 * @module booksAPI
 */

/**
 * 书籍 API
 */
export const booksAPI = {
  /**
   * 获取书籍列表
   * @param {string} userId - 用户ID
   * @returns {Promise<{books: Array}>} 书籍列表
   */
  async getList(userId) {
    return apiClient.get(`/books?userId=${userId}`);
  },

  /**
   * 获取书籍详情
   * @param {string} bookId - 书籍ID
   * @param {string} [userId] - 用户ID（可选）
   * @returns {Promise<{book: Object, chapters: Array, characters: Array}>} 书籍详情
   */
  async getDetail(bookId, userId) {
    let url = `/books?bookId=${bookId}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return apiClient.get(url);
  },

  /**
   * 创建书籍
   * @param {string} userId - 用户ID
   * @param {string} title - 书籍标题（最大50字符）
   * @returns {Promise<{bookId: string, message: string}>} 创建结果
   */
  async create(userId, title) {
    return apiClient.post('/books', { userId, title });
  },

  /**
   * 更新书籍
   * @param {string} bookId - 书籍ID
   * @param {Object} data - 更新数据
   * @param {string} [data.title] - 标题
   * @param {string} [data.status] - 状态
   * @returns {Promise<{message: string}>} 更新结果
   */
  async update(bookId, data) {
    return apiClient.put('/books', { bookId, ...data });
  },

  /**
   * 删除书籍
   * @param {string} bookId - 书籍ID
   * @returns {Promise<{message: string}>} 删除结果
   */
  async delete(bookId) {
    return apiClient.delete(`/books?id=${bookId}`);
  },
};

/**
 * 书籍角色 API
 * @module bookCharactersAPI
 */
export const bookCharactersAPI = {
  /**
   * 获取书籍角色列表
   * @param {string} bookId - 书籍ID
   * @returns {Promise<{characters: Array}>} 角色列表
   */
  async getList(bookId) {
    return apiClient.get(`/book-characters?bookId=${bookId}`);
  },

  /**
   * 添加角色到书籍
   * @param {string} bookId - 书籍ID
   * @param {string} characterId - 人仔ID
   * @param {string} customName - 自定义名称（最大20字符）
   * @param {string} [roleType] - 角色类型：protagonist/antagonist/supporting/extra
   * @returns {Promise<{message: string, id: string}>} 添加结果
   */
  async add(bookId, characterId, customName, roleType) {
    return apiClient.post('/book-characters', {
      bookId,
      characterId,
      customName,
      roleType,
    });
  },

  /**
   * 更新书籍角色
   * @param {string} id - 记录ID
   * @param {Object} data - 更新数据
   * @param {string} [data.customName] - 自定义名称
   * @param {string} [data.roleType] - 角色类型
   * @returns {Promise<{message: string}>} 更新结果
   */
  async update(id, data) {
    return apiClient.put('/book-characters', {
      id,
      customName: data.customName,
      roleType: data.roleType,
    });
  },

  /**
   * 从书籍移除角色
   * @param {string} id - 记录ID
   * @param {boolean} [force=false] - 是否强制删除
   * @returns {Promise<{message: string}|{needsConfirm: boolean, message: string, isProtagonist: boolean, chapterCount: number}>} 删除结果
   */
  async delete(id, force = false) {
    const url = force 
      ? `/book-characters?id=${id}&force=true`
      : `/book-characters?id=${id}`;
    return apiClient.delete(url);
  },
};

export default booksAPI;
