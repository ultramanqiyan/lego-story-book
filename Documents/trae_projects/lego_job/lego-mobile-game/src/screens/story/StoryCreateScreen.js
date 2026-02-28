import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, EmptyState, Loading, Modal } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const StoryCreateScreen = () => {
  const navigation = useNavigation();
  const { selectBook, addCharacter, selectedCharacters } = useGame();
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(1);
  const [books, setBooks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [booksRes, charsRes] = await Promise.all([
        api.books.getAll(),
        api.characters.getAll(),
      ]);
      setBooks(booksRes.data || []);
      setCharacters(charsRes.data || []);
      setPlots([
        { id: 'adventure', name: '冒险故事', icon: '🗺️' },
        { id: 'mystery', name: '神秘故事', icon: '🔮' },
        { id: 'friendship', name: '友情故事', icon: '🤝' },
        { id: 'hero', name: '英雄故事', icon: '🦸' },
      ]);
    } catch (error) {
      showError('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStory = async () => {
    if (!selectedBook || !selectedPlot) {
      showError('请选择书籍和情节');
      return;
    }

    setIsCreating(true);
    try {
      const response = await api.story.create({
        bookId: selectedBook.id,
        plotType: selectedPlot.id,
        characterIds: selectedCharacters.map(c => c.id),
        characters: selectedCharacters,
        plot: selectedPlot.name,
      });
      showSuccess('故事创建成功');
      navigation.navigate('BookDetail', { bookId: selectedBook.id });
    } catch (error) {
      showError('创建故事失败');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map(s => (
        <View
          key={s}
          style={[
            styles.stepDot,
            step >= s && styles.stepDotActive,
          ]}
        >
          <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>创建故事</Text>
        {renderStepIndicator()}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>选择书籍</Text>
            {books.map(book => (
              <TouchableOpacity key={book.id} onPress={() => setSelectedBook(book)}>
                <Card
                  rarity={selectedBook?.id === book.id ? 'legendary' : 'common'}
                  selected={selectedBook?.id === book.id}
                  style={styles.optionCard}
                >
                  <Text style={styles.optionText}>{book.title}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>选择情节</Text>
            {plots.map(plot => (
              <TouchableOpacity key={plot.id} onPress={() => setSelectedPlot(plot)}>
                <Card
                  rarity={selectedPlot?.id === plot.id ? 'legendary' : 'common'}
                  selected={selectedPlot?.id === plot.id}
                  style={styles.optionCard}
                >
                  <Text style={styles.plotIcon}>{plot.icon}</Text>
                  <Text style={styles.optionText}>{plot.name}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>选择角色</Text>
            {characters.map(char => (
              <TouchableOpacity
                key={char.id}
                onPress={() => {
                  if (selectedCharacters.some(c => c.id === char.id)) {
                    // removeCharacter(char.id);
                  } else {
                    addCharacter(char);
                  }
                }}
              >
                <Card
                  rarity={selectedCharacters.some(c => c.id === char.id) ? 'legendary' : 'common'}
                  selected={selectedCharacters.some(c => c.id === char.id)}
                  style={styles.optionCard}
                >
                  <Text style={styles.optionText}>{char.name}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>确认创建</Text>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>书籍:</Text>
              <Text style={styles.summaryValue}>{selectedBook?.title}</Text>
              <Text style={styles.summaryLabel}>情节:</Text>
              <Text style={styles.summaryValue}>{selectedPlot?.name}</Text>
              <Text style={styles.summaryLabel}>角色:</Text>
              <Text style={styles.summaryValue}>
                {selectedCharacters.map(c => c.name).join(', ') || '无'}
              </Text>
            </Card>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backButtonText}>上一步</Text>
            </TouchableOpacity>
          )}
          {step < 4 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setStep(step + 1)}
            >
              <Text style={styles.nextButtonText}>下一步</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateStory}
              disabled={isCreating}
            >
              <Text style={styles.createButtonText}>
                {isCreating ? '创建中...' : '创建故事'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  pageTitle: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.gold.primary,
  },
  stepNumber: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
  },
  stepNumberActive: {
    color: COLORS.background.primary,
    fontWeight: '700',
  },
  stepContent: {
    marginBottom: SPACING.xl,
  },
  stepTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  plotIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  optionText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
  },
  summaryCard: {
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  summaryValue: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  backButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.text.primary,
  },
  nextButton: {
    flex: 1,
    backgroundColor: COLORS.gold.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: COLORS.status.success,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  createButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default StoryCreateScreen;
