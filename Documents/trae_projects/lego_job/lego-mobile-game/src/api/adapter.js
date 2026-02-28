import { usersAPI } from './users';
import { charactersAPI } from './characters';
import { booksAPI, bookCharactersAPI } from './books';
import { chaptersAPI } from './chapters';
import { storyAPI } from './story';
import { puzzleAPI, plotOptionsAPI } from './puzzle';
import { shareAPI } from './share';

function transformBook(book) {
  if (!book) return null;
  return {
    ...book,
    id: book.book_id,
    chapterCount: book.chapter_count,
    plotSelection: book.plot_selection || book.plotSelection,
  };
}

function transformChapter(chapter) {
  if (!chapter) return null;
  return {
    ...chapter,
    id: chapter.chapter_id,
    chapterNumber: chapter.chapter_number,
    hasPuzzle: chapter.has_puzzle,
    puzzleResult: chapter.puzzle_result,
    bookId: chapter.book_id,
  };
}

function transformCharacter(character) {
  if (!character) return null;
  return {
    ...character,
    id: character.character_id,
    image: character.image || character.image_base64,
    imageBase64: character.image_base64,
    speakingStyle: character.speaking_style,
    creatorId: character.creator_id,
    role: character.role_type || character.role,
    rarity: character.rarity,
  };
}

function transformBookCharacter(bc) {
  if (!bc) return null;
  return {
    ...bc,
    id: bc.id || bc.character_id,
    characterId: bc.character_id,
    bookId: bc.book_id,
    customName: bc.custom_name,
    roleType: bc.role_type,
    roleName: bc.role_type,
    originalName: bc.original_name,
    name: bc.custom_name || bc.original_name || bc.name,
    role: bc.role_type,
    image: bc.image || bc.image_base64,
    imageBase64: bc.image_base64,
  };
}

function transformUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.user_id,
    dailyTimeLimit: user.daily_time_limit,
    timeUsedToday: user.time_used_today,
    parentId: user.parent_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function transformPuzzle(puzzle) {
  if (!puzzle) return null;
  let options = puzzle.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (e) {
      options = options.split(',').map(o => o.trim());
    }
  }
  return {
    ...puzzle,
    id: puzzle.puzzle_id,
    chapterId: puzzle.chapter_id,
    puzzleType: puzzle.puzzle_type,
    correctAnswer: puzzle.answer,
    options: options,
    hint: puzzle.hint,
  };
}

function transformShare(share) {
  if (!share) return null;
  return {
    ...share,
    id: share.share_id,
    shareCode: share.share_code,
    bookId: share.book_id,
    userId: share.user_id,
    isPublic: share.is_public,
    createdAt: share.created_at,
    code: share.share_code,
  };
}

let currentUserId = null;

export const setCurrentUserId = (userId) => {
  currentUserId = userId;
};

export const getCurrentUserId = () => currentUserId;

const api = {
  users: {
    createOrLogin: async (username, email) => {
      const result = await usersAPI.createOrLogin(username, email);
      if (result.userId) {
        setCurrentUserId(result.userId);
      }
      return { data: { id: result.userId, isNewUser: result.isNewUser, ...result } };
    },
    getUser: async (userId) => {
      const result = await usersAPI.getUser(userId || currentUserId);
      return { data: transformUser(result.user) };
    },
    updateUser: async (userId, data) => {
      const result = await usersAPI.updateUser(userId || currentUserId, data);
      return { data: result };
    },
  },

  books: {
    getAll: async () => {
      const userId = currentUserId;
      if (!userId) {
        return { data: [] };
      }
      const result = await booksAPI.getList(userId);
      return { data: (result.books || []).map(transformBook) };
    },
    getById: async (bookId) => {
      const userId = currentUserId;
      if (!userId || !bookId) {
        return { data: null };
      }
      const result = await booksAPI.getDetail(bookId, userId);
      return { 
        data: transformBook(result.book),
        chapters: (result.chapters || []).map(transformChapter),
        characters: (result.characters || []).map(transformBookCharacter),
      };
    },
    create: async (userId, title) => {
      const result = await booksAPI.create(userId || currentUserId, title);
      return { data: { id: result.bookId, ...result } };
    },
    update: async (bookId, data) => {
      const result = await booksAPI.update(bookId, data);
      return { data: result };
    },
    delete: async (bookId) => {
      const result = await booksAPI.delete(bookId);
      return { data: result };
    },
  },

  chapters: {
    getByBookId: async (bookId) => {
      const userId = currentUserId;
      if (!userId || !bookId) {
        return { data: [] };
      }
      const result = await chaptersAPI.getListByBook(bookId, userId);
      return { data: (result.chapters || []).map(transformChapter) };
    },
    getById: async (chapterId) => {
      const userId = currentUserId;
      if (!userId || !chapterId) {
        return { data: null };
      }
      const result = await chaptersAPI.getDetail(chapterId, userId);
      const transformedPuzzle = transformPuzzle(result.puzzle);
      return { 
        data: transformChapter(result.chapter), 
        puzzle: transformedPuzzle, 
        puzzleRecord: result.puzzleRecord 
      };
    },
    create: async (bookId, title, content, puzzle) => {
      const result = await chaptersAPI.create(bookId, title, content, puzzle);
      return { data: { id: result.chapterId, ...result } };
    },
    delete: async (chapterId) => {
      const result = await chaptersAPI.delete(chapterId);
      return { data: result };
    },
    complete: async (bookId, chapterId, userId) => {
      const result = await chaptersAPI.complete(bookId, chapterId, userId || currentUserId);
      return { data: result };
    },
    generate: async (bookId, plotSelection, characterIds) => {
      const userId = currentUserId;
      if (!userId) {
        return { data: null };
      }
      const result = await chaptersAPI.generate(bookId, userId, plotSelection, characterIds);
      return { data: { id: result.chapterId, ...result } };
    },
  },

  characters: {
    getAll: async () => {
      const userId = currentUserId;
      if (!userId) {
        return { data: [] };
      }
      const result = await charactersAPI.getList(userId);
      return { data: (result.characters || []).map(transformCharacter) };
    },
    getByBookId: async (bookId) => {
      const result = await bookCharactersAPI.getList(bookId);
      return { data: (result.characters || []).map(transformBookCharacter) };
    },
    create: async (data) => {
      const result = await charactersAPI.create({ ...data, creatorId: data.creatorId || currentUserId });
      return { data: { id: result.characterId, ...result } };
    },
    update: async (characterId, data) => {
      const result = await charactersAPI.update(characterId, data);
      return { data: result };
    },
    delete: async (characterId, force) => {
      const result = await charactersAPI.delete(characterId, force);
      return { data: result };
    },
  },

  story: {
    getAll: async () => {
      const result = await storyAPI.getAll?.() || { stories: [] };
      return { data: result.stories || [] };
    },
    getById: async (storyId) => {
      const result = await storyAPI.getById?.(storyId) || {};
      return { data: result };
    },
    generate: async (params) => {
      const result = await storyAPI.generate(params);
      return { data: result };
    },
    create: async (params) => {
      const result = await storyAPI.generate({
        characters: params.characters || [],
        plot: params.plotType || '冒险故事',
        plotSelection: params.plotSelection,
        chapterCharacters: params.chapterCharacters,
      });
      return { data: { id: result.chapterId, title: result.title, content: result.content, ...result } };
    },
    getPlots: async (bookId) => {
      const result = await plotOptionsAPI.get();
      const plotOptions = result.plotOptions || result;
      const plots = [];
      if (plotOptions.adventureType) {
        plots.push(...plotOptions.adventureType.map((type, index) => ({
          id: `adventure_${index}`,
          title: type,
          description: `选择${type}类型的冒险`,
        })));
      }
      return { data: plots };
    },
    applyPlot: async (bookId, plotId) => {
      const result = await storyAPI.applyPlot?.(bookId, plotId) || {};
      return { data: result };
    },
  },

  puzzle: {
    getById: async (puzzleId) => {
      const result = await puzzleAPI.getById(puzzleId);
      return { data: transformPuzzle(result.puzzle) };
    },
    getByChapter: async (chapterId) => {
      const result = await puzzleAPI.getByChapter(chapterId);
      return { data: transformPuzzle(result.puzzle) };
    },
    submit: async (puzzleId, userId, userAnswer) => {
      const result = await puzzleAPI.submit(puzzleId, userId || currentUserId, userAnswer);
      return { data: result };
    },
  },

  plotOptions: {
    get: async () => {
      const result = await plotOptionsAPI.get();
      return { data: result.plotOptions || result };
    },
  },

  share: {
    create: async (bookId, userId, options) => {
      const result = await shareAPI.create(bookId, userId || currentUserId, options);
      return { data: { id: result.shareId, code: result.shareCode, shareCode: result.shareCode, ...result } };
    },
    getByBook: async (bookId, userId) => {
      const result = await shareAPI.getByBook(bookId, userId || currentUserId);
      return { data: (result.shares || []).map(transformShare) };
    },
    getByCode: async (code) => {
      const result = await shareAPI.getByCode(code);
      return { data: transformShare(result.share) };
    },
    delete: async (shareId) => {
      const result = await shareAPI.delete(shareId);
      return { data: result };
    },
  },
};

export default api;
