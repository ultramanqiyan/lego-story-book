import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, Loading, GlowEffect } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const ChapterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chapterId, storyId } = route.params || {};
  const { recordAnswer, addScore } = useGame();
  const { showSuccess, showError } = useToast();
  const [chapter, setChapter] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (chapterId) {
        const response = await api.chapters.getById(chapterId);
        setChapter(response.data);
        if (response.data.puzzle) {
          setPuzzle(response.data.puzzle);
        }
      } else if (storyId) {
        const response = await api.story.getById(storyId);
        setChapter(response.data);
      }
    } catch (error) {
      showError('加载章节失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !puzzle) return;
    
    const correctAnswer = puzzle.correctAnswer || puzzle.answer;
    const isCorrect = selectedAnswer === correctAnswer;
    setShowResult(true);
    recordAnswer(isCorrect);
    
    if (isCorrect) {
      showSuccess('回答正确！');
    } else {
      showError('回答错误');
    }
  };

  const handleNextChapter = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>章节不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParticleBackground count={20} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.storyCard}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.storyContent}>{chapter.content}</Text>
        </Card>

        {puzzle && (
          <View style={styles.puzzleSection}>
            <Text style={styles.puzzleQuestion}>{puzzle.question}</Text>
            
            {puzzle.options && puzzle.options.map((option, index) => {
              const correctAnswer = puzzle.correctAnswer || puzzle.answer;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswerSelect(option)}
                  style={styles.answerCardContainer}
                >
                  <Card
                    rarity={
                      showResult
                        ? option === correctAnswer
                          ? 'legendary'
                          : selectedAnswer === option
                          ? 'common'
                          : 'common'
                        : selectedAnswer === option
                        ? 'rare'
                        : 'common'
                    }
                    selected={selectedAnswer === option}
                    style={styles.answerCard}
                  >
                    <Text style={styles.answerText}>{option}</Text>
                  </Card>
                </TouchableOpacity>
              );
            })}

            {!showResult && selectedAnswer && (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswer}>
                <Text style={styles.submitButtonText}>确认答案</Text>
              </TouchableOpacity>
            )}

            {showResult && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNextChapter}>
                <Text style={styles.nextButtonText}>继续</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING['3xl'],
  },
  storyCard: {
    marginBottom: SPACING.xl,
  },
  chapterTitle: {
    ...TYPOGRAPHY.styles.h3,
    color: COLORS.gold.primary,
    marginBottom: SPACING.md,
  },
  storyContent: {
    ...TYPOGRAPHY.styles.bodyLarge,
    color: COLORS.text.primary,
    lineHeight: 28,
  },
  puzzleSection: {
    marginTop: SPACING.lg,
  },
  puzzleQuestion: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  answerCardContainer: {
    marginBottom: SPACING.md,
  },
  answerCard: {
    alignItems: 'center',
  },
  answerText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
  },
  submitButton: {
    backgroundColor: COLORS.gold.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: COLORS.status.success,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  nextButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
  errorText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default ChapterScreen;
