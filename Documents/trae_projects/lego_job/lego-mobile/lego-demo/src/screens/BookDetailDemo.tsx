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
  Modal,
} from 'react-native';
import { useData } from '../context/DataContext';
import { Book, Chapter, Character, PlotElement, UnlockedElement } from '../database/DatabaseService';

const { width, height } = Dimensions.get('window');
const PAGE_WIDTH = (width - 60) / 2;
const PAGE_HEIGHT = height - 200;
const ITEMS_PER_PAGE = 6;

type TabType = 'chapters' | 'characters' | 'plots';
type ChapterViewMode = 'directory' | 'content';



const getStatusIcon = (chapter: Chapter) => {
  if (chapter.puzzleResult === 1) return '✅';
  if (chapter.hasPuzzle && chapter.puzzleResult === null) return '🧩';
  if (!chapter.hasPuzzle && chapter.puzzleResult === null) return '○';
  return '🔒';
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
    getPlotElementsByTypeId, 
    updateBookProgress,
    getUnlockedElements,
    unlockElement,
    getLockedElements,
    updatePuzzleResult,
  } = useData();
  
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [plotElements, setPlotElements] = useState<PlotElement[]>([]);
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
      const bookData = await getBookById(bookId);
      if (bookData) {
        setBook(bookData);
        const chaptersData = await getChaptersByBookId(bookId);
        setChapters(chaptersData);
        
        const unlocked = await getUnlockedElements(bookId);
        setUnlockedElements(unlocked);
        
        const unlockedCharIds = unlocked
          .filter(e => e.elementType === 'character')
          .map(e => e.elementId);
        const allChars = await getCharactersByBookId(bookId);
        setCharacters(allChars.filter(c => unlockedCharIds.includes(c.characterId)));
        
        const allPlotElements = await getPlotElementsByTypeId(bookData.typeId);
        const unlockedPlotIds = unlocked.map(e => e.elementId);
        setPlotElements(allPlotElements.filter(e => unlockedPlotIds.includes(e.elementId)));
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
    if (!chapter.puzzleQuestion || !chapter.puzzleOptions || puzzleAttempts >= 3) return;
    
    setPuzzleAnswer(optionIndex);
    const newAttempts = puzzleAttempts + 1;
    setPuzzleAttempts(newAttempts);
    
    if (optionIndex === chapter.puzzleCorrectIndex) {
      setPuzzleResult('correct');
      await updatePuzzleResult(chapter.chapterId, 1);
      
      if (book) {
        const lockedElements = await getLockedElements(bookId, book.typeId);
        const allLocked = [
          ...lockedElements.characters.map(c => ({ id: c.characterId, type: 'character', emoji: c.emoji, name: c.name })),
          ...lockedElements.weathers.map(w => ({ id: w.elementId, type: 'weather', emoji: w.emoji, name: w.name })),
          ...lockedElements.terrains.map(t => ({ id: t.elementId, type: 'terrain', emoji: t.emoji, name: t.name })),
          ...lockedElements.equipments.map(e => ({ id: e.elementId, type: 'equipment', emoji: e.emoji, name: e.name })),
          ...lockedElements.adventures.map(a => ({ id: a.elementId, type: 'adventure', emoji: a.emoji, name: a.name })),
        ];
        
        if (allLocked.length > 0) {
          const randomIndex = Math.floor(Math.random() * allLocked.length);
          const randomCard = allLocked[randomIndex];
          await unlockElement(bookId, randomCard.id, randomCard.type);
          setUnlockedCard(randomCard);
          setShowUnlockModal(true);
          await loadData();
        }
      }
    } else if (newAttempts >= 3) {
      setPuzzleResult('wrong');
      await updatePuzzleResult(chapter.chapterId, 0);
    } else {
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
    console.log(`[UI] Puzzle check: hasPuzzle=${selectedChapter.hasPuzzle}, puzzleQuestion=${selectedChapter.puzzleQuestion}, puzzleOptions=${JSON.stringify(selectedChapter.puzzleOptions)}`);
    
    const currentIndex = chapters.findIndex(c => c.chapterId === selectedChapterId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < chapters.length - 1;
    
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
            isSelected && styles.cardSelected,
          ]}
          onPress={() => handleCharacterSelect(character.characterId)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <View style={[styles.glowRing, { borderColor: getRoleColor(character.roleType) }]} />
          )}
          <Text style={styles.cardEmoji}>{character.emoji}</Text>
          <Text style={styles.cardName}>{character.name}</Text>
          <Text style={[styles.cardRole, { color: getRoleColor(character.roleType) }]}>
            {character.roleType}
          </Text>
        </TouchableOpacity>
      );
    };
    
    return (
      <ScrollView style={styles.cardGridContainer}>
        <Text style={styles.sectionTitle}>👥 角色列表</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardRow}>
            {characters.map((character, index) => renderCharacterCard(character, index))}
          </View>
        </ScrollView>
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
            isSelected && styles.cardSelected,
          ]}
          onPress={() => handlePlotCardSelect(card.elementId)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <View style={[styles.glowRing, { borderColor: '#FFD700' }]} />
          )}
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={styles.cardName}>{card.name}</Text>
        </TouchableOpacity>
      );
    };
    
    return (
      <ScrollView style={styles.cardGridContainer}>
        {categories.map(category => (
          <View key={category.key} style={styles.plotCategory}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cardRow}>
                {category.data.map((card, index) => renderPlotCard(card, index))}
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: '#1E1B4B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4C1D95',
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
    color: '#E0E7FF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#F8FAFC',
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
    backgroundColor: '#312E81',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#4338CA',
  },
  bookmarkActive: {
    backgroundColor: '#4338CA',
    borderColor: '#6366F1',
  },
  bookmarkText: {
    color: '#C4B5FD',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookmarkTextActive: {
    color: '#F8FAFC',
  },
  bookContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  bookCover: {
    flex: 1,
    backgroundColor: '#312E81',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    shadowColor: '#8B5CF6',
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
  singlePage: {
    flex: 1,
    padding: 20,
  },
  pageDivider: {
    width: 2,
    backgroundColor: '#4338CA',
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
  cardGridContainer: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A3728',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 5,
  },
  characterCard: {
    width: 80,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D2B48C',
    backgroundColor: '#FFF8DC',
    padding: 8,
  },
  cardSelected: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderColor: '#8B4513',
    backgroundColor: '#FFF',
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
    fontSize: 32,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A3728',
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
    width: 80,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D2B48C',
    backgroundColor: '#FFF8DC',
    padding: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageNumber: {
    color: '#D2B48C',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF8DC',
    borderRadius: 16,
    padding: 24,
    width: width * 0.8,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3728',
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
    color: '#4A3728',
    marginBottom: 4,
  },
  unlockedCardType: {
    fontSize: 14,
    color: '#8B4513',
  },
  modalButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF8DC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailDemo;
