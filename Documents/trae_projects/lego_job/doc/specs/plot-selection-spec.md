# 情节选择功能规格说明书

## 1. 功能概述

### 1.1 背景
现有添加章节功能只可以选择角色，但不能选择情节。为了增加故事创作的多样性和用户参与度，新增情节选择功能。

### 1.2 目标
- 允许用户在生成新章节时选择预设情节
- 将用户选择的情节信息传递给大模型，影响故事生成
- 不影响现有功能，保持向后兼容

## 2. 情节维度设计

### 2.1 天气维度（Weather）
| 序号 | 选项 | 描述 |
|------|------|------|
| 1 | 晴天 | 阳光明媚，适合户外冒险 |
| 2 | 下雨 | 雨水淅沥，需要寻找避雨处 |
| 3 | 打雷 | 雷声轰鸣，充满紧张气氛 |
| 4 | 下雪 | 白雪皑皑，银装素裹的世界 |
| 5 | 大雾 | 迷雾重重，能见度很低 |
| 6 | 狂风 | 狂风呼啸，考验勇气 |
| 7 | 彩虹 | 彩虹横跨，充满希望 |
| 8 | 星夜 | 繁星点点，神秘浪漫 |

### 2.2 冒险类型维度（Adventure Type）
| 序号 | 选项 | 描述 |
|------|------|------|
| 1 | 友谊考验 | 测试角色之间的友情 |
| 2 | 冒险之旅 | 充满未知的探索旅程 |
| 3 | 智慧挑战 | 需要动脑筋解决问题 |
| 4 | 勇气试炼 | 面对恐惧，勇敢前行 |
| 5 | 寻宝探险 | 寻找隐藏的宝藏 |
| 6 | 救援任务 | 拯救被困的朋友 |
| 7 | 神秘探索 | 探索未知的秘密 |
| 8 | 竞技比赛 | 参加激烈的比赛 |

### 2.3 地形选择维度（Terrain）
| 序号 | 选项 | 描述 |
|------|------|------|
| 1 | 森林 | 茂密的树林，充满生机 |
| 2 | 城堡 | 宏伟的城堡，神秘莫测 |
| 3 | 海洋 | 广阔的海洋，深不可测 |
| 4 | 沙漠 | 干燥的沙漠，考验耐力 |
| 5 | 山峰 | 高耸的山峰，挑战极限 |
| 6 | 冰川 | 寒冷的冰川，晶莹剔透 |
| 7 | 火山 | 活跃的火山，危险刺激 |
| 8 | 城市 | 繁华的城市，人来人往 |

### 2.4 装备与道具维度（Equipment）
| 序号 | 选项 | 描述 |
|------|------|------|
| 1 | 魔法杖 | 拥有神奇魔力的法杖 |
| 2 | 盾牌 | 坚固的防御装备 |
| 3 | 地图 | 指引方向的神秘地图 |
| 4 | 望远镜 | 观察远方的工具 |
| 5 | 宝剑 | 锋利的战斗武器 |
| 6 | 药水 | 神奇的治愈药水 |
| 7 | 飞行器 | 可以飞行的交通工具 |
| 8 | 隐身斗篷 | 可以隐身的神奇斗篷 |

## 3. 数据结构设计

### 3.1 前端数据结构
```javascript
const PLOT_OPTIONS = {
  weather: [
    { id: 'sunny', name: '晴天', icon: '☀️', description: '阳光明媚，适合户外冒险' },
    { id: 'rainy', name: '下雨', icon: '🌧️', description: '雨水淅沥，需要寻找避雨处' },
    { id: 'thunder', name: '打雷', icon: '⛈️', description: '雷声轰鸣，充满紧张气氛' },
    { id: 'snow', name: '下雪', icon: '❄️', description: '白雪皑皑，银装素裹的世界' },
    { id: 'fog', name: '大雾', icon: '🌫️', description: '迷雾重重，能见度很低' },
    { id: 'wind', name: '狂风', icon: '💨', description: '狂风呼啸，考验勇气' },
    { id: 'rainbow', name: '彩虹', icon: '🌈', description: '彩虹横跨，充满希望' },
    { id: 'starry', name: '星夜', icon: '🌟', description: '繁星点点，神秘浪漫' }
  ],
  adventureType: [
    { id: 'friendship', name: '友谊考验', icon: '🤝', description: '测试角色之间的友情' },
    { id: 'adventure', name: '冒险之旅', icon: '🗺️', description: '充满未知的探索旅程' },
    { id: 'wisdom', name: '智慧挑战', icon: '🧠', description: '需要动脑筋解决问题' },
    { id: 'courage', name: '勇气试炼', icon: '💪', description: '面对恐惧，勇敢前行' },
    { id: 'treasure', name: '寻宝探险', icon: '💎', description: '寻找隐藏的宝藏' },
    { id: 'rescue', name: '救援任务', icon: '🦸', description: '拯救被困的朋友' },
    { id: 'mystery', name: '神秘探索', icon: '🔮', description: '探索未知的秘密' },
    { id: 'competition', name: '竞技比赛', icon: '🏆', description: '参加激烈的比赛' }
  ],
  terrain: [
    { id: 'forest', name: '森林', icon: '🌲', description: '茂密的树林，充满生机' },
    { id: 'castle', name: '城堡', icon: '🏰', description: '宏伟的城堡，神秘莫测' },
    { id: 'ocean', name: '海洋', icon: '🌊', description: '广阔的海洋，深不可测' },
    { id: 'desert', name: '沙漠', icon: '🏜️', description: '干燥的沙漠，考验耐力' },
    { id: 'mountain', name: '山峰', icon: '⛰️', description: '高耸的山峰，挑战极限' },
    { id: 'glacier', name: '冰川', icon: '🧊', description: '寒冷的冰川，晶莹剔透' },
    { id: 'volcano', name: '火山', icon: '🌋', description: '活跃的火山，危险刺激' },
    { id: 'city', name: '城市', icon: '🏙️', description: '繁华的城市，人来人往' }
  ],
  equipment: [
    { id: 'wand', name: '魔法杖', icon: '🪄', description: '拥有神奇魔力的法杖' },
    { id: 'shield', name: '盾牌', icon: '🛡️', description: '坚固的防御装备' },
    { id: 'map', name: '地图', icon: '🗺️', description: '指引方向的神秘地图' },
    { id: 'telescope', name: '望远镜', icon: '🔭', description: '观察远方的工具' },
    { id: 'sword', name: '宝剑', icon: '⚔️', description: '锋利的战斗武器' },
    { id: 'potion', name: '药水', icon: '🧪', description: '神奇的治愈药水' },
    { id: 'flyer', name: '飞行器', icon: '🚀', description: '可以飞行的交通工具' },
    { id: 'cloak', name: '隐身斗篷', icon: '🧥', description: '可以隐身的神奇斗篷' }
  ]
};
```

### 3.2 API 请求参数
```javascript
// POST /chapters-generate/books/{bookId}
{
  userId: string,
  plotSelection: {
    weather: string,      // 天气选项ID，如 'sunny'
    adventureType: string, // 冒险类型ID，如 'adventure'
    terrain: string,       // 地形ID，如 'forest'
    equipment: string      // 装备ID，如 'wand'
  }
}
```

### 3.3 数据库存储
在 books 表中新增字段存储情节选择：
```sql
ALTER TABLE books ADD COLUMN plot_selection TEXT;
-- 存储格式：JSON字符串
-- 示例：'{"weather":"sunny","adventureType":"adventure","terrain":"forest","equipment":"wand"}'
```

## 4. 用户界面设计

### 4.1 情节选择弹窗
在章节页面点击"继续生成故事"按钮时，弹出情节选择弹窗：

```
┌─────────────────────────────────────────┐
│           🎭 选择故事情节                │
├─────────────────────────────────────────┤
│                                         │
│  ☀️ 天气                                 │
│  [晴天] [下雨] [打雷] [下雪]             │
│  [大雾] [狂风] [彩虹] [星夜]             │
│                                         │
│  🗺️ 冒险类型                             │
│  [友谊考验] [冒险之旅] [智慧挑战] [勇气试炼] │
│  [寻宝探险] [救援任务] [神秘探索] [竞技比赛] │
│                                         │
│  🌲 地形                                 │
│  [森林] [城堡] [海洋] [沙漠]             │
│  [山峰] [冰川] [火山] [城市]             │
│                                         │
│  🪄 装备与道具                           │
│  [魔法杖] [盾牌] [地图] [望远镜]          │
│  [宝剑] [药水] [飞行器] [隐身斗篷]        │
│                                         │
│  [随机选择]          [确认生成]          │
└─────────────────────────────────────────┘
```

### 4.2 交互流程
1. 用户点击"继续生成故事"按钮
2. 弹出情节选择弹窗（可跳过，使用随机选择）
3. 用户选择各维度的情节选项
4. 点击"确认生成"按钮
5. 将选择传递给API生成章节

## 5. API 修改设计

### 5.1 chapters-generate.js 修改

#### 5.1.1 接收情节参数
```javascript
export async function onRequestPost(context) {
  const { bookId } = context.params;
  const body = await context.request.json();
  const { userId, plotSelection } = body;
  
  // plotSelection 结构：
  // {
  //   weather: 'sunny',
  //   adventureType: 'adventure',
  //   terrain: 'forest',
  //   equipment: 'wand'
  // }
  
  // ... 现有逻辑
}
```

#### 5.1.2 构建提示词
```javascript
function buildStoryPrompt(characters, previousSummary, previousPuzzle, plotSelection) {
  var prompt = '你是一个儿童故事作家，正在创作一个连续的乐高主题故事。\n\n';
  
  // ... 现有角色信息
  
  // 新增：情节选择信息
  if (plotSelection) {
    prompt += '【情节设定】\n';
    prompt += '天气：' + getPlotName('weather', plotSelection.weather) + '\n';
    prompt += '冒险类型：' + getPlotName('adventureType', plotSelection.adventureType) + '\n';
    prompt += '地形：' + getPlotName('terrain', plotSelection.terrain) + '\n';
    prompt += '装备：' + getPlotName('equipment', plotSelection.equipment) + '\n\n';
    
    prompt += '请根据以上情节设定创作故事，让天气、冒险类型、地形和装备自然融入故事中。\n\n';
  }
  
  // ... 现有故事要求
}
```

### 5.2 books.js 修改

#### 5.2.1 保存情节选择
```javascript
// 在创建书籍时保存情节选择
if (plotSelection) {
  await DB.prepare(
    'UPDATE books SET plot_selection = ? WHERE book_id = ?'
  ).bind(JSON.stringify(plotSelection), bookId).run();
}
```

## 6. 向后兼容性

### 6.1 API 兼容
- plotSelection 参数可选，不传递时使用随机选择
- 现有不传递 plotSelection 的调用继续正常工作

### 6.2 数据库兼容
- 新增字段使用 ALTER TABLE，不影响现有数据
- 现有书籍的 plot_selection 字段为 NULL

### 6.3 前端兼容
- 情节选择弹窗可跳过
- 不选择时使用随机选择

## 7. 测试策略

### 7.1 单元测试
- 测试情节选项数据结构
- 测试提示词构建函数
- 测试随机选择逻辑

### 7.2 集成测试
- 测试 API 接收情节参数
- 测试数据库存储情节选择
- 测试大模型提示词包含情节信息

### 7.3 端到端测试
- 测试情节选择弹窗显示
- 测试情节选择后生成章节
- 测试跳过情节选择生成章节
- 测试情节信息显示在故事创作提示区域

## 8. 实现优先级

| 优先级 | 任务 | 预计工作量 |
|--------|------|-----------|
| P0 | 后端 API 接收情节参数 | 1小时 |
| P0 | 后端提示词构建修改 | 1小时 |
| P0 | 前端情节选择弹窗 | 2小时 |
| P1 | 数据库存储情节选择 | 0.5小时 |
| P1 | 情节信息显示优化 | 1小时 |
| P2 | 端到端测试补充 | 1小时 |

## 9. 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 大模型不理解情节设定 | 故事与选择不符 | 优化提示词，增加示例 |
| 用户不选择情节 | 功能闲置 | 提供随机选择，默认跳过 |
| 情节选项过多 | 用户困惑 | 分组展示，提供推荐 |

## 10. 验收标准

1. 用户可以在生成章节前选择情节
2. 选择的情节信息正确传递给大模型
3. 生成的故事包含选择的情节元素
4. 现有功能不受影响
5. 所有测试通过
