'use client'

import { useState, useEffect } from 'react'

export default function SharePage() {
    const [shareCode, setShareCode] = useState('')
    const [password, setPassword] = useState('')
    const [book, setBook] = useState(null)
    const [currentChapter, setCurrentChapter] = useState(0)
    const [loading, setLoading] = useState(false)
    const [requirePassword, setRequirePassword] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        if (code) {
            setShareCode(code)
            accessShare(code)
        }
    }, [])

    const accessShare = async (code = shareCode, pwd = password) => {
        if (!code) {
            setError('请输入分享码')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/share?action=access&code=${code}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwd })
            })

            const data = await response.json()

            if (data.requirePassword) {
                setRequirePassword(true)
                setLoading(false)
                return
            }

            if (data.success) {
                setBook(data.book)
                setRequirePassword(false)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('访问失败')
        } finally {
            setLoading(false)
        }
    }

    const prevChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1)
        }
    }

    const nextChapter = () => {
        if (book && currentChapter < book.chapters.length - 1) {
            setCurrentChapter(currentChapter + 1)
        }
    }

    if (book) {
        const chapter = book.chapters[currentChapter]

        return (
            <div className="py-8">
                <div className="lego-card mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                    <p className="text-gray-600">共 {book.chapter_count} 章</p>
                </div>

                <div className="lego-card mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={prevChapter}
                            disabled={currentChapter === 0}
                            className="lego-button bg-gray-400 disabled:opacity-50"
                        >
                            上一章
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">
                            第{chapter.chapter_number}章：{chapter.title}
                        </h2>
                        <button
                            onClick={nextChapter}
                            disabled={currentChapter === book.chapters.length - 1}
                            className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
                        >
                            下一章
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
                        <p className="text-lg leading-relaxed text-gray-800">
                            {chapter.content}
                        </p>
                    </div>
                </div>

                <div className="lego-card">
                    <h3 className="font-bold text-gray-800 mb-4">章节目录</h3>
                    <div className="space-y-2">
                        {book.chapters.map((ch, index) => (
                            <div
                                key={ch.id}
                                onClick={() => setCurrentChapter(index)}
                                className={`p-3 rounded-lg cursor-pointer transition ${
                                    index === currentChapter
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <span className="font-medium">
                                    第{ch.chapter_number}章：{ch.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="lego-card text-center">
                <div className="text-6xl mb-4">📖</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">访问分享的故事</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={shareCode}
                            onChange={(e) => setShareCode(e.target.value)}
                            className="lego-input text-center"
                            placeholder="输入分享码"
                            maxLength={8}
                        />
                    </div>

                    {requirePassword && (
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="lego-input text-center"
                                placeholder="输入访问密码"
                            />
                        </div>
                    )}

                    <button
                        onClick={() => accessShare()}
                        disabled={loading}
                        className="lego-button w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                        {loading ? '访问中...' : '访问'}
                    </button>
                </div>
            </div>
        </div>
    )
}
