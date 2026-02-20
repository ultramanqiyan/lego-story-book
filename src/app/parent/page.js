'use client'

import { useState, useEffect } from 'react'

export default function ParentPage() {
    const [user, setUser] = useState(null)
    const [children, setChildren] = useState([])
    const [selectedChild, setSelectedChild] = useState(null)
    const [controls, setControls] = useState({
        daily_time_limit: 60,
        allowed_start_hour: 8,
        allowed_end_hour: 21,
        break_reminder_interval: 30,
        content_filter_level: 'medium'
    })
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [bindUsername, setBindUsername] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            if (userData.role !== 'parent') {
                setLoading(false)
                return
            }
            loadChildren(userData)
        } else {
            setLoading(false)
        }
    }, [])

    const loadChildren = async (userData) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/parent?action=children', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setChildren(data.children)
                if (data.children.length > 0) {
                    selectChild(data.children[0])
                }
            }
        } catch (err) {
            console.error('Failed to load children:', err)
        } finally {
            setLoading(false)
        }
    }

    const selectChild = async (child) => {
        setSelectedChild(child)
        if (child.controls) {
            setControls(child.controls)
        }
        loadStats(child.id)
    }

    const loadStats = async (childId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/parent?action=stats&child_id=${childId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setStats(data.stats)
            }
        } catch (err) {
            console.error('Failed to load stats:', err)
        }
    }

    const bindChild = async () => {
        if (!bindUsername.trim()) {
            setError('请输入儿童账户用户名')
            return
        }

        setSaving(true)
        setError('')
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/user?action=bind-child', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ child_username: bindUsername })
            })

            const data = await response.json()
            if (data.success) {
                setSuccess('绑定成功')
                setBindUsername('')
                loadChildren()
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('绑定失败')
        } finally {
            setSaving(false)
        }
    }

    const saveControls = async () => {
        if (!selectedChild) return

        setSaving(true)
        setError('')
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/parent?action=settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    child_id: selectedChild.id,
                    ...controls
                })
            })

            const data = await response.json()
            if (data.success) {
                setSuccess('设置已保存')
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('保存失败')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="text-2xl">加载中...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">请先登录</h2>
                    <p className="text-gray-600 mb-6">登录后即可使用家长控制功能</p>
                    <a href="/login/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
                        去登录
                    </a>
                </div>
            </div>
        )
    }

    if (user.role !== 'parent') {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">需要家长账户</h2>
                    <p className="text-gray-600 mb-6">此功能仅限家长账户使用</p>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">👨‍👩‍👧 家长控制</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
                    {success}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="lego-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">绑定儿童账户</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={bindUsername}
                            onChange={(e) => setBindUsername(e.target.value)}
                            className="lego-input flex-1"
                            placeholder="输入儿童用户名"
                        />
                        <button
                            onClick={bindChild}
                            disabled={saving}
                            className="lego-button bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                            绑定
                        </button>
                    </div>

                    {children.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-bold text-gray-700 mb-2">已绑定账户</h3>
                            <div className="space-y-2">
                                {children.map(child => (
                                    <div
                                        key={child.id}
                                        onClick={() => selectChild(child)}
                                        className={`p-3 rounded-lg cursor-pointer transition ${
                                            selectedChild?.id === child.id
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="font-medium">{child.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lego-card md:col-span-2">
                    {selectedChild ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {selectedChild.username} 的控制设置
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        每日使用时长限制（分钟）
                                    </label>
                                    <input
                                        type="number"
                                        value={controls.daily_time_limit}
                                        onChange={(e) => setControls({ ...controls, daily_time_limit: parseInt(e.target.value) || 60 })}
                                        className="lego-input"
                                        min={1}
                                        max={480}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        休息提醒间隔（分钟）
                                    </label>
                                    <input
                                        type="number"
                                        value={controls.break_reminder_interval}
                                        onChange={(e) => setControls({ ...controls, break_reminder_interval: parseInt(e.target.value) || 30 })}
                                        className="lego-input"
                                        min={5}
                                        max={120}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        允许使用开始时间
                                    </label>
                                    <select
                                        value={controls.allowed_start_hour}
                                        onChange={(e) => setControls({ ...controls, allowed_start_hour: parseInt(e.target.value) })}
                                        className="lego-select"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <option key={i} value={i}>{i}:00</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">
                                        允许使用结束时间
                                    </label>
                                    <select
                                        value={controls.allowed_end_hour}
                                        onChange={(e) => setControls({ ...controls, allowed_end_hour: parseInt(e.target.value) })}
                                        className="lego-select"
                                    >
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <option key={i} value={i}>{i}:00</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        内容过滤级别
                                    </label>
                                    <select
                                        value={controls.content_filter_level}
                                        onChange={(e) => setControls({ ...controls, content_filter_level: e.target.value })}
                                        className="lego-select"
                                    >
                                        <option value="low">低 - 仅过滤严重不当内容</option>
                                        <option value="medium">中 - 过滤大部分不当内容</option>
                                        <option value="high">高 - 严格过滤所有可能不当内容</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={saveControls}
                                disabled={saving}
                                className="lego-button w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500"
                            >
                                {saving ? '保存中...' : '保存设置'}
                            </button>

                            {stats && (
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="font-bold text-gray-800 mb-4">使用统计</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-blue-600">{stats.total_time}</div>
                                            <div className="text-sm text-gray-600">总使用时长(分钟)</div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-green-600">{stats.total_actions}</div>
                                            <div className="text-sm text-gray-600">总操作次数</div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {stats.by_action?.length || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">活动类型</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            请先选择一个儿童账户
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
