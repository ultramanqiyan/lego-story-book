export async function createBook(db, bookData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO books (id, title, user_id, chapter_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        bookData.title,
        bookData.user_id,
        0,
        now,
        now
    ).run()
    
    return {
        id,
        title: bookData.title,
        user_id: bookData.user_id,
        chapter_count: 0,
        created_at: now,
        updated_at: now
    }
}

export async function getBookById(db, id) {
    const result = await db.prepare('SELECT * FROM books WHERE id = ?').bind(id).first()
    return result || null
}

export async function getUserBooks(db, userId) {
    const result = await db.prepare('SELECT * FROM books WHERE user_id = ? ORDER BY updated_at DESC').bind(userId).all()
    return result.results || []
}

export async function updateBook(db, id, updates) {
    const now = new Date().toISOString()
    const fields = []
    const values = []
    
    if (updates.title !== undefined) {
        fields.push('title = ?')
        values.push(updates.title)
    }
    
    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)
    
    await db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run()
    
    return getBookById(db, id)
}

export async function updateBookChapterCount(db, bookId) {
    const result = await db.prepare('SELECT COUNT(*) as count FROM chapters WHERE book_id = ?').bind(bookId).first()
    const count = result?.count || 0
    
    const now = new Date().toISOString()
    await db.prepare('UPDATE books SET chapter_count = ?, updated_at = ? WHERE id = ?').bind(count, now, bookId).run()
}

export async function deleteBook(db, id) {
    await db.prepare('DELETE FROM chapters WHERE book_id = ?').bind(id).run()
    await db.prepare('DELETE FROM shares WHERE book_id = ?').bind(id).run()
    await db.prepare('DELETE FROM books WHERE id = ?').bind(id).run()
}

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
