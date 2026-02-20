export async function createChapter(db, chapterData) {
    const id = generateId()
    const now = new Date().toISOString()
    
    await db.prepare(
        'INSERT INTO chapters (id, book_id, chapter_number, title, content, characters, plot, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        id,
        chapterData.book_id,
        chapterData.chapter_number,
        chapterData.title,
        chapterData.content,
        typeof chapterData.characters === 'string' ? chapterData.characters : JSON.stringify(chapterData.characters),
        chapterData.plot,
        now,
        now
    ).run()
    
    return {
        id,
        book_id: chapterData.book_id,
        chapter_number: chapterData.chapter_number,
        title: chapterData.title,
        content: chapterData.content,
        characters: chapterData.characters,
        plot: chapterData.plot,
        created_at: now,
        updated_at: now
    }
}

export async function getChapterById(db, id) {
    const result = await db.prepare('SELECT * FROM chapters WHERE id = ?').bind(id).first()
    return result || null
}

export async function getBookChapters(db, bookId) {
    const result = await db.prepare('SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number ASC').bind(bookId).all()
    return result.results || []
}

export async function getChapterCount(db, bookId) {
    const result = await db.prepare('SELECT COUNT(*) as count FROM chapters WHERE book_id = ?').bind(bookId).first()
    return result?.count || 0
}

export async function getNextChapterNumber(db, bookId) {
    const count = await getChapterCount(db, bookId)
    return count + 1
}

export async function updateChapter(db, id, updates) {
    const now = new Date().toISOString()
    const fields = []
    const values = []
    
    if (updates.title !== undefined) {
        fields.push('title = ?')
        values.push(updates.title)
    }
    if (updates.content !== undefined) {
        fields.push('content = ?')
        values.push(updates.content)
    }
    
    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)
    
    await db.prepare(`UPDATE chapters SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run()
    
    return getChapterById(db, id)
}

export async function deleteChapter(db, id) {
    await db.prepare('DELETE FROM chapters WHERE id = ?').bind(id).run()
}

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
