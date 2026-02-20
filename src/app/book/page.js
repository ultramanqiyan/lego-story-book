'use client'

import { useState, useEffect } from 'react'

export default function BookPage() {
    const [user, setUser] = useState(null)
    const [book, setBook] = useState(null)
    const [currentChapter, setCurrentChapter] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }

        const params = new URLSearchParams(window.location.search)
        const bookId = params.get('id')
        if (bookId) {
            loadBook(bookId)
        } else {
            setLoading(false)
            setError('缺少书籍ID')
        }
    }, [])

    const loadBook = async (bookId) => {
        try {
            const response = await fetch(`/api/book?action=detail&id=${bookId}`)
            const data = await response.json()
            if (data.success) {
                setBook(data.book)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('加载书籍失败')
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

    const continueStory = () => {
        window.location.href = `/story-create/?bookId=${book.id}`
    }

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="text-2xl">加载中...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">错误</h2>
                    <p className="text-gray-600">{error}</p>
                    <a href="/bookshelf/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block mt-4">
                        返回书架
                    </a>
                </div>
            </div>
        )
    }

    if (!book) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">书籍不存在</h2>
                    <a href="/bookshelf/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
                        返回书架
                    </a>
                </div>
            </div>
        )
    }

    const chapter = book.chapters[currentChapter]

    return (
        <div className="py-8">
            <div className="lego-card mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
                        <p className="text-gray-600">共 {book.chapter_count} 章</p>
                    </div>
                    <a href="/bookshelf/" className="text-blue-500 hover:underline">
                        返回书架
                    </a>
                </div>
            </div>

            {book.chapters.length === 0 ? (
                <div className="lego-card text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">还没有章节</h3>
                    <p className="text-gray-600 mb-6">开始创作第一个章节吧！</p>
                    <button
                        onClick={continueStory}
                        className="lego-button bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                        开始创作 ✨
                    </button>
                </div>
            ) : (
                <>
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
                            {currentChapter < book.chapters.length - 1 ? (
                                <button
                                    onClick={nextChapter}
                                    className="lego-button bg-gradient-to-r from-blue-500 to-purple-500"
                                >
                                    下一章
                                </button>
                            ) : (
                                <button
                                    onClick={continueStory}
                                    className="lego-button bg-gradient-to-r from-green-500 to-blue-500"
                                >
                                    继续生成故事
                                </button>
                            )}
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
                </>
            )}
        </div>
    )
}
