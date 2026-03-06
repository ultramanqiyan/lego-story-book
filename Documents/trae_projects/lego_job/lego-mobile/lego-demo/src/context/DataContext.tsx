import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DatabaseService, BookType, Book, Chapter, Character, PlotElement, UnlockedElement } from '../database/DatabaseService';

interface DataContextType {
  isLoading: boolean;
  bookTypes: BookType[];
  books: Book[];
  refreshBooks: () => Promise<void>;
  getBookTypeById: (typeId: string) => Promise<BookType | null>;
  getBookById: (bookId: string) => Promise<Book | null>;
  getChaptersByBookId: (bookId: string) => Promise<Chapter[]>;
  getCharactersByTypeId: (typeId: string) => Promise<Character[]>;
  getCharactersByBookId: (bookId: string) => Promise<Character[]>;
  getPlotElementsByTypeId: (typeId: string, category?: string) => Promise<PlotElement[]>;
  updateBookProgress: (bookId: string, progress: number) => Promise<void>;
  createBook: (params: { title: string; typeId: string }) => Promise<Book>;
  getUnlockedElements: (bookId: string, elementType?: string) => Promise<UnlockedElement[]>;
  unlockElement: (bookId: string, elementId: string, elementType: string) => Promise<void>;
  getLockedElements: (bookId: string, typeId: string) => Promise<{
    characters: Character[];
    weathers: PlotElement[];
    terrains: PlotElement[];
    equipments: PlotElement[];
    adventures: PlotElement[];
  }>;
  addChapter: (bookId: string, chapterData: Omit<Chapter, 'chapterId' | 'chapterNumber'>) => Promise<Chapter>;
  updatePuzzleResult: (chapterId: string, result: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      console.log('[DataContext] Starting initialization...');
      await DatabaseService.initDatabase();
      console.log('[DataContext] Database initialized');
      const types = await DatabaseService.getBookTypes();
      console.log('[DataContext] Book types loaded:', types.length);
      const allBooks = await DatabaseService.getAllBooks();
      console.log('[DataContext] Books loaded:', allBooks.length);
      setBookTypes(types);
      setBooks(allBooks);
      console.log('[DataContext] Initialization complete');
    } catch (error) {
      console.error('[DataContext] Failed to initialize database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = async () => {
    const allBooks = await DatabaseService.getAllBooks();
    setBooks(allBooks);
  };

  const createBook = async (params: { title: string; typeId: string }) => {
    const book = await DatabaseService.createBook(params);
    await refreshBooks();
    return book;
  };

  const value: DataContextType = {
    isLoading,
    bookTypes,
    books,
    refreshBooks,
    getBookTypeById: DatabaseService.getBookTypeById,
    getBookById: DatabaseService.getBookById,
    getChaptersByBookId: DatabaseService.getChaptersByBookId,
    getCharactersByTypeId: DatabaseService.getCharactersByTypeId,
    getCharactersByBookId: DatabaseService.getCharactersByBookId,
    getPlotElementsByTypeId: DatabaseService.getPlotElementsByTypeId,
    updateBookProgress: DatabaseService.updateBookProgress,
    createBook,
    getUnlockedElements: DatabaseService.getUnlockedElements,
    unlockElement: DatabaseService.unlockElement,
    getLockedElements: DatabaseService.getLockedElements,
    addChapter: DatabaseService.addChapter,
    updatePuzzleResult: DatabaseService.updatePuzzleResult,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
