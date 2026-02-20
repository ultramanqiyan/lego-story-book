'use client'

import { useState, useEffect } from 'react'

export default function BookshelfPage() {
    const [user, setUser] = useState(null)
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        } else {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) {
            loadBooks()
        }
    }, [user])

    const loadBooks = async () => {
        try {
            const response = await fetch(`/api/book?action=list&user_id=${user.id}`)
            const data = await response.json()
            if (data.success) {
                setBooks(data.books)
            }
        } catch (err) {
            console.error('Failed to load books:', err)
        } finally {
            setLoading(false)
        }
    }

    const deleteBook = async (bookId) => {
        if (!confirm('确定要删除这本书吗？所有章节都将被删除。')) {
            return
        }

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/book?action=delete&id=${bookId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const data = await response.json()
            if (data.success) {
                setBooks(books.filter(b => b.id !== bookId))
            }
        } catch (err) {
            console.error('Failed to delete book:', err)
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
                    <p className="text-gray-600 mb-6">登录后即可查看你的书架</p>
                    <a href="/login/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
                        去登录
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">📚 我的书架</h1>
                <a href="/story-create/" className="lego-button bg-gradient-to-r from-green-500 to-blue-500">
                    创建新书 ✨
                </a>
            </div>

            {books.length === 0 ? (
                <div className="lego-card text-center py-12">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">书架空空如也</h3>
                    <p className="text-gray-600 mb-6">开始创作你的第一个故事吧！</p>
                    <a href="/story-create/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
                        开始创作
                    </a>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {books.map(book => (
                        <div key={book.id} className="lego-card">
                            <div className="bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100 h-32 rounded-xl mb-4 flex items-center justify-center">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{book.chapter_count} 章节</p>
                            <div className="flex gap-2">
                                <a
                                    href={`/book/?id=${book.id}`}
                                    className="flex-1 text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    阅读
                                </a>
                                <button
                                    onClick={() => deleteBook(book.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    删除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
