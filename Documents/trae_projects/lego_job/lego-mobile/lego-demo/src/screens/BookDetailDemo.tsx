import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const PAGE_WIDTH = (width - 60) / 2;
const PAGE_HEIGHT = height - 200;

type TabType = 'chapters' | 'characters' | 'plots';

interface Chapter {
  chapterId: string;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  hasPuzzle: boolean;
  puzzleResult?: 0 | 1 | null;
  characters: string[];
  puzzle?: {
    question: string;
    options: string[];
    correctIndex: number;
    attempts: number;
    maxAttempts: number;
  };
}

interface Character {
  id: string;
  customName: string;
  name: string;
  roleType: 'protagonist' | 'supporting' | 'antagonist';
  emoji: string;
  description: string;
}

interface PlotCard {
  id: string;
  type?: 'weather' | 'adventure' | 'terrain' | 'equipment';
  name: string;
  emoji: string;
  description: string;
}

const FAKE_BOOK = {
  bookId: 'book-1',
  title: '勇者的冒险之旅',
};

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
    wordCount: 234,
    hasPuzzle: true,
    puzzleResult: 1,
    characters: ['char-1', 'char-2'],
    puzzle: {
      question: '森林中出现的黑影最可能是什么？',
      options: ['精灵', '魔兽', '迷路的旅人', '法师的幻象'],
      correctIndex: 1,
      attempts: 1,
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

勇士阿尔法环顾四周，发现城堡周围还有一些奇怪的雕像，它们似乎在注视着每一个来访者。`,
    wordCount: 312,
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
    wordCount: 189,
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

阿尔法深吸一口气，握紧了手中的宝剑。这一刻，他等待了太久...`,
    wordCount: 198,
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
    wordCount: 245,
    hasPuzzle: false,
    puzzleResult: null,
    characters: ['char-1', 'char-2', 'char-3', 'char-5'],
    puzzle: undefined,
  },
];

const FAKE_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    customName: '勇士阿尔法',
    name: '勇士',
    roleType: 'protagonist',
    emoji: '👑',
    description: '故事的主角，一位勇敢的年轻战士，肩负着拯救世界的使命。',
  },
  {
    id: 'char-2',
    customName: '法师贝塔',
    name: '法师',
    roleType: 'supporting',
    emoji: '⚔️',
    description: '智慧的魔法师，阿尔法的好友和得力助手。',
  },
  {
    id: 'char-3',
    customName: '魔王',
    name: '魔王',
    roleType: 'antagonist',
    emoji: '😈',
    description: '黑暗势力的统治者，故事的主要反派。',
  },
  {
    id: 'char-4',
    customName: '守卫伽马',
    name: '守卫',
    roleType: 'supporting',
    emoji: '🛡️',
    description: '古老城堡的守护者，考验来访者的勇气。',
  },
  {
    id: 'char-5',
    customName: '弓手德尔塔',
    name: '弓手',
    roleType: 'supporting',
    emoji: '🏹',
    description: '精灵族的弓箭手，在最终决战中提供了关键的支援。',
  },
];

const FAKE_PLOT_CARDS: Record<string, PlotCard[]> = {
  weather: [
    { id: 'w-1', name: '晴天', emoji: '☀️', description: '阳光明媚，视野清晰' },
    { id: 'w-2', name: '雨天', emoji: '🌧️', description: '细雨绵绵，行动隐蔽' },
    { id: 'w-3', name: '雪天', emoji: '❄️', description: '白雪皑皑，留下足迹' },
    { id: 'w-4', name: '夜晚', emoji: '🌙', description: '月黑风高，适合潜行' },
  ],
  adventure: [
    { id: 'a-1', name: '战斗', emoji: '⚔️', description: '与敌人正面交锋' },
    { id: 'a-2', name: '探索', emoji: '🔍', description: '搜寻隐藏的宝藏' },
    { id: 'a-3', name: '寻宝', emoji: '💎', description: '寻找珍贵的宝物' },
    { id: 'a-4', name: '解谜', emoji: '🧩', description: '破解古老的谜题' },
  ],
  terrain: [
    { id: 't-1', name: '森林', emoji: '🌲', description: '茂密的树林，适合伏击' },
    { id: 't-2', name: '山地', emoji: '⛰️', description: '崎岖的山路，视野开阔' },
    { id: 't-3', name: '沙滩', emoji: '🏖️', description: '柔软的沙滩，行动缓慢' },
    { id: 't-4', name: '沙漠', emoji: '🏜️', description: '干旱的沙漠，资源稀缺' },
  ],
  equipment: [
    { id: 'e-1', name: '宝剑', emoji: '🗡️', description: '锋利的宝剑，攻击力+10' },
    { id: 'e-2', name: '盾牌', emoji: '🛡️', description: '坚固的盾牌，防御力+10' },
    { id: 'e-3', name: '戒指', emoji: '💍', description: '魔法戒指，魔力+10' },
    { id: 'e-4', name: '卷轴', emoji: '📜', description: '古老卷轴，解锁新技能' },
  ],
};

const READING_POSITION_KEY = 'book_reading_position';

const getRoleColor = (roleType: string) => {
  switch (roleType) {
    case 'protagonist': return '#FFD700';
    case 'supporting': return '#3B82F6';
    case 'antagonist': return '#EF4444';
    default: return '#888';
  }
};

const getStatusIcon = (chapter: Chapter) => {
  if (chapter.puzzleResult === 1) return '✅';
  if (chapter.hasPuzzle && chapter.puzzleResult === null) return '🧩';
  if (!chapter.hasPuzzle && chapter.puzzleResult === null) return '○';
  return '🔒';
};

interface BookDetailDemoProps {
  onBack: () => void;
}

const BookDetailDemo: React.FC<BookDetailDemoProps> = ({ onBack }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedPlotType, setSelectedPlotType] = useState<string>('weather');
  const [selectedPlotCardId, setSelectedPlotCardId] = useState<string | null>(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState<number | null>(null);
  const [puzzleAttempts, setPuzzleAttempts] = useState<number>(0);
  const [puzzleResult, setPuzzleResult] = useState<'correct' | 'wrong' | null>(null);
  const [savedReadingPosition, setSavedReadingPosition] = useState<string | null>(null);
  
  const flipAnim = useRef(new Animated.Value(0)).current;
  const tabAnims = useRef({
    chapters: new Animated.Value(8),
    characters: new Animated.Value(0),
    plots: new Animated.Value(0),
  }).current;

  useEffect(() => {
    if (savedReadingPosition) {
      setSelectedChapterId(savedReadingPosition);
    } else if (FAKE_CHAPTERS.length > 0) {
      setSelectedChapterId(FAKE_CHAPTERS[1].chapterId);
    }
  }, []);

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [selectedChapterId]);

  useEffect(() => {
    Object.keys(tabAnims).forEach((key) => {
      Animated.spring(tabAnims[key as TabType], {
        toValue: currentTab === key ? 8 : 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });
  }, [currentTab]);

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSavedReadingPosition(chapterId);
    setPuzzleAnswer(null);
    setPuzzleResult(null);
    setPuzzleAttempts(0);
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };

  const handlePlotCardSelect = (cardId: string) => {
    setSelectedPlotCardId(cardId);
  };

  const handlePuzzleAnswer = (optionIndex: number, chapter: Chapter) => {
    if (!chapter.puzzle || puzzleAttempts >= chapter.puzzle.maxAttempts) return;
    
    setPuzzleAnswer(optionIndex);
    const newAttempts = puzzleAttempts + 1;
    setPuzzleAttempts(newAttempts);
    
    if (optionIndex === chapter.puzzle.correctIndex) {
      setPuzzleResult('correct');
    } else if (newAttempts >= chapter.puzzle.maxAttempts) {
      setPuzzleResult('wrong');
    } else {
      setPuzzleResult('wrong');
      setTimeout(() => {
        setPuzzleResult(null);
        setPuzzleAnswer(null);
      }, 1000);
    }
  };

  const selectedChapter = FAKE_CHAPTERS.find(c => c.chapterId === selectedChapterId);
  const selectedCharacter = FAKE_CHARACTERS.find(c => c.id === selectedCharacterId);
  const selectedPlotCard = FAKE_PLOT_CARDS[selectedPlotType]?.find(c => c.id === selectedPlotCardId);

  const renderBookmarkTab = () => (
    <View style={styles.bookmarkContainer}>
      {(['chapters', 'characters', 'plots'] as TabType[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.bookmark,
            currentTab === tab && styles.bookmarkActive,
          ]}
          onPress={() => setCurrentTab(tab)}
        >
          <Animated.View
            style={{
              transform: [{ translateY: tabAnims[tab] }],
            }}
          >
            <Text style={[styles.bookmarkText, currentTab === tab && styles.bookmarkTextActive]}>
              {tab === 'chapters' ? '📚 章节' : tab === 'characters' ? '🎭 角色' : '🎴 情节'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderChapterContent = (chapter: Chapter) => {
    return (
      <ScrollView style={styles.chapterScrollContainer}>
        <Text style={styles.chapterTitle}>第{chapter.chapterNumber}章 {chapter.title}</Text>
        <View style={styles.chapterDivider} />
        <Text style={styles.chapterContent}>{chapter.content}</Text>
        {chapter.characters.length > 0 && (
          <View style={styles.characterTags}>
            <Text style={styles.characterTagLabel}>🎭 登场角色</Text>
            <View style={styles.characterTagList}>
              {chapter.characters.map(charId => {
                const char = FAKE_CHARACTERS.find(c => c.id === charId);
                if (!char) return null;
                return (
                  <Text
                    key={charId}
                    style={[
                      styles.characterTag,
                      { backgroundColor: getRoleColor(char.roleType) + '30', color: getRoleColor(char.roleType) },
                    ]}
                  >
                    {char.emoji} {char.customName}
                  </Text>
                );
              })}
            </View>
          </View>
        )}
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
      </ScrollView>
    );
  };

  const renderChaptersTab = () => (
    <View style={styles.bookPages}>
      <View style={styles.leftPage}>
        <Text style={styles.pageTitle}>目 录</Text>
        <ScrollView>
          {FAKE_CHAPTERS.map((chapter) => (
            <TouchableOpacity
              key={chapter.chapterId}
              style={[
                styles.chapterItem,
                selectedChapterId === chapter.chapterId && styles.chapterItemActive,
              ]}
              onPress={() => handleChapterSelect(chapter.chapterId)}
            >
              <Text style={styles.chapterItemText}>
                第{chapter.chapterNumber}章 {chapter.title}
              </Text>
              <Text style={styles.chapterItemStatus}>{getStatusIcon(chapter)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.pageDivider} />
      <View style={styles.rightPage}>
        {selectedChapter ? (
          renderChapterContent(selectedChapter)
        ) : (
          <View style={styles.emptyPage}>
            <Text style={styles.emptyPageText}>请选择章节</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCharactersTab = () => (
    <View style={styles.bookPages}>
      <View style={styles.leftPage}>
        <Text style={styles.pageTitle}>角色列表</Text>
        <ScrollView>
          {FAKE_CHARACTERS.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={[
                styles.characterItem,
                selectedCharacterId === character.id && styles.characterItemActive,
              ]}
              onPress={() => handleCharacterSelect(character.id)}
            >
              <Text style={styles.characterEmoji}>{character.emoji}</Text>
              <View style={styles.characterInfo}>
                <Text style={styles.characterName}>{character.customName}</Text>
                <Text style={[styles.characterRole, { color: getRoleColor(character.roleType) }]}>
                  {character.roleType === 'protagonist' ? '主角' : character.roleType === 'supporting' ? '配角' : '反派'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.pageDivider} />
      <View style={styles.rightPage}>
        {selectedCharacter ? (
          <View style={styles.characterDetail}>
            <Text style={styles.characterDetailEmoji}>{selectedCharacter.emoji}</Text>
            <Text style={styles.characterDetailName}>{selectedCharacter.customName}</Text>
            <Text style={[styles.characterDetailRole, { color: getRoleColor(selectedCharacter.roleType) }]}>
              {selectedCharacter.roleType === 'protagonist' ? '主角' : selectedCharacter.roleType === 'supporting' ? '配角' : '反派'}
            </Text>
            <View style={styles.characterDetailDivider} />
            <Text style={styles.characterDetailDesc}>{selectedCharacter.description}</Text>
          </View>
        ) : (
          <View style={styles.emptyPage}>
            <Text style={styles.emptyPageText}>请选择角色</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPlotsTab = () => (
    <View style={styles.bookPages}>
      <View style={styles.leftPage}>
        <Text style={styles.pageTitle}>情节元素</Text>
        <ScrollView>
          {Object.entries(FAKE_PLOT_CARDS).map(([type, cards]) => (
            <View key={type} style={styles.plotCategory}>
              <Text style={styles.plotCategoryTitle}>
                {type === 'weather' ? '☀️ 天气' : type === 'adventure' ? '⚔️ 冒险类型' : type === 'terrain' ? '🌲 地形' : '🪄 装备'}
              </Text>
              <View style={styles.plotCardList}>
                {cards.map((card) => (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.plotCardItem,
                      selectedPlotType === type && selectedPlotCardId === card.id && styles.plotCardItemActive,
                    ]}
                    onPress={() => {
                      setSelectedPlotType(type);
                      handlePlotCardSelect(card.id);
                    }}
                  >
                    <Text style={styles.plotCardEmoji}>{card.emoji}</Text>
                    <Text style={styles.plotCardName}>{card.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.pageDivider} />
      <View style={styles.rightPage}>
        {selectedPlotCard ? (
          <View style={styles.plotCardDetail}>
            <Text style={styles.plotCardDetailEmoji}>{selectedPlotCard.emoji}</Text>
            <Text style={styles.plotCardDetailName}>{selectedPlotCard.name}</Text>
            <View style={styles.plotCardDetailDivider} />
            <Text style={styles.plotCardDetailDesc}>{selectedPlotCard.description}</Text>
          </View>
        ) : (
          <View style={styles.emptyPage}>
            <Text style={styles.emptyPageText}>请选择情节卡牌</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 {FAKE_BOOK.title}</Text>
        <View style={styles.headerRight} />
      </View>

      {renderBookmarkTab()}

      <View style={styles.bookContainer}>
        <View style={styles.bookCover}>
          {currentTab === 'chapters' && renderChaptersTab()}
          {currentTab === 'characters' && renderCharactersTab()}
          {currentTab === 'plots' && renderPlotsTab()}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.pageNumber}>
          {currentTab === 'chapters' && selectedChapter
            ? `${selectedChapter.chapterNumber}/${FAKE_CHAPTERS.length}`
            : '1/1'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4A3728',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#F5DEB3',
    fontSize: 16,
  },
  headerTitle: {
    color: '#F5DEB3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 60,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  bookmark: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#5D3A1A',
  },
  bookmarkActive: {
    backgroundColor: '#A0522D',
    borderColor: '#D2691E',
  },
  bookmarkText: {
    color: '#D2B48C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookmarkTextActive: {
    color: '#FFF8DC',
  },
  bookContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  bookCover: {
    flex: 1,
    backgroundColor: '#F5F0E6',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  bookPages: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPage: {
    flex: 1,
    padding: 15,
  },
  rightPage: {
    flex: 1,
    padding: 15,
  },
  pageDivider: {
    width: 2,
    backgroundColor: '#D2B48C',
    marginVertical: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3728',
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  chapterItemActive: {
    backgroundColor: '#FFF8DC',
    borderRadius: 5,
  },
  chapterItemText: {
    fontSize: 14,
    color: '#4A3728',
  },
  chapterItemStatus: {
    fontSize: 16,
  },
  pageContentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  pageScroll: {
    flex: 1,
  },
  chapterScrollContainer: {
    flex: 1,
  },
  chapterDivider: {
    height: 1,
    backgroundColor: '#D2B48C',
    marginBottom: 15,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 10,
    textAlign: 'center',
  },
  chapterContent: {
    fontSize: 13,
    color: '#3D2914',
    lineHeight: 22,
  },
  characterTags: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF8F0',
    borderRadius: 5,
  },
  characterTagLabel: {
    fontSize: 12,
    color: '#8B4513',
    marginBottom: 8,
  },
  characterTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characterTag: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 5,
  },
  puzzleBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  puzzleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 8,
  },
  puzzleQuestion: {
    fontSize: 13,
    color: '#3D2914',
    marginBottom: 10,
  },
  puzzleOptions: {
    marginTop: 5,
  },
  puzzleOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  puzzleOptionSelected: {
    borderColor: '#4A90D9',
    backgroundColor: '#E8F4FD',
  },
  puzzleOptionCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#DCFCE7',
  },
  puzzleOptionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  puzzleOptionText: {
    fontSize: 13,
    color: '#3D2914',
  },
  puzzleAttempts: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  puzzleResultCorrect: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  puzzleResultWrong: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPageText: {
    fontSize: 14,
    color: '#888',
  },
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DCC8',
  },
  characterItemActive: {
    backgroundColor: '#FFF8DC',
    borderRadius: 5,
  },
  characterEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 14,
    color: '#4A3728',
    fontWeight: '500',
  },
  characterRole: {
    fontSize: 12,
    marginTop: 2,
  },
  characterDetail: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  characterDetailEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  characterDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 5,
  },
  characterDetailRole: {
    fontSize: 14,
    marginBottom: 15,
  },
  characterDetailDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#D2B48C',
    marginBottom: 15,
  },
  characterDetailDesc: {
    fontSize: 14,
    color: '#3D2914',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  plotCategory: {
    marginBottom: 15,
  },
  plotCategoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 8,
  },
  plotCardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  plotCardItem: {
    width: '45%',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: '2.5%',
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  plotCardItemActive: {
    borderColor: '#4A90D9',
    backgroundColor: '#E8F4FD',
  },
  plotCardEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  plotCardName: {
    fontSize: 12,
    color: '#4A3728',
  },
  plotCardDetail: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  plotCardDetailEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  plotCardDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 15,
  },
  plotCardDetailDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#D2B48C',
    marginBottom: 15,
  },
  plotCardDetailDesc: {
    fontSize: 14,
    color: '#3D2914',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageNumber: {
    color: '#D2B48C',
    fontSize: 12,
  },
});

export default BookDetailDemo;
