const API_BASE = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
}

describe('E2E API Tests', () => {
  const testUserId = 'test-user-e2e';
  let createdCharacterId = null;
  let createdBookId = null;

  beforeAll(async () => {
    console.log('Starting E2E tests...');
  });

  afterAll(async () => {
    console.log('E2E tests completed.');
  });

  describe('1. Health Check', () => {
    test('API server should be running', async () => {
      const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
      expect(response.status).toBe(200);
    });
  });

  describe('2. Characters API', () => {
    test('GET /characters - should return character list', async () => {
      const data = await fetchAPI(`/characters?userId=${testUserId}`);
      expect(data).toHaveProperty('characters');
      expect(Array.isArray(data.characters)).toBe(true);
    });

    test('GET /characters - should have preset characters (creator_id = system)', async () => {
      const data = await fetchAPI(`/characters?userId=${testUserId}`);
      const presetCharacters = data.characters.filter(c => c.creator_id === 'system');
      expect(presetCharacters.length).toBeGreaterThan(0);
    });

    test('POST /characters - should create a new character', async () => {
      const data = await fetchAPI('/characters', {
        method: 'POST',
        body: {
          name: 'E2E Test Character',
          personality: 'Brave and kind',
          speakingStyle: 'Friendly',
          creatorId: testUserId,
        },
      });
      
      expect(data).toHaveProperty('characterId');
      createdCharacterId = data.characterId;
    });

    test('GET /characters - should include newly created character', async () => {
      const data = await fetchAPI(`/characters?userId=${testUserId}`);
      const found = data.characters.find(c => c.character_id === createdCharacterId);
      expect(found).toBeDefined();
      expect(found.creator_id).toBe(testUserId);
    });

    test('PUT /characters - should update character', async () => {
      const data = await fetchAPI('/characters', {
        method: 'PUT',
        body: {
          characterId: createdCharacterId,
          name: 'E2E Test Character Updated',
          personality: 'Very brave',
        },
      });
      
      expect(data).toHaveProperty('message');
    });

    test('PUT /characters - should not allow updating preset characters', async () => {
      const data = await fetchAPI(`/characters?userId=${testUserId}`);
      const presetChar = data.characters.find(c => c.creator_id === 'system');
      
      if (presetChar) {
        await expect(
          fetchAPI('/characters', {
            method: 'PUT',
            body: {
              characterId: presetChar.character_id,
              name: 'Should Fail',
            },
          })
        ).rejects.toThrow('预设人仔不能修改');
      }
    });

    test('DELETE /characters - should delete character', async () => {
      const data = await fetchAPI(`/characters?id=${createdCharacterId}`, {
        method: 'DELETE',
      });
      
      expect(data).toHaveProperty('message');
    });

    test('GET /characters - should not include deleted character', async () => {
      const data = await fetchAPI(`/characters?userId=${testUserId}`);
      const found = data.characters.find(c => c.character_id === createdCharacterId);
      expect(found).toBeUndefined();
    });
  });

  describe('3. Books API', () => {
    test('GET /books - should return book list', async () => {
      const data = await fetchAPI(`/books?userId=${testUserId}`);
      expect(data).toHaveProperty('books');
      expect(Array.isArray(data.books)).toBe(true);
    });

    test('POST /books - should create a new book', async () => {
      const data = await fetchAPI('/books', {
        method: 'POST',
        body: {
          title: 'E2E Test Book',
          description: 'A test book for E2E testing',
          userId: testUserId,
        },
      });
      
      expect(data).toHaveProperty('bookId');
      createdBookId = data.bookId;
    });

    test('GET /books/:id - should return book details', async () => {
      const data = await fetchAPI(`/books/${createdBookId}`);
      expect(data).toHaveProperty('book');
      expect(data.book.title).toBe('E2E Test Book');
    });

    test('PUT /books/:id - should update book', async () => {
      const data = await fetchAPI(`/books/${createdBookId}`, {
        method: 'PUT',
        body: {
          title: 'E2E Test Book Updated',
        },
      });
      
      expect(data).toHaveProperty('message');
    });
  });

  describe('4. Plot Options API', () => {
    test('GET /plot-options - should return plot options', async () => {
      const data = await fetchAPI('/plot-options');
      expect(data).toHaveProperty('options');
      
      const { options } = data;
      expect(options).toHaveProperty('adventures');
      expect(options).toHaveProperty('terrains');
      expect(options).toHaveProperty('weathers');
      expect(options).toHaveProperty('items');
      
      expect(Array.isArray(options.adventures)).toBe(true);
      expect(Array.isArray(options.terrains)).toBe(true);
      expect(Array.isArray(options.weathers)).toBe(true);
      expect(Array.isArray(options.items)).toBe(true);
    });
  });

  describe('5. Book Characters API', () => {
    test('GET /book-characters - should return book characters', async () => {
      const data = await fetchAPI(`/book-characters?bookId=${createdBookId}`);
      expect(data).toHaveProperty('characters');
      expect(Array.isArray(data.characters)).toBe(true);
    });

    test('POST /book-characters - should add character to book', async () => {
      const charsData = await fetchAPI(`/characters?userId=${testUserId}`);
      const presetChar = charsData.characters.find(c => c.creator_id === 'system');
      
      if (presetChar && createdBookId) {
        const data = await fetchAPI('/book-characters', {
          method: 'POST',
          body: {
            bookId: createdBookId,
            characterId: presetChar.character_id,
            role: 'protagonist',
            customName: 'Hero',
          },
        });
        
        expect(data).toHaveProperty('message');
      }
    });
  });

  describe('6. Chapters API', () => {
    test('GET /chapters - should return chapters for book', async () => {
      const data = await fetchAPI(`/chapters?bookId=${createdBookId}`);
      expect(data).toHaveProperty('chapters');
      expect(Array.isArray(data.chapters)).toBe(true);
    });
  });

  describe('7. Cleanup', () => {
    test('DELETE /books/:id - should delete test book', async () => {
      if (createdBookId) {
        const data = await fetchAPI(`/books/${createdBookId}`, {
          method: 'DELETE',
          body: { userId: testUserId },
        });
        expect(data).toHaveProperty('message');
      }
    });
  });
});
