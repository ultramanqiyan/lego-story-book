import './globals.css'

export const metadata = {
    title: '乐高故事书籍',
    description: '创建属于你的乐高故事'
}

export default function RootLayout({ children }) {
    return (
        <html lang="zh-CN">
            <body>
                <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
                    <nav className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-4 shadow-lg">
                        <div className="max-w-6xl mx-auto flex justify-between items-center">
                            <a href="/" className="text-white font-bold text-xl flex items-center gap-2">
                                <span className="text-2xl">🧱</span>
                                乐高故事书籍
                            </a>
                            <div className="flex gap-4 flex-wrap">
                                <a href="/" className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition">主页</a>
                                <a href="/story-create/" className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition">故事创作</a>
                                <a href="/bookshelf/" className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition">书架</a>
                                <a href="/characters/" className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition">人仔管理</a>
                                <a href="/parent/" className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition">家长控制</a>
                                <a href="/login/" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-lg hover:from-red-700 hover:to-red-800 transition">登录</a>
                            </div>
                        </div>
                    </nav>
                    <main className="max-w-6xl mx-auto p-4">
                        {children}
                    </main>
                    <footer className="bg-gray-800 text-white p-4 mt-8">
                        <div className="max-w-6xl mx-auto text-center">
                            <p>© 2024 乐高故事书籍 - 激发儿童的创造力和想象力</p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
