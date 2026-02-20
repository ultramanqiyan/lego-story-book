import { createShare, getShareByCode, getSharesByBookId, deleteShare } from '../../src/lib/db/share.js'
import { getBookById } from '../../src/lib/db/book.js'
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
            const bookId = url.searchParams.get('book_id')
            if (!bookId) {
                return new Response(JSON.stringify({ success: false, error: '缺少book_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const shares = await getSharesByBookId(context.env.DB, bookId)
            return new Response(JSON.stringify({
                success: true,
                shares: shares.map(s => ({
                    id: s.id,
                    share_code: s.share_code,
                    is_public: s.is_public === 1,
                    created_at: s.created_at,
                    expires_at: s.expires_at
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Share API error:', error)
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
            const { book_id, is_public, password } = body
            
            if (!book_id) {
                return new Response(JSON.stringify({ success: false, error: '缺少书籍ID' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await getBookById(context.env.DB, book_id)
            if (!book) {
                return new Response(JSON.stringify({ success: false, error: '书籍不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (book.user_id !== userId) {
                return new Response(JSON.stringify({ success: false, error: '无权限分享此书籍' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!is_public && !password) {
                return new Response(JSON.stringify({ success: false, error: '私密分享需要设置密码' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const share = await createShare(context.env.DB, {
                book_id,
                is_public: is_public !== false,
                password: password || null
            })
            
            const baseUrl = url.origin
            const shareUrl = `${baseUrl}/share?code=${share.share_code}`
            
            return new Response(JSON.stringify({
                success: true,
                share: {
                    id: share.id,
                    share_code: share.share_code,
                    share_url: shareUrl
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'access') {
            const code = url.searchParams.get('code')
            if (!code) {
                return new Response(JSON.stringify({ success: false, error: '缺少分享码' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const body = await context.request.json().catch(() => ({}))
            const { password } = body
            
            const share = await getShareByCode(context.env.DB, code)
            if (!share) {
                return new Response(JSON.stringify({ success: false, error: '分享不存在或已过期' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (share.expires_at && new Date(share.expires_at) < new Date()) {
                return new Response(JSON.stringify({ success: false, error: '分享已过期' }), {
                    status: 410,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (share.is_public !== 1) {
                if (!password) {
                    return new Response(JSON.stringify({ success: false, error: '需要密码', requirePassword: true }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
                
                if (password !== share.password) {
                    return new Response(JSON.stringify({ success: false, error: '密码错误' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
            }
            
            const book = await getBookById(context.env.DB, share.book_id)
            const chapters = await getBookChapters(context.env.DB, share.book_id)
            
            return new Response(JSON.stringify({
                success: true,
                book: {
                    id: book.id,
                    title: book.title,
                    chapter_count: book.chapter_count,
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
        console.error('Share API error:', error)
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
                return new Response(JSON.stringify({ success: false, error: '缺少分享ID' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await deleteShare(context.env.DB, id)
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Share API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
