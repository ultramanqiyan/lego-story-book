import { createChapter, getChapterById, getBookChapters, getNextChapterNumber } from '../../src/lib/db/chapter.js'
import { getBookById, updateBookChapterCount } from '../../src/lib/db/book.js'
import { getCharacterById } from '../../src/lib/db/character.js'

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

const STORY_TEMPLATES = [
    {
        title: '冒险开始',
        content: '在乐高小镇的边缘，{protagonist}站在高高的塔楼上，眺望着远方。今天，一个全新的冒险即将开始。{protagonist}深吸一口气，准备踏上未知的旅程。'
    },
    {
        title: '神秘发现',
        content: '{protagonist}在森林深处发现了一个神秘的洞穴。洞穴入口闪烁着奇异的光芒，仿佛在召唤着勇敢的探险者。{protagonist}决定一探究竟。'
    },
    {
        title: '友谊的力量',
        content: '在困难面前，{protagonist}并不孤单。{supporting}及时出现，带来了希望和力量。他们携手并肩，共同面对挑战。'
    },
    {
        title: '勇气的考验',
        content: '面对可怕的{villain}，{protagonist}没有退缩。勇气在心中燃烧，{protagonist}知道自己必须保护这个美丽的世界。'
    }
]

const PLOT_TEMPLATES = {
    '冒险之旅': '踏上未知的冒险旅程',
    '神秘谜团': '发现并解开神秘的谜题',
    '友谊考验': '经历友谊的考验与成长',
    '英雄救美': '勇敢地拯救被困的人',
    '寻宝探险': '寻找传说中的珍贵宝藏',
    '魔法奇遇': '遇到神奇的魔法力量',
    '太空冒险': '展开星际探索之旅',
    '竞技比赛': '参加激烈的竞技比赛'
}

async function generateStoryWithAI(characters, plot, previousChapters, apiKey) {
    const prompt = buildPrompt(characters, plot, previousChapters)
    
    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'doubao-1-5-pro-32k-250115',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个儿童故事作家，专门创作适合6-12岁儿童阅读的乐高主题故事。故事要充满想象力、轻松有趣，每个故事100-200字。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500
            })
        })
        
        if (!response.ok) {
            throw new Error('API调用失败')
        }
        
        const data = await response.json()
        const content = data.choices[0].message.content
        
        const titleMatch = content.match(/【(.+?)】/)
        const title = titleMatch ? titleMatch[1] : '新章节'
        const storyContent = content.replace(/【.+?】/, '').trim()
        
        return { title, content: storyContent }
    } catch (error) {
        console.error('AI generation error:', error)
        return null
    }
}

function buildPrompt(characters, plot, previousChapters) {
    let prompt = `请创作一个乐高主题的儿童故事章节。

角色信息：
`
    
    characters.forEach(char => {
        prompt += `- ${char.nickname || char.name}（${char.role === 'protagonist' ? '主角' : char.role === 'supporting' ? '配角' : char.role === 'villain' ? '反派' : '路人'}）\n`
    })
    
    prompt += `\n情节：${PLOT_TEMPLATES[plot] || plot}\n`
    
    if (previousChapters && previousChapters.length > 0) {
        prompt += `\n前情提要：\n`
        previousChapters.forEach(ch => {
            prompt += `第${ch.chapter_number}章：${ch.title} - ${ch.content.substring(0, 50)}...\n`
        })
    }
    
    prompt += `\n请以【章节标题】开头，然后写故事内容。故事要100-200字。`
    
    return prompt
}

function generateMockStory(characters, plot, chapterNumber) {
    const protagonist = characters.find(c => c.role === 'protagonist')
    const supporting = characters.find(c => c.role === 'supporting')
    const villain = characters.find(c => c.role === 'villain')
    
    const template = STORY_TEMPLATES[chapterNumber % STORY_TEMPLATES.length]
    
    let content = template.content
        .replace(/{protagonist}/g, protagonist?.nickname || protagonist?.name || '英雄')
        .replace(/{supporting}/g, supporting?.nickname || supporting?.name || '朋友')
        .replace(/{villain}/g, villain?.nickname || villain?.name || '敌人')
    
    return {
        title: template.title,
        content
    }
}

export async function onRequestGet(context) {
    const url = new URL(context.request.url)
    const action = url.searchParams.get('action')
    
    try {
        if (action === 'detail') {
            const id = url.searchParams.get('id')
            if (!id) {
                return new Response(JSON.stringify({ success: false, error: '缺少id' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const chapter = await getChapterById(context.env.DB, id)
            if (!chapter) {
                return new Response(JSON.stringify({ success: false, error: '章节不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            return new Response(JSON.stringify({
                success: true,
                chapter: {
                    id: chapter.id,
                    book_id: chapter.book_id,
                    chapter_number: chapter.chapter_number,
                    title: chapter.title,
                    content: chapter.content,
                    characters: chapter.characters,
                    plot: chapter.plot
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
        console.error('Chapter API error:', error)
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
        if (action === 'generate') {
            const userId = getUserIdFromToken(context.request)
            if (!userId) {
                return new Response(JSON.stringify({ success: false, error: '未授权' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const body = await context.request.json()
            const { book_id, characters, plot, previous_chapters } = body
            
            if (!book_id) {
                return new Response(JSON.stringify({ success: false, error: '缺少书籍ID' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!characters || characters.length === 0) {
                return new Response(JSON.stringify({ success: false, error: '请至少选择一个角色' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const hasProtagonist = characters.some(c => c.role === 'protagonist')
            if (!hasProtagonist) {
                return new Response(JSON.stringify({ success: false, error: '必须选择一个主角' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            if (!plot || plot.trim().length === 0) {
                return new Response(JSON.stringify({ success: false, error: '请选择或输入情节' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const book = await getBookById(context.env.DB, book_id)
            if (!book) {
                return new Response(JSON.stringify({ success: false, error: '书籍不存在' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            
            const chapterNumber = await getNextChapterNumber(context.env.DB, book_id)
            
            let story
            const apiKey = context.env.DOUBAO_API_KEY || 'ee51832f-f233-45ec-9262-00e1d2a66ba1'
            
            if (body.simulate_failure) {
                story = null
            } else {
                story = await generateStoryWithAI(characters, plot, previous_chapters || [], apiKey)
            }
            
            if (!story) {
                story = generateMockStory(characters, plot, chapterNumber)
            }
            
            const chapter = await createChapter(context.env.DB, {
                book_id,
                chapter_number: chapterNumber,
                title: story.title,
                content: story.content,
                characters: characters,
                plot
            })
            
            await updateBookChapterCount(context.env.DB, book_id)
            
            return new Response(JSON.stringify({
                success: true,
                chapter: {
                    id: chapter.id,
                    chapter_number: chapter.chapter_number,
                    title: chapter.title,
                    content: chapter.content
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
        console.error('Chapter API error:', error)
        return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
