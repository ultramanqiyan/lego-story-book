import { setParentControls, getParentControlsByChildId, getParentControlsByParentId, logUsage, getUsageLogs, getUsageStats } from '../../src/lib/db/parent.js'
import { getUserById, getChildUsers } from '../../src/lib/db/user.js'

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
        const userId = getUserIdFromToken(context.request)
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'controls') {
            const childId = url.searchParams.get('child_id')
            if (!childId) {
                return new Response(JSON.stringify({ success: false, error: '缺少child_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const controls = await getParentControlsByChildId(context.env.DB, childId)
            if (!controls) {
                return new Response(JSON.stringify({ success: true, controls: null }), {
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            return new Response(JSON.stringify({
                success: true,
                controls: {
                    daily_time_limit: controls.daily_time_limit,
                    allowed_start_hour: controls.allowed_start_hour,
                    allowed_end_hour: controls.allowed_end_hour,
                    break_reminder_interval: controls.break_reminder_interval,
                    content_filter_level: controls.content_filter_level
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'children') {
            const children = await getChildUsers(context.env.DB, userId)
            const childrenWithControls = await Promise.all(
                children.map(async (child) => {
                    const controls = await getParentControlsByChildId(context.env.DB, child.id)
                    return {
                        id: child.id,
                        username: child.username,
                        email: child.email,
                        controls: controls ? {
                            daily_time_limit: controls.daily_time_limit,
                            allowed_start_hour: controls.allowed_start_hour,
                            allowed_end_hour: controls.allowed_end_hour,
                            break_reminder_interval: controls.break_reminder_interval,
                            content_filter_level: controls.content_filter_level
                        } : null
                    }
                })
            )
            
            return new Response(JSON.stringify({
                success: true,
                children: childrenWithControls
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'stats') {
            const childId = url.searchParams.get('child_id')
            const days = parseInt(url.searchParams.get('days') || '7', 10)
            
            if (!childId) {
                return new Response(JSON.stringify({ success: false, error: '缺少child_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const stats = await getUsageStats(context.env.DB, childId, days)
            const logs = await getUsageLogs(context.env.DB, childId, 100)
            
            const totalDuration = stats.reduce((sum, s) => sum + (s.total_duration || 0), 0)
            const totalActions = stats.reduce((sum, s) => sum + (s.count || 0), 0)
            
            return new Response(JSON.stringify({
                success: true,
                stats: {
                    total_time: totalDuration,
                    total_actions: totalActions,
                    by_action: stats,
                    recent_logs: logs.slice(0, 20)
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
        console.error('Parent API error:', error)
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
        const userId = getUserIdFromToken(context.request)
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'settings') {
            const body = await context.request.json()
            const { child_id, daily_time_limit, allowed_start_hour, allowed_end_hour, break_reminder_interval, content_filter_level } = body
            
            if (!child_id) {
                return new Response(JSON.stringify({ success: false, error: '缺少child_id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const child = await getUserById(context.env.DB, child_id)
            if (!child) {
                return new Response(JSON.stringify({ success: false, error: '儿童账户不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (child.parent_id !== userId) {
                return new Response(JSON.stringify({ success: false, error: '无权限设置此儿童的控制规则' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (daily_time_limit !== undefined && (daily_time_limit < 1 || daily_time_limit > 480)) {
                return new Response(JSON.stringify({ success: false, error: '每日时长限制应在1-480分钟之间' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (allowed_start_hour !== undefined && (allowed_start_hour < 0 || allowed_start_hour > 23)) {
                return new Response(JSON.stringify({ success: false, error: '开始时间应在0-23之间' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (allowed_end_hour !== undefined && (allowed_end_hour < 0 || allowed_end_hour > 23)) {
                return new Response(JSON.stringify({ success: false, error: '结束时间应在0-23之间' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (content_filter_level && !['low', 'medium', 'high'].includes(content_filter_level)) {
                return new Response(JSON.stringify({ success: false, error: '内容过滤级别应为low、medium或high' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await setParentControls(context.env.DB, {
                parent_id: userId,
                child_id,
                daily_time_limit: daily_time_limit ?? 60,
                allowed_start_hour: allowed_start_hour ?? 8,
                allowed_end_hour: allowed_end_hour ?? 21,
                break_reminder_interval: break_reminder_interval ?? 30,
                content_filter_level: content_filter_level ?? 'medium'
            })
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (action === 'log') {
            const body = await context.request.json()
            const { action: logAction, details, duration } = body
            
            if (!logAction) {
                return new Response(JSON.stringify({ success: false, error: '缺少action' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            await logUsage(context.env.DB, {
                user_id: userId,
                action: logAction,
                details: details ? JSON.stringify(details) : null,
                duration: duration || null
            })
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return new Response(JSON.stringify({ success: false, error: '未知操作' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Parent API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
