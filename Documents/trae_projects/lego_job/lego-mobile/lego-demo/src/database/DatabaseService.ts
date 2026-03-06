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
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS book_types (
        type_id TEXT PRIMARY KEY,
        type_name TEXT NOT NULL,
        type_emoji TEXT,
        card_style TEXT,
        primary_color TEXT,
        secondary_color TEXT,
        accent_color TEXT
      );
      
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
      );
      
      CREATE TABLE IF NOT EXISTS plot_elements (
        element_id TEXT PRIMARY KEY,
        type_id TEXT NOT NULL,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        emoji TEXT,
        extra_config TEXT
      );
      
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
      );
      
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
        character_ids TEXT
      );
      
      CREATE TABLE IF NOT EXISTS book_characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT NOT NULL,
        character_id TEXT NOT NULL,
        is_protagonist INTEGER DEFAULT 0,
        current_health INTEGER,
        current_intimacy INTEGER,
        UNIQUE(book_id, character_id)
      );
    `);
  },

  async seedData(database: SQLite.SQLiteDatabase): Promise<void> {
    const typeCount = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM book_types'
    );
    
    if (typeCount && typeCount.count > 0) return;

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
    return results.map(r => ({
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
      characterIds: r.character_ids ? JSON.parse(r.character_ids) : undefined,
    }));
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

  async closeDatabase(): Promise<void> {
    if (db) {
      await db.closeAsync();
      db = null;
    }
  },
};
