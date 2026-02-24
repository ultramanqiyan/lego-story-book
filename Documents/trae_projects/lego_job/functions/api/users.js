import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

// 处理 CORS 预检请求
export async function onRequestOptions(context) {
  return handleCORS();
}

function getUser(DB, userId) {
  return DB.prepare('SELECT * FROM users WHERE user_id = ?').bind(userId).first();
}

export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) return createErrorResponse('用户ID不能为空', 400);
    
    const user = await getUser(DB, userId);
    if (!user) return createErrorResponse('用户不存在', 404);
    
    return createSuccessResponse({ user });
  } catch (error) {
    return createErrorResponse('获取用户失败', 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const body = await context.request.json();
    const { username, email, parentId } = body;

    console.log('Creating user:', { username, email, parentId });

    if (!username || username.trim() === '') {
      return createErrorResponse('用户名不能为空', 400);
    }

    if (username.length > 20) {
      return createErrorResponse('用户名不能超过20个字符', 400);
    }

    const existingUser = await DB.prepare(
      'SELECT user_id FROM users WHERE username = ?'
    ).bind(username.trim()).first();
    
    if (existingUser) {
      console.log('User already exists:', existingUser.user_id);
      return createSuccessResponse({ 
        userId: existingUser.user_id, 
        message: '登录成功',
        isNewUser: false
      });
    }

    const userId = generateId();
    const now = new Date().toISOString();

    console.log('Generated userId:', userId);

    const result = await DB.prepare(
      `INSERT INTO users
        (user_id, username, email, parent_id, daily_time_limit, time_used_today, created_at, updated_at)
       VALUES (?, ?, ?, ?, 120, 0, ?, ?)`
    ).bind(userId, username.trim(), email || null, parentId || null, now, now).run();

    console.log('Insert result:', result);

    return createSuccessResponse({ 
      userId, 
      message: '用户创建成功',
      isNewUser: true
    });
  } catch (error) {
    console.error('Create user error:', error);
    return createErrorResponse('创建用户失败: ' + error.message, 500);
  }
}

function buildUpdateQuery(data) {
  const updates = [];
  const values = [];
  const { username, email, avatar, dailyTimeLimit } = data;
  
  if (username !== undefined) {
    updates.push('username = ?');
    values.push(username.trim());
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (avatar !== undefined) {
    updates.push('avatar = ?');
    values.push(avatar);
  }
  if (dailyTimeLimit !== undefined) {
    updates.push('daily_time_limit = ?');
    values.push(dailyTimeLimit);
  }
  
  return { updates, values };
}

export async function onRequestPut(context) {
  try {
    const { DB } = context.env;
    const data = await context.request.json();
    const { userId, username } = data;
    
    if (!userId) return createErrorResponse('用户ID不能为空', 400);
    
    const existing = await getUser(DB, userId);
    if (!existing) return createErrorResponse('用户不存在', 404);
    
    if (username !== undefined && username.length > 20) {
      return createErrorResponse('用户名不能超过20个字符', 400);
    }
    
    const { updates, values } = buildUpdateQuery(data);
    
    if (updates.length === 0) {
      return createSuccessResponse({ message: '没有需要更新的字段' });
    }
    
    const now = new Date().toISOString();
    updates.push('updated_at = ?');
    values.push(now);
    values.push(userId);
    
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
    await DB.prepare(sql).bind(...values).run();
    
    return createSuccessResponse({ message: '用户更新成功' });
  } catch (error) {
    return createErrorResponse('更新用户失败', 500);
  }
}
