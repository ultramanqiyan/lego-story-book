/**
 * fieldCompatibility.js 单元测试
 */

import {
  getFieldWithFallback,
  getCharacterId,
  getBookId,
  getChapterId,
  getPuzzleId,
  getCustomName,
  getRoleType,
  getChapterNumber,
  getHasPuzzle,
  getChapterCount,
  getWordCount,
  getTimeUsedToday,
  getDailyTimeLimit,
  getCreatorId,
  getSpeakingStyle,
  getPuzzleResult,
  getWeeklyData,
  getStats,
} from '../fieldCompatibility';

describe('fieldCompatibility', () => {
  describe('getFieldWithFallback', () => {
    it('应该返回snake_case字段值', () => {
      const obj = { character_id: '123', characterId: '456' };
      expect(getFieldWithFallback(obj, 'character_id', 'characterId')).toBe('123');
    });

    it('应该返回camelCase字段值当snake_case不存在时', () => {
      const obj = { characterId: '456' };
      expect(getFieldWithFallback(obj, 'character_id', 'characterId')).toBe('456');
    });

    it('应该返回fallback当两个字段都不存在时', () => {
      const obj = {};
      expect(getFieldWithFallback(obj, 'character_id', 'characterId', 'default')).toBe('default');
    });

    it('应该返回null当字段值为null时', () => {
      const obj = { character_id: null, characterId: '456' };
      expect(getFieldWithFallback(obj, 'character_id', 'characterId')).toBe('456');
    });
  });

  describe('getCharacterId', () => {
    it('应该返回character_id', () => {
      expect(getCharacterId({ character_id: '123' })).toBe('123');
    });

    it('应该返回characterId', () => {
      expect(getCharacterId({ characterId: '456' })).toBe('456');
    });

    it('应该返回id', () => {
      expect(getCharacterId({ id: '789' })).toBe('789');
    });

    it('应该返回null当item为null', () => {
      expect(getCharacterId(null)).toBeNull();
    });

    it('应该返回null当item为undefined', () => {
      expect(getCharacterId(undefined)).toBeNull();
    });
  });

  describe('getBookId', () => {
    it('应该返回book_id', () => {
      expect(getBookId({ book_id: 'book-123' })).toBe('book-123');
    });

    it('应该返回bookId', () => {
      expect(getBookId({ bookId: 'book-456' })).toBe('book-456');
    });

    it('应该返回null当item为null', () => {
      expect(getBookId(null)).toBeNull();
    });
  });

  describe('getChapterId', () => {
    it('应该返回chapter_id', () => {
      expect(getChapterId({ chapter_id: 'chapter-123' })).toBe('chapter-123');
    });

    it('应该返回chapterId', () => {
      expect(getChapterId({ chapterId: 'chapter-456' })).toBe('chapter-456');
    });

    it('应该返回null当item为null', () => {
      expect(getChapterId(null)).toBeNull();
    });
  });

  describe('getPuzzleId', () => {
    it('应该返回puzzle_id', () => {
      expect(getPuzzleId({ puzzle_id: 'puzzle-123' })).toBe('puzzle-123');
    });

    it('应该返回puzzleId', () => {
      expect(getPuzzleId({ puzzleId: 'puzzle-456' })).toBe('puzzle-456');
    });

    it('应该返回null当item为null', () => {
      expect(getPuzzleId(null)).toBeNull();
    });
  });

  describe('getCustomName', () => {
    it('应该返回custom_name', () => {
      expect(getCustomName({ custom_name: '自定义名' })).toBe('自定义名');
    });

    it('应该返回customName', () => {
      expect(getCustomName({ customName: '自定义名2' })).toBe('自定义名2');
    });

    it('应该返回name', () => {
      expect(getCustomName({ name: '名称' })).toBe('名称');
    });

    it('应该返回null当item为null', () => {
      expect(getCustomName(null)).toBeNull();
    });
  });

  describe('getRoleType', () => {
    it('应该返回role_type', () => {
      expect(getRoleType({ role_type: 'protagonist' })).toBe('protagonist');
    });

    it('应该返回roleType', () => {
      expect(getRoleType({ roleType: 'supporting' })).toBe('supporting');
    });

    it('应该返回null当item为null', () => {
      expect(getRoleType(null)).toBeNull();
    });
  });

  describe('getChapterNumber', () => {
    it('应该返回chapter_number', () => {
      expect(getChapterNumber({ chapter_number: 1 })).toBe(1);
    });

    it('应该返回chapterNumber', () => {
      expect(getChapterNumber({ chapterNumber: 2 })).toBe(2);
    });

    it('应该返回null当item为null', () => {
      expect(getChapterNumber(null)).toBeNull();
    });
  });

  describe('getHasPuzzle', () => {
    it('应该返回has_puzzle', () => {
      expect(getHasPuzzle({ has_puzzle: true })).toBe(true);
    });

    it('应该返回hasPuzzle', () => {
      expect(getHasPuzzle({ hasPuzzle: true })).toBe(true);
    });

    it('应该返回false当item为null', () => {
      expect(getHasPuzzle(null)).toBe(false);
    });

    it('应该返回false当字段不存在', () => {
      expect(getHasPuzzle({})).toBe(false);
    });
  });

  describe('getChapterCount', () => {
    it('应该返回chapter_count', () => {
      expect(getChapterCount({ chapter_count: 10 })).toBe(10);
    });

    it('应该返回chapterCount', () => {
      expect(getChapterCount({ chapterCount: 5 })).toBe(5);
    });

    it('应该返回0当item为null', () => {
      expect(getChapterCount(null)).toBe(0);
    });
  });

  describe('getWordCount', () => {
    it('应该返回word_count', () => {
      expect(getWordCount({ word_count: 1000 })).toBe(1000);
    });

    it('应该返回wordCount', () => {
      expect(getWordCount({ wordCount: 500 })).toBe(500);
    });

    it('应该返回0当item为null', () => {
      expect(getWordCount(null)).toBe(0);
    });
  });

  describe('getTimeUsedToday', () => {
    it('应该返回time_used_today', () => {
      expect(getTimeUsedToday({ time_used_today: 60 })).toBe(60);
    });

    it('应该返回timeUsedToday', () => {
      expect(getTimeUsedToday({ timeUsedToday: 30 })).toBe(30);
    });

    it('应该返回0当item为null', () => {
      expect(getTimeUsedToday(null)).toBe(0);
    });
  });

  describe('getDailyTimeLimit', () => {
    it('应该返回daily_time_limit', () => {
      expect(getDailyTimeLimit({ daily_time_limit: 120 })).toBe(120);
    });

    it('应该返回dailyTimeLimit', () => {
      expect(getDailyTimeLimit({ dailyTimeLimit: 60 })).toBe(60);
    });

    it('应该返回120当item为null', () => {
      expect(getDailyTimeLimit(null)).toBe(120);
    });
  });

  describe('getCreatorId', () => {
    it('应该返回creator_id', () => {
      expect(getCreatorId({ creator_id: 'creator-123' })).toBe('creator-123');
    });

    it('应该返回creatorId', () => {
      expect(getCreatorId({ creatorId: 'creator-456' })).toBe('creator-456');
    });

    it('应该返回null当item为null', () => {
      expect(getCreatorId(null)).toBeNull();
    });
  });

  describe('getSpeakingStyle', () => {
    it('应该返回speaking_style', () => {
      expect(getSpeakingStyle({ speaking_style: '幽默' })).toBe('幽默');
    });

    it('应该返回speakingStyle', () => {
      expect(getSpeakingStyle({ speakingStyle: '严肃' })).toBe('严肃');
    });

    it('应该返回正常当item为null', () => {
      expect(getSpeakingStyle(null)).toBe('正常');
    });
  });

  describe('getPuzzleResult', () => {
    it('应该返回puzzle_result', () => {
      expect(getPuzzleResult({ puzzle_result: true })).toBe(true);
    });

    it('应该返回puzzleResult', () => {
      expect(getPuzzleResult({ puzzleResult: false })).toBe(false);
    });

    it('应该返回null当item为null', () => {
      expect(getPuzzleResult(null)).toBeNull();
    });
  });

  describe('getWeeklyData', () => {
    it('应该返回weekly_data', () => {
      expect(getWeeklyData({ weekly_data: [1, 2, 3] })).toEqual([1, 2, 3]);
    });

    it('应该返回weeklyData', () => {
      expect(getWeeklyData({ weeklyData: [4, 5, 6] })).toEqual([4, 5, 6]);
    });

    it('应该返回空数组当item为null', () => {
      expect(getWeeklyData(null)).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('应该返回完整统计对象', () => {
      const result = getStats({
        stories_completed: 5,
        chapters_completed: 10,
        puzzles_solved: 3,
      });
      expect(result).toEqual({
        storiesCompleted: 5,
        chaptersCompleted: 10,
        puzzlesSolved: 3,
      });
    });

    it('应该支持camelCase字段', () => {
      const result = getStats({
        storiesCompleted: 2,
        chaptersCompleted: 4,
        puzzlesSolved: 1,
      });
      expect(result).toEqual({
        storiesCompleted: 2,
        chaptersCompleted: 4,
        puzzlesSolved: 1,
      });
    });

    it('应该返回默认值当item为null', () => {
      const result = getStats(null);
      expect(result).toEqual({
        storiesCompleted: 0,
        chaptersCompleted: 0,
        puzzlesSolved: 0,
      });
    });
  });
});
