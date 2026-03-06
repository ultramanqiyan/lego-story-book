# 书籍详情页UI重构实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** 重构书籍详情页，实现目录视图与内容视图分离、角色/情节卡牌网格布局、扩充假数据展示翻页效果

**Architecture:** 保持现有组件结构，新增视图模式状态管理，重构三个Tab的渲染逻辑，实现分页算法

**Tech Stack:** React Native, TypeScript, Animated API, Appium E2E Testing

---

## Task 1: 扩充假数据

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:59-239`

**Step 1: 扩充章节数据到10章**

将FAKE_CHAPTERS从5章扩充到10章，包含短章节和长章节：

```typescript
const FAKE_CHAPTERS: Chapter[] = [
  {
    chapterId: 'ch-1',
    chapterNumber: 1,
    title: '神秘森林',
    content: `在神秘的森林深处，年轻的勇士阿尔法开始了他的冒险之旅。

古老的树木遮天蔽日，阳光只能透过枝叶的缝隙洒落，在地面上形成斑驳的光影。空气中弥漫着泥土和青草的芬芳，远处传来鸟儿清脆的鸣叫声。

勇士阿尔法紧握着手中的宝剑，警惕地观察着四周。法师贝塔跟在他身后，手中闪烁着微弱的魔法光芒。

"这里感觉有些不对劲，"阿尔法低声说道，"我们要小心。"

就在这时，前方的灌木丛突然晃动起来，一个黑影从里面窜了出来...`,
    wordCount: 150,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '森林中出现的黑影最可能是什么？',
      options: ['精灵', '魔兽', '迷路的旅人', '法师的幻象'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-2',
    chapterNumber: 2,
    title: '古老城堡',
    content: `穿过森林，一座古老的城堡出现在眼前。

城堡的墙壁上爬满了藤蔓，大门紧闭着。门上刻着神秘的符文，散发着微弱的光芒。守卫伽马站在城门口，手持长矛，神情严肃。

"要进入城堡，必须解开这道符文谜题，"守卫伽马说道，"只有真正的勇者才能通过。"

法师贝塔走上前去，仔细研究着门上的符文。"这是古老的魔法文字，"他喃喃自语，"我需要一些时间来解读..."

勇士阿尔法环顾四周，发现城堡周围还有一些奇怪的雕像，它们似乎在注视着每一个来访者。雕像的眼睛闪烁着诡异的光芒，仿佛在守护着某种古老的秘密。

"这些雕像看起来不简单，"阿尔法低声说道，"我们要小心。"

贝塔点点头，开始集中精神解读符文。随着时间的推移，符文的光芒越来越亮，最终发出一声清脆的响声，大门缓缓打开。

"成功了！"贝塔兴奋地说道。

阿尔法深吸一口气，握紧了手中的宝剑。他们踏入了城堡的大门，迎接他们的将是未知的挑战...

城堡内部昏暗而神秘，走廊两侧挂满了古老的画像，每一幅画像都讲述着一个传奇故事。他们小心翼翼地前进，生怕惊动了沉睡的守护者。

突然，一阵阴风吹过，画像中的人物似乎都在注视着他们...`,
    wordCount: 500,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2', 'char-4'],
    puzzle: {
      question: '城堡大门上的符文代表什么元素？',
      options: ['火焰', '水流', '大地', '风暴'],
      correctIndex: 2,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-3',
    chapterNumber: 3,
    title: '深海领域',
    content: `城堡的地下通道通向一片神秘的地下海洋。

幽蓝色的光芒从水中透出，照亮了整个洞穴。勇士阿尔法和法师贝塔站在岸边，望着眼前一望无际的地下海洋。

"我们需要一艘船，"贝塔说道，"但我感觉水下有什么东西在注视着我们。"

就在这时，水面开始波动，一个巨大的身影从水中缓缓升起...那是传说中的海王，他守护着通往魔王领地的道路。`,
    wordCount: 200,
    hasPuzzle: false,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: undefined,
  },
  {
    chapterId: 'ch-4',
    chapterNumber: 4,
    title: '魔王领地',
    content: `经过漫长的旅程，勇士阿尔法终于来到了魔王的领地。

黑暗的城堡耸立在火山之上，岩浆从山壁流下，发出嘶嘶的声响。空气中充满了硫磺的味道，让人呼吸困难。

魔王站在城堡的最高处，俯视着下方。"你终于来了，勇士，"他的声音如同雷鸣般回荡，"但你是否准备好面对最终的挑战？"

阿尔法深吸一口气，握紧了手中的宝剑。这一刻，他等待了太久...

城堡的大门缓缓打开，一股黑暗的气息扑面而来。阿尔法毫不犹豫地踏入其中，每一步都踏在滚烫的岩石上。

走廊两侧是无数个牢笼，里面关押着被魔王囚禁的灵魂。他们伸出枯瘦的手臂，发出无声的哀嚎。

"不要看他们，"贝塔提醒道，"这些都是魔王的陷阱。"

阿尔法点点头，继续向前。终于，他们来到了魔王的大殿。

大殿中央，魔王端坐在黑曜石王座上，他的眼睛闪烁着血红的光芒。"欢迎来到我的领地，勇者，"他冷笑道，"你将在这里结束你的旅程。"

阿尔法举起宝剑，剑身上闪烁着圣洁的光芒。"今天，我将终结你的统治！"他大声宣布。`,
    wordCount: 600,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-3'],
    puzzle: {
      question: '魔王最害怕的是什么？',
      options: ['火焰', '光明', '水', '黑暗'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-5',
    chapterNumber: 5,
    title: '最终决战',
    content: `决战开始了！

勇士阿尔法冲向魔王，宝剑在空中划出一道银光。魔王挥动法杖，黑暗能量如潮水般涌来。

法师贝塔在后方施展保护魔法，为阿尔法抵挡着黑暗力量的侵蚀。弓手德尔塔站在远处，不断射出光之箭，干扰魔王的施法。

战斗持续了整整一天一夜。最终，在众人的配合下，阿尔法找到了魔王的弱点，一剑刺穿了他的心脏。

光明重新降临这片土地，勇者们的故事将被永远传颂...`,
    wordCount: 180,
    hasPuzzle: false,
    puzzleResult: null,
    characters: ['char-1', 'char-2', 'char-3', 'char-5'],
    puzzle: undefined,
  },
  {
    chapterId: 'ch-6',
    chapterNumber: 6,
    title: '新的开始',
    content: `魔王倒下后，世界迎来了久违的和平。

勇士阿尔法站在城堡的废墟上，望着远方的地平线。阳光穿透云层，洒在大地上，一切都显得那么美好。

"我们成功了，"法师贝塔走到他身边，"但我们的旅程还没有结束。"

阿尔法点点头。他知道，虽然魔王已经倒下，但世界上还有许多需要帮助的人。

就在这时，一位神秘的旅人出现在他们面前。他穿着灰色斗篷，看不清面容。

"勇者们，"旅人说道，"我有重要的事情要告诉你们。在遥远的东方，有一座被遗忘的神殿，里面封印着比魔王更可怕的存在..."

阿尔法和贝塔对视一眼，他们知道新的冒险即将开始。

旅人继续说道："那座神殿名为'时间裂隙'，传说中它连接着过去和未来。如果封印被打破，整个世界都将陷入混乱。"

"我们需要做什么？"阿尔法问道。

"找到神殿的钥匙，"旅人回答，"它们散落在世界的四个角落。只有集齐四把钥匙，才能加固封印。"

阿尔法握紧宝剑，眼中闪烁着坚定的光芒。"我们接受这个任务。"

旅人微微点头，从斗篷下取出一张古老的地图。"这是神殿的位置，祝你们好运。"

说完，旅人便消失在空气中，仿佛从未出现过。

阿尔法展开地图，上面标注着四个神秘的地点：迷雾沼泽、天空之城、时间裂隙、永恒传说。

"准备好了吗，老朋友？"阿尔法看向贝塔。

"随时准备着，"贝塔微笑着回答。`,
    wordCount: 550,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '旅人提到的神殿叫什么名字？',
      options: ['遗忘神殿', '时间裂隙', '永恒之塔', '命运之门'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-7',
    chapterNumber: 7,
    title: '迷雾沼泽',
    content: `根据地图的指引，阿尔法和贝塔来到了第一站——迷雾沼泽。

浓雾笼罩着整片区域，能见度不足五米。空气中弥漫着腐烂的气息，脚下的泥土发出"咕噜咕噜"的声音。

"小心，"贝塔警告道，"这里的雾气有毒，不要深呼吸。"

阿尔法用布条蒙住口鼻，小心翼翼地前进。突然，他感觉脚下有什么东西在移动。

"有东西在水下！"他大喊一声，迅速跳开。

一条巨大的沼泽蟒蛇从泥水中窜出，张开血盆大口扑向他们...`,
    wordCount: 160,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '迷雾沼泽的雾气有什么特点？',
      options: ['让人迷路', '有剧毒', '会燃烧', '能隐身'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-8',
    chapterNumber: 8,
    title: '天空之城',
    content: `穿过迷雾沼泽，阿尔法和贝塔来到了一座悬浮在云端的城市。

天空之城的建筑由洁白的大理石建成，在阳光的照耀下闪闪发光。无数条锁链将城市固定在空中，风吹过时，整座城市都会轻轻摇晃。

"太壮观了，"贝塔惊叹道，"这就是传说中的天空之城！"

他们乘坐云梯升上城市，迎接他们的是一位身穿银甲的守护者。

"欢迎来到天空之城，"守护者说道，"我是这里的守护者，你们为何而来？"

"我们寻找时间裂隙的钥匙，"阿尔法回答。

守护者点点头，"钥匙就在城市的最高塔中，但要得到它，你们必须通过三道试炼。"

第一道试炼是智慧之门。守护者带他们来到一座巨大的迷宫前。

"这座迷宫会不断变化，"守护者解释道，"只有最聪明的人才能找到出口。"

阿尔法和贝塔相互配合，贝塔用魔法探测迷宫的变化，阿尔法则负责开路。经过几个小时的努力，他们终于找到了出口。

第二道试炼是勇气之桥。一座透明的桥梁横跨两座塔楼，桥下是万丈深渊。

"这座桥只能承载一个人的重量，"守护者说，"你们必须一个一个通过。"

阿尔法率先踏上桥梁，每一步都小心翼翼。风从四面八方吹来，试图将他推下深渊。但他咬紧牙关，一步一步向前，最终成功到达对岸。

第三道试炼是力量之墙。一堵巨大的石墙挡住了去路，墙上刻着古老的符文。

"这堵墙只有真正的勇者才能推倒，"守护者说。

阿尔法深吸一口气，将全身的力量集中在双臂上。他猛地向前推去，石墙开始震动，然后轰然倒塌。

"恭喜你们，"守护者微笑着说，"你们通过了所有试炼。"

他递给阿尔法一把银色的钥匙，钥匙上刻着云朵的图案。

"这是天空之城的钥匙，愿它帮助你们完成使命。"`,
    wordCount: 580,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '天空之城的第一道试炼是什么？',
      options: ['力量之墙', '智慧之门', '勇气之桥', '命运之塔'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-9',
    chapterNumber: 9,
    title: '时间裂隙',
    content: `集齐了天空之城的钥匙，阿尔法和贝塔继续向东前进。

终于，他们来到了传说中的时间裂隙。这里的空间扭曲着，过去和未来的影像交织在一起。

"小心，"贝塔警告道，"这里的时间流动很不稳定。"

阿尔法看到自己的过去和未来在眼前闪过：他第一次拿起宝剑的样子、与魔王战斗的场景、甚至看到了一个白发苍苍的自己。

"这就是时间裂隙的力量，"一个声音从虚空中传来。

阿尔法转身，看到一个模糊的身影正在凝聚。那是...他自己？

"我是未来的你，"身影说道，"我来是为了警告你。封印即将破碎，你必须尽快找到最后一把钥匙。"

"最后一把钥匙在哪里？"阿尔法问道。

"在永恒传说之地，"未来的阿尔法回答，"那里有你要找的答案。"

说完，身影便消散在空气中。`,
    wordCount: 190,
    hasPuzzle: true,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '谁在时间裂隙中警告了阿尔法？',
      options: ['魔王', '未来的自己', '神秘旅人', '守护者'],
      correctIndex: 1,
      attempts: 0,
      maxAttempts: 3,
    },
  },
  {
    chapterId: 'ch-10',
    chapterNumber: 10,
    title: '永恒传说',
    content: `阿尔法和贝塔来到了旅程的终点——永恒传说之地。

这里是一片宁静的草原，鲜花盛开，蝴蝶飞舞。在草原的中央，矗立着一座古老的神殿。

"就是这里了，"阿尔法深吸一口气，"最后一把钥匙就在里面。"

他们走进神殿，发现里面空无一人。只有一座石台，上面放着一把金色的钥匙。

但当阿尔法伸手去拿时，一个声音在神殿中回荡：

"勇者，你真的想要这把钥匙吗？"

阿尔法转身，看到一个光芒四射的身影正在凝聚。那是...创世神？

"是的，"阿尔法坚定地回答，"我要保护这个世界。"

创世神点点头，"你已经证明了自己的勇气、智慧和力量。这把钥匙属于你。"

阿尔法拿起金色的钥匙，感觉一股温暖的力量涌入体内。

"去吧，"创世神说，"用这四把钥匙加固时间裂隙的封印。世界的未来，就交给你了。"

阿尔法和贝塔离开神殿，踏上了返回时间裂隙的路途。他们知道，最后的战斗即将来临...

当他们回到时间裂隙时，封印已经开始松动。阿尔法将四把钥匙插入封印的四个凹槽中。

一道耀眼的光芒闪过，封印重新变得稳固。时间裂隙恢复了平静，世界再次安全了。

阿尔法望着天空，露出疲惫但满足的微笑。他的冒险，暂时告一段落。但他知道，只要有需要，他随时都会再次踏上征程。

这就是勇者阿尔法的传说，一个将被永远传颂的故事。`,
    wordCount: 520,
    hasPuzzle: false,
    puzzleResult: null,
    characters: ['char-1', 'char-2'],
    puzzle: undefined,
  },
];
```

**Step 2: 验证数据结构**

检查TypeScript编译无错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 扩充章节数据到10章，包含短章节和长章节"
```

---

## Task 2: 添加状态管理

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:263-272`

**Step 1: 添加新的状态变量**

在现有状态后添加：

```typescript
const [chapterViewMode, setChapterViewMode] = useState<'directory' | 'content'>('directory');
const [directoryPage, setDirectoryPage] = useState<number>(0);
const [chapterContentPage, setChapterContentPage] = useState<number>(0);
const ITEMS_PER_PAGE = 6;
```

**Step 2: 验证编译**

运行TypeScript检查确保无错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 添加章节视图模式和分页状态管理"
```

---

## Task 3: 实现目录分页算法

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx` (在组件内部添加函数)

**Step 1: 添加分页计算函数**

在组件内部，handleChapterSelect函数前添加：

```typescript
const totalDirectoryPages = Math.ceil((FAKE_CHAPTERS.length + 1) / ITEMS_PER_PAGE);

const getDirectoryPageItems = (page: number) => {
  const allItems = [...FAKE_CHAPTERS, { chapterId: 'add-new', isAddButton: true }];
  const startIndex = page * ITEMS_PER_PAGE;
  const pageItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const leftItems: any[] = [];
  const rightItems: any[] = [];
  
  pageItems.forEach((item, index) => {
    if (index % 2 === 0) {
      leftItems.push(item);
    } else {
      rightItems.push(item);
    }
  });
  
  return { leftItems, rightItems };
};
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 实现目录分页计算函数"
```

---

## Task 4: 重构章节Tab - 目录视图

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:438-471`

**Step 1: 重写renderChaptersTab函数**

```typescript
const renderChaptersTab = () => {
  if (chapterViewMode === 'content' && selectedChapterId) {
    return renderChapterContentView();
  }
  
  const { leftItems, rightItems } = getDirectoryPageItems(directoryPage);
  
  const renderDirectoryItem = (item: any) => {
    if (item.isAddButton) {
      return (
        <TouchableOpacity
          key="add-new"
          style={styles.chapterItem}
          onPress={() => onNavigateToDirector()}
        >
          <Text style={styles.chapterItemText}>➕ 添加章节</Text>
          <Text style={styles.chapterItemStatus}> </Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity
        key={item.chapterId}
        style={[
          styles.chapterItem,
          selectedChapterId === item.chapterId && styles.chapterItemActive,
        ]}
        onPress={() => handleChapterSelect(item.chapterId)}
      >
        <Text style={styles.chapterItemText}>
          第{item.chapterNumber}章 {item.title}
        </Text>
        <Text style={styles.chapterItemStatus}>{getStatusIcon(item)}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.bookPages}>
      <View style={styles.leftPage}>
        <Text style={styles.pageTitle}>目 录</Text>
        {leftItems.map(renderDirectoryItem)}
      </View>
      <View style={styles.pageDivider} />
      <View style={styles.rightPage}>
        <Text style={styles.pageTitle}>目 录</Text>
        {rightItems.map(renderDirectoryItem)}
      </View>
    </View>
  );
};
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 重构章节Tab目录视图，支持两列布局"
```

---

## Task 5: 实现章节内容视图

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx`

**Step 1: 添加renderChapterContentView函数**

```typescript
const renderChapterContentView = () => {
  const chapter = FAKE_CHAPTERS.find(c => c.chapterId === selectedChapterId);
  if (!chapter) return null;
  
  const currentIndex = FAKE_CHAPTERS.findIndex(c => c.chapterId === selectedChapterId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < FAKE_CHAPTERS.length - 1;
  
  return (
    <View style={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.backToDirectory} 
        onPress={() => setChapterViewMode('directory')}
      >
        <Text style={styles.backToDirectoryText}>← 目录</Text>
      </TouchableOpacity>
      
      <Text style={styles.chapterTitle}>第{chapter.chapterNumber}章 {chapter.title}</Text>
      <View style={styles.chapterDivider} />
      <Text style={styles.chapterContent}>{chapter.content}</Text>
      
      {chapter.puzzle && (
        <View style={styles.puzzleBox}>
          <Text style={styles.puzzleTitle}>❓ 谜题</Text>
          <Text style={styles.puzzleQuestion}>{chapter.puzzle.question}</Text>
          <View style={styles.puzzleOptions}>
            {chapter.puzzle.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.puzzleOption,
                  puzzleAnswer === index && styles.puzzleOptionSelected,
                  puzzleResult === 'correct' && index === chapter.puzzle!.correctIndex && styles.puzzleOptionCorrect,
                  puzzleResult === 'wrong' && puzzleAnswer === index && styles.puzzleOptionWrong,
                ]}
                onPress={() => handlePuzzleAnswer(index, chapter)}
                disabled={puzzleResult === 'correct' || puzzleAttempts >= chapter.puzzle!.maxAttempts}
              >
                <Text style={styles.puzzleOptionText}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.puzzleAttempts}>尝试次数: {puzzleAttempts}/{chapter.puzzle.maxAttempts}</Text>
          {puzzleResult === 'correct' && (
            <Text style={styles.puzzleResultCorrect}>✅ 正确！</Text>
          )}
          {puzzleResult === 'wrong' && puzzleAttempts >= chapter.puzzle.maxAttempts && (
            <Text style={styles.puzzleResultWrong}>
              ❌ 正确答案: {String.fromCharCode(65 + chapter.puzzle.correctIndex)}. {chapter.puzzle.options[chapter.puzzle.correctIndex]}
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.chapterNavigation}>
        <TouchableOpacity
          style={[styles.navButton, !hasPrev && styles.navButtonDisabled]}
          onPress={() => {
            if (hasPrev) {
              const prevChapter = FAKE_CHAPTERS[currentIndex - 1];
              handleChapterSelect(prevChapter.chapterId);
            }
          }}
          disabled={!hasPrev}
        >
          <Text style={[styles.navButtonText, !hasPrev && styles.navButtonTextDisabled]}>
            上一章
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>
          {currentIndex + 1}/{FAKE_CHAPTERS.length}
        </Text>
        
        <TouchableOpacity
          style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
          onPress={() => {
            if (hasNext) {
              const nextChapter = FAKE_CHAPTERS[currentIndex + 1];
              handleChapterSelect(nextChapter.chapterId);
            }
          }}
          disabled={!hasNext}
        >
          <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>
            下一章
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

**Step 2: 更新handleChapterSelect函数**

```typescript
const handleChapterSelect = (chapterId: string) => {
  setSelectedChapterId(chapterId);
  setChapterViewMode('content');
  setPuzzleAnswer(null);
  setPuzzleResult(null);
  setPuzzleAttempts(0);
};
```

**Step 3: 验证编译**

确保无TypeScript错误。

**Step 4: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 实现章节内容视图，支持章节导航"
```

---

## Task 6: 添加目录翻页控制

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx`

**Step 1: 在renderChaptersTab中添加翻页控制**

在目录视图的return语句中，添加翻页控制：

```typescript
return (
  <View style={{ flex: 1 }}>
    <View style={styles.bookPages}>
      {/* ... existing code ... */}
    </View>
    
    <View style={styles.directoryPagination}>
      <TouchableOpacity
        style={[styles.navButton, directoryPage === 0 && styles.navButtonDisabled]}
        onPress={() => setDirectoryPage(Math.max(0, directoryPage - 1))}
        disabled={directoryPage === 0}
      >
        <Text style={[styles.navButtonText, directoryPage === 0 && styles.navButtonTextDisabled]}>
          上一页
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.pageIndicator}>
        {directoryPage + 1}/{totalDirectoryPages}
      </Text>
      
      <TouchableOpacity
        style={[styles.navButton, directoryPage >= totalDirectoryPages - 1 && styles.navButtonDisabled]}
        onPress={() => setDirectoryPage(Math.min(totalDirectoryPages - 1, directoryPage + 1))}
        disabled={directoryPage >= totalDirectoryPages - 1}
      >
        <Text style={[styles.navButtonText, directoryPage >= totalDirectoryPages - 1 && styles.navButtonTextDisabled]}>
          下一页
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 添加目录翻页控制按钮"
```

---

## Task 7: 重构角色Tab - 卡牌网格布局

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:473-517`

**Step 1: 重写renderCharactersTab函数**

```typescript
const renderCharactersTab = () => {
  const renderCharacterCard = (character: Character) => (
    <TouchableOpacity
      key={character.id}
      style={[
        styles.characterCard,
        selectedCharacterId === character.id && styles.characterCardActive,
      ]}
      onPress={() => handleCharacterSelect(character.id)}
    >
      <Text style={styles.characterCardEmoji}>{character.emoji}</Text>
      <View style={styles.characterCardDivider} />
      <Text style={styles.characterCardName}>{character.customName}</Text>
      <Text style={[styles.characterCardRole, { color: getRoleColor(character.roleType) }]}>
        {character.roleType === 'protagonist' ? '主角' : character.roleType === 'supporting' ? '配角' : '反派'}
      </Text>
    </TouchableOpacity>
  );
  
  const rows: Character[][] = [];
  for (let i = 0; i < FAKE_CHARACTERS.length; i += 2) {
    rows.push(FAKE_CHARACTERS.slice(i, i + 2));
  }
  
  return (
    <ScrollView style={styles.cardGridContainer}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.cardRow}>
          {row.map(renderCharacterCard)}
          {row.length === 1 && <View style={styles.emptyCardSlot} />}
        </View>
      ))}
    </ScrollView>
  );
};
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 重构角色Tab为一行两个卡牌布局"
```

---

## Task 8: 重构情节Tab - 分类卡牌网格布局

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:519-567`

**Step 1: 重写renderPlotsTab函数**

```typescript
const renderPlotsTab = () => {
  const categories = [
    { key: 'weather', title: '☀️ 天气', data: FAKE_PLOT_CARDS.weather },
    { key: 'adventure', title: '⚔️ 冒险类型', data: FAKE_PLOT_CARDS.adventure },
    { key: 'terrain', title: '🌲 地形', data: FAKE_PLOT_CARDS.terrain },
    { key: 'equipment', title: '🪄 装备', data: FAKE_PLOT_CARDS.equipment },
  ];
  
  const renderPlotCard = (card: PlotCard) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.plotCard,
        selectedPlotCardId === card.id && styles.plotCardActive,
      ]}
      onPress={() => handlePlotCardSelect(card.id)}
    >
      <Text style={styles.plotCardEmoji}>{card.emoji}</Text>
      <View style={styles.plotCardDivider} />
      <Text style={styles.plotCardName}>{card.name}</Text>
      <Text style={styles.plotCardDesc} numberOfLines={2}>{card.description}</Text>
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={styles.cardGridContainer}>
      {categories.map(category => (
        <View key={category.key} style={styles.plotCategory}>
          <Text style={styles.plotCategoryTitle}>{category.title}</Text>
          <View style={styles.plotCategoryDivider} />
          <View style={styles.cardRow}>
            {category.data.slice(0, 2).map(renderPlotCard)}
          </View>
          <View style={styles.cardRow}>
            {category.data.slice(2, 4).map(renderPlotCard)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 重构情节Tab为分类卡牌网格布局"
```

---

## Task 9: 更新样式

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx` (StyleSheet部分)

**Step 1: 添加新样式**

在StyleSheet中添加：

```typescript
contentContainer: {
  flex: 1,
  padding: 15,
},
backToDirectory: {
  paddingVertical: 8,
  marginBottom: 10,
},
backToDirectoryText: {
  color: '#8B4513',
  fontSize: 14,
},
chapterNavigation: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
  borderTopWidth: 1,
  borderTopColor: '#D2B48C',
  marginTop: 15,
},
navButton: {
  paddingHorizontal: 20,
  paddingVertical: 8,
  backgroundColor: '#8B4513',
  borderRadius: 5,
},
navButtonDisabled: {
  backgroundColor: '#D2B48C',
},
navButtonText: {
  color: '#FFF8DC',
  fontSize: 14,
},
navButtonTextDisabled: {
  color: '#A0522D',
},
pageIndicator: {
  fontSize: 14,
  color: '#4A3728',
},
directoryPagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: '#D2B48C',
},
cardGridContainer: {
  flex: 1,
  padding: 10,
},
cardRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},
characterCard: {
  width: '48%',
  backgroundColor: '#FFF8DC',
  borderRadius: 10,
  padding: 15,
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#D2B48C',
},
characterCardActive: {
  borderColor: '#8B4513',
  backgroundColor: '#FFF',
},
characterCardEmoji: {
  fontSize: 36,
  marginBottom: 8,
},
characterCardDivider: {
  width: '80%',
  height: 1,
  backgroundColor: '#D2B48C',
  marginBottom: 8,
},
characterCardName: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#4A3728',
  marginBottom: 4,
},
characterCardRole: {
  fontSize: 12,
},
emptyCardSlot: {
  width: '48%',
},
plotCategory: {
  marginBottom: 20,
},
plotCategoryTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#4A3728',
  marginBottom: 5,
},
plotCategoryDivider: {
  height: 1,
  backgroundColor: '#D2B48C',
  marginBottom: 10,
},
plotCard: {
  width: '48%',
  backgroundColor: '#FFF8DC',
  borderRadius: 10,
  padding: 12,
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#D2B48C',
},
plotCardActive: {
  borderColor: '#8B4513',
  backgroundColor: '#FFF',
},
plotCardEmoji: {
  fontSize: 32,
  marginBottom: 6,
},
plotCardDivider: {
  width: '80%',
  height: 1,
  backgroundColor: '#D2B48C',
  marginBottom: 6,
},
plotCardName: {
  fontSize: 13,
  fontWeight: 'bold',
  color: '#4A3728',
  marginBottom: 4,
},
plotCardDesc: {
  fontSize: 11,
  color: '#6B4423',
  textAlign: 'center',
},
```

**Step 2: 验证编译**

确保无TypeScript错误。

**Step 3: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 添加新的UI样式"
```

---

## Task 10: 更新组件Props

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx:259-261`
- Modify: `App.tsx`

**Step 1: 更新BookDetailDemoProps接口**

```typescript
interface BookDetailDemoProps {
  onBack: () => void;
  onNavigateToDirector: () => void;
}
```

**Step 2: 更新组件定义**

```typescript
const BookDetailDemo: React.FC<BookDetailDemoProps> = ({ onBack, onNavigateToDirector }) => {
```

**Step 3: 更新App.tsx中的调用**

```typescript
case 'book-detail':
  return <BookDetailDemo onBack={() => setCurrentPage('home')} onNavigateToDirector={() => setCurrentPage('director')} />;
```

**Step 4: 验证编译**

确保无TypeScript错误。

**Step 5: Commit**

```bash
git add src/screens/BookDetailDemo.tsx App.tsx
git commit -m "feat: 添加导航到导演页的props"
```

---

## Task 11: 构建APK

**Files:**
- Run: `.\run-app.ps1`

**Step 1: 运行构建脚本**

```powershell
cd c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\lego-demo
.\run-app.ps1
```

**Step 2: 验证构建成功**

检查输出显示"BUILD AND RUN SUCCESSFUL"。

**Step 3: 验证APP启动**

在模拟器中检查APP是否正常启动。

---

## Task 12: 更新Appium测试用例

**Files:**
- Modify: `appium-book-detail-test.js`

**Step 1: 更新测试用例覆盖新功能**

添加新的测试点：
- 目录翻页功能
- 章节内容视图切换
- 章节导航功能
- 角色卡牌网格布局
- 情节分类卡牌布局
- 添加章节跳转

**Step 2: 运行测试**

```bash
node appium-book-detail-test.js
```

**Step 3: 验证测试通过**

确保所有测试点通过率 >= 90%。

**Step 4: Commit**

```bash
git add appium-book-detail-test.js
git commit -m "test: 更新Appium测试覆盖新功能"
```

---

## Task 13: 最终验证

**Step 1: 手动测试所有功能**

- 目录翻页
- 章节选择和内容显示
- 章节导航
- 角色卡牌布局
- 情节分类卡牌布局
- 添加章节跳转

**Step 2: 确认无TypeScript错误**

**Step 3: 确认测试通过**

---

## 设计参考

详细设计文档: `docs/plans/2026-03-06-book-detail-redesign.md`
