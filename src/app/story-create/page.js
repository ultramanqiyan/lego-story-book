'use client'

import { useState, useEffect } from 'react'

const STEPS = ['选择书籍', '选择角色', '选择情节', '生成故事']

const PRESET_PLOTS = [
    { id: 'adventure', name: '冒险之旅', desc: '踏上未知的冒险旅程', icon: '🗺️' },
    { id: 'mystery', name: '神秘谜团', desc: '发现并解开神秘谜题', icon: '🔍' },
    { id: 'friendship', name: '友谊考验', desc: '经历友谊的考验与成长', icon: '🤝' },
    { id: 'hero', name: '英雄救美', desc: '勇敢地拯救被困的人', icon: '🦸' },
    { id: 'treasure', name: '寻宝探险', desc: '寻找传说中的宝藏', icon: '💎' },
    { id: 'magic', name: '魔法奇遇', desc: '遇到神奇的魔法力量', icon: '✨' },
    { id: 'space', name: '太空冒险', desc: '展开星际探索之旅', icon: '🚀' },
    { id: 'competition', name: '竞技比赛', desc: '参加激烈的竞技比赛', icon: '🏆' }
]

export default function StoryCreatePage() {
    const [step, setStep] = useState(0)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [newBookTitle, setNewBookTitle] = useState('')
    
    const [characters, setCharacters] = useState([])
    const [selectedCharacters, setSelectedCharacters] = useState([])
    
    const [selectedPlot, setSelectedPlot] = useState('')
    const [customPlot, setCustomPlot] = useState('')
    
    const [generatedStory, setGeneratedStory] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        loadPresetCharacters()
    }, [])

    useEffect(() => {
        if (user) {
            loadBooks()
        }
    }, [user])

    const loadPresetCharacters = async () => {
        try {
            const response = await fetch('/api/character?action=preset')
            const data = await response.json()
            if (data.success) {
                setCharacters(data.characters)
            }
        } catch (err) {
            console.error('Failed to load characters:', err)
        }
    }

    const loadBooks = async () => {
        try {
            const response = await fetch(`/api/book?action=list&user_id=${user.id}`)
            const data = await response.json()
            if (data.success) {
                setBooks(data.books)
            }
        } catch (err) {
            console.error('Failed to load books:', err)
        }
    }

    const createNewBook = async () => {
        if (!newBookTitle.trim()) {
            setError('请输入书籍名称')
            return
        }

        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/book?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newBookTitle })
            })

            const data = await response.json()
            if (data.success) {
                setSelectedBook(data.book)
                setStep(1)
                setError('')
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('创建书籍失败')
        } finally {
            setLoading(false)
        }
    }

    const selectBook = (book) => {
        setSelectedBook(book)
        setStep(1)
    }

    const toggleCharacter = (character) => {
        const exists = selectedCharacters.find(c => c.id === character.id)
        if (exists) {
            setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id))
        } else {
            setSelectedCharacters([...selectedCharacters, {
                ...character,
                role: selectedCharacters.length === 0 ? 'protagonist' : 'supporting',
                nickname: character.name
            }])
        }
    }

    const updateCharacterRole = (characterId, role) => {
        setSelectedCharacters(selectedCharacters.map(c => 
            c.id === characterId ? { ...c, role } : c
        ))
    }

    const updateCharacterNickname = (characterId, nickname) => {
        setSelectedCharacters(selectedCharacters.map(c => 
            c.id === characterId ? { ...c, nickname } : c
        ))
    }

    const generateStory = async () => {
        if (!selectedBook) {
            setError('请先选择书籍')
            return
        }

        if (selectedCharacters.length === 0) {
            setError('请至少选择一个角色')
            return
        }

        const hasProtagonist = selectedCharacters.some(c => c.role === 'protagonist')
        if (!hasProtagonist) {
            setError('必须选择一个主角')
            return
        }

        const plot = customPlot || selectedPlot
        if (!plot) {
            setError('请选择或输入情节')
            return
        }

        setLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/chapter?action=generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    book_id: selectedBook.id,
                    characters: selectedCharacters,
                    plot,
                    previous_chapters: []
                })
            })

            const data = await response.json()
            if (data.success) {
                setGeneratedStory(data.chapter)
                setStep(3)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('生成故事失败')
        } finally {
            setLoading(false)
        }
    }

    const continueStory = () => {
        setGeneratedStory(null)
        setStep(2)
    }

    const viewBook = () => {
        window.location.href = `/book/?id=${selectedBook.id}`
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">请先登录</h2>
                    <p className="text-gray-600 mb-6">登录后即可开始创作故事</p>
                    <a href="/login/" className="lego-button bg-gradient-to-r from-blue-500 to-purple-500 inline-block">
                        去登录
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {STEPS.map((s, i) => (
                        <div key={i} className={`flex-1 text-center ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                                i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}>
                                {i + 1}
                            </div>
                            <span className="text-sm font-medium">{s}</span>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                    {error}
                </div>
            )}

            {step === 0 && (
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">选择或创建书籍</h2>
                    
                    {books.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">我的书籍</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {books.map(book => (
                                    <div 
                                        key={book.id}
                                        onClick={() => selectBook(book)}
                                        className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition"
                                    >
                                        <h4 className="font-bold text-gray-800">{book.title}</h4>
                                        <p className="text-sm text-gray-600">{book.chapter_count} 章节</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-bold text-gray-700 mb-4">创建新书</h3>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={newBookTitle}
                                onChange={(e) => setNewBookTitle(e.target.value)}
                                className="lego-input flex-1"
                                placeholder="输入书籍名称"
                                maxLength={100}
                            />
                            <button
                                onClick={createNewBook}
                                disabled={loading}
                                className="lego-button bg-gradient-to-r from-green-500 to-blue-500"
                            >
                                {loading ? '创建中...' : '创建'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">选择角色</h2>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {characters.map(char => {
                            const isSelected = selectedCharacters.find(c => c.id === char.id)
                            return (
                                <div
                                    key={char.id}
                                    onClick={() => toggleCharacter(char)}
                                    className={`p-4 rounded-xl cursor-pointer transition ${
                                        isSelected 
                                            ? 'bg-blue-100 border-2 border-blue-500' 
                                            : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-200">
                                        {char.image && (
                                            <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <h4 className="font-bold text-center text-gray-800">{char.name}</h4>
                                    <p className="text-xs text-center text-gray-600">{char.personality}</p>
                                </div>
                            )
                        })}
                    </div>

                    {selectedCharacters.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4">已选角色</h3>
                            <div className="space-y-4">
                                {selectedCharacters.map(char => (
                                    <div key={char.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                            {char.image && (
                                                <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={char.nickname}
                                                onChange={(e) => updateCharacterNickname(char.id, e.target.value)}
                                                className="lego-input text-sm"
                                                placeholder="昵称"
                                            />
                                        </div>
                                        <select
                                            value={char.role}
                                            onChange={(e) => updateCharacterRole(char.id, e.target.value)}
                                            className="lego-select w-32"
                                        >
                                            <option value="protagonist">主角</option>
                                            <option value="supporting">配角</option>
                                            <option value="villain">反派</option>
                                            <option value="passerby">路人</option>
                                        </select>
                                        <button
                                            onClick={() => toggleCharacter(char)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(0)}
                            className="lego-button bg-gray-400"
                        >
                            上一步
                        </button>
                        <button
                            onClick={() => {
                                if (selectedCharacters.length === 0) {
                                    setError('请至少选择一个角色')
                                    return
                                }
                                if (!selectedCharacters.some(c => c.role === 'protagonist')) {
                                    setError('必须选择一个主角')
                                    return
                                }
                                setError('')
                                setStep(2)
                            }}
                            className="lego-button bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                            下一步
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">选择情节</h2>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {PRESET_PLOTS.map(plot => (
                            <div
                                key={plot.id}
                                onClick={() => {
                                    setSelectedPlot(plot.name)
                                    setCustomPlot('')
                                }}
                                className={`p-4 rounded-xl cursor-pointer transition ${
                                    selectedPlot === plot.name
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <div className="text-3xl mb-2">{plot.icon}</div>
                                <h4 className="font-bold text-gray-800">{plot.name}</h4>
                                <p className="text-sm text-gray-600">{plot.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">或自定义情节</h3>
                        <textarea
                            value={customPlot}
                            onChange={(e) => {
                                setCustomPlot(e.target.value)
                                setSelectedPlot('')
                            }}
                            className="lego-input h-24"
                            placeholder="描述你想要的情节（最多100字）"
                            maxLength={100}
                        />
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(1)}
                            className="lego-button bg-gray-400"
                        >
                            上一步
                        </button>
                        <button
                            onClick={generateStory}
                            disabled={loading || (!selectedPlot && !customPlot)}
                            className="lego-button bg-gradient-to-r from-green-500 to-blue-500 disabled:opacity-50"
                        >
                            {loading ? '生成中...' : '生成故事 ✨'}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && generatedStory && (
                <div className="lego-card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        第{generatedStory.chapter_number}章：{generatedStory.title}
                    </h2>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                        <p className="text-lg leading-relaxed text-gray-800">
                            {generatedStory.content}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={continueStory}
                            className="lego-button flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                            继续生成故事
                        </button>
                        <button
                            onClick={viewBook}
                            className="lego-button flex-1 bg-gradient-to-r from-green-500 to-blue-500"
                        >
                            查看书籍
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
