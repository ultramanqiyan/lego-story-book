import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

function getChapter(DB, chapterId) {
  return DB.prepare('SELECT * FROM chapters WHERE chapter_id = ?')
    .bind(chapterId).first();
}

function getBook(DB, bookId) {
  return DB.prepare('SELECT * FROM books WHERE book_id = ?').bind(bookId).first();
}

function getChapterCount(DB, bookId) {
  return DB.prepare('SELECT COUNT(*) as count FROM chapters WHERE book_id = ?')
    .bind(bookId).first();
}

function createPuzzle(DB, chapterId, puzzle, now) {
  const puzzleId = generateId();
  return DB.prepare(
    `INSERT INTO puzzles 
      (puzzle_id, chapter_id, question, options, answer, hint, puzzle_type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    puzzleId, chapterId, puzzle.question, JSON.stringify(puzzle.options), 
    puzzle.answer, puzzle.hint || null, puzzle.type || 'pattern', now
  ).run();
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const chapterId = url.searchParams.get('id');
    const bookId = url.searchParams.get('bookId');
    const userId = url.searchParams.get('userId');
    
    if (chapterId) {
      const chapter = await getChapter(DB, chapterId);
      if (!chapter) return createErrorResponse('章节不存在', 404);
      
      let puzzle = null;
      let puzzleRecord = null;
      if (chapter.has_puzzle) {
        puzzle = await DB.prepare('SELECT * FROM puzzles WHERE chapter_id = ?')
          .bind(chapterId).first();
        
        if (puzzle && userId) {
          puzzleRecord = await DB.prepare(
            'SELECT * FROM puzzle_records WHERE user_id = ? AND puzzle_id = ?'
          ).bind(userId, puzzle.puzzle_id).first();
        }
      }
      return createSuccessResponse({ chapter, puzzle, puzzleRecord });
    }
    
    if (bookId) {
      const userId = url.searchParams.get('userId');
      const { results } = await DB.prepare(
        `SELECT chapter_id, chapter_number, title, has_puzzle, created_at 
         FROM chapters WHERE book_id = ? ORDER BY chapter_number ASC`
      ).bind(bookId).all();
      
      if (userId) {
        for (const chapter of results) {
          if (chapter.has_puzzle) {
            const puzzle = await DB.prepare(
              'SELECT puzzle_id FROM puzzles WHERE chapter_id = ?'
            ).bind(chapter.chapter_id).first();
            
            if (puzzle) {
              const record = await DB.prepare(
                'SELECT is_correct FROM puzzle_records WHERE user_id = ? AND puzzle_id = ?'
              ).bind(userId, puzzle.puzzle_id).first();
              chapter.puzzle_result = record ? record.is_correct : null;
            }
          }
        }
      }
      
      return createSuccessResponse({ chapters: results });
    }
    
    return createErrorResponse('请提供章节ID或书籍ID', 400);
  } catch (error) {
    return createErrorResponse('获取章节失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { bookId, title, content, puzzle } = await context.request.json();
    
    if (!bookId) return createErrorResponse('书籍ID不能为空', 400);
    if (!content || content.trim() === '') return createErrorResponse('章节内容不能为空', 400);
    
    const book = await getBook(DB, bookId);
    if (!book) return createErrorResponse('书籍不存在', 404);
    
    const chapterCount = await getChapterCount(DB, bookId);
    if (chapterCount.count >= 100) return createErrorResponse('单本书籍最多100章', 400);
    
    const chapterId = generateId();
    const chapterNumber = chapterCount.count + 1;
    const now = new Date().toISOString();
    const hasPuzzle = puzzle ? 1 : 0;
    
    await DB.prepare(
      `INSERT INTO chapters 
        (chapter_id, book_id, chapter_number, title, content, has_puzzle, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(chapterId, bookId, chapterNumber, title || `第${chapterNumber}章`, content, hasPuzzle, now).run();
    
    await DB.prepare(
      'UPDATE books SET chapter_count = chapter_count + 1, updated_at = ? WHERE book_id = ?'
    ).bind(now, bookId).run();
    
    if (puzzle) {
      await createPuzzle(DB, chapterId, puzzle, now);
    }
    
    return createSuccessResponse({ chapterId, chapterNumber, message: '章节创建成功' });
  } catch (error) {
    return createErrorResponse('创建章节失败', 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const chapterId = url.searchParams.get('id');
    
    if (!chapterId) return createErrorResponse('章节ID不能为空', 400);
    
    const chapter = await getChapter(DB, chapterId);
    if (!chapter) return createErrorResponse('章节不存在', 404);
    
    await DB.prepare('DELETE FROM puzzles WHERE chapter_id = ?').bind(chapterId).run();
    await DB.prepare('DELETE FROM chapters WHERE chapter_id = ?').bind(chapterId).run();
    
    const now = new Date().toISOString();
    await DB.prepare(
      'UPDATE books SET chapter_count = chapter_count - 1, updated_at = ? WHERE book_id = ?'
    ).bind(now, chapter.book_id).run();
    
    return createSuccessResponse({ message: '章节删除成功' });
  } catch (error) {
    return createErrorResponse('删除章节失败', 500);
  }
}
