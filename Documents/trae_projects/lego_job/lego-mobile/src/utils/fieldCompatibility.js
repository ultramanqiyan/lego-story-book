export const getFieldWithFallback = (obj, snakeCase, camelCase, fallback = null) => {
  if (obj[snakeCase] !== undefined && obj[snakeCase] !== null) {
    return obj[snakeCase];
  }
  if (obj[camelCase] !== undefined && obj[camelCase] !== null) {
    return obj[camelCase];
  }
  return fallback;
};

export const getCharacterId = (item) => {
  if (!item) return null;
  return item.character_id || item.characterId || item.id || null;
};

export const getBookId = (item) => {
  if (!item) return null;
  return item.book_id || item.bookId || item.id || null;
};

export const getChapterId = (item) => {
  if (!item) return null;
  return item.chapter_id || item.chapterId || item.id || null;
};

export const getPuzzleId = (item) => {
  if (!item) return null;
  return item.puzzle_id || item.puzzleId || item.id || null;
};

export const getCustomName = (item) => {
  if (!item) return null;
  return item.custom_name || item.customName || item.name || null;
};

export const getRoleType = (item) => {
  if (!item) return null;
  return item.role_type || item.roleType || null;
};

export const getChapterNumber = (item) => {
  if (!item) return null;
  return item.chapter_number || item.chapterNumber || null;
};

export const getHasPuzzle = (item) => {
  if (!item) return false;
  return item.has_puzzle || item.hasPuzzle || false;
};

export const getChapterCount = (item) => {
  if (!item) return 0;
  return item.chapter_count || item.chapterCount || 0;
};

export const getWordCount = (item) => {
  if (!item) return 0;
  return item.word_count || item.wordCount || 0;
};

export const getTimeUsedToday = (item) => {
  if (!item) return 0;
  return item.time_used_today || item.timeUsedToday || 0;
};

export const getDailyTimeLimit = (item) => {
  if (!item) return 120;
  return item.daily_time_limit || item.dailyTimeLimit || 120;
};

export const getCreatorId = (item) => {
  if (!item) return null;
  return item.creator_id || item.creatorId || null;
};

export const getSpeakingStyle = (item) => {
  if (!item) return '正常';
  return item.speaking_style || item.speakingStyle || '正常';
};

export const getPuzzleResult = (item) => {
  if (!item) return null;
  return item.puzzle_result ?? item.puzzleResult ?? null;
};

export const getWeeklyData = (item) => {
  if (!item) return [];
  return item.weekly_data || item.weeklyData || [];
};

export const getStats = (item) => {
  if (!item) {
    return {
      storiesCompleted: 0,
      chaptersCompleted: 0,
      puzzlesSolved: 0,
    };
  }
  return {
    storiesCompleted: item.stories_completed || item.storiesCompleted || 0,
    chaptersCompleted: item.chapters_completed || item.chaptersCompleted || 0,
    puzzlesSolved: item.puzzles_solved || item.puzzlesSolved || 0,
  };
};
