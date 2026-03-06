# 书籍创建与章节添加功能设计文档

> **日期**: 2026-03-06
> **状态**: 待确认

---

## 一、需求概述

### 需求1：创建书籍

用户点击创建书籍后：
1. 填入书籍名称
2. 选择书籍类型（儿童探险、魔法世界、都市职场、机械帝国）
3. 系统初始化随机分配卡牌：
   - 2个角色（第一个自动设为主角）
   - 2个天气
   - 2个冒险类型
   - 2个地形
   - 2个装备
4. 跳转到书籍详情页，显示初始化的卡牌

### 需求2：添加章节

1. 跳转到故事导演页
2. 选择卡牌：
   - 最多4个角色（主角必须选择）
   - 1个天气、1个冒险类型、1个地形、1个装备
3. 点击"开拍"，生成假数据章节
4. 跳转回书籍详情页，目录显示新章节
5. 阅读章节内容，回答谜题
6. 答对后随机解锁一张新卡牌

---

## 二、数据库设计

### 2.1 新增表：`book_unlocked_elements`

追踪每本书籍已获得的卡牌：

```sql
CREATE TABLE IF NOT EXISTS book_unlocked_elements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id TEXT NOT NULL,
  element_id TEXT NOT NULL,        -- 卡牌ID
  element_type TEXT NOT NULL,      -- 类型：'character', 'weather', 'terrain', 'equipment', 'adventure'
  unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, element_id)
)
```

### 2.2 修改表：`chapters`

新增字段存储谜题答题结果：

```sql
ALTER TABLE chapters ADD COLUMN puzzle_result INTEGER DEFAULT NULL;
-- puzzle_result: NULL=未答, 0=答错, 1=答对
```

### 2.3 预设书籍初始化规则

预设书籍（books.json中的书籍）在seed时：
- 自动将该书籍类型下的所有卡牌插入 `book_unlocked_elements`
- 表示预设书籍默认获得全部卡牌

---

## 三、类型定义

### 3.1 Chapter 接口扩展

```typescript
interface Chapter {
  chapterId: string;
  bookId: string;
  chapterNumber: number;
  title: string;              // 不包含"第X章"，如"新的冒险"
  content: string;
  wordCount?: number;
  hasPuzzle: boolean;
  puzzleQuestion?: string;
  puzzleOptions?: string[];
  puzzleCorrectIndex?: number;
  characterIds?: string[];
  puzzleResult?: number;      // 新增：NULL=未答, 0=答错, 1=答对
}
```

### 3.2 UnlockedElement 接口

```typescript
interface UnlockedElement {
  id: number;
  bookId: string;
  elementId: string;
  elementType: 'character' | 'weather' | 'terrain' | 'equipment' | 'adventure';
  unlockedAt: string;
}
```

---

## 四、DatabaseService 新增方法

```typescript
// 创建用户书籍（含随机卡牌初始化）
async createBook(params: {
  title: string;
  typeId: string;
}): Promise<Book>

// 获取书籍已解锁的卡牌
async getUnlockedElements(bookId: string, elementType?: string): Promise<UnlockedElement[]>

// 解锁新卡牌
async unlockElement(bookId: string, elementId: string, elementType: string): Promise<void>

// 获取书籍未解锁的卡牌池
async getLockedElements(bookId: string, typeId: string): Promise<{
  characters: Character[];
  weathers: PlotElement[];
  terrains: PlotElement[];
  equipments: PlotElement[];
  adventures: PlotElement[];
}>

// 添加章节
async addChapter(bookId: string, chapter: Omit<Chapter, 'chapterId' | 'chapterNumber'>): Promise<Chapter>

// 更新谜题结果
async updatePuzzleResult(chapterId: string, result: number): Promise<void>
```

---

## 五、需求1：创建书籍 - 详细流程

### 5.1 流程图

```
点击"新建"按钮
    ↓
弹出创建Modal
    ↓
输入书籍名称 + 选择书籍类型（下拉选择器）
    ↓
点击"创建"
    ↓
【后端逻辑】
1. 创建书籍记录 (is_user_created = 1)
2. 随机抽取卡牌：
   - 从该类型角色中随机抽取2个，第一个设为主角
   - 从该类型天气中随机抽取2个
   - 从该类型冒险类型中随机抽取2个
   - 从该类型地形中随机抽取2个
   - 从该类型装备中随机抽取2个
3. 将抽取的卡牌写入 book_unlocked_elements
4. 将角色写入 book_characters
    ↓
跳转到书籍详情页
    ↓
显示初始化的卡牌
```

### 5.2 UI修改 - BookshelfDemo.tsx

创建Modal新增书籍类型选择器：

```tsx
// 新增状态
const [selectedTypeId, setSelectedTypeId] = useState<string>('children');

// Modal中新增类型选择
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {bookTypes.map(type => (
    <TouchableOpacity
      key={type.typeId}
      style={[
        styles.typeOption,
        selectedTypeId === type.typeId && styles.typeOptionSelected,
        { borderColor: type.primaryColor }
      ]}
      onPress={() => setSelectedTypeId(type.typeId)}
    >
      <Text style={styles.typeEmoji}>{type.typeEmoji}</Text>
      <Text style={styles.typeName}>{type.typeName}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

---

## 六、需求2：添加章节 - 详细流程

### 6.1 流程图

```
书籍详情页 → 点击"添加章节"
    ↓
跳转到故事导演页
    ↓
【选择阶段】
- 选择角色（最多4个，主角必须选择）
  └─ 来源：book_unlocked_elements 中 element_type='character'
- 选择天气（1个）
  └─ 来源：book_unlocked_elements 中 element_type='weather'
- 选择冒险类型（1个）
  └─ 来源：book_unlocked_elements 中 element_type='adventure'
- 选择地形（1个）
  └─ 来源：book_unlocked_elements 中 element_type='terrain'
- 选择装备（1个）
  └─ 来源：book_unlocked_elements 中 element_type='equipment'
    ↓
点击"开拍"
    ↓
【生成章节】（假数据）
1. 组装提示词（选择的卡牌信息）
2. 返回假数据
3. 写入 chapters 表（chapter_number = 当前章节数 + 1）
    ↓
跳转回书籍详情页
    ↓
目录显示新章节
    ↓
点击章节 → 查看内容 + 谜题
    ↓
回答谜题
    ↓
【答题结果处理】
- 记录 puzzle_result 到数据库
- 如果答对：
  1. 查询这本书未获得的卡牌池
  2. 随机抽取1张
  3. 插入 book_unlocked_elements
  4. 弹窗提示获得新卡牌
    ↓
书籍详情页的角色Tab/情节Tab更新显示
```

### 6.2 假数据生成逻辑

```typescript
const generateFakeChapter = (
  chapterNumber: number,
  selectedCards: {
    characters: Character[];
    weather: PlotElement;
    terrain: PlotElement;
    equipment: PlotElement;
    adventure: PlotElement;
  }
): Chapter => {
  const charNames = selectedCards.characters.map(c => c.name).join('、');
  
  return {
    chapterId: `chapter-${Date.now()}`,
    bookId: '',
    chapterNumber,
    title: '新的冒险',  // 不包含"第X章"
    content: `【提示词调试信息】
角色：${charNames}
天气：${selectedCards.weather.name}${selectedCards.weather.emoji}
地形：${selectedCards.terrain.name}${selectedCards.terrain.emoji}
装备：${selectedCards.equipment.name}${selectedCards.equipment.emoji}
冒险类型：${selectedCards.adventure.name}${selectedCards.adventure.emoji}

【故事内容】
${selectedCards.characters[0]?.name || '勇者'}和伙伴们来到了${selectedCards.terrain.name}。
天空${selectedCards.weather.name}，${selectedCards.characters[1]?.name || '伙伴'}拿出了${selectedCards.equipment.name}。
这是一场${selectedCards.adventure.name}的开始...`,
    hasPuzzle: true,
    puzzleQuestion: '接下来会发生什么？',
    puzzleOptions: ['继续前进', '原地休息', '寻找帮助', '返回出发地'],
    puzzleCorrectIndex: 0,
    characterIds: selectedCards.characters.map(c => c.characterId),
  };
};
```

### 6.3 UI修改 - StoryDirectorDemo.tsx

1. 卡牌选择范围改为从已解锁卡牌中获取
2. 开拍按钮生成假数据并写入数据库
3. 生成成功后返回书籍详情页

### 6.4 UI修改 - BookDetailDemo.tsx

1. 角色/情节Tab只显示已解锁卡牌
2. 答题后弹窗显示获得新卡牌
3. 目录显示格式：`第{chapterNumber}章 {title}`

---

## 七、UI组件修改清单

| 组件 | 修改内容 |
|------|----------|
| **BookshelfDemo.tsx** | 创建Modal新增书籍类型选择器 |
| **BookDetailDemo.tsx** | 1. 角色/情节Tab只显示已解锁卡牌<br>2. 答题后弹窗显示获得新卡牌<br>3. 目录显示格式调整 |
| **StoryDirectorDemo.tsx** | 1. 卡牌选择范围改为已解锁<br>2. 开拍按钮生成假数据并写入数据库<br>3. 生成成功后返回书籍详情页 |
| **DatabaseService.ts** | 新增多个方法（见第四节） |
| **DataContext.tsx** | 新增相关数据获取方法 |

---

## 八、关键决策记录

| 问题 | 决策 |
|------|------|
| 卡牌选择范围 | 角色从已解锁中选择；天气/地形/装备/冒险类型从已解锁中选择 |
| 主角确定 | 初始化时自动指定第一个角色为主角 |
| 解锁时机 | 答对谜题后立即解锁 |
| 解锁来源池 | 从未获得的所有类型卡牌中随机抽取 |
| 全部解锁后 | 不再奖励新卡牌 |
| 章节标题 | 不包含"第X章"，由UI层根据chapterNumber动态显示 |
| 提示词存储 | 合并在文本内容中，用于调试 |

---

## 九、测试要点

1. **创建书籍**
   - 选择不同类型，验证初始化卡牌来自对应类型
   - 验证主角正确设置
   - 验证跳转到详情页后卡牌正确显示

2. **添加章节**
   - 验证角色选择范围是已解锁的角色
   - 验证必须选择主角
   - 验证章节正确写入数据库
   - 验证章节号自增

3. **答题解锁**
   - 验证答对后解锁新卡牌
   - 验证解锁的卡牌来自未获得池
   - 验证全部解锁后不再奖励
   - 验证新卡牌在Tab中正确显示

---

## 十、待确认事项

- [x] 设计方案已确认
- [ ] 等待开始实现指令
