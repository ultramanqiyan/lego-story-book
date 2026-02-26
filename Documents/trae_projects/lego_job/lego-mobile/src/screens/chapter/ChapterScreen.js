import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { chaptersAPI, puzzleAPI, plotOptionsAPI, booksAPI } from '../../api';
import { Card, Button, Loading, Modal, Header, ParticleBackground } from '../../components/common';
import KeywordHighlight from '../../components/chapter/KeywordHighlight';
import { COLORS } from '../../utils/constants';

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const ChapterScreen = ({ route, navigation }) => {
  const { chapterId, bookId } = route.params;
  const { user } = useAuth();
  const toast = useToast();
  
  const [chapter, setChapter] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [plotModalVisible, setPlotModalVisible] = useState(false);
  const [plotOptions, setPlotOptions] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState({
    weather: null,
    adventureType: null,
    terrain: null,
    equipment: null,
  });
  const [bookCharacters, setBookCharacters] = useState([]);
  const [navigationInfo, setNavigationInfo] = useState({ prev: null, next: null, total: 0, current: 1 });
  const [hintVisible, setHintVisible] = useState(false);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-40)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const paragraphAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const puzzleAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    loadChapter();
  }, [chapterId]);

  useEffect(() => {
    if (!isLoading && chapter) {
      startAnimations();
    }
  }, [isLoading, chapter]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.spring(titleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(titleY, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    paragraphAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 150,
        useNativeDriver: true,
      }).start();
    });

    if (puzzle && !isCorrect) {
      Animated.timing(puzzleAnim, {
        toValue: 1,
        duration: 700,
        delay: 800,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();
    }
  };

  const loadChapter = async () => {
    try {
      const data = await chaptersAPI.getDetail(chapterId, user?.userId);
      setChapter(data.chapter);
      if (data.chapter.has_puzzle && data.puzzle) {
        setPuzzle(data.puzzle);
        if (data.puzzleRecord) {
          setIsCorrect(data.puzzleRecord.is_correct === 1);
        }
      }

      if (data.bookCharacters) {
        setBookCharacters(data.bookCharacters);
      }

      if (data.navigation) {
        setNavigationInfo(data.navigation);
      }

      if (bookId) {
        try {
          const bookData = await booksAPI.getDetail(bookId, user?.userId);
          if (bookData.characters) {
            setBookCharacters(bookData.characters);
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (selectedAnswer || isCorrect) return;

    setSelectedAnswer(answer);
    try {
      const result = await puzzleAPI.submit(puzzle.puzzle_id, user?.userId, answer);
      setAttempts(result.attempts);
      
      if (result.isCorrect) {
        setIsCorrect(true);
        toast.success('🎉 回答正确！');
        await chaptersAPI.complete(bookId, chapterId, user?.userId);
        
        Animated.spring(resultAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();

        celebrationAnims.forEach((anim, index) => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            delay: index * 80,
            easing: BOUNCE_EASING,
            useNativeDriver: true,
          }).start();
        });
      } else {
        toast.error(`❌ 答案错误，还有 ${3 - result.attempts} 次机会`);
        if (result.hint) {
          toast.info(`💡 提示：${result.hint}`);
        }
        
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0.5, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();
        
        setTimeout(() => setSelectedAnswer(null), 1000);
      }
    } catch (error) {
      toast.error('提交失败');
      setSelectedAnswer(null);
    }
  };

  const openPlotModal = async () => {
    if (!plotOptions) {
      try {
        const data = await plotOptionsAPI.get();
        setPlotOptions(data.plotOptions);
      } catch (error) {
        console.error('Failed to load plot options');
      }
    }
    setPlotModalVisible(true);
  };

  const handleGenerateNext = async () => {
    if (!selectedPlot.weather || !selectedPlot.adventureType || !selectedPlot.terrain || !selectedPlot.equipment) {
      toast.error('请选择所有情节选项');
      return;
    }

    setPlotModalVisible(false);
    try {
      await chaptersAPI.generate(bookId, user?.userId, selectedPlot);
      toast.success('新章节生成成功！');
      navigation.goBack();
    } catch (error) {
      toast.error(`生成失败：${error.message}`);
    }
  };

  const goToChapter = (targetChapterId) => {
    if (targetChapterId) {
      navigation.push('Chapter', { chapterId: targetChapterId, bookId });
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="加载章节..." />;
  }

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '70%'],
  });

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return (
    <View style={styles.container}>
      <ParticleBackground />
      
      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: ChapterScreen (章节阅读页)</Text>
      </View>
      
      <Header
        title={`第${chapter?.chapter_number}章`}
        subtitle={chapter?.title}
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
      />

      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Animated.Text 
            style={[
              styles.chapterTitle, 
              { 
                opacity: titleAnim,
                transform: [{ translateY: titleY }],
              }
            ]}
          >
            {chapter?.title}
          </Animated.Text>
          <Animated.View style={[styles.titleUnderline, { width: underlineWidth }]} />
        </View>

        <TouchableOpacity 
          style={styles.hintToggle}
          onPress={() => setHintVisible(!hintVisible)}
        >
          <Text style={styles.hintToggleText}>
            {hintVisible ? '▼ 收起创作提示' : '▶ 展开创作提示'}
          </Text>
        </TouchableOpacity>

        {hintVisible && (
          <Card style={styles.hintCard}>
            <Text style={styles.hintTitle}>📖 故事背景</Text>
            <Text style={styles.hintContent}>
              {chapter?.story_context || '这是一个充满冒险的故事...'}
            </Text>
            {bookCharacters.length > 0 && (
              <>
                <Text style={styles.hintTitle}>👥 登场角色</Text>
                <View style={styles.charactersList}>
                  {bookCharacters.map((char, index) => (
                    <View key={index} style={styles.characterChip}>
                      <Text style={styles.characterName}>{char.custom_name || char.name}</Text>
                      <Text style={styles.characterRole}>
                        {char.role_type === 'protagonist' && '👑'}
                        {char.role_type === 'antagonist' && '😈'}
                        {char.role_type === 'supporting' && '⭐'}
                        {char.role_type === 'extra' && '👤'}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card>
        )}

        <Card style={styles.storyCard}>
          <KeywordHighlight 
            content={chapter?.content} 
            characters={bookCharacters} 
          />
        </Card>

        {puzzle && !isCorrect && (
          <Animated.View 
            style={[
              styles.puzzleWrapper,
              {
                opacity: puzzleAnim,
                transform: [
                  { translateX: puzzleAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                  { rotateY: puzzleAnim.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '0deg'] }) },
                ],
              }
            ]}
          >
            <Card variant="warning" style={styles.puzzleCard}>
              <Text style={styles.puzzleTitle}>❓ 互动谜题</Text>
              <Text style={styles.puzzleQuestion}>{puzzle.question}</Text>
              
              <View style={styles.optionsGrid}>
                {JSON.parse(puzzle.options).map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswer === option.charAt(0) && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleAnswer(option.charAt(0))}
                    disabled={selectedAnswer !== null}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionText}>
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.attemptsText}>
                尝试次数: {attempts} / 3
              </Text>
            </Card>
          </Animated.View>
        )}

        {isCorrect && (
          <Animated.View 
            style={[
              styles.resultWrapper,
              { 
                opacity: resultAnim,
                transform: [{ scale: resultAnim }, { translateX: shakeTranslateX }],
              }
            ]}
          >
            <Card variant="success" style={styles.resultCard}>
              <View style={styles.celebrationContainer}>
                {['⭐', '✨', '🌟', '💫', '🎉', '🎊', '⭐', '✨'].map((emoji, index) => {
                  const translateX = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (Math.random() - 0.5) * 150],
                  });
                  const translateY = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (Math.random() - 0.5) * 150],
                  });
                  const scale = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1.5],
                  });
                  
                  return (
                    <Animated.Text
                      key={index}
                      style={[
                        styles.celebrationStar,
                        { transform: [{ translateX }, { translateY }, { scale }] },
                      ]}
                    >
                      {emoji}
                    </Animated.Text>
                  );
                })}
              </View>
              <Text style={styles.resultIcon}>✅</Text>
              <Text style={styles.resultTitle}>太棒了！</Text>
              <Text style={styles.resultText}>你成功解开了谜题，可以继续冒险了！</Text>
            </Card>
          </Animated.View>
        )}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, !navigationInfo.prev && styles.navButtonDisabled]}
            onPress={() => goToChapter(navigationInfo.prev)}
            disabled={!navigationInfo.prev}
          >
            <Text style={styles.navButtonIcon}>◀</Text>
            <Text style={styles.navButtonText}>上一章</Text>
          </TouchableOpacity>
          
          <View style={styles.navIndicator}>
            <Text style={styles.navIndicatorText}>
              {navigationInfo.current} / {navigationInfo.total}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.navButton, !navigationInfo.next && styles.navButtonDisabled]}
            onPress={() => goToChapter(navigationInfo.next)}
            disabled={!navigationInfo.next}
          >
            <Text style={styles.navButtonText}>下一章</Text>
            <Text style={styles.navButtonIcon}>▶</Text>
          </TouchableOpacity>
        </View>

        {(isCorrect || !puzzle) && (
          <Button
            title="✨ 继续生成故事"
            onPress={openPlotModal}
            size="lg"
            style={styles.continueButton}
          />
        )}
      </ScrollView>

      <Modal
        visible={plotModalVisible}
        onClose={() => setPlotModalVisible(false)}
        title="🎭 选择故事情节"
      >
        <ScrollView style={styles.plotModalContent}>
          {plotOptions && Object.entries(plotOptions).map(([category, options]) => (
            <View key={category} style={styles.plotSection}>
              <Text style={styles.plotSectionTitle}>
                {category === 'weather' && '☀️ 天气'}
                {category === 'adventureType' && '🗺️ 冒险类型'}
                {category === 'terrain' && '🌲 地形'}
                {category === 'equipment' && '🪄 装备与道具'}
              </Text>
              <View style={styles.plotOptions}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.plotOption,
                      selectedPlot[category] === option.id && styles.plotOptionActive,
                    ]}
                    onPress={() => setSelectedPlot({ ...selectedPlot, [category]: option.id })}
                  >
                    <Text style={styles.plotOptionIcon}>{option.icon}</Text>
                    <Text style={styles.plotOptionName}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <Button title="✨ 确认生成" onPress={handleGenerateNext} size="lg" />
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  debugLabel: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  debugLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chapterTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  titleUnderline: {
    height: 3,
    backgroundColor: COLORS.legoYellow,
    marginTop: 8,
    borderRadius: 2,
  },
  hintToggle: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  hintToggleText: {
    fontSize: 14,
    color: COLORS.legoBlue,
    fontWeight: '600',
  },
  hintCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  hintContent: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 12,
  },
  charactersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.legoYellow + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  characterName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 4,
  },
  characterRole: {
    fontSize: 12,
  },
  storyCard: {
    marginBottom: 20,
    padding: 20,
  },
  puzzleWrapper: {
    marginBottom: 20,
  },
  puzzleCard: {
    padding: 20,
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  puzzleQuestion: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  optionsGrid: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  attemptsText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  resultWrapper: {
    marginBottom: 20,
  },
  resultCard: {
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationStar: {
    position: 'absolute',
    fontSize: 24,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonIcon: {
    fontSize: 14,
    color: COLORS.legoBlue,
    marginHorizontal: 4,
  },
  navButtonText: {
    fontSize: 14,
    color: COLORS.legoBlue,
    fontWeight: '600',
  },
  navIndicator: {
    backgroundColor: COLORS.legoYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  navIndicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  continueButton: {
    marginBottom: 40,
  },
  plotModalContent: {
    maxHeight: 400,
  },
  plotSection: {
    marginBottom: 20,
  },
  plotSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  plotOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  plotOption: {
    width: '23%',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  plotOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  plotOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  plotOptionName: {
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default ChapterScreen;
