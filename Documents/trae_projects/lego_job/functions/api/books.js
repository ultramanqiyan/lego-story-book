import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';
import { getPlotOption } from './plot-options.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

function getBook(DB, bookId) {
  return DB.prepare('SELECT * FROM books WHERE book_id = ?').bind(bookId).first();
}

function getBookCount(DB, userId) {
  return DB.prepare(
    'SELECT COUNT(*) as count FROM books WHERE user_id = ? AND status != ?'
  ).bind(userId, 'archived').first();
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    const bookId = url.searchParams.get('bookId');
    
    if (bookId) {
      const book = await getBook(DB, bookId);
      if (!book) return createErrorResponse('书籍不存在', 404);
      
      const chapters = await DB.prepare(
        'SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number ASC'
      ).bind(bookId).all();
      
      const characters = await DB.prepare(
        `SELECT bc.*, c.name as original_name, c.image_base64, 
                c.personality, c.speaking_style 
         FROM book_characters bc 
         LEFT JOIN characters c ON bc.character_id = c.character_id 
         WHERE bc.book_id = ?`
      ).bind(bookId).all();
      
      const userIdParam = url.searchParams.get('userId');
      
      for (const chapter of chapters.results) {
        if (chapter.has_puzzle) {
          const puzzle = await DB.prepare(
            'SELECT puzzle_id, question, options, hint, puzzle_type FROM puzzles WHERE chapter_id = ?'
          ).bind(chapter.chapter_id).first();
          
          if (puzzle) {
            chapter.puzzle = {
              id: puzzle.puzzle_id,
              question: puzzle.question,
              options: JSON.parse(puzzle.options),
              hint: puzzle.hint,
              type: puzzle.puzzle_type
            };
            
            if (userIdParam) {
              const record = await DB.prepare(
                'SELECT is_correct FROM puzzle_records WHERE user_id = ? AND puzzle_id = ?'
              ).bind(userIdParam, puzzle.puzzle_id).first();
              if (record) {
                chapter.puzzle_result = record.is_correct;
                chapter.isCompleted = record.is_correct === 1;
              }
            }
          }
        }
      }
      
      return createSuccessResponse({ 
        book: {
          ...book,
          plotSelection: book.plot_selection ? JSON.parse(book.plot_selection) : null
        }, 
        chapters: chapters.results, 
        characters: characters.results 
      });
    }
    
    if (!userId) return createErrorResponse('用户ID不能为空', 400);
    
    const { results } = await DB.prepare(
      'SELECT * FROM books WHERE user_id = ? AND status != ? ORDER BY created_at DESC'
    ).bind(userId, 'archived').all();
    
    return createSuccessResponse({ books: results });
  } catch (error) {
    return createErrorResponse('获取书籍失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { userId, title } = await context.request.json();
    
    if (!userId) return createErrorResponse('用户ID不能为空', 400);
    if (!title || title.trim() === '') return createErrorResponse('书籍名称不能为空', 400);
    if (title.length > 50) return createErrorResponse('书籍名称不能超过50个字符', 400);
    
    const existingUser = await DB.prepare('SELECT user_id FROM users WHERE user_id = ?')
      .bind(userId).first();
    
    if (!existingUser) {
      const now = new Date().toISOString();
      await DB.prepare(
        `INSERT INTO users (user_id, username, created_at, updated_at)
         VALUES (?, ?, ?, ?)`
      ).bind(userId, 'User_' + userId.substring(0, 8), now, now).run();
    }
    
    const bookCount = await getBookCount(DB, userId);
    if (bookCount.count >= 20) return createErrorResponse('每用户最多创建20本书籍', 400);
    
    const bookId = generateId();
    const now = new Date().toISOString();
    
    await DB.prepare(
      `INSERT INTO books (book_id, user_id, title, chapter_count, status, created_at, updated_at)
       VALUES (?, ?, ?, 0, 'active', ?, ?)`
    ).bind(bookId, userId, title.trim(), now, now).run();
    
    return createSuccessResponse({ bookId, message: '书籍创建成功' });
  } catch (error) {
    return createErrorResponse('创建书籍失败', 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { DB } = context.env;
    const { bookId, title, status } = await context.request.json();
    
    if (!bookId) return createErrorResponse('书籍ID不能为空', 400);
    
    const existing = await getBook(DB, bookId);
    if (!existing) return createErrorResponse('书籍不存在', 404);
    
    const now = new Date().toISOString();
    
    if (title) {
      if (title.length > 50) return createErrorResponse('书籍名称不能超过50个字符', 400);
      await DB.prepare('UPDATE books SET title = ?, updated_at = ? WHERE book_id = ?')
        .bind(title.trim(), now, bookId).run();
    }
    
    if (status) {
      await DB.prepare('UPDATE books SET status = ?, updated_at = ? WHERE book_id = ?')
        .bind(status, now, bookId).run();
    }
    
    return createSuccessResponse({ message: '书籍更新成功' });
  } catch (error) {
    return createErrorResponse('更新书籍失败', 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const bookId = url.searchParams.get('id');
    
    if (!bookId) return createErrorResponse('书籍ID不能为空', 400);
    
    const existing = await getBook(DB, bookId);
    if (!existing) return createErrorResponse('书籍不存在', 404);
    
    const now = new Date().toISOString();
    await DB.prepare('UPDATE books SET status = ?, updated_at = ? WHERE book_id = ?')
      .bind('archived', now, bookId).run();
    
    return createSuccessResponse({ message: '书籍已归档' });
  } catch (error) {
    return createErrorResponse('删除书籍失败', 500);
  }
}
