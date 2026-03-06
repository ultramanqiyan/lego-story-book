import { DatabaseService, UnlockedElement, Chapter, Book, Character, PlotElement } from '../DatabaseService';

const mockData: {
  bookTypes: any[];
  characters: any[];
  plotElements: any[];
  books: any[];
  chapters: any[];
  bookCharacters: any[];
  unlockedElements: any[];
} = {
  bookTypes: [
    { type_id: 'children', type_name: '儿童探险', type_emoji: '🧒', card_style: 'cartoon', primary_color: '#FF6B6B', secondary_color: '#4ECDC4', accent_color: '#FFE66D' },
    { type_id: 'magic', type_name: '魔法世界', type_emoji: '🔮', card_style: 'fantasy', primary_color: '#9B59B6', secondary_color: '#3498DB', accent_color: '#E74C3C' },
  ],
  characters: [
    { character_id: 'char-1', type_id: 'children', name: '小勇者', role_type: 'protagonist', emoji: '🦸', description: '勇敢的小英雄', health: 100, intimacy: 100, personality: '["勇敢","善良"]' },
    { character_id: 'char-2', type_id: 'children', name: '魔法兔子', role_type: 'companion', emoji: '🐰', description: '神奇的魔法兔子', health: 80, intimacy: 90, personality: '["聪明","可爱"]' },
    { character_id: 'char-3', type_id: 'children', name: '智慧猫头鹰', role_type: 'mentor', emoji: '🦉', description: '智慧的导师', health: 70, intimacy: 85, personality: '["智慧","耐心"]' },
    { character_id: 'char-4', type_id: 'magic', name: '魔法师', role_type: 'protagonist', emoji: '🧙', description: '强大的魔法师', health: 90, intimacy: 80, personality: '["神秘","强大"]' },
  ],
  plotElements: [
    { element_id: 'weather-1', type_id: 'children', category: 'weather', name: '晴天', emoji: '☀️', extra_config: null },
    { element_id: 'weather-2', type_id: 'children', category: 'weather', name: '雨天', emoji: '🌧️', extra_config: null },
    { element_id: 'terrain-1', type_id: 'children', category: 'terrain', name: '森林', emoji: '🌲', extra_config: null },
    { element_id: 'terrain-2', type_id: 'children', category: 'terrain', name: '山脉', emoji: '⛰️', extra_config: null },
    { element_id: 'equipment-1', type_id: 'children', category: 'equipment', name: '魔法剑', emoji: '⚔️', extra_config: null },
    { element_id: 'equipment-2', type_id: 'children', category: 'equipment', name: '护盾', emoji: '🛡️', extra_config: null },
    { element_id: 'adventure-1', type_id: 'children', category: 'adventure', name: '探索', emoji: '🗺️', extra_config: null },
    { element_id: 'adventure-2', type_id: 'children', category: 'adventure', name: '战斗', emoji: '⚔️', extra_config: null },
  ],
  books: [],
  chapters: [],
  bookCharacters: [],
  unlockedElements: [],
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn().mockImplementation(async () => ({
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockImplementation(async (sql: string, params: any[]) => {
      if (sql.includes('INSERT INTO books')) {
        mockData.books.push({
          book_id: params[0],
          title: params[1],
          type_id: params[2],
          cover_emoji: params[3],
          description: params[4],
          chapter_count: params[5],
          progress: params[6],
          is_user_created: params[7],
          character_ids: params[8],
          protagonist_id: params[9],
        });
      } else if (sql.includes('INSERT INTO chapters')) {
        mockData.chapters.push({
          chapter_id: params[0],
          book_id: params[1],
          chapter_number: params[2],
          title: params[3],
          content: params[4],
          word_count: params[5],
          has_puzzle: params[6],
          puzzle_question: params[7],
          puzzle_options: params[8],
          puzzle_correct_index: params[9],
          character_ids: params[10],
          puzzle_result: null,
        });
      } else if (sql.includes('INSERT INTO book_characters')) {
        mockData.bookCharacters.push({
          book_id: params[0],
          character_id: params[1],
          is_protagonist: params[2],
          current_health: params[3],
          current_intimacy: params[4],
        });
      } else if (sql.includes('book_unlocked_elements')) {
        const existing = mockData.unlockedElements.find(
          e => e.book_id === params[0] && e.element_id === params[1]
        );
        if (!existing) {
          mockData.unlockedElements.push({
            id: mockData.unlockedElements.length + 1,
            book_id: params[0],
            element_id: params[1],
            element_type: params[2],
            unlocked_at: new Date().toISOString(),
          });
        }
      } else if (sql.includes('UPDATE chapters SET puzzle_result')) {
        const chapter = mockData.chapters.find(c => c.chapter_id === params[1]);
        if (chapter) {
          chapter.puzzle_result = params[0];
        }
      } else if (sql.includes('UPDATE books SET chapter_count')) {
        const book = mockData.books.find(b => b.book_id === params[0]);
        if (book) {
          book.chapter_count += 1;
        }
      }
      return { changes: 1 };
    }),
    getFirstAsync: jest.fn().mockImplementation(async (sql: string, params: any[]) => {
      if (sql.includes('SELECT COUNT')) {
        return { count: 1 };
      }
      if (sql.includes('book_types')) {
        return mockData.bookTypes.find(t => t.type_id === params[0]);
      }
      if (sql.includes('books WHERE book_id')) {
        return mockData.books.find(b => b.book_id === params[0]);
      }
      return null;
    }),
    getAllAsync: jest.fn().mockImplementation(async (sql: string, params: any[]) => {
      if (sql.includes('book_types')) {
        return mockData.bookTypes;
      }
      if (sql.includes('books ORDER BY')) {
        return mockData.books;
      }
      if (sql.includes('chapters WHERE book_id')) {
        return mockData.chapters.filter(c => c.book_id === params[0]);
      }
      if (sql.includes('book_unlocked_elements WHERE book_id')) {
        let results = mockData.unlockedElements.filter(e => e.book_id === params[0]);
        if (sql.includes('element_type') && params.length > 1) {
          results = results.filter(e => e.element_type === params[1]);
        }
        return results;
      }
      return [];
    }),
    closeAsync: jest.fn().mockResolvedValue(undefined),
  })),
}));

function resetMockData() {
  mockData.books = [];
  mockData.chapters = [];
  mockData.bookCharacters = [];
  mockData.unlockedElements = [];
  (DatabaseService as any).resetForTesting();
}

describe('DatabaseService - createBook', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('should create a book with random initialized cards', async () => {
    const result = await DatabaseService.createBook({
      title: '测试书籍',
      typeId: 'children',
    });

    expect(result).toBeDefined();
    expect(result.title).toBe('测试书籍');
    expect(result.typeId).toBe('children');
    expect(result.isUserCreated).toBe(true);
    expect(result.bookId).toMatch(/^user-book-/);
  });

  it('should throw error if title is empty', async () => {
    await expect(DatabaseService.createBook({
      title: '',
      typeId: 'children',
    })).rejects.toThrow('书籍名称不能为空');
  });

  it('should throw error if typeId is empty', async () => {
    await expect(DatabaseService.createBook({
      title: '测试书籍',
      typeId: '',
    })).rejects.toThrow('书籍类型不能为空');
  });
});

describe('DatabaseService - getUnlockedElements', () => {
  beforeEach(() => {
    resetMockData();
    mockData.unlockedElements = [
      { id: 1, book_id: 'test-book-1', element_id: 'char-1', element_type: 'character', unlocked_at: '2024-01-01' },
      { id: 2, book_id: 'test-book-1', element_id: 'weather-1', element_type: 'weather', unlocked_at: '2024-01-01' },
    ];
  });

  it('should return unlocked elements for a book', async () => {
    const result = await DatabaseService.getUnlockedElements('test-book-1');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it('should filter by element type when provided', async () => {
    const result = await DatabaseService.getUnlockedElements('test-book-1', 'character');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].elementType).toBe('character');
  });
});

describe('DatabaseService - unlockElement', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('should unlock a new element for a book', async () => {
    await DatabaseService.unlockElement('test-book-1', 'char-1', 'character');
    
    expect(mockData.unlockedElements.length).toBe(1);
    expect(mockData.unlockedElements[0].element_id).toBe('char-1');
    expect(mockData.unlockedElements[0].element_type).toBe('character');
  });
});

describe('DatabaseService - getLockedElements', () => {
  beforeEach(() => {
    resetMockData();
    mockData.unlockedElements = [
      { id: 1, book_id: 'test-book-1', element_id: 'char-1', element_type: 'character', unlocked_at: '2024-01-01' },
    ];
  });

  it('should return locked elements for a book', async () => {
    const result = await DatabaseService.getLockedElements('test-book-1', 'children');
    
    expect(result).toHaveProperty('characters');
    expect(result).toHaveProperty('weathers');
    expect(result).toHaveProperty('terrains');
    expect(result).toHaveProperty('equipments');
    expect(result).toHaveProperty('adventures');
    
    expect(result.characters.length).toBeGreaterThan(0);
    expect(result.characters.find(c => c.characterId === 'char-1')).toBeUndefined();
  });
});

describe('DatabaseService - addChapter', () => {
  beforeEach(() => {
    resetMockData();
    mockData.books = [
      { book_id: 'test-book-1', title: '测试书籍', type_id: 'children', chapter_count: 0 },
    ];
  });

  it('should add a chapter to a book', async () => {
    const chapterData = {
      title: '新的冒险',
      content: '测试内容',
      hasPuzzle: true,
      puzzleQuestion: '问题？',
      puzzleOptions: ['A', 'B', 'C', 'D'],
      puzzleCorrectIndex: 0,
      characterIds: ['char-1', 'char-2'],
    };
    
    const result = await DatabaseService.addChapter('test-book-1', chapterData);
    
    expect(result).toBeDefined();
    expect(result.bookId).toBe('test-book-1');
    expect(result.title).toBe('新的冒险');
    expect(result.chapterNumber).toBe(1);
    expect(result.hasPuzzle).toBe(true);
  });

  it('should increment chapter number correctly', async () => {
    mockData.chapters = [
      { chapter_id: 'ch1', book_id: 'test-book-1', chapter_number: 1, title: '第一章', content: '内容' },
    ];
    
    const chapterData = {
      title: '第二章',
      content: '新内容',
      hasPuzzle: false,
    };
    
    const result = await DatabaseService.addChapter('test-book-1', chapterData);
    expect(result.chapterNumber).toBe(2);
  });
});

describe('DatabaseService - updatePuzzleResult', () => {
  beforeEach(() => {
    resetMockData();
    mockData.chapters = [
      { chapter_id: 'chapter-1', book_id: 'test-book-1', chapter_number: 1, title: '测试章节', content: '内容', puzzle_result: null },
    ];
  });

  it('should update puzzle result for a chapter', async () => {
    await DatabaseService.updatePuzzleResult('chapter-1', 1);
    
    const chapter = mockData.chapters.find(c => c.chapter_id === 'chapter-1');
    expect(chapter?.puzzle_result).toBe(1);
  });

  it('should throw error if result is invalid', async () => {
    await expect(DatabaseService.updatePuzzleResult('chapter-1', 2)).rejects.toThrow('谜题结果必须是0(答错)或1(答对)');
  });

  it('should accept result 0 for wrong answer', async () => {
    await DatabaseService.updatePuzzleResult('chapter-1', 0);
    
    const chapter = mockData.chapters.find(c => c.chapter_id === 'chapter-1');
    expect(chapter?.puzzle_result).toBe(0);
  });
});
