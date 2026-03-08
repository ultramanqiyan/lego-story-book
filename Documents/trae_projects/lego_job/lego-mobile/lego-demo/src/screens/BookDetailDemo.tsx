import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useData } from '../context/DataContext';
import { Book, Chapter, Character, PlotElement, UnlockedElement } from '../database/DatabaseService';
import { getThemeColors, getGlassStyle, storyThemes } from '../theme';
import { CARD_STYLES } from '../types/styles';
import { getCardStyleForBookType } from '../theme/cardStyleMapping';

const DEFAULT_THEME = storyThemes.children.colors;

const { width, height } = Dimensions.get('window');
const PAGE_WIDTH = (width - 60) / 2;
const PAGE_HEIGHT = height - 200;
const ITEMS_PER_PAGE = 6;
// 计算卡片宽度：每行显示2张卡片
// cardRow paddingHorizontal: 5 * 2 = 10px
// 每张卡片 margin: 6 * 2 = 12px (左右各6px)
// 两张卡片总 margin: 12 * 2 = 24px
// 可用宽度: 屏幕宽度 - 10 - 24 = 屏幕宽度 - 34
// 每张卡片宽度 = (屏幕宽度 - 34) / 2
const CARD_MARGIN = 6;
const CARD_ROW_PADDING = 5;
// 基础卡片宽度（每行两张）
const BASE_CARD_WIDTH = (width - CARD_ROW_PADDING * 2 - CARD_MARGIN * 4) / 2;
// 扩大1.3倍，但限制最大宽度不超过屏幕
const CARD_WIDTH = Math.min(BASE_CARD_WIDTH * 1.3, width * 0.45);
const CARD_HEIGHT = CARD_WIDTH * 1.25;  // 保持比例不变

type TabType = 'chapters' | 'characters' | 'plots';
type ChapterViewMode = 'directory' | 'content';



const getStatusIcon = (chapter: Chapter) => {
  if (chapter.puzzleResult === 1) return '✅';  // 回答正确
  if (chapter.puzzleResult === 0) return '❌';  // 回答失败三次
  if (chapter.hasPuzzle && chapter.puzzleResult === null) return '🧩';  // 未回答
  if (!chapter.hasPuzzle) return '○';  // 无谜题
  return '🔒';  // 其他情况
};

interface BookDetailDemoProps {
  bookId: string;
  onBack: () => void;
  onNavigateToDirector: (bookId: string) => void;
}

const getRoleColor = (roleType: string) => {
  switch (roleType) {
    case '主角': return '#FFD700';
    case '伙伴': return '#3B82F6';
    case '导师': return '#10B981';
    case '守护者': return '#8B5CF6';
    case '小怪兽': return '#EF4444';
    default: return '#888';
  }
};

const BookDetailDemo: React.FC<BookDetailDemoProps> = ({ bookId, onBack, onNavigateToDirector }) => {
  const { 
    getBookById, 
    getChaptersByBookId, 
    getCharactersByBookId, 
    getCharactersByTypeId,
    getPlotElementsByTypeId, 
    updateBookProgress,
    getUnlockedElements,
    unlockElement,
    getLockedElements,
    updatePuzzleResult,
  } = useData();
  
  const [book, setBook] = useState<Book | null>(null);
  const [bookType, setBookType] = useState<string>('children');
  const cardStyleType = getCardStyleForBookType(bookType);
  const styleConfig = CARD_STYLES[cardStyleType];
  
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);  // 所有角色（用于章节卡牌显示）
  const [plotElements, setPlotElements] = useState<PlotElement[]>([]);
  const [allPlotElements, setAllPlotElements] = useState<PlotElement[]>([]);  // 所有情节元素（用于章节卡牌显示）
  const [unlockedElements, setUnlockedElements] = useState<UnlockedElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentTab, setCurrentTab] = useState<TabType>('chapters');
  const [chapterViewMode, setChapterViewMode] = useState<ChapterViewMode>('directory');
  const [directoryPage, setDirectoryPage] = useState<number>(0);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedPlotCardId, setSelectedPlotCardId] = useState<string | null>(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState<number | null>(null);
  const [puzzleAttempts, setPuzzleAttempts] = useState<number>(0);
  const [puzzleResult, setPuzzleResult] = useState<'correct' | 'wrong' | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockedCard, setUnlockedCard] = useState<{emoji: string; name: string; type: string} | null>(null);
  
  const [isCardAreaExpanded, setIsCardAreaExpanded] = useState(false);
  const [selectedDisplayCard, setSelectedDisplayCard] = useState<string | null>(null);
  const cardExpandAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  
  const flipAnim = useRef(new Animated.Value(0)).current;
  const tabAnims = useRef({
    chapters: new Animated.Value(8),
    characters: new Animated.Value(0),
    plots: new Animated.Value(0),
  }).current;

  useEffect(() => {
    loadData();
  }, [bookId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('[BookDetailDemo] loadData called, bookId:', bookId);
      const bookData = await getBookById(bookId);
      console.log('[BookDetailDemo] bookData from DB:', bookData);
      console.log('[BookDetailDemo] bookData.typeId:', bookData?.typeId);
      if (bookData) {
        setBook(bookData);
        setBookType(bookData.typeId || 'children');
        const chaptersData = await getChaptersByBookId(bookId);
        setChapters(chaptersData);
        
        const unlocked = await getUnlockedElements(bookId);
        setUnlockedElements(unlocked);
        console.log('[BookDetailDemo] unlocked elements:', unlocked.length);
        
        // 角色加载：从 characters 表获取所有该类型的角色，然后过滤已解锁的
        const unlockedCharIds = unlocked
          .filter(e => e.elementType === 'character')
          .map(e => e.elementId);
        console.log('[BookDetailDemo] unlockedCharIds:', unlockedCharIds);
        
        const allChars = await getCharactersByTypeId(bookData.typeId || 'children');
        console.log('[BookDetailDemo] allChars count:', allChars.length);
        setAllCharacters(allChars);  // 保存所有角色
        setCharacters(allChars.filter(c => unlockedCharIds.includes(c.characterId)));
        
        // 情节元素加载
        const allPlotElementsData = await getPlotElementsByTypeId(bookData.typeId);
        const unlockedPlotIds = unlocked.map(e => e.elementId);
        console.log('[BookDetailDemo] unlockedPlotIds:', unlockedPlotIds);
        console.log('[BookDetailDemo] allPlotElements count:', allPlotElementsData.length);
        setAllPlotElements(allPlotElementsData);  // 保存所有情节元素
        const filteredPlotElements = allPlotElementsData.filter(e => unlockedPlotIds.includes(e.elementId));
        console.log('[BookDetailDemo] filteredPlotElements count:', filteredPlotElements.length);
        setPlotElements(filteredPlotElements);
      }
    } catch (error) {
      console.error('Failed to load book data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDirectoryPages = Math.ceil((chapters.length + 1) / ITEMS_PER_PAGE);

  const getDirectoryPageItems = (page: number) => {
    const allItems: any[] = [...chapters, { chapterId: 'add-new', isAddButton: true }];
    const startIndex = page * ITEMS_PER_PAGE;
    const pageItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return pageItems;
  };

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
    setChapterViewMode('content');
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

  const handlePuzzleAnswer = async (optionIndex: number, chapter: Chapter) => {
    console.log('[Puzzle] handlePuzzleAnswer called');
    console.log('[Puzzle] optionIndex:', optionIndex, 'correctIndex:', chapter.puzzleCorrectIndex);
    console.log('[Puzzle] book:', book);
    console.log('[Puzzle] bookId:', bookId, 'typeId:', book?.typeId);
    
    // 检查是否已经回答过（成功或失败三次）
    if (chapter.puzzleResult !== null) {
      console.log('[Puzzle] Already answered, puzzleResult:', chapter.puzzleResult);
      Alert.alert('提示', '已经回答过了，不能重复答题');
      return;
    }
    
    if (!chapter.puzzleQuestion || !chapter.puzzleOptions || puzzleAttempts >= 3) return;
    
    setPuzzleAnswer(optionIndex);
    const newAttempts = puzzleAttempts + 1;
    setPuzzleAttempts(newAttempts);
    
    if (optionIndex === chapter.puzzleCorrectIndex) {
      console.log('[Puzzle] Answer CORRECT!');
      setPuzzleResult('correct');
      
      console.log('[Puzzle] Before updatePuzzleResult');
      await updatePuzzleResult(chapter.chapterId, 1);
      console.log('[Puzzle] After updatePuzzleResult');
      
      if (book) {
        console.log('[Puzzle] Before getLockedElements, bookId:', bookId, 'typeId:', book.typeId);
        const lockedElements = await getLockedElements(bookId, book.typeId);
        console.log('[Puzzle] After getLockedElements, result:', lockedElements);
        
        const allLocked = [
          ...lockedElements.characters.map(c => ({ id: c.characterId, type: 'character', emoji: c.emoji, name: c.name })),
          ...lockedElements.weathers.map(w => ({ id: w.elementId, type: 'weather', emoji: w.emoji, name: w.name })),
          ...lockedElements.terrains.map(t => ({ id: t.elementId, type: 'terrain', emoji: t.emoji, name: t.name })),
          ...lockedElements.equipments.map(e => ({ id: e.elementId, type: 'equipment', emoji: e.emoji, name: e.name })),
          ...lockedElements.adventures.map(a => ({ id: a.elementId, type: 'adventure', emoji: a.emoji, name: a.name })),
        ];
        
        console.log('[Puzzle] allLocked count:', allLocked.length);
        console.log('[Puzzle] allLocked items:', allLocked);
        
        if (allLocked.length > 0) {
          const randomIndex = Math.floor(Math.random() * allLocked.length);
          const randomCard = allLocked[randomIndex];
          console.log('[Puzzle] Unlocking card:', randomCard);
          await unlockElement(bookId, randomCard.id, randomCard.type);
          setUnlockedCard(randomCard);
          setShowUnlockModal(true);
          await loadData();
        } else {
          console.log('[Puzzle] No locked elements to unlock!');
        }
      } else {
        console.log('[Puzzle] No book found!');
      }
    } else if (newAttempts >= 3) {
      console.log('[Puzzle] Answer WRONG, max attempts reached');
      setPuzzleResult('wrong');
      await updatePuzzleResult(chapter.chapterId, 0);
    } else {
      console.log('[Puzzle] Answer WRONG, attempts:', newAttempts);
      setPuzzleResult('wrong');
      setTimeout(() => {
        setPuzzleResult(null);
        setPuzzleAnswer(null);
      }, 1000);
    }
  };

  const selectedChapter = chapters.find(c => c.chapterId === selectedChapterId);
  const selectedCharacter = characters.find(c => c.characterId === selectedCharacterId);
  const selectedPlotCard = plotElements.find(c => c.elementId === selectedPlotCardId);

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

  const renderChapterContentView = () => {
    if (!selectedChapter) return null;
    
    console.log(`[UI] renderChapterContentView: chapter=${selectedChapter.chapterNumber}, title=${selectedChapter.title}`);
    console.log(`[UI] selectedElements: ${JSON.stringify(selectedChapter.selectedElements)}`);
    console.log(`[UI] Puzzle check: hasPuzzle=${selectedChapter.hasPuzzle}, puzzleQuestion=${selectedChapter.puzzleQuestion}, puzzleOptions=${JSON.stringify(selectedChapter.puzzleOptions)}`);
    
    const currentIndex = chapters.findIndex(c => c.chapterId === selectedChapterId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < chapters.length - 1;
    
    // 获取本章卡牌
    let chapterCards: any[] = [];
    console.log('[BookDetailDemo] selectedChapter.selectedElements:', selectedChapter.selectedElements);
    console.log('[BookDetailDemo] allCharacters count:', allCharacters.length);
    console.log('[BookDetailDemo] allPlotElements count:', allPlotElements.length);
    
    if (selectedChapter.selectedElements) {
      const sel = selectedChapter.selectedElements;
      
      if (sel.characters && sel.characters.length > 0) {
        const chapterChars = allCharacters.filter(c => sel.characters!.includes(c.characterId));
        console.log('[BookDetailDemo] chapterChars found:', chapterChars.length);
        chapterCards.push(...chapterChars.map(c => ({ ...c, cardType: 'character', elementId: c.characterId })));
      }
      
      if (sel.weather) {
        const weather = allPlotElements.find(p => p.elementId === sel.weather);
        console.log('[BookDetailDemo] weather found:', weather?.name);
        if (weather) chapterCards.push({ ...weather, cardType: 'weather' });
      }
      if (sel.terrain) {
        const terrain = allPlotElements.find(p => p.elementId === sel.terrain);
        console.log('[BookDetailDemo] terrain found:', terrain?.name);
        if (terrain) chapterCards.push({ ...terrain, cardType: 'terrain' });
      }
      if (sel.equipment) {
        const equipment = allPlotElements.find(p => p.elementId === sel.equipment);
        console.log('[BookDetailDemo] equipment found:', equipment?.name);
        if (equipment) chapterCards.push({ ...equipment, cardType: 'equipment' });
      }
      if (sel.adventure) {
        const adventure = allPlotElements.find(p => p.elementId === sel.adventure);
        console.log('[BookDetailDemo] adventure found:', adventure?.name);
        if (adventure) chapterCards.push({ ...adventure, cardType: 'adventure' });
      }
    }
    console.log('[BookDetailDemo] Total chapterCards:', chapterCards.length);
    
    return (
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.backToDirectory} 
          onPress={() => setChapterViewMode('directory')}
        >
          <Text style={styles.backToDirectoryText}>← 目录</Text>
        </TouchableOpacity>
        
        <ScrollView style={styles.chapterScrollContainer}>
          <Text style={styles.chapterTitle}>第{selectedChapter.chapterNumber}章 {selectedChapter.title}</Text>
          <View style={styles.chapterDivider} />
          <Text style={styles.chapterContent}>{selectedChapter.content}</Text>
          
          {selectedChapter.hasPuzzle && selectedChapter.puzzleQuestion && selectedChapter.puzzleOptions && (
            <View style={styles.puzzleBox}>
              <Text style={styles.puzzleTitle}>❓ 谜题</Text>
              <Text style={styles.puzzleQuestion}>{selectedChapter.puzzleQuestion}</Text>
              <View style={styles.puzzleOptions}>
                {selectedChapter.puzzleOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.puzzleOption,
                      puzzleAnswer === index && styles.puzzleOptionSelected,
                      puzzleResult === 'correct' && index === selectedChapter.puzzleCorrectIndex && styles.puzzleOptionCorrect,
                      puzzleResult === 'wrong' && puzzleAnswer === index && styles.puzzleOptionWrong,
                    ]}
                    onPress={() => handlePuzzleAnswer(index, selectedChapter)}
                    disabled={puzzleResult === 'correct' || puzzleAttempts >= 3}
                  >
                    <Text style={styles.puzzleOptionText}>
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.puzzleAttempts}>尝试次数: {puzzleAttempts}/3</Text>
              {puzzleResult === 'correct' && (
                <Text style={styles.puzzleResultCorrect}>✅ 正确！</Text>
              )}
              {puzzleResult === 'wrong' && puzzleAttempts >= 3 && (
                <Text style={styles.puzzleResultWrong}>
                  ❌ 正确答案: {String.fromCharCode(65 + (selectedChapter.puzzleCorrectIndex ?? 0))}. {selectedChapter.puzzleOptions[selectedChapter.puzzleCorrectIndex ?? 0]}
                </Text>
              )}
            </View>
          )}
          
          {/* 本章卡牌展示区 */}
          {chapterCards.length > 0 && (
            <View style={styles.chapterCardsSection}>
              <Text style={styles.chapterCardsTitle}>🎴 本章卡牌</Text>
              <View style={styles.chapterCardsRow}>
                {chapterCards.map((card, index) => (
                  <View key={index} style={styles.chapterCardItem}>
                    <Text style={styles.chapterCardEmoji}>{card.emoji}</Text>
                    <Text style={styles.chapterCardName}>{card.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.chapterNavigation}>
          <TouchableOpacity
            style={[styles.navButton, !hasPrev && styles.navButtonDisabled]}
            onPress={() => {
              if (hasPrev) {
                const prevChapter = chapters[currentIndex - 1];
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
            {currentIndex + 1}/{chapters.length}
          </Text>
          
          <TouchableOpacity
            style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
            onPress={() => {
              if (hasNext) {
                const nextChapter = chapters[currentIndex + 1];
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

  const renderChaptersTab = () => {
    if (chapterViewMode === 'content' && selectedChapterId) {
      return renderChapterContentView();
    }
    
    const allItems = getDirectoryPageItems(directoryPage);
    
    const renderDirectoryItem = (item: any) => {
      if (item.isAddButton) {
        return (
          <TouchableOpacity
            key="add-new"
            style={styles.chapterItem}
            onPress={() => onNavigateToDirector(bookId)}
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
      <View style={{ flex: 1 }}>
        <View style={styles.bookPages}>
          <View style={styles.singlePage}>
            <Text style={styles.pageTitle}>目 录</Text>
            {allItems.map(renderDirectoryItem)}
          </View>
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
  };

  const renderCharactersTab = () => {
    const renderCharacterCard = (character: Character, index: number) => {
      const isSelected = selectedCharacterId === character.characterId;
      
      return (
        <TouchableOpacity
          key={character.characterId}
          style={[
            styles.characterCard,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => handleCharacterSelect(character.characterId)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <View style={[styles.glowRing, { borderColor: styleConfig.colors.accent }]} />
          )}
          <Text style={styles.cardEmoji}>{character.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{character.name}</Text>
          <Text style={[styles.cardRole, { color: getRoleColor(character.roleType) }]}>
            {character.roleType}
          </Text>
        </TouchableOpacity>
      );
    };
    
    return (
      <ScrollView style={styles.cardGridContainer}>
        <Text style={styles.sectionTitle}>👥 角色列表</Text>
        <View style={styles.cardRow}>
          {characters.map((character, index) => renderCharacterCard(character, index))}
        </View>
      </ScrollView>
    );
  };

  const renderPlotsTab = () => {
    const weatherElements = plotElements.filter(e => e.category === 'weather');
    const adventureElements = plotElements.filter(e => e.category === 'adventure');
    const terrainElements = plotElements.filter(e => e.category === 'terrain');
    const equipmentElements = plotElements.filter(e => e.category === 'equipment');
    
    const categories = [
      { key: 'weather', title: '☀️ 天气', data: weatherElements },
      { key: 'adventure', title: '⚔️ 冒险类型', data: adventureElements },
      { key: 'terrain', title: '🌲 地形', data: terrainElements },
      { key: 'equipment', title: '🪄 装备', data: equipmentElements },
    ];
    
    const renderPlotCard = (card: PlotElement, index: number) => {
      const isSelected = selectedPlotCardId === card.elementId;
      
      return (
        <TouchableOpacity
          key={card.elementId}
          style={[
            styles.plotCard,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => handlePlotCardSelect(card.elementId)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <View style={[styles.glowRing, { borderColor: styleConfig.colors.accent }]} />
          )}
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{card.name}</Text>
        </TouchableOpacity>
      );
    };
    
    return (
      <ScrollView style={styles.cardGridContainer}>
        {categories.map(category => (
          <View key={category.key} style={styles.plotCategory}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <View style={styles.cardRow}>
              {category.data.map((card, index) => renderPlotCard(card, index))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const handleCardDisplayTap = (card: any) => {
    const cardId = card.characterId || card.elementId;
    
    if (selectedDisplayCard === cardId) {
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }).start();
      setSelectedDisplayCard(null);
    } else {
      setSelectedDisplayCard(cardId);
      Animated.sequence([
        Animated.timing(cardScaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardScaleAnim, {
          toValue: 1.2,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderCardDisplayArea = () => {
    let displayCards: any[] = [];
    let areaTitle = '🎴 已解锁卡牌';

    // 检查是否在章节内容视图（chapterViewMode === 'content' 且有选中的章节）
    if (chapterViewMode === 'content' && selectedChapter && selectedChapter.selectedElements) {
      areaTitle = '🎴 本章卡牌';
      const sel = selectedChapter.selectedElements;
      
      if (sel.characters && sel.characters.length > 0) {
        const chapterChars = allCharacters.filter(c => sel.characters!.includes(c.characterId));
        displayCards.push(...chapterChars.map(c => ({ ...c, cardType: 'character', elementId: c.characterId })));
      }
      
      if (sel.weather) {
        const weather = allPlotElements.find(p => p.elementId === sel.weather);
        if (weather) displayCards.push({ ...weather, cardType: 'weather' });
      }
      if (sel.terrain) {
        const terrain = allPlotElements.find(p => p.elementId === sel.terrain);
        if (terrain) displayCards.push({ ...terrain, cardType: 'terrain' });
      }
      if (sel.equipment) {
        const equipment = allPlotElements.find(p => p.elementId === sel.equipment);
        if (equipment) displayCards.push({ ...equipment, cardType: 'equipment' });
      }
      if (sel.adventure) {
        const adventure = allPlotElements.find(p => p.elementId === sel.adventure);
        if (adventure) displayCards.push({ ...adventure, cardType: 'adventure' });
      }
    } else if (chapterViewMode === 'directory') {
      // 目录视图显示所有已解锁卡牌
      displayCards = [
        ...characters.map(c => ({ ...c, cardType: 'character', elementId: c.characterId })),
        ...plotElements.map(p => ({ ...p, cardType: p.category })),
      ];
    } else {
      // 章节内容视图但没有选择的卡牌，显示空
      displayCards = [];
      areaTitle = '🎴 本章卡牌';
    }

    const collapsedOffset = 30;
    const expandedOffset = CARD_WIDTH + CARD_MARGIN * 2;

    const renderStackedCard = (card: any, index: number) => {
      const isSelected = selectedDisplayCard === card.elementId || selectedDisplayCard === card.characterId;
      
      const translateX = cardExpandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [collapsedOffset * index, expandedOffset * index],
      });

      return (
        <Animated.View
          key={card.elementId || card.characterId}
          style={[
            styles.stackedCard,
            {
              transform: [
                { translateX: index > 0 ? translateX : 0 },
                { scale: isSelected ? cardScaleAnim : 1 },
              ],
              zIndex: isSelected ? 100 : displayCards.length - index,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.miniCard,
              {
                backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
                borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              },
            ]}
            onPress={() => handleCardDisplayTap(card)}
            activeOpacity={0.8}
          >
            <Text style={styles.miniCardEmoji}>{card.emoji}</Text>
            <Text style={[styles.miniCardName, { color: styleConfig.colors.text }]} numberOfLines={1}>
              {card.name}
            </Text>
            {card.roleType && (
              <Text style={[styles.miniCardRole, { color: getRoleColor(card.roleType) }]}>
                {card.roleType}
              </Text>
            )}
            {card.cardType && !card.roleType && (
              <Text style={[styles.miniCardRole, { color: '#64748B' }]}>
                {card.cardType === 'weather' ? '天气' :
                 card.cardType === 'terrain' ? '地形' :
                 card.cardType === 'equipment' ? '装备' :
                 card.cardType === 'adventure' ? '冒险' : ''}
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <View style={styles.cardDisplayArea}>
        <TouchableOpacity 
          style={styles.cardDisplayHeader}
          onPress={() => {
            setIsCardAreaExpanded(!isCardAreaExpanded);
            Animated.spring(cardExpandAnim, {
              toValue: isCardAreaExpanded ? 0 : 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.cardDisplayTitle}>
            {areaTitle} ({displayCards.length})
          </Text>
          <Text style={styles.cardDisplayToggle}>
            {isCardAreaExpanded ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>
        
        {displayCards.length > 0 && (
          <View style={styles.cardDisplayScroll}>
            {displayCards.map((card, index) => renderStackedCard(card, index))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 {book?.title || '加载中...'}</Text>
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

      {currentTab === 'chapters' && renderCardDisplayArea()}

      <View style={styles.footer}>
        <Text style={styles.pageNumber}>
          {currentTab === 'chapters' && selectedChapter
            ? `${selectedChapter.chapterNumber}/${chapters.length}`
            : '1/1'}
        </Text>
      </View>
      
      <Modal
        visible={showUnlockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnlockModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUnlockModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 恭喜解锁新卡牌！</Text>
            {unlockedCard && (
              <View style={styles.unlockedCardContainer}>
                <Text style={styles.unlockedCardEmoji}>{unlockedCard.emoji}</Text>
                <Text style={styles.unlockedCardName}>{unlockedCard.name}</Text>
                <Text style={styles.unlockedCardType}>
                  {unlockedCard.type === 'character' ? '角色' :
                   unlockedCard.type === 'weather' ? '天气' :
                   unlockedCard.type === 'terrain' ? '地形' :
                   unlockedCard.type === 'equipment' ? '装备' : '冒险类型'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowUnlockModal(false)}
            >
              <Text style={styles.modalButtonText}>太棒了！</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 12,
    paddingHorizontal: 16,
    minWidth: 80,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#1E293B',
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
    backgroundColor: '#FFFFFF',
  },
  bookmark: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#E2E8F0',
  },
  bookmarkActive: {
    backgroundColor: DEFAULT_THEME.primary,
    borderColor: DEFAULT_THEME.primary,
  },
  bookmarkText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookmarkTextActive: {
    color: '#FFFFFF',
  },
  bookContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  bookCover: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
  singlePage: {
    flex: 1,
    padding: 20,
  },
  pageDivider: {
    width: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chapterItemActive: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
  },
  chapterItemText: {
    fontSize: 14,
    color: '#374151',
  },
  chapterItemStatus: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  backToDirectory: {
    paddingVertical: 8,
    marginBottom: 10,
  },
  backToDirectoryText: {
    color: DEFAULT_THEME.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  chapterScrollContainer: {
    flex: 1,
  },
  chapterDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 15,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  chapterContent: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 22,
  },
  chapterNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 15,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: DEFAULT_THEME.primary,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#94A3B8',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#64748B',
  },
  directoryPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  puzzleBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#FDF4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  puzzleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 8,
  },
  puzzleQuestion: {
    fontSize: 13,
    color: '#4C1D95',
    marginBottom: 10,
  },
  puzzleOptions: {
    marginTop: 5,
  },
  puzzleOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  puzzleOptionSelected: {
    borderColor: DEFAULT_THEME.primary,
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  },
  puzzleOptionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  puzzleOptionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  puzzleOptionText: {
    fontSize: 13,
    color: '#374151',
  },
  puzzleAttempts: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  puzzleResultCorrect: {
    fontSize: 14,
    color: '#10B981',
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
  cardGridContainer: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CARD_ROW_PADDING,
  },
  characterCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 12,
    margin: CARD_MARGIN,
  },
  cardSelected: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  glowRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    borderWidth: 2,
  },
  cardEmoji: {
    fontSize: 64,  // 放大一倍
    marginBottom: 4,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardRole: {
    fontSize: 10,
    marginTop: 2,
  },
  plotCategory: {
    marginBottom: 15,
  },
  plotCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 12,
    margin: CARD_MARGIN,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  pageNumber: {
    color: '#94A3B8',
    fontSize: 12,
  },
  chapterCardsSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chapterCardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  chapterCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chapterCardItem: {
    width: CARD_WIDTH * 0.8,
    height: CARD_HEIGHT * 0.8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  chapterCardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  chapterCardName: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width * 0.8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  unlockedCardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  unlockedCardEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  unlockedCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  unlockedCardType: {
    fontSize: 14,
    color: '#64748B',
  },
  modalButton: {
    backgroundColor: DEFAULT_THEME.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDisplayArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    maxHeight: '25%',
  },
  cardDisplayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardDisplayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardDisplayToggle: {
    fontSize: 12,
    color: '#64748B',
  },
  cardDisplayScroll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 120,
  },
  stackedCard: {
    position: 'absolute',
    left: 10,
  },
  miniCard: {
    width: 70,
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 6,
  },
  miniCardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  miniCardName: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  miniCardRole: {
    fontSize: 9,
    marginTop: 2,
  },
});

export default BookDetailDemo;
