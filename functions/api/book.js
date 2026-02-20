import { createBook, getBookById, getUserBooks, updateBook, deleteBook, updateBookChapterCount } from '../../src/lib/db/book.js'
import { getBookChapters } from '../../src/lib/db/chapter.js'

function getUserIdFromToken(request) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    
    try {
        const token = authHeader.split(' ')[1]
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.id
    } catch {
        return null
    }
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        if (action === 'list') {
            const userId = url.searchParams.get('user_id')
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '缺少user_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const books = await getUserBooks(context.env.DB, userId)
            return new Response(JSON.stringify({
                success: true,
                books: books.map(b => ({
                    id: b.id,
                    title: b.title,
                    chapter_count: b.chapter_count,
                    created_at: b.created_at,
                    updated_at: b.updated_at
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'detail') {
            const id = url.searchParams.get('id')
            if (!id) {
                return new Response(JSON.stringify({ success: false, error: '缺少id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await getBookById(context.env.DB, id)
            if (!book) {
                return new Response(JSON.stringify({ success: false, error: '书籍不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const chapters = await getBookChapters(context.env.DB, id)
            
            return new Response(JSON.stringify({
                success: true,
                book: {
                    id: book.id,
                    title: book.title,
                    chapter_count: book.chapter_count,
                    created_at: book.created_at,
                    updated_at: book.updated_at,
                    chapters: chapters.map(c => ({
                        id: c.id,
                        chapter_number: c.chapter_number,
                        title: c.title,
                        content: c.content
                    }))
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Book API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function onRequestPost(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        if (action === 'create') {
            const userId = getUserIdFromToken(context.request)
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const body = await context.request.json()
            const { title } = body
            
            if (!title || title.trim().length === 0) {
                return new Response(JSON.stringify({ success: false, error: '请输入书籍名称' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (title.length > 100) {
                return new Response(JSON.stringify({ success: false, error: '书籍名称不能超过100个字符' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await createBook(context.env.DB, {
                title: title.trim(),
                user_id: userId
            })
            
            return new Response(JSON.stringify({
                success: true,
                book: {
                    id: book.id,
                    title: book.title,
                    chapter_count: book.chapter_count
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Book API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function onRequestPut(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        if (action === 'update') {
            const userId = getUserIdFromToken(context.request)
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const body = await context.request.json()
            const { id, title } = body
            
            if (!id) {
                return new Response(JSON.stringify({ success: false, error: '缺少书籍ID' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await getBookById(context.env.DB, id)
            if (!book) {
                return new Response(JSON.stringify({ success: false, error: '书籍不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (book.user_id !== userId) {
                return new Response(JSON.stringify({ success: false, error: '无权限修改此书籍' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (title) {
                if (title.trim().length === 0) {
                    return new Response(JSON.stringify({ success: false, error: '书籍名称不能为空' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                
                if (title.length > 100) {
                    return new Response(JSON.stringify({ success: false, error: '书籍名称不能超过100个字符' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                
                await updateBook(context.env.DB, id, { title: title.trim() })
            }
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Book API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function onRequestDelete(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        if (action === 'delete') {
            const userId = getUserIdFromToken(context.request)
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const id = url.searchParams.get('id')
            if (!id) {
                return new Response(JSON.stringify({ success: false, error: '缺少书籍ID' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await getBookById(context.env.DB, id)
            if (!book) {
                return new Response(JSON.stringify({ success: false, error: '书籍不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (book.user_id !== userId) {
                return new Response(JSON.stringify({ success: false, error: '无权限删除此书籍' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await deleteBook(context.env.DB, id)
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Book API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
