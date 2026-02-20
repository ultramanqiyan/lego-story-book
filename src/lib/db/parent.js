export async function setParentControls(db, controlsData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    const existing = await db.prepare('SELECT id FROM parent_controls WHERE parent_id = ? AND child_id = ?')
        .bind(controlsData.parent_id, controlsData.child_id).first()
    
    if (existing) {
        await db.prepare(
            'UPDATE parent_controls SET daily_time_limit = ?, allowed_start_hour = ?, allowed_end_hour = ?, break_reminder_interval = ?, content_filter_level = ?, updated_at = ? WHERE id = ?'
        ).bind(
            controlsData.daily_time_limit || 60,
            controlsData.allowed_start_hour || 8,
            controlsData.allowed_end_hour || 21,
            controlsData.break_reminder_interval || 30,
            controlsData.content_filter_level || 'medium',
            now,
            existing.id
        ).run()
        
        return getParentControlsByChildId(db, controlsData.child_id)
    }
    
    await db.prepare(
        'INSERT INTO parent_controls (id, parent_id, child_id, daily_time_limit, allowed_start_hour, allowed_end_hour, break_reminder_interval, content_filter_level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        controlsData.parent_id,
        controlsData.child_id,
        controlsData.daily_time_limit || 60,
        controlsData.allowed_start_hour || 8,
        controlsData.allowed_end_hour || 21,
        controlsData.break_reminder_interval || 30,
        controlsData.content_filter_level || 'medium',
        now,
        now
    ).run()
    
    return {
        id,
        parent_id: controlsData.parent_id,
        child_id: controlsData.child_id,
        daily_time_limit: controlsData.daily_time_limit || 60,
        allowed_start_hour: controlsData.allowed_start_hour || 8,
        allowed_end_hour: controlsData.allowed_end_hour || 21,
        break_reminder_interval: controlsData.break_reminder_interval || 30,
        content_filter_level: controlsData.content_filter_level || 'medium',
        created_at: now,
        updated_at: now
    }
}

export async function getParentControlsByChildId(db, childId) {
    const result = await db.prepare('SELECT * FROM parent_controls WHERE child_id = ?').bind(childId).first()
    return result || null
}

export async function getParentControlsByParentId(db, parentId) {
    const result = await db.prepare('SELECT * FROM parent_controls WHERE parent_id = ?').bind(parentId).all()
    return result.results || []
}

export async function deleteParentControls(db, id) {
    await db.prepare('DELETE FROM parent_controls WHERE id = ?').bind(id).run()
}

export async function logUsage(db, logData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO usage_logs (id, user_id, action, details, duration, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        logData.user_id,
        logData.action,
        logData.details || null,
        logData.duration || null,
        now
    ).run()
    
    return {
        id,
        user_id: logData.user_id,
        action: logData.action,
        details: logData.details,
        duration: logData.duration,
        created_at: now
    }
}

export async function getUsageLogs(db, userId, limit = 100) {
    const result = await db.prepare('SELECT * FROM usage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
        .bind(userId, limit).all()
    return result.results || []
}

export async function getUsageStats(db, userId, days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const result = await db.prepare(
        'SELECT action, COUNT(*) as count, SUM(duration) as total_duration FROM usage_logs WHERE user_id = ? AND created_at >= ? GROUP BY action'
    ).bind(userId, startDate.toISOString()).all()
    
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
