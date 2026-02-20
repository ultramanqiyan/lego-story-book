import { createUser, getUserById, getUserByUsername, getUserByEmail, updateUser, deleteUser, getChildUsers } from '../../src/lib/db/user.js'

function generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    }))
    const signature = btoa(`${header}.${payload}`)
    return `${header}.${payload}.${signature}`
}

function hashPassword(password) {
    return btoa(password + '_hashed')
}

function verifyPassword(password, hash) {
    return hashPassword(password) === hash
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    if (action === 'info') {
        const authHeader = context.request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        try {
            const token = authHeader.split(' ')[1]
            const payload = JSON.parse(atob(token.split('.')[1]))
            
            if (payload.exp < Date.now()) {
                return new Response(JSON.stringify({ success: false, error: 'Token已过期' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const user = await getUserById(context.env.DB, payload.id)
            if (!user) {
                return new Response(JSON.stringify({ success: false, error: '用户不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            return new Response(JSON.stringify({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: '无效的Token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
    
    if (action === 'children') {
        const authHeader = context.request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        try {
            const token = authHeader.split(' ')[1]
            const payload = JSON.parse(atob(token.split('.')[1]))
            const children = await getChildUsers(context.env.DB, payload.id)
            
            return new Response(JSON.stringify({
                success: true,
                children: children.map(c => ({
                    id: c.id,
                    username: c.username,
                    email: c.email
                }))
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: '获取失败' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }
    
    return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function onRequestPost(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        const body = await context.request.json()
        
        if (action === 'register') {
            const { username, email, password, role } = body
            
            if (!username || username.length < 3 || username.length > 20) {
                return new Response(JSON.stringify({ success: false, error: '用户名长度需要在3-20个字符之间' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return new Response(JSON.stringify({ success: false, error: '邮箱格式不正确' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!password || password.length < 6) {
                return new Response(JSON.stringify({ success: false, error: '密码长度至少6个字符' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const existingUser = await getUserByUsername(context.env.DB, username)
            if (existingUser) {
                return new Response(JSON.stringify({ success: false, error: '用户名已存在' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (email) {
                const existingEmail = await getUserByEmail(context.env.DB, email)
                if (existingEmail) {
                    return new Response(JSON.stringify({ success: false, error: '邮箱已被使用' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    })
                }
            }
            
            const user = await createUser(context.env.DB, {
                username,
                email: email || null,
                password_hash: hashPassword(password),
                role: role || 'child'
            })
            
            const token = generateToken(user)
            
            return new Response(JSON.stringify({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'login') {
            const { username, password } = body
            
            if (!username || !password) {
                return new Response(JSON.stringify({ success: false, error: '请输入用户名和密码' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const user = await getUserByUsername(context.env.DB, username)
            if (!user) {
                return new Response(JSON.stringify({ success: false, error: '用户名或密码错误' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!verifyPassword(password, user.password_hash)) {
                return new Response(JSON.stringify({ success: false, error: '用户名或密码错误' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const token = generateToken(user)
            
            return new Response(JSON.stringify({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'bind-child') {
            const authHeader = context.request.headers.get('Authorization')
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const { child_username } = body
            const token = authHeader.split(' ')[1]
            const payload = JSON.parse(atob(token.split('.')[1]))
            
            const child = await getUserByUsername(context.env.DB, child_username)
            if (!child) {
                return new Response(JSON.stringify({ success: false, error: '儿童账户不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await updateUser(context.env.DB, child.id, { parent_id: payload.id })
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('User API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function onRequestDelete(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    if (action === 'unbind-child') {
        const authHeader = context.request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        const child_id = url.searchParams.get('child_id')
        if (!child_id) {
            return new Response(JSON.stringify({ success: false, error: '缺少child_id' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        await updateUser(context.env.DB, child_id, { parent_id: null })
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        })
    }
    
    return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    })
}
