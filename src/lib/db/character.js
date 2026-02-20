export async function createCharacter(db, characterData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO characters (id, name, image, description, personality, speaking_style, creator_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        characterData.name,
        characterData.image,
        characterData.description || null,
        characterData.personality,
        characterData.speaking_style,
        characterData.creator_id || 'system',
        now,
        now
    ).run()
    
    return {
        id,
        name: characterData.name,
        image: characterData.image,
        description: characterData.description,
        personality: characterData.personality,
        speaking_style: characterData.speaking_style,
        creator_id: characterData.creator_id || 'system',
        created_at: now,
        updated_at: now
    }
}

export async function getCharacterById(db, id) {
    const result = await db.prepare('SELECT * FROM characters WHERE id = ?').bind(id).first()
    return result || null
}

export async function getPresetCharacters(db) {
    const result = await db.prepare('SELECT * FROM characters WHERE creator_id = ?').bind('system').all()
    return result.results || []
}

export async function getUserCharacters(db, userId) {
    const result = await db.prepare('SELECT * FROM characters WHERE creator_id = ?').bind(userId).all()
    return result.results || []
}

export async function getAllCharactersForUser(db, userId) {
    const result = await db.prepare(
        'SELECT * FROM characters WHERE creator_id = ? OR creator_id = ?'
    ).bind(userId, 'system').all()
    return result.results || []
}

export async function updateCharacter(db, id, updates) {
    const now = new Date().toISOString()
    const fields = []
    const values = []
    
    if (updates.name !== undefined) {
        fields.push('name = ?')
        values.push(updates.name)
    }
    if (updates.image !== undefined) {
        fields.push('image = ?')
        values.push(updates.image)
    }
    if (updates.description !== undefined) {
        fields.push('description = ?')
        values.push(updates.description)
    }
    if (updates.personality !== undefined) {
        fields.push('personality = ?')
        values.push(updates.personality)
    }
    if (updates.speaking_style !== undefined) {
        fields.push('speaking_style = ?')
        values.push(updates.speaking_style)
    }
    
    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)
    
    await db.prepare(`UPDATE characters SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run()
    
    return getCharacterById(db, id)
}

export async function deleteCharacter(db, id) {
    await db.prepare('DELETE FROM characters WHERE id = ?').bind(id).run()
}

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
