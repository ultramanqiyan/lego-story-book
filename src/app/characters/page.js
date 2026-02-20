'use client'

import { useState, useEffect } from 'react'

const PERSONALITIES = [
    '勇敢、正义、严肃',
    '活泼、幽默、善良',
    '热血、坚韧、乐观',
    '威猛、古老、神秘',
    '优雅、善良、勇敢',
    '忠诚、勇敢、正直',
    '智慧、神秘、慈祥',
    '好奇、勇敢、科学',
    '豪爽、自由、机智',
    '敏捷、聪慧、友善',
    '精确、理性、忠诚',
    '正义、无私、强大'
]

const SPEAKING_STYLES = [
    '低沉有力',
    '轻松俏皮',
    '充满干劲',
    '低沉咆哮',
    '温柔甜美',
    '庄重有力',
    '古老深奥',
    '专业冷静',
    '粗犷豪迈',
    '清脆悦耳',
    '机械平稳',
    '坚定有力'
]

export default function CharactersPage() {
    const [user, setUser] = useState(null)
    const [presetCharacters, setPresetCharacters] = useState([])
    const [userCharacters, setUserCharacters] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createStep, setCreateStep] = useState(1)
    const [uploading, setUploading] = useState(false)
    
    const [newCharacter, setNewCharacter] = useState({
        name: '',
        image: '',
        description: '',
        personality: PERSONALITIES[0],
        speaking_style: SPEAKING_STYLES[0]
    })

    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        loadCharacters()
    }, [])

    useEffect(() => {
        if (user) {
            loadUserCharacters()
        }
    }, [user])

    const loadCharacters = async () => {
        try {
            const response = await fetch('/api/character?action=preset')
            const data = await response.json()
            if (data.success) {
                setPresetCharacters(data.characters)
            }
        } catch (err) {
            console.error('Failed to load characters:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadUserCharacters = async () => {
        try {
            const response = await fetch(`/api/character?action=list&user_id=${user.id}`)
            const data = await response.json()
            if (data.success) {
                setUserCharacters(data.characters)
            }
        } catch (err) {
            console.error('Failed to load user characters:', err)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const reader = new FileReader()
            reader.onload = async (event) => {
                const base64 = event.target.result
                
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: base64,
                        prompt: 'LEGO style character, colorful, cute'
                    })
                })

                const data = await response.json()
                if (data.success) {
                    setNewCharacter({ ...newCharacter, image: data.imageUrl })
                    setCreateStep(2)
                } else {
                    setNewCharacter({ ...newCharacter, image: base64 })
                    setCreateStep(2)
                }
            }
            reader.readAsDataURL(file)
        } catch (err) {
            console.error('Upload error:', err)
        } finally {
            setUploading(false)
        }
    }

    const createCharacter = async () => {
        if (!newCharacter.name.trim()) {
            alert('请输入人仓名称')
            return
        }

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/character?action=create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCharacter)
            })

            const data = await response.json()
            if (data.success) {
                setUserCharacters([...userCharacters, data.character])
                setShowCreateModal(false)
                setCreateStep(1)
                setNewCharacter({
                    name: '',
                    image: '',
                    description: '',
                    personality: PERSONALITIES[0],
                    speaking_style: SPEAKING_STYLES[0]
                })
            }
        } catch (err) {
            console.error('Create error:', err)
        }
    }

    const deleteCharacter = async (id) => {
        if (!confirm('确定要删除这个人仔吗？')) return

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/character?action=delete&id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            const data = await response.json()
            if (data.success) {
                setUserCharacters(userCharacters.filter(c => c.id !== id))
            }
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="text-2xl">加载中...</div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">🎭 人仔管理</h1>
                {user && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="lego-button bg-gradient-to-r from-green-500 to-blue-500"
                    >
                        创建人仔 ✨
                    </button>
                )}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">预设人仔</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {presetCharacters.map(char => (
                        <div key={char.id} className="lego-card">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-200">
                                {char.image && (
                                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h3 className="font-bold text-center text-gray-800">{char.name}</h3>
                            <p className="text-xs text-center text-gray-600 mb-1">{char.personality}</p>
                            <p className="text-xs text-center text-gray-500">{char.speaking_style}</p>
                        </div>
                    ))}
                </div>
            </div>

            {user && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">我的人仔</h2>
                    {userCharacters.length === 0 ? (
                        <div className="lego-card text-center py-8">
                            <p className="text-gray-600">还没有创建人仔</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-4">
                            {userCharacters.map(char => (
                                <div key={char.id} className="lego-card">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-200">
                                        {char.image && (
                                            <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-center text-gray-800">{char.name}</h3>
                                    <p className="text-xs text-center text-gray-600 mb-1">{char.personality}</p>
                                    <p className="text-xs text-center text-gray-500 mb-4">{char.speaking_style}</p>
                                    <button
                                        onClick={() => deleteCharacter(char.id)}
                                        className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        删除
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">创建人仔</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    setCreateStep(1)
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex gap-2 mb-6">
                            <div className={`flex-1 h-2 rounded ${createStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                            <div className={`flex-1 h-2 rounded ${createStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                            <div className={`flex-1 h-2 rounded ${createStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                        </div>

                        {createStep === 1 && (
                            <div className="text-center">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <div className="text-4xl mb-4">📷</div>
                                        <p className="text-gray-600">点击上传照片</p>
                                        <p className="text-sm text-gray-400">支持 JPG/PNG 格式</p>
                                    </label>
                                </div>
                                {uploading && <p className="text-blue-500">正在生成乐高风格...</p>}
                            </div>
                        )}

                        {createStep === 2 && (
                            <div>
                                <div className="w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden bg-gray-200">
                                    {newCharacter.image && (
                                        <img src={newCharacter.image} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">人仓名称</label>
                                        <input
                                            type="text"
                                            value={newCharacter.name}
                                            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                                            className="lego-input"
                                            placeholder="给人仔起个名字"
                                            maxLength={20}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">性格特点</label>
                                        <select
                                            value={newCharacter.personality}
                                            onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                                            className="lego-select"
                                        >
                                            {PERSONALITIES.map((p, i) => (
                                                <option key={i} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">说话方式</label>
                                        <select
                                            value={newCharacter.speaking_style}
                                            onChange={(e) => setNewCharacter({ ...newCharacter, speaking_style: e.target.value })}
                                            className="lego-select"
                                        >
                                            {SPEAKING_STYLES.map((s, i) => (
                                                <option key={i} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setCreateStep(1)}
                                        className="lego-button flex-1 bg-gray-400"
                                    >
                                        重新上传
                                    </button>
                                    <button
                                        onClick={createCharacter}
                                        className="lego-button flex-1 bg-gradient-to-r from-green-500 to-blue-500"
                                    >
                                        创建
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
