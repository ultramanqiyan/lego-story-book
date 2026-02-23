import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

function getPuzzle(DB, puzzleId) {
  return DB.prepare(
    `SELECT puzzle_id, chapter_id, question, options, hint, puzzle_type, created_at 
     FROM puzzles WHERE puzzle_id = ?`
  ).bind(puzzleId).first();
}

function getPuzzleByChapter(DB, chapterId) {
  return DB.prepare(
    `SELECT puzzle_id, chapter_id, question, options, hint, puzzle_type, created_at 
     FROM puzzles WHERE chapter_id = ?`
  ).bind(chapterId).first();
}

function getPuzzleWithAnswer(DB, puzzleId) {
  return DB.prepare('SELECT * FROM puzzles WHERE puzzle_id = ?').bind(puzzleId).first();
}

function getRecord(DB, userId, puzzleId) {
  return DB.prepare('SELECT * FROM puzzle_records WHERE user_id = ? AND puzzle_id = ?')
    .bind(userId, puzzleId).first();
}

function createRecord(DB, recordId, userId, puzzleId, userAnswer, isCorrect, now) {
  return DB.prepare(
    `INSERT INTO puzzle_records 
      (record_id, user_id, puzzle_id, user_answer, is_correct, attempts, answered_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(recordId, userId, puzzleId, userAnswer, isCorrect ? 1 : 0, 1, now).run();
}

function updateRecord(DB, userAnswer, isCorrect, attempts, now, recordId) {
  return DB.prepare(
    `UPDATE puzzle_records 
     SET user_answer = ?, is_correct = ?, attempts = ?, answered_at = ? 
     WHERE record_id = ?`
  ).bind(userAnswer, isCorrect ? 1 : 0, attempts, now, recordId).run();
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const puzzleId = url.searchParams.get('id');
    const chapterId = url.searchParams.get('chapterId');
    
    if (puzzleId) {
      const puzzle = await getPuzzle(DB, puzzleId);
      if (!puzzle) return createErrorResponse('谜题不存在', 404);
      return createSuccessResponse({ puzzle });
    }
    
    if (chapterId) {
      const puzzle = await getPuzzleByChapter(DB, chapterId);
      return createSuccessResponse({ puzzle });
    }
    
    return createErrorResponse('请提供谜题ID或章节ID', 400);
  } catch (error) {
    return createErrorResponse('获取谜题失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { puzzleId, userId, userAnswer } = await context.request.json();
    
    if (!puzzleId || !userId || !userAnswer) {
      return createErrorResponse('参数不完整', 400);
    }
    
    const puzzle = await getPuzzleWithAnswer(DB, puzzleId);
    if (!puzzle) return createErrorResponse('谜题不存在', 404);
    
    const isCorrect = puzzle.answer === userAnswer;
    const now = new Date().toISOString();
    
    const existingRecord = await getRecord(DB, userId, puzzleId);
    
    let attempts = 1;
    if (existingRecord) {
      attempts = existingRecord.attempts + 1;
      await updateRecord(DB, userAnswer, isCorrect, attempts, now, existingRecord.record_id);
    } else {
      const recordId = generateId();
      await createRecord(DB, recordId, userId, puzzleId, userAnswer, isCorrect, now);
    }
    
    let hint = null;
    if (!isCorrect && attempts >= 2) {
      hint = puzzle.hint;
    }
    
    return createSuccessResponse({ 
      isCorrect, 
      attempts, 
      attemptsRemaining: Math.max(0, 3 - attempts), 
      hint,
      message: isCorrect ? '答对了！' : '答案错误，请再试一次'
    });
  } catch (error) {
    return createErrorResponse('验证答案失败', 500);
  }
}
