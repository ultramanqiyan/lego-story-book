/**
 * Books API 单元测试
 */

import { booksAPI, bookCharactersAPI } from '../books';
import apiClient from '../client';

// Mock apiClient
jest.mock('../client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('booksAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('应该获取书籍列表', async () => {
      const mockResponse = { books: [{ book_id: '1', title: '测试书籍' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await booksAPI.getList('user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/books?userId=user-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDetail', () => {
    it('应该获取书籍详情（不带userId）', async () => {
      const mockResponse = { book: { book_id: '1', title: '测试书籍' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await booksAPI.getDetail('book-123');

      expect(apiClient.get).toHaveBeenCalledWith('/books?bookId=book-123');
      expect(result).toEqual(mockResponse);
    });

    it('应该获取书籍详情（带userId）', async () => {
      const mockResponse = { book: { book_id: '1', title: '测试书籍' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await booksAPI.getDetail('book-123', 'user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/books?bookId=book-123&userId=user-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create', () => {
    it('应该创建书籍', async () => {
      const mockResponse = { bookId: 'new-book-id', message: '创建成功' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await booksAPI.create('user-123', '新书籍');

      expect(apiClient.post).toHaveBeenCalledWith('/books', { userId: 'user-123', title: '新书籍' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('应该更新书籍', async () => {
      const mockResponse = { message: '更新成功' };
      apiClient.put.mockResolvedValue(mockResponse);

      const result = await booksAPI.update('book-123', { title: '更新后的标题' });

      expect(apiClient.put).toHaveBeenCalledWith('/books', { bookId: 'book-123', title: '更新后的标题' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('应该删除书籍', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await booksAPI.delete('book-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/books?id=book-123');
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('bookCharactersAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getList', () => {
    it('应该获取书籍角色列表', async () => {
      const mockResponse = { characters: [{ character_id: '1', name: '角色1' }] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await bookCharactersAPI.getList('book-123');

      expect(apiClient.get).toHaveBeenCalledWith('/book-characters?bookId=book-123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('add', () => {
    it('应该添加角色到书籍', async () => {
      const mockResponse = { message: '添加成功', id: 'new-id' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await bookCharactersAPI.add('book-123', 'char-123', '自定义名称', 'protagonist');

      expect(apiClient.post).toHaveBeenCalledWith('/book-characters', {
        bookId: 'book-123',
        characterId: 'char-123',
        customName: '自定义名称',
        roleType: 'protagonist',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('应该更新书籍角色', async () => {
      const mockResponse = { message: '更新成功' };
      apiClient.put.mockResolvedValue(mockResponse);

      const result = await bookCharactersAPI.update('id-123', { customName: '新名称', roleType: 'supporting' });

      expect(apiClient.put).toHaveBeenCalledWith('/book-characters', {
        id: 'id-123',
        customName: '新名称',
        roleType: 'supporting',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('应该删除书籍角色（不带force）', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await bookCharactersAPI.delete('id-123');

      expect(apiClient.delete).toHaveBeenCalledWith('/book-characters?id=id-123');
      expect(result).toEqual(mockResponse);
    });

    it('应该强制删除书籍角色（带force）', async () => {
      const mockResponse = { message: '删除成功' };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await bookCharactersAPI.delete('id-123', true);

      expect(apiClient.delete).toHaveBeenCalledWith('/book-characters?id=id-123&force=true');
      expect(result).toEqual(mockResponse);
    });
  });
});
