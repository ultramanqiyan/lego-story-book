import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DatabaseService, BookType, Book, Chapter, Character, PlotElement } from '../database/DatabaseService';

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
      await DatabaseService.initDatabase();
      const types = await DatabaseService.getBookTypes();
      const allBooks = await DatabaseService.getAllBooks();
      setBookTypes(types);
      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to initialize database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = async () => {
    const allBooks = await DatabaseService.getAllBooks();
    setBooks(allBooks);
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
