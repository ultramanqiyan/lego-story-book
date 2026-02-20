'use client'

import { useState } from 'react'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const endpoint = isLogin ? '/api/user?action=login' : '/api/user?action=register'
            const body = isLogin 
                ? { username, password }
                : { username, email, password, role: 'child' }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                window.location.href = '/story-create/'
            } else {
                setError(data.error || '操作失败')
            }
        } catch (err) {
            setError('网络错误，请重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="lego-card">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? '🧱 登录乐高小镇' : '🧱 注册新账户'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="lego-input"
                            placeholder="请输入用户名"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">邮箱（可选）</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="lego-input"
                                placeholder="请输入邮箱"
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="lego-input"
                            placeholder="请输入密码"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="lego-button w-full bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
                    >
                        {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError('')
                        }}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? '没有账户？点击注册' : '已有账户？点击登录'}
                    </button>
                </div>
            </div>
        </div>
    )
}
