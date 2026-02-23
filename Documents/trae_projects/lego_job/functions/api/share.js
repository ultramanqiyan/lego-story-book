import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

function getShare(DB, shareId) {
  return DB.prepare('SELECT * FROM shares WHERE share_id = ?').bind(shareId).first();
}

function getShareByCode(DB, shareCode) {
  return DB.prepare('SELECT * FROM shares WHERE share_code = ?').bind(shareCode).first();
}

function generateShareCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const shareCode = url.searchParams.get('code');
    const bookId = url.searchParams.get('bookId');
    const userId = url.searchParams.get('userId');
    
    if (shareCode) {
      const share = await getShareByCode(DB, shareCode);
      if (!share) {
        return createErrorResponse('分享链接不存在或已过期', 404);
      }
      return createSuccessResponse({ share });
    }
    
    if (bookId && userId) {
      const shares = await DB.prepare(
        'SELECT * FROM shares WHERE book_id = ? AND user_id = ? ORDER BY created_at DESC'
      ).bind(bookId, userId).all();
      return createSuccessResponse({ shares: shares.results });
    }
    
    return createErrorResponse('请提供分享码或书籍ID', 400);
  } catch (error) {
    return createErrorResponse('获取分享失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { bookId, userId, password, isPublic } = await context.request.json();
    
    if (!bookId || !userId) {
      return createErrorResponse('书籍ID和用户ID不能为空', 400);
    }
    
    const book = await DB.prepare('SELECT * FROM books WHERE book_id = ?').bind(bookId).first();
    if (!book) {
      return createErrorResponse('书籍不存在', 404);
    }
    
    const shareId = generateId();
    const shareCode = generateShareCode();
    const now = new Date().toISOString();
    
    await DB.prepare(
      `INSERT INTO shares (share_id, book_id, user_id, share_code, password, is_public, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(shareId, bookId, userId, shareCode, password || null, isPublic !== false ? 1 : 0, now).run();
    
    return createSuccessResponse({ 
      shareId, 
      shareCode, 
      message: '分享链接创建成功' 
    });
  } catch (error) {
    return createErrorResponse('创建分享失败', 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const shareId = url.searchParams.get('id');
    
    if (!shareId) {
      return createErrorResponse('分享ID不能为空', 400);
    }
    
    const existing = await getShare(DB, shareId);
    if (!existing) {
      return createErrorResponse('分享链接不存在', 404);
    }
    
    await DB.prepare('DELETE FROM shares WHERE share_id = ?').bind(shareId).run();
    
    return createSuccessResponse({ message: '分享链接已删除' });
  } catch (error) {
    return createErrorResponse('删除分享失败', 500);
  }
}
