import { createCharacter, getCharacterById, getPresetCharacters, getUserCharacters, deleteCharacter } from '../../src/lib/db/character.js'

function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

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
        if (action === 'preset') {
            const characters = await getPresetCharacters(context.env.DB)
            return new Response(JSON.stringify({
                success: true,
                characters: characters.map(c => ({
                    id: c.id,
                    name: c.name,
                    image: c.image,
                    description: c.description,
                    personality: c.personality,
                    speaking_style: c.speaking_style
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'list') {
            const userId = url.searchParams.get('user_id')
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '缺少user_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const characters = await getUserCharacters(context.env.DB, userId)
            return new Response(JSON.stringify({
                success: true,
                characters: characters.map(c => ({
                    id: c.id,
                    name: c.name,
                    image: c.image,
                    description: c.description,
                    personality: c.personality,
                    speaking_style: c.speaking_style
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
            
            const character = await getCharacterById(context.env.DB, id)
            if (!character) {
                return new Response(JSON.stringify({ success: false, error: '人仔不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            return new Response(JSON.stringify({
                success: true,
                character: {
                    id: character.id,
                    name: character.name,
                    image: character.image,
                    description: character.description,
                    personality: character.personality,
                    speaking_style: character.speaking_style
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
        console.error('Character API error:', error)
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
            const body = await context.request.json()
            
            const { name, image, description, personality, speaking_style } = body
            
            if (!name || name.trim().length === 0) {
                return new Response(JSON.stringify({ success: false, error: '请输入人仓名称' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!image) {
                return new Response(JSON.stringify({ success: false, error: '请上传人仔图片' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!personality) {
                return new Response(JSON.stringify({ success: false, error: '请选择性格类型' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!speaking_style) {
                return new Response(JSON.stringify({ success: false, error: '请选择说话方式' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const character = await createCharacter(context.env.DB, {
                name: name.trim(),
                image,
                description: description?.trim() || null,
                personality,
                speaking_style,
                creator_id: userId || 'anonymous'
            })
            
            return new Response(JSON.stringify({
                success: true,
                character: {
                    id: character.id,
                    name: character.name,
                    image: character.image
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
        console.error('Character API error:', error)
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
            const id = url.searchParams.get('id')
            if (!id) {
                return new Response(JSON.stringify({ success: false, error: '缺少id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const character = await getCharacterById(context.env.DB, id)
            if (!character) {
                return new Response(JSON.stringify({ success: false, error: '人仔不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (character.creator_id === 'system') {
                return new Response(JSON.stringify({ success: false, error: '预设人仔不能删除' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await deleteCharacter(context.env.DB, id)
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Character API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
