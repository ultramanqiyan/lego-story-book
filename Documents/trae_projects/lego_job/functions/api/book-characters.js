import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

function getBook(DB, bookId) {
  return DB.prepare('SELECT * FROM books WHERE book_id = ?').bind(bookId).first();
}

function getCharacter(DB, characterId) {
  return DB.prepare('SELECT * FROM characters WHERE character_id = ?')
    .bind(characterId).first();
}

function getExistingName(DB, bookId, customName, excludeId) {
  let query = 'SELECT * FROM book_characters WHERE book_id = ? AND custom_name = ?';
  const params = [bookId, customName];
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  return DB.prepare(query).bind(...params).first();
}

function getExistingProtagonist(DB, bookId, excludeId) {
  let query = 'SELECT * FROM book_characters WHERE book_id = ? AND role_type = ?';
  const params = [bookId, 'protagonist'];
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }
  return DB.prepare(query).bind(...params).first();
}

async function demoteProtagonist(DB, id) {
  return DB.prepare('UPDATE book_characters SET role_type = ? WHERE id = ?')
    .bind('supporting', id).run();
}

async function handleProtagonistChange(DB, bookId, excludeId) {
  const existingProtagonist = await getExistingProtagonist(DB, bookId, excludeId);
  if (existingProtagonist) {
    await demoteProtagonist(DB, existingProtagonist.id);
  }
}

async function validateBookCharacter(DB, bookId, characterId, customName, excludeId) {
  const book = await getBook(DB, bookId);
  if (!book) return { valid: false, error: createErrorResponse('书籍不存在', 404) };
  
  const character = await getCharacter(DB, characterId);
  if (!character) return { valid: false, error: createErrorResponse('人仔不存在', 404) };
  
  if (customName) {
    const existingName = await getExistingName(DB, bookId, customName, excludeId);
    if (existingName) {
      return { valid: false, error: createErrorResponse('自定义名称已存在', 400) };
    }
  }
  
  return { valid: true };
}

export async function onRequestGet(context) {
  try {
    const DB = context.env.DB;
    const url = new URL(context.request.url);
    const bookId = url.searchParams.get('bookId');
    
    if (!bookId) return createErrorResponse('书籍ID不能为空', 400);
    
    const results = await DB.prepare(
      'SELECT bc.*, c.name as original_name, c.description, c.personality, c.speaking_style ' +
      'FROM book_characters bc ' +
      'LEFT JOIN characters c ON bc.character_id = c.character_id ' +
      'WHERE bc.book_id = ?'
    ).bind(bookId).all();
    
    return createSuccessResponse({ characters: results.results });
  } catch (error) {
    return createErrorResponse('获取角色列表失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const body = await context.request.json();
    const bookId = body.bookId;
    const characterId = body.characterId;
    const customName = body.customName;
    const roleType = body.roleType || 'supporting';
    
    if (!bookId || !characterId || !customName) {
      return createErrorResponse('书籍ID、人仔ID和自定义名称不能为空', 400);
    }
    
    if (customName.length > 20) {
      return createErrorResponse('自定义名称不能超过20个字符', 400);
    }
    
    const validation = await validateBookCharacter(DB, bookId, characterId, customName, null);
    if (!validation.valid) return validation.error;
    
    if (roleType === 'protagonist') {
      await handleProtagonistChange(DB, bookId, null);
    }
    
    const id = generateId();
    const now = new Date().toISOString();
    
    await DB.prepare(
      'INSERT INTO book_characters (id, book_id, character_id, custom_name, role_type, created_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, bookId, characterId, customName, roleType, now).run();
    
    return createSuccessResponse({ message: '角色添加成功', id: id });
  } catch (error) {
    return createErrorResponse('添加角色失败', 500);
  }
}

function validateUpdateParams(id, bookId, characterId) {
  if (!id && !(bookId && characterId)) {
    return createErrorResponse('角色ID或书籍ID+人仔ID不能为空', 400);
  }
  return null;
}

async function findExistingCharacter(DB, id, bookId, characterId) {
  if (id) {
    return DB.prepare('SELECT * FROM book_characters WHERE id = ?').bind(id).first();
  }
  if (bookId && characterId) {
    return DB.prepare('SELECT * FROM book_characters WHERE book_id = ? AND character_id = ?')
      .bind(bookId, characterId).first();
  }
  return null;
}

async function validateCustomName(DB, bookId, customName, excludeId) {
  if (!customName) return null;
  const existingName = await getExistingName(DB, bookId, customName, excludeId);
  if (existingName) {
    return createErrorResponse('自定义名称已存在', 400);
  }
  return null;
}

async function updateCharacter(DB, existing, customName, roleType) {
  const nameError = await validateCustomName(DB, existing.book_id, customName, existing.id);
  if (nameError) return nameError;
  
  if (roleType === 'protagonist') {
    await handleProtagonistChange(DB, existing.book_id, existing.id);
  }
  
  await DB.prepare('UPDATE book_characters SET custom_name = ?, role_type = ? WHERE id = ?')
    .bind(customName || existing.custom_name, roleType || existing.role_type, existing.id).run();
  
  return createSuccessResponse({ message: '角色更新成功' });
}

export async function onRequestPut(context) {
  try {
    const DB = context.env.DB;
    const body = await context.request.json();
    const { id, bookId, characterId, customName, roleType } = body;
    
    const paramError = validateUpdateParams(id, bookId, characterId);
    if (paramError) return paramError;
    
    const existing = await findExistingCharacter(DB, id, bookId, characterId);
    if (!existing) return createErrorResponse('角色不存在', 404);
    
    return updateCharacter(DB, existing, customName, roleType);
  } catch (error) {
    return createErrorResponse('更新角色失败', 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const DB = context.env.DB;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const force = url.searchParams.get('force') === 'true';
    
    if (!id) return createErrorResponse('角色ID不能为空', 400);
    
    const existing = await DB.prepare('SELECT * FROM book_characters WHERE id = ?').bind(id).first();
    if (!existing) return createErrorResponse('角色不存在', 404);
    
    if (existing.role_type === 'protagonist' && !force) {
      const chapterCount = await DB.prepare(
        'SELECT COUNT(*) as count FROM chapters WHERE book_id = ?'
      ).bind(existing.book_id).first();
      
      if (chapterCount.count > 0) {
        return createSuccessResponse({
          needsConfirm: true,
          message: '该角色已在故事中使用，删除后可能影响阅读体验',
          isProtagonist: true,
          chapterCount: chapterCount.count
        });
      }
    }
    
    await DB.prepare('DELETE FROM book_characters WHERE id = ?').bind(id).run();
    
    return createSuccessResponse({ message: '角色删除成功' });
  } catch (error) {
    return createErrorResponse('删除角色失败', 500);
  }
}
