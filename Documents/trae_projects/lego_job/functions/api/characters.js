import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    
    let query = 'SELECT * FROM characters WHERE creator_id = ? OR creator_id = ? ORDER BY created_at ASC';
    let params = ['system', userId || ''];
    
    const { results } = await DB.prepare(query).bind(...params).all();
    
    return createSuccessResponse({ characters: results });
  } catch (error) {
    return createErrorResponse('获取人仔列表失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const data = await context.request.json();
    const { name, imageBase64, description, personality, speakingStyle, creatorId } = data;
    
    if (!name || name.trim() === '') {
      return createErrorResponse('人仔名称不能为空', 400);
    }
    
    if (name.length > 20) {
      return createErrorResponse('人仔名称不能超过20个字符', 400);
    }
    
    const characterId = generateId();
    const now = new Date().toISOString();
    
    await DB.prepare(
      `INSERT INTO characters 
        (character_id, name, image_base64, description, personality, 
         speaking_style, creator_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      characterId, name.trim(), imageBase64 || null, description || null, 
      personality || null, speakingStyle || null, creatorId || 'user', now, now
    ).run();
    
    return createSuccessResponse({ characterId, message: '人仔创建成功' });
  } catch (error) {
    return createErrorResponse('创建人仔失败', 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { DB } = context.env;
    const data = await context.request.json();
    const { characterId, name, imageBase64, description, personality, speakingStyle } = data;
    
    if (!characterId) {
      return createErrorResponse('人仔ID不能为空', 400);
    }
    
    const existing = await DB.prepare(
      'SELECT * FROM characters WHERE character_id = ?'
    ).bind(characterId).first();
    
    if (!existing) {
      return createErrorResponse('人仔不存在', 404);
    }
    
    if (existing.creator_id === 'system') {
      return createErrorResponse('预设人仔不能修改', 403);
    }
    
    const now = new Date().toISOString();
    
    await DB.prepare(
      `UPDATE characters 
       SET name = ?, image_base64 = ?, description = ?, 
           personality = ?, speaking_style = ?, updated_at = ?
       WHERE character_id = ?`
    ).bind(
      name?.trim() || existing.name,
      imageBase64 !== undefined ? imageBase64 : existing.image_base64,
      description !== undefined ? description : existing.description,
      personality !== undefined ? personality : existing.personality,
      speakingStyle !== undefined ? speakingStyle : existing.speaking_style,
      now, characterId
    ).run();
    
    return createSuccessResponse({ message: '人仔更新成功' });
  } catch (error) {
    return createErrorResponse('更新人仔失败', 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const characterId = url.searchParams.get('id');
    const force = url.searchParams.get('force') === 'true';
    
    if (!characterId) {
      return createErrorResponse('人仔ID不能为空', 400);
    }
    
    const existing = await DB.prepare(
      'SELECT * FROM characters WHERE character_id = ?'
    ).bind(characterId).first();
    
    if (!existing) {
      return createErrorResponse('人仔不存在', 404);
    }
    
    if (existing.creator_id === 'system') {
      return createErrorResponse('预设人仔不能删除', 403);
    }
    
    const bookCharacters = await DB.prepare(
      'SELECT COUNT(*) as count FROM book_characters WHERE character_id = ?'
    ).bind(characterId).first();
    
    if (bookCharacters.count > 0 && !force) {
      return createSuccessResponse({ 
        needsConfirm: true,
        message: '该人仔已在故事中使用，删除后角色将显示为默认形象',
        usageCount: bookCharacters.count
      });
    }
    
    if (bookCharacters.count > 0 && force) {
      const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RqDwvdGV4dD48L3N2Zz4=';
      await DB.prepare(
        'UPDATE book_characters SET image_base64 = ? WHERE character_id = ?'
      ).bind(defaultImage, characterId).run();
    }
    
    await DB.prepare(
      'DELETE FROM characters WHERE character_id = ?'
    ).bind(characterId).run();
    
    return createSuccessResponse({ message: '人仔删除成功' });
  } catch (error) {
    return createErrorResponse('删除人仔失败', 500);
  }
}
