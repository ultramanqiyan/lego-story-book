export async function createUser(db, userData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO users (id, username, email, password_hash, role, parent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        userData.username,
        userData.email || null,
        userData.password_hash,
        userData.role || 'child',
        userData.parent_id || null,
        now,
        now
    ).run()
    
    return {
        id,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'child',
        parent_id: userData.parent_id || null,
        created_at: now,
        updated_at: now
    }
}

export async function getUserById(db, id) {
    const result = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
    return result || null
}

export async function getUserByUsername(db, username) {
    const result = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first()
    return result || null
}

export async function getUserByEmail(db, email) {
    const result = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    return result || null
}

export async function updateUser(db, id, updates) {
    const now = new Date().toISOString()
    const fields = []
    const values = []
    
    if (updates.email !== undefined) {
        fields.push('email = ?')
        values.push(updates.email)
    }
    if (updates.password_hash !== undefined) {
        fields.push('password_hash = ?')
        values.push(updates.password_hash)
    }
    if (updates.parent_id !== undefined) {
        fields.push('parent_id = ?')
        values.push(updates.parent_id)
    }
    
    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)
    
    await db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run()
    
    return getUserById(db, id)
}

export async function deleteUser(db, id) {
    await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
}

export async function getChildUsers(db, parentId) {
    const result = await db.prepare('SELECT * FROM users WHERE parent_id = ?').bind(parentId).all()
    return result.results || []
}

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
