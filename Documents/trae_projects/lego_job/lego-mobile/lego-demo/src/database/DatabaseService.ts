import * as SQLite from 'expo-sqlite';
import bookTypesData from '../data/preset/bookTypes.json';
import charactersData from '../data/preset/characters.json';
import plotElementsData from '../data/preset/plotElements.json';
import booksData from '../data/preset/books.json';

const DATABASE_NAME = 'lego_story.db';

export interface BookType {
  typeId: string;
  typeName: string;
  typeEmoji: string;
  cardStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface Character {
  characterId: string;
  typeId: string;
  name: string;
  customName?: string;
  roleType: string;
  emoji: string;
  description: string;
  health: number;
  intimacy: number;
  personality: string[];
}

export interface PlotElement {
  elementId: string;
  typeId: string;
  category: 'weather' | 'terrain' | 'equipment' | 'adventure';
  name: string;
  emoji: string;
  extraConfig?: Record<string, any>;
}

export interface Chapter {
  chapterId: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount?: number;
  hasPuzzle: boolean;
  puzzleQuestion?: string;
  puzzleOptions?: string[];
  puzzleCorrectIndex?: number;
  characterIds?: string[];
  puzzleResult?: number;
  selectedElements?: {
    characters?: string[];
    weather?: string;
    terrain?: string;
    equipment?: string;
    adventure?: string;
  };
}

export interface UnlockedElement {
  id: number;
  bookId: string;
  elementId: string;
  elementType: 'character' | 'weather' | 'terrain' | 'equipment' | 'adventure';
  unlockedAt: string;
}

export interface Book {
  bookId: string;
  title: string;
  typeId: string;
  coverEmoji: string;
  description: string;
  chapterCount: number;
  progress: number;
  lastReadTime?: string;
  isUserCreated: boolean;
  characterIds: string[];
  protagonistId: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export const DatabaseService = {
  async getBookTypes(): Promise<BookType[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>('SELECT * FROM book_types');
    return results.map(r => ({
      typeId: r.type_id,
      typeName: r.type_name,
      typeEmoji: r.type_emoji,
      cardStyle: r.card_style,
      primaryColor: r.primary_color,
      secondaryColor: r.secondary_color,
      accentColor: r.accent_color,
    }));
  },

  async getAllBooks(): Promise<Book[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>('SELECT * FROM books ORDER BY book_id');
    return results.map(r => ({
      bookId: r.book_id,
      title: r.title,
      typeId: r.type_id,
      coverEmoji: r.cover_emoji,
      description: r.description,
      chapterCount: r.chapter_count,
      progress: r.progress || 0,
      lastReadTime: r.last_read_time,
      isUserCreated: r.is_user_created === 1,
      characterIds: r.character_ids ? JSON.parse(r.character_ids) : [],
      protagonistId: r.protagonist_id,
    }));
  },

  async initDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (db) return db;
    
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await this.createTables(db);
    await this.seedData(db);
    return db;
  },

  async createTables(database: SQLite.SQLiteDatabase): Promise<void> {
    console.log('[DB] Creating tables...');
    
    await database.execAsync('PRAGMA journal_mode = WAL');
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS book_types (
        type_id TEXT PRIMARY KEY,
        type_name TEXT NOT NULL,
        type_emoji TEXT,
        card_style TEXT,
        primary_color TEXT,
        secondary_color TEXT,
        accent_color TEXT
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS characters (
        character_id TEXT PRIMARY KEY,
        type_id TEXT NOT NULL,
        name TEXT NOT NULL,
        custom_name TEXT,
        role_type TEXT NOT NULL,
        emoji TEXT,
        description TEXT,
        health INTEGER DEFAULT 100,
        intimacy INTEGER DEFAULT 100,
        personality TEXT
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS plot_elements (
        element_id TEXT PRIMARY KEY,
        type_id TEXT NOT NULL,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT,
        extra_config TEXT
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        book_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type_id TEXT NOT NULL,
        cover_emoji TEXT,
        description TEXT,
        chapter_count INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0,
        last_read_time TEXT,
        is_user_created INTEGER DEFAULT 0,
        character_ids TEXT,
        protagonist_id TEXT
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS chapters (
        chapter_id TEXT PRIMARY KEY,
        book_id TEXT NOT NULL,
        chapter_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        word_count INTEGER,
        has_puzzle INTEGER DEFAULT 0,
        puzzle_question TEXT,
        puzzle_options TEXT,
        puzzle_correct_index INTEGER,
        puzzle_result INTEGER DEFAULT NULL,
        character_ids TEXT,
        selected_elements TEXT
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS book_characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT NOT NULL,
        character_id TEXT NOT NULL,
        is_protagonist INTEGER DEFAULT 0,
        current_health INTEGER,
        current_intimacy INTEGER,
        UNIQUE(book_id, character_id)
      )
    `);
    
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS book_unlocked_elements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT NOT NULL,
        element_id TEXT NOT NULL,
        element_type TEXT NOT NULL,
        unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, element_id)
      )
    `);
    
    console.log('[DB] Tables created successfully');
    
    // 数据库迁移：检查并添加缺失的列
    try {
      const tableInfo = await database.getAllAsync<any>('PRAGMA table_info(chapters)');
      const columnNames = tableInfo.map((col: any) => col.name);
      
      if (!columnNames.includes('selected_elements')) {
        console.log('[DB] Migrating: Adding selected_elements column to chapters table');
        await database.execAsync('ALTER TABLE chapters ADD COLUMN selected_elements TEXT');
        console.log('[DB] Migration complete: selected_elements column added');
      }
      
      if (!columnNames.includes('puzzle_result')) {
        console.log('[DB] Migrating: Adding puzzle_result column to chapters table');
        await database.execAsync('ALTER TABLE chapters ADD COLUMN puzzle_result INTEGER DEFAULT NULL');
        console.log('[DB] Migration complete: puzzle_result column added');
      }
    } catch (migrationError) {
      console.log('[DB] Migration check error (may be expected):', migrationError);
    }
  },

  async seedData(database: SQLite.SQLiteDatabase): Promise<void> {
    const typeCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM book_types'
    );
    
    if (typeCount && typeCount.count > 0) {
      console.log('[DB] Data already exists, skipping seed');
      return;
    }
    
    console.log('[DB] Seeding data...');

    for (const type of bookTypesData.bookTypes) {
      await database.runAsync(
        `INSERT INTO book_types (type_id, type_name, type_emoji, card_style, primary_color, secondary_color, accent_color)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [type.typeId, type.typeName, type.typeEmoji, type.cardStyle, type.primaryColor, type.secondaryColor, type.accentColor]
      );
    }

    for (const char of charactersData.characters) {
      await database.runAsync(
        `INSERT INTO characters (character_id, type_id, name, role_type, emoji, description, health, intimacy, personality)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [char.characterId, char.typeId, char.name, char.roleType, char.emoji, char.description, char.health, char.intimacy, JSON.stringify(char.personality)]
      );
    }

    for (const element of plotElementsData.plotElements) {
      await database.runAsync(
        `INSERT INTO plot_elements (element_id, type_id, category, name, emoji, extra_config)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [element.elementId, element.typeId, element.category, element.name, element.emoji, element.extraConfig ? JSON.stringify(element.extraConfig) : null]
      );
    }

    for (const book of booksData.books) {
      await database.runAsync(
        `INSERT INTO books (book_id, title, type_id, cover_emoji, description, chapter_count, progress, is_user_created, character_ids, protagonist_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [book.bookId, book.title, book.typeId, book.coverEmoji, book.description, book.chapters.length, 0, 0, JSON.stringify(book.characterIds), book.protagonistId]
      );

      for (const chapter of book.chapters) {
        const chapterId = `${book.bookId}-chapter-${chapter.chapterNumber}`;
        console.log(`[DB] Inserting chapter ${chapter.chapterNumber}: hasPuzzle=${chapter.hasPuzzle}, puzzleQuestion=${chapter.puzzleQuestion}`);
        await database.runAsync(
          `INSERT INTO chapters (chapter_id, book_id, chapter_number, title, content, word_count, has_puzzle, puzzle_question, puzzle_options, puzzle_correct_index, character_ids)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            chapterId,
            book.bookId,
            chapter.chapterNumber,
            chapter.title,
            chapter.content,
            chapter.content.length,
            chapter.hasPuzzle ? 1 : 0,
            chapter.puzzleQuestion || null,
            chapter.puzzleOptions ? JSON.stringify(chapter.puzzleOptions) : null,
            chapter.puzzleCorrectIndex ?? null,
            chapter.characterIds ? JSON.stringify(chapter.characterIds) : null
          ]
        );
      }

      for (const charId of book.characterIds) {
        const isProtagonist = charId === book.protagonistId ? 1 : 0;
        await database.runAsync(
          `INSERT INTO book_characters (book_id, character_id, is_protagonist, current_health, current_intimacy)
           VALUES (?, ?, ?, 100, 100)`,
          [book.bookId, charId, isProtagonist]
        );
      }

      const bookTypeCharacters = charactersData.characters.filter(c => c.typeId === book.typeId);
      for (const char of bookTypeCharacters) {
        await database.runAsync(
          `INSERT OR IGNORE INTO book_unlocked_elements (book_id, element_id, element_type)
           VALUES (?, ?, 'character')`,
          [book.bookId, char.characterId]
        );
      }

      const bookTypeElements = plotElementsData.plotElements.filter(e => e.typeId === book.typeId);
      for (const element of bookTypeElements) {
        await database.runAsync(
          `INSERT OR IGNORE INTO book_unlocked_elements (book_id, element_id, element_type)
           VALUES (?, ?, ?)`,
          [book.bookId, element.elementId, element.category]
        );
      }
    }
  },

  async getBookTypes(): Promise<BookType[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>('SELECT * FROM book_types');
    return results.map(r => ({
      typeId: r.type_id,
      typeName: r.type_name,
      typeEmoji: r.type_emoji,
      cardStyle: r.card_style,
      primaryColor: r.primary_color,
      secondaryColor: r.secondary_color,
      accentColor: r.accent_color,
    }));
  },

  async getBookTypeById(typeId: string): Promise<BookType | null> {
    if (!db) db = await this.initDatabase();
    const result = await db!.getFirstAsync<any>('SELECT * FROM book_types WHERE type_id = ?', [typeId]);
    if (!result) return null;
    return {
      typeId: result.type_id,
      typeName: result.type_name,
      typeEmoji: result.type_emoji,
      cardStyle: result.card_style,
      primaryColor: result.primary_color,
      secondaryColor: result.secondary_color,
      accentColor: result.accent_color,
    };
  },

  async getAllBooks(): Promise<Book[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>('SELECT * FROM books ORDER BY book_id');
    return results.map(r => ({
      bookId: r.book_id,
      title: r.title,
      typeId: r.type_id,
      coverEmoji: r.cover_emoji,
      description: r.description,
      chapterCount: r.chapter_count,
      progress: r.progress || 0,
      lastReadTime: r.last_read_time,
      isUserCreated: r.is_user_created === 1,
      characterIds: r.character_ids ? JSON.parse(r.character_ids) : [],
      protagonistId: r.protagonist_id,
    }));
  },

  async getBookById(bookId: string): Promise<Book | null> {
    if (!db) db = await this.initDatabase();
    const result = await db!.getFirstAsync<any>('SELECT * FROM books WHERE book_id = ?', [bookId]);
    if (!result) return null;
    return {
      bookId: result.book_id,
      title: result.title,
      typeId: result.type_id,
      coverEmoji: result.cover_emoji,
      description: result.description,
      chapterCount: result.chapter_count,
      progress: result.progress || 0,
      lastReadTime: result.last_read_time,
      isUserCreated: result.is_user_created === 1,
      characterIds: result.character_ids ? JSON.parse(result.character_ids) : [],
      protagonistId: result.protagonist_id,
    };
  },

  async getChaptersByBookId(bookId: string): Promise<Chapter[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>(
      'SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number',
      [bookId]
    );
    const chapters = results.map(r => {
      const chapter = {
        chapterId: r.chapter_id,
        bookId: r.book_id,
        chapterNumber: r.chapter_number,
        title: r.title,
        content: r.content,
        wordCount: r.word_count,
        hasPuzzle: r.has_puzzle === 1,
        puzzleQuestion: r.puzzle_question,
        puzzleOptions: r.puzzle_options ? JSON.parse(r.puzzle_options) : undefined,
        puzzleCorrectIndex: r.puzzle_correct_index,
        puzzleResult: r.puzzle_result,
        characterIds: r.character_ids ? JSON.parse(r.character_ids) : undefined,
        selectedElements: r.selected_elements ? JSON.parse(r.selected_elements) : undefined,
      };
      console.log(`[DB] Chapter ${r.chapter_number}: hasPuzzle=${chapter.hasPuzzle}, puzzleResult=${chapter.puzzleResult}`);
      return chapter;
    });
    return chapters;
  },

  async getCharactersByTypeId(typeId: string): Promise<Character[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>(
      'SELECT * FROM characters WHERE type_id = ?',
      [typeId]
    );
    return results.map(r => ({
      characterId: r.character_id,
      typeId: r.type_id,
      name: r.name,
      customName: r.custom_name,
      roleType: r.role_type,
      emoji: r.emoji,
      description: r.description,
      health: r.health,
      intimacy: r.intimacy,
      personality: r.personality ? JSON.parse(r.personality) : [],
    }));
  },

  async getCharactersByBookId(bookId: string): Promise<Character[]> {
    if (!db) db = await this.initDatabase();
    const results = await db!.getAllAsync<any>(
      `SELECT c.*, bc.is_protagonist, bc.current_health, bc.current_intimacy
       FROM characters c
       JOIN book_characters bc ON c.character_id = bc.character_id
       WHERE bc.book_id = ?`,
      [bookId]
    );
    return results.map(r => ({
      characterId: r.character_id,
      typeId: r.type_id,
      name: r.name,
      customName: r.custom_name,
      roleType: r.role_type,
      emoji: r.emoji,
      description: r.description,
      health: r.current_health || r.health,
      intimacy: r.current_intimacy || r.intimacy,
      personality: r.personality ? JSON.parse(r.personality) : [],
      isProtagonist: r.is_protagonist === 1,
    }));
  },

  async getPlotElementsByTypeId(typeId: string, category?: string): Promise<PlotElement[]> {
    if (!db) db = await this.initDatabase();
    let query = 'SELECT * FROM plot_elements WHERE type_id = ?';
    const params: any[] = [typeId];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    const results = await db!.getAllAsync<any>(query, params);
    return results.map(r => ({
      elementId: r.element_id,
      typeId: r.type_id,
      category: r.category,
      name: r.name,
      emoji: r.emoji,
      extraConfig: r.extra_config ? JSON.parse(r.extra_config) : undefined,
    }));
  },

  async updateBookProgress(bookId: string, progress: number): Promise<void> {
    if (!db) db = await this.initDatabase();
    await db!.runAsync(
      'UPDATE books SET progress = ?, last_read_time = ? WHERE book_id = ?',
      [progress, new Date().toISOString(), bookId]
    );
  },

  async createBook(params: { title: string; typeId: string }): Promise<Book> {
    console.log('[DatabaseService] createBook called with params:', params);
    if (!db) db = await this.initDatabase();
    
    if (!params.title || params.title.trim() === '') {
      throw new Error('书籍名称不能为空');
    }
    if (!params.typeId) {
      throw new Error('书籍类型不能为空');
    }

    const bookId = `user-book-${Date.now()}`;
    console.log('[DatabaseService] Generated bookId:', bookId);
    
    const bookType = await this.getBookTypeById(params.typeId);
    console.log('[DatabaseService] bookType:', bookType);
    
    const allCharacters = charactersData.characters.filter(c => c.typeId === params.typeId);
    console.log('[DatabaseService] allCharacters for typeId:', params.typeId, 'count:', allCharacters.length);
    
    const shuffledChars = [...allCharacters].sort(() => Math.random() - 0.5);
    const selectedChars = shuffledChars.slice(0, 2);
    console.log('[DatabaseService] selectedChars:', selectedChars.map(c => c.name));
    const protagonistId = selectedChars[0]?.characterId || '';

    const allWeathers = plotElementsData.plotElements.filter(e => e.typeId === params.typeId && e.category === 'weather');
    const shuffledWeathers = [...allWeathers].sort(() => Math.random() - 0.5);
    const selectedWeathers = shuffledWeathers.slice(0, 2);

    const allAdventures = plotElementsData.plotElements.filter(e => e.typeId === params.typeId && e.category === 'adventure');
    const shuffledAdventures = [...allAdventures].sort(() => Math.random() - 0.5);
    const selectedAdventures = shuffledAdventures.slice(0, 2);

    const allTerrains = plotElementsData.plotElements.filter(e => e.typeId === params.typeId && e.category === 'terrain');
    const shuffledTerrains = [...allTerrains].sort(() => Math.random() - 0.5);
    const selectedTerrains = shuffledTerrains.slice(0, 2);

    const allEquipments = plotElementsData.plotElements.filter(e => e.typeId === params.typeId && e.category === 'equipment');
    const shuffledEquipments = [...allEquipments].sort(() => Math.random() - 0.5);
    const selectedEquipments = shuffledEquipments.slice(0, 2);

    console.log('[DatabaseService] Inserting book into database...');
    await db!.runAsync(
      `INSERT INTO books (book_id, title, type_id, cover_emoji, description, chapter_count, progress, is_user_created, character_ids, protagonist_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bookId, params.title, params.typeId, bookType?.typeEmoji || '📖', `用户创建的${bookType?.typeName || '书籍'}`, 0, 0, 1, JSON.stringify(selectedChars.map(c => c.characterId)), protagonistId]
    );
    console.log('[DatabaseService] Book inserted successfully');

    for (let i = 0; i < selectedChars.length; i++) {
      const char = selectedChars[i];
      await db!.runAsync(
        `INSERT INTO book_characters (book_id, character_id, is_protagonist, current_health, current_intimacy)
         VALUES (?, ?, ?, 100, 100)`,
        [bookId, char.characterId, i === 0 ? 1 : 0]
      );
      
      await db!.runAsync(
        `INSERT OR IGNORE INTO book_unlocked_elements (book_id, element_id, element_type)
         VALUES (?, ?, 'character')`,
        [bookId, char.characterId]
      );
    }
    console.log('[DatabaseService] Characters and unlocked elements inserted');

    for (const element of [...selectedWeathers, ...selectedAdventures, ...selectedTerrains, ...selectedEquipments]) {
      await db!.runAsync(
        `INSERT OR IGNORE INTO book_unlocked_elements (book_id, element_id, element_type)
         VALUES (?, ?, ?)`,
        [bookId, element.elementId, element.category]
      );
    }
    console.log('[DatabaseService] Plot elements inserted');

    const result = {
      bookId,
      title: params.title,
      typeId: params.typeId,
      coverEmoji: bookType?.typeEmoji || '📖',
      description: `用户创建的${bookType?.typeName || '书籍'}`,
      chapterCount: 0,
      progress: 0,
      isUserCreated: true,
      characterIds: selectedChars.map(c => c.characterId),
      protagonistId,
    };
    console.log('[DatabaseService] Returning book:', result);
    return result;
  },

  async getUnlockedElements(bookId: string, elementType?: string): Promise<UnlockedElement[]> {
    console.log('[getUnlockedElements] Called with bookId:', bookId, 'elementType:', elementType);
    
    if (!db) {
      console.log('[getUnlockedElements] Database not initialized, initializing...');
      db = await this.initDatabase();
      console.log('[getUnlockedElements] Database initialized');
    }
    
    let query = 'SELECT * FROM book_unlocked_elements WHERE book_id = ?';
    const params: any[] = [bookId];
    
    if (elementType) {
      query += ' AND element_type = ?';
      params.push(elementType);
    }
    
    console.log('[getUnlockedElements] Executing query:', query, 'params:', params);
    const results = await db!.getAllAsync<any>(query, params);
    console.log('[getUnlockedElements] Query returned', results.length, 'results');
    
    return results.map(r => ({
      id: r.id,
      bookId: r.book_id,
      elementId: r.element_id,
      elementType: r.element_type,
      unlockedAt: r.unlocked_at,
    }));
  },

  async unlockElement(bookId: string, elementId: string, elementType: string): Promise<void> {
    if (!db) db = await this.initDatabase();
    
    await db!.runAsync(
      `INSERT OR IGNORE INTO book_unlocked_elements (book_id, element_id, element_type)
       VALUES (?, ?, ?)`,
      [bookId, elementId, elementType]
    );
  },

  async getLockedElements(bookId: string, typeId: string): Promise<{
    characters: Character[];
    weathers: PlotElement[];
    terrains: PlotElement[];
    equipments: PlotElement[];
    adventures: PlotElement[];
  }> {
    console.log('[getLockedElements] START, bookId:', bookId, 'typeId:', typeId);
    
    if (!db) db = await this.initDatabase();
    
    // 直接执行查询，不调用 getUnlockedElements
    const results = await db!.getAllAsync<any>(
      'SELECT element_id FROM book_unlocked_elements WHERE book_id = ?',
      [bookId]
    );
    const unlockedIds = new Set(results.map(r => r.element_id));
    console.log('[getLockedElements] unlockedIds count:', unlockedIds.size);

    const allCharacters = charactersData.characters.filter(c => c.typeId === typeId);
    const characters = allCharacters.filter(c => !unlockedIds.has(c.characterId)).map(c => ({
      characterId: c.characterId,
      typeId: c.typeId,
      name: c.name,
      customName: c.customName,
      roleType: c.roleType,
      emoji: c.emoji,
      description: c.description,
      health: c.health,
      intimacy: c.intimacy,
      personality: c.personality,
    }));
    console.log('[getLockedElements] locked characters:', characters.length);

    const allElements = plotElementsData.plotElements.filter(e => e.typeId === typeId);
    
    const weathers = allElements
      .filter(e => e.category === 'weather' && !unlockedIds.has(e.elementId))
      .map(e => ({
        elementId: e.elementId,
        typeId: e.typeId,
        category: e.category,
        name: e.name,
        emoji: e.emoji,
        extraConfig: e.extraConfig,
      }));

    const terrains = allElements
      .filter(e => e.category === 'terrain' && !unlockedIds.has(e.elementId))
      .map(e => ({
        elementId: e.elementId,
        typeId: e.typeId,
        category: e.category,
        name: e.name,
        emoji: e.emoji,
        extraConfig: e.extraConfig,
      }));

    const equipments = allElements
      .filter(e => e.category === 'equipment' && !unlockedIds.has(e.elementId))
      .map(e => ({
        elementId: e.elementId,
        typeId: e.typeId,
        category: e.category,
        name: e.name,
        emoji: e.emoji,
        extraConfig: e.extraConfig,
      }));

    const adventures = allElements
      .filter(e => e.category === 'adventure' && !unlockedIds.has(e.elementId))
      .map(e => ({
        elementId: e.elementId,
        typeId: e.typeId,
        category: e.category,
        name: e.name,
        emoji: e.emoji,
        extraConfig: e.extraConfig,
      }));

    console.log('[getLockedElements] locked elements - weather:', weathers.length, 'terrain:', terrains.length, 'equipment:', equipments.length, 'adventure:', adventures.length);

    return { characters, weathers, terrains, equipments, adventures };
  },

  async addChapter(bookId: string, chapterData: Omit<Chapter, 'chapterId' | 'chapterNumber'>): Promise<Chapter> {
    if (!db) db = await DatabaseService.initDatabase();
    
    const existingChapters = await DatabaseService.getChaptersByBookId(bookId);
    const chapterNumber = existingChapters.length + 1;
    const chapterId = `${bookId}-chapter-${Date.now()}`;

    await db!.runAsync(
      `INSERT INTO chapters (chapter_id, book_id, chapter_number, title, content, word_count, has_puzzle, puzzle_question, puzzle_options, puzzle_correct_index, character_ids, selected_elements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chapterId,
        bookId,
        chapterNumber,
        chapterData.title,
        chapterData.content,
        chapterData.content.length,
        chapterData.hasPuzzle ? 1 : 0,
        chapterData.puzzleQuestion || null,
        chapterData.puzzleOptions ? JSON.stringify(chapterData.puzzleOptions) : null,
        chapterData.puzzleCorrectIndex ?? null,
        chapterData.characterIds ? JSON.stringify(chapterData.characterIds) : null,
        chapterData.selectedElements ? JSON.stringify(chapterData.selectedElements) : null
      ]
    );

    await db!.runAsync(
      'UPDATE books SET chapter_count = chapter_count + 1 WHERE book_id = ?',
      [bookId]
    );

    return {
      chapterId,
      bookId,
      chapterNumber,
      title: chapterData.title,
      content: chapterData.content,
      wordCount: chapterData.content.length,
      hasPuzzle: chapterData.hasPuzzle,
      puzzleQuestion: chapterData.puzzleQuestion,
      puzzleOptions: chapterData.puzzleOptions,
      puzzleCorrectIndex: chapterData.puzzleCorrectIndex,
      characterIds: chapterData.characterIds,
      selectedElements: chapterData.selectedElements,
    };
  },

  async updatePuzzleResult(chapterId: string, result: number): Promise<void> {
    if (!db) db = await this.initDatabase();
    
    if (result !== 0 && result !== 1) {
      throw new Error('谜题结果必须是0(答错)或1(答对)');
    }
    
    await db!.runAsync(
      'UPDATE chapters SET puzzle_result = ? WHERE chapter_id = ?',
      [result, chapterId]
    );
  },

  async updateChapterSelection(chapterId: string, selectedElements: Chapter['selectedElements']): Promise<void> {
    if (!db) db = await this.initDatabase();
    
    await db!.runAsync(
      'UPDATE chapters SET selected_elements = ? WHERE chapter_id = ?',
      [selectedElements ? JSON.stringify(selectedElements) : null, chapterId]
    );
  },

  async closeDatabase(): Promise<void> {
    if (db) {
      await db.closeAsync();
      db = null;
    }
  },

  resetForTesting(): void {
    db = null;
  },
};
