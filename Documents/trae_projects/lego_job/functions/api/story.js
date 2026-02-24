import { generateId, createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';
import { buildPlotPrompt } from './plot-options.js';

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

function shouldGeneratePuzzle() {
  return true;
}

function buildCharacterInfo(characters) {
  return characters.map((c, index) => {
    return '  "角色' + (index + 1) + '": {\n' +
      '    "自定义名称": "' + c.custom_name + '",\n' +
      '    "原始名称": "' + (c.original_name || '未知') + '",\n' +
      '    "性格": "' + (c.personality || '神秘') + '",\n' +
      '    "说话方式": "' + (c.speaking_style || '正常') + '"\n' +
      '  }';
  }).join(',\n');
}

function buildStoryPrompt(params) {
  const { characters, plot, previousSummary, chapterCharacters, generatePuzzle, puzzleType, previousPuzzle, plotSelection } = params;
  
  const characterInfo = buildCharacterInfo(characters);
  const chapterCharacterList = (chapterCharacters || characters).map(c => c.custom_name).join('、');
  
  let prompt = '你是一个儿童故事作家，正在创作一个连续的乐高主题故事。\n\n';
  
  prompt += '【书籍角色】\n{\n' + characterInfo + '\n}\n\n';
  
  if (previousSummary) {
    prompt += '【前情提要】\n' + previousSummary + '\n\n';
  }
  
  if (previousPuzzle) {
    prompt += '【上一章谜题回顾】\n';
    prompt += '谜题问题：' + previousPuzzle.question + '\n';
    prompt += '正确答案：' + previousPuzzle.answer + '\n';
    if (previousPuzzle.isCorrect) {
      prompt += '主角成功解开了谜题，继续前进。\n\n';
    } else {
      prompt += '主角答错了谜题，遇到了一些小困难，但仍然继续前进。\n\n';
    }
  }
  
  if (plotSelection) {
    prompt += buildPlotPrompt(plotSelection);
  }
  
  prompt += '【本章角色】\n' + chapterCharacterList + '\n\n';
  
  prompt += '【本章情节】\n' + plot + '\n\n';
  
  if (generatePuzzle && puzzleType) {
    prompt += '【解谜要求】\n' + puzzleType.prompt + '\n\n';
  }
  
  prompt += '请生成下一章故事（100-200字），要求：\n';
  prompt += '与前文情节连贯';
  if (previousPuzzle) {
    prompt += '，根据上一章谜题回顾主角答对还是答错谜题，生成对应的情节';
  }
  prompt += '\n';
  prompt += '使用角色的自定义名称（如"小蝙蝠"而非"乐高蝙蝠侠"）\n';
  prompt += '符合角色性格和说话方式\n';
  
  if (generatePuzzle) {
    prompt += '在关键节点（如遇到大门、遇到NPC、发现宝箱）设置谜题\n';
    const puzzleFormat = '{"title": "章节名称", "content": "故事内容", ' +
      '"puzzle": {"question": "谜题问题", "options": ["A. 选项1", "B. 选项2"], ' +
      '"answer": "B", "hint": "提示内容", "type": "' + puzzleType.type + '"}}\n';
    prompt += '返回JSON格式：' + puzzleFormat;
  } else {
    prompt += '返回JSON格式：{"title": "章节名称", "content": "故事内容", "puzzle": null}\n';
  }
  
  prompt += '\n章节名称要求：4-10个字，简短有力';
  
  return prompt;
}

function buildMessages(prompt) {
  return [
    { role: 'system', content: '你是一个专业的儿童故事作家。' },
    { role: 'user', content: prompt }
  ];
}

async function callDoubaoAPI(apiKey, messages) {
  const response = await fetch(DOUBAO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: DOUBAO_MODEL,
      messages: messages,
      max_tokens: 1500,
      temperature: 0.8
    })
  });
  
  return response;
}

function extractContent(responseData) {
  if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
    return { title: '新章节', content: '故事生成中，请稍后...', puzzle: null };
  }
  
  const content = responseData.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    if (parsed.title && parsed.content) {
      return {
        title: parsed.title,
        content: parsed.content,
        puzzle: parsed.puzzle || null
      };
    }
  } catch (e) {
    const titleMatch = content.match(/"title"\s*:\s*"([^"]+)"/);
    const contentMatch = content.match(/"content"\s*:\s*"([^"]+)"/);
    
    if (titleMatch && contentMatch) {
      return {
        title: titleMatch[1],
        content: contentMatch[1],
        puzzle: null
      };
    }
  }
  
  return { title: '新章节', content: content, puzzle: null };
}

function validateRequest(data) {
  if (!data.characters || !Array.isArray(data.characters) || data.characters.length === 0) {
    return createErrorResponse('请选择至少一个角色', 400);
  }
  
  if (!data.plot) {
    return createErrorResponse('请选择故事类型', 400);
  }
  
  return null;
}

async function generateStory(env, data) {
  const generatePuzzle = data.forcePuzzle !== undefined ? data.forcePuzzle : shouldGeneratePuzzle();
  const puzzleType = generatePuzzle ? getRandomPuzzleType() : null;
  
  const apiKey = getApiKey(env);
  const prompt = buildStoryPrompt({
    characters: data.characters,
    plot: data.plot,
    previousSummary: data.previousSummary,
    previousPuzzle: data.previousPuzzle,
    chapterCharacters: data.chapterCharacters,
    generatePuzzle,
    puzzleType,
    plotSelection: data.plotSelection
  });
  
  const messages = buildMessages(prompt);
  const response = await callDoubaoAPI(apiKey, messages);
  
  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg = errorData.error ? errorData.error.message : 'API调用失败';
    return { success: false, error: errorMsg };
  }
  
  const responseData = await response.json();
  const { title, content, puzzle } = extractContent(responseData);
  
  return {
    success: true,
    title,
    content,
    puzzle,
    prompt
  };
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    const validationError = validateRequest(data);
    if (validationError) return validationError;
    
    const result = await generateStory(context.env, data);
    
    if (!result.success) {
      return createErrorResponse(result.error, 500);
    }
    
    return createSuccessResponse(result);
  } catch (error) {
    return createErrorResponse('生成故事失败: ' + error.message, 500);
  }
}
