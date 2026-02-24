import { createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

export async function onRequestPost(context) {
  try {
    var DB = context.env.DB;
    var url = new URL(context.request.url);
    var pathParts = url.pathname.split('/');
    var bookId = pathParts[3];
    var chapterId = pathParts[5];
    var data = await context.request.json();
    var userId = data.userId;
    
    if (!bookId || !chapterId) {
      return createErrorResponse('书籍ID和章节ID不能为空', 400);
    }
    
    if (!userId) {
      return createErrorResponse('用户ID不能为空', 400);
    }
    
    var chapter = await DB.prepare(
      'SELECT * FROM chapters WHERE chapter_id = ? AND book_id = ?'
    ).bind(chapterId, bookId).first();
    
    if (!chapter) {
      return createErrorResponse('章节不存在', 404);
    }
    
    if (chapter.has_puzzle) {
      var puzzle = await DB.prepare(
        'SELECT * FROM puzzles WHERE chapter_id = ?'
      ).bind(chapterId).first();
      
      if (puzzle) {
        var now = new Date().toISOString();
        await DB.prepare(
          'INSERT OR REPLACE INTO puzzle_records (user_id, puzzle_id, is_correct, attempts, completed_at) ' +
          'VALUES (?, ?, 1, 1, ?)'
        ).bind(userId, puzzle.puzzle_id, now).run();
      }
    }
    
    return createSuccessResponse({ message: '章节已标记完成' });
  } catch (error) {
    return createErrorResponse('标记完成失败: ' + error.message, 500);
  }
}
