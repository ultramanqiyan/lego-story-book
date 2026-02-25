import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';
import { getRandomPlotSelection, buildPlotPrompt } from './plot-options.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const DOUBAO_MODEL = 'doubao-1-5-pro-32k-250115';

const PUZZLE_TYPES = [
  {
    type: 'pattern',
    prompt: '【规律推理模式】\n在故事中设置一个规律推理谜题：\n' +
      '场景：遇到神秘符号、密码锁、图案排列等\n' +
      '问题：找出规律并选择正确答案\n' +
      '选项：4个选项（A/B/C/D），每个选项1-5个字\n' +
      '难度：适合10-12岁儿童，基于观察和逻辑\n' +
      '重要：必须创作全新的、原创的规律谜题，禁止使用常见示例'
  },
  {
    type: 'riddle',
    prompt: '【谜语模式】\n在故事中设置一个谜语谜题：\n' +
      '场景：遇到守门人、神秘生物出谜语\n' +
      '问题：一个有趣的谜语\n' +
      '选项：4个选项（A/B/C/D），每个选项1-5个字\n' +
      '难度：适合10-12岁儿童，富有趣味性\n' +
      '重要：必须创作全新的、原创的谜语，禁止使用"越洗越脏"、"有头没有脚"等常见谜语'
  },
  {
    type: 'knowledge',
    prompt: '【生活常识模式】\n在故事中设置一个生活常识谜题：\n' +
      '场景：遇到物品分类、找不同、常识判断等\n' +
      '问题：找出不同类或回答常识问题\n' +
      '选项：4个选项（A/B/C/D），每个选项1-5个字\n' +
      '难度：适合10-12岁儿童，基于观察和常识\n' +
      '重要：必须创作全新的、原创的常识问题，禁止使用常见示例'
  }
];

function getApiKey(env) {
  return env.DOUBAO_API_KEY || 'ee51832f-f233-45ec-9262-00e1d2a66ba1';
}

function getRandomPuzzleType() {
  return PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)];
}

function buildCharacterInfo(characters) {
  return characters.map(function(c, index) {
    return '  "角色' + (index + 1) + '": {\n' +
      '    "自定义名称": "' + c.custom_name + '",\n' +
      '    "原始名称": "' + (c.original_name || c.name || '未知') + '",\n' +
      '    "性格": "' + (c.personality || '神秘') + '",\n' +
      '    "说话方式": "' + (c.speaking_style || '正常') + '"\n' +
      '  }';
  }).join(',\n');
}

function buildStoryPrompt(characters, previousSummary, previousPuzzle, plotSelection) {
  var characterInfo = buildCharacterInfo(characters);
  var puzzleType = getRandomPuzzleType();
  
  var prompt = '你是一个儿童故事作家，正在创作一个连续的乐高主题故事。\n\n';
  
  prompt += '【书籍角色】\n{\n' + characterInfo + '\n}\n\n';
  
  if (previousSummary) {
    prompt += '【前情提要】\n' + previousSummary + '\n\n';
  }
  
  if (previousPuzzle) {
    prompt += '【上一章谜题回顾】\n';
    prompt += '谜题问题：' + previousPuzzle.question + '\n';
    prompt += '正确答案：' + previousPuzzle.answer + '\n';
    prompt += '用户答对了，故事可以继续发展。\n\n';
  }
  
  if (plotSelection) {
    prompt += buildPlotPrompt(plotSelection);
  }
  
  prompt += '【故事要求】\n';
  prompt += '1. 故事长度：100字\n';
  prompt += '2. 故事风格：乐高积木世界，充满想象力和冒险\n';
  prompt += '3. 使用所有角色，让每个角色都有出场机会\n';
  prompt += '4. 故事要连贯、有趣，适合10-12岁儿童\n';
  prompt += '5. 结尾要留有悬念，为下一章做铺垫\n\n';
  
  prompt += '【谜题要求】\n';
  prompt += puzzleType.prompt + '\n\n';
  
  prompt += '请以JSON格式返回：\n';
  prompt += '{\n';
  prompt += '  "title": "章节标题（简短有力，5-10字）",\n';
  prompt += '  "content": "故事内容",\n';
  prompt += '  "puzzle": {\n';
  prompt += '    "question": "谜题问题",\n';
  prompt += '    "options": ["选项A", "选项B", "选项C", "选项D"],\n';
  prompt += '    "answer": "正确答案（A/B/C/D）",\n';
  prompt += '    "hint": "提示（可选）",\n';
  prompt += '    "type": "' + puzzleType.type + '"\n';
  prompt += '  }\n';
  prompt += '}\n';
  
  return prompt;
}

function parseAIResponse(message) {
  try {
    var content = message.content || '';
    var jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function onRequestPost(context) {
  try {
    var DB = context.env.DB;
    var url = new URL(context.request.url);
    var bookId = url.searchParams.get('bookId');
    
    if (!bookId) {
      return createErrorResponse('书籍ID不能为空', 400);
    }
    
    var body = await context.request.json();
    var userId = body.userId;
    var plotSelection = body.plotSelection || null;
    var selectedCharacterIds = body.characterIds || [];
    
    if (!plotSelection) {
      plotSelection = getRandomPlotSelection();
    }
    
    var book = await DB.prepare('SELECT * FROM books WHERE book_id = ?').bind(bookId).first();
    if (!book) {
      return createErrorResponse('书籍不存在', 404);
    }
    
    var chapterCount = await DB.prepare('SELECT COUNT(*) as count FROM chapters WHERE book_id = ?').bind(bookId).first();
    if (chapterCount.count >= 100) {
      return createErrorResponse('单本书籍最多100章', 400);
    }
    
    var characters = await DB.prepare(
      'SELECT bc.*, c.name as original_name, c.personality, c.speaking_style ' +
      'FROM book_characters bc ' +
      'LEFT JOIN characters c ON bc.character_id = c.character_id ' +
      'WHERE bc.book_id = ?'
    ).bind(bookId).all();
    
    if (!characters.results || characters.results.length === 0) {
      return createErrorResponse('请先添加角色', 400);
    }
    
    if (selectedCharacterIds.length > 0) {
      characters.results = characters.results.filter(function(c) {
        return selectedCharacterIds.indexOf(c.character_id) !== -1;
      });
    }
    
    var previousSummary = null;
    var previousPuzzle = null;
    
    if (chapterCount.count > 0) {
      var lastChapter = await DB.prepare(
        'SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number DESC LIMIT 1'
      ).bind(bookId).first();
      
      if (lastChapter) {
        previousSummary = lastChapter.content.substring(0, 300);
        
        if (lastChapter.has_puzzle) {
          var puzzle = await DB.prepare(
            'SELECT * FROM puzzles WHERE chapter_id = ?'
          ).bind(lastChapter.chapter_id).first();
          
          if (puzzle) {
            previousPuzzle = {
              question: puzzle.question,
              answer: puzzle.answer
            };
          }
        }
      }
    }
    
    var prompt = buildStoryPrompt(characters.results, previousSummary, previousPuzzle, plotSelection);
    
    var response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey(context.env)
      },
      body: JSON.stringify({
        model: DOUBAO_MODEL,
        messages: [
          { role: 'system', content: '你是一个专业的儿童故事作家，擅长创作有趣、教育意义的乐高主题故事。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      return createErrorResponse('AI服务暂时不可用', 500);
    }
    
    var aiResult = await response.json();
    var storyData = parseAIResponse(aiResult.choices[0].message);
    
    if (!storyData) {
      return createErrorResponse('AI返回格式错误', 500);
    }
    
    var chapterId = generateId();
    var chapterNumber = chapterCount.count + 1;
    var now = new Date().toISOString();
    var hasPuzzle = storyData.puzzle ? 1 : 0;
    
    await DB.prepare(
      'INSERT INTO chapters (chapter_id, book_id, chapter_number, title, content, has_puzzle, created_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(chapterId, bookId, chapterNumber, storyData.title || '第' + chapterNumber + '章', storyData.content, hasPuzzle, now).run();
    
    await DB.prepare(
      'UPDATE books SET chapter_count = chapter_count + 1, updated_at = ? WHERE book_id = ?'
    ).bind(now, bookId).run();
    
    if (storyData.puzzle) {
      var puzzleId = generateId();
      await DB.prepare(
        'INSERT INTO puzzles (puzzle_id, chapter_id, question, options, answer, hint, puzzle_type, created_at) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        puzzleId, chapterId, storyData.puzzle.question,
        JSON.stringify(storyData.puzzle.options),
        storyData.puzzle.answer, storyData.puzzle.hint || null,
        storyData.puzzle.type || 'pattern', now
      ).run();
    }
    
    return createSuccessResponse({
      chapterId: chapterId,
      chapterNumber: chapterNumber,
      title: storyData.title,
      hasPuzzle: hasPuzzle,
      prompt: prompt,
      message: '章节生成成功'
    });
  } catch (error) {
    return createErrorResponse('生成章节失败: ' + error.message, 500);
  }
}
