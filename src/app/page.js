export default function HomePage() {
    return (
        <div className="py-8">
            <section className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                    🧱 乐高故事书籍 📚
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    创建属于你的乐高冒险故事！
                </p>
                <a href="/story-create/" className="lego-button bg-gradient-to-r from-red-500 to-yellow-500 text-xl px-8 py-4 inline-block">
                    开始创作 ✨
                </a>
            </section>

            <section className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="lego-card text-center">
                    <div className="text-4xl mb-4">🎭</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">选择角色</h3>
                    <p className="text-gray-600">
                        从12个预设人仔中选择，或创建你自己的乐高人仔
                    </p>
                </div>
                <div className="lego-card text-center">
                    <div className="text-4xl mb-4">📖</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">创作故事</h3>
                    <p className="text-gray-600">
                        选择情节，AI帮你生成精彩的乐高故事
                    </p>
                </div>
                <div className="lego-card text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">收藏书籍</h3>
                    <p className="text-gray-600">
                        将故事保存成书籍，随时阅读和分享
                    </p>
                </div>
            </section>

            <section className="lego-card mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">预设人仔</h2>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {[
                        { name: '蝙蝠侠', color: 'bg-gray-800' },
                        { name: '蜘蛛侠', color: 'bg-red-600' },
                        { name: '火影忍者', color: 'bg-orange-500' },
                        { name: '恐龙', color: 'bg-green-600' },
                        { name: '公主', color: 'bg-pink-400' },
                        { name: '骑士', color: 'bg-gray-400' },
                        { name: '巫师', color: 'bg-purple-600' },
                        { name: '宇航员', color: 'bg-white border-2 border-gray-300' },
                        { name: '海盗', color: 'bg-amber-700' },
                        { name: '精灵', color: 'bg-green-400' },
                        { name: '机器人', color: 'bg-gray-500' },
                        { name: '超人', color: 'bg-blue-600' }
                    ].map((char, index) => (
                        <div key={index} className="text-center">
                            <div className={`${char.color} w-16 h-16 mx-auto rounded-lg shadow-md flex items-center justify-center text-white text-xs font-bold`}>
                                {char.name}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="lego-card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">预设情节</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {[
                        { name: '冒险之旅', icon: '🗺️', desc: '踏上未知的冒险旅程' },
                        { name: '神秘谜团', icon: '🔍', desc: '发现并解开神秘谜题' },
                        { name: '友谊考验', icon: '🤝', desc: '经历友谊的考验与成长' },
                        { name: '英雄救美', icon: '🦸', desc: '勇敢地拯救被困的人' },
                        { name: '寻宝探险', icon: '💎', desc: '寻找传说中的宝藏' },
                        { name: '魔法奇遇', icon: '✨', desc: '遇到神奇的魔法力量' },
                        { name: '太空冒险', icon: '🚀', desc: '展开星际探索之旅' },
                        { name: '竞技比赛', icon: '🏆', desc: '参加激烈的竞技比赛' }
                    ].map((plot, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-center">
                            <div className="text-3xl mb-2">{plot.icon}</div>
                            <h4 className="font-bold text-gray-800">{plot.name}</h4>
                            <p className="text-sm text-gray-600">{plot.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
