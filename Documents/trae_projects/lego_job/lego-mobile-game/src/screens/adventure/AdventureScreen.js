import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, EmptyState, Loading } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const AdventureScreen = () => {
  const navigation = useNavigation();
  const { currentBook, startGame, gameState, adventureProgress, score } = useGame();
  const { showSuccess, showError } = useToast();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const response = await api.story.getAll();
      setStories(response.data || []);
    } catch (error) {
      showError('加载故事失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAdventure = (story) => {
    startGame();
    navigation.navigate('Chapter', { storyId: story.id });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParticleBackground count={20} colors={[COLORS.magic.blue, COLORS.magic.purple]} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>冒险模式</Text>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>总积分</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{adventureProgress.correctAnswers}</Text>
            <Text style={styles.statLabel}>正确答案</Text>
          </Card>
        </View>

        {stories.length === 0 ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>🗺️</Text>}
            title="没有可用的冒险"
            message="先创建一些故事吧"
          />
        ) : (
          <View style={styles.storyList}>
            {stories.map(story => (
              <Card key={story.id} style={styles.storyCard}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyDescription} numberOfLines={2}>
                  {story.description || '开始一场精彩的冒险'}
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartAdventure(story)}
                >
                  <Text style={styles.startButtonText}>开始冒险</Text>
                </TouchableOpacity>
              </Card>
            ))}
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
  pageTitle: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  statCard: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  statValue: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  storyList: {
    gap: SPACING.md,
  },
  storyCard: {
    marginBottom: SPACING.md,
  },
  storyTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  storyDescription: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.status.success,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  startButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 64,
  },
});

export default AdventureScreen;
