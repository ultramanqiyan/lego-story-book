export async function createShare(db, shareData) {
    const id = generateId()
    const shareCode = generateShareCode(8)
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO shares (id, book_id, share_code, password, is_public, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        shareData.book_id,
        shareCode,
        shareData.password || null,
        shareData.is_public ? 1 : 0,
        now,
        shareData.expires_at || null
    ).run()
    
    return {
        id,
        book_id: shareData.book_id,
        share_code: shareCode,
        password: shareData.password,
        is_public: shareData.is_public,
        created_at: now,
        expires_at: shareData.expires_at
    }
}

export async function getShareByCode(db, shareCode) {
    const result = await db.prepare('SELECT * FROM shares WHERE share_code = ?').bind(shareCode).first()
    return result || null
}

export async function getSharesByBookId(db, bookId) {
    const result = await db.prepare('SELECT * FROM shares WHERE book_id = ? ORDER BY created_at DESC').bind(bookId).all()
    return result.results || []
}

export async function deleteShare(db, id) {
    await db.prepare('DELETE FROM shares WHERE id = ?').bind(id).run()
}

export async function deleteSharesByBookId(db, bookId) {
    await db.prepare('DELETE FROM shares WHERE book_id = ?').bind(bookId).run()
}

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

function generateShareCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
