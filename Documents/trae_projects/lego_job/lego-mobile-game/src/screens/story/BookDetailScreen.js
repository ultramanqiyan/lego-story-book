import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, EmptyState, Loading } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params || {};
  const { selectBook, selectChapter } = useGame();
  const { showSuccess, showError } = useToast();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      loadBookData();
    }
  }, [bookId]);

  const loadBookData = async () => {
    try {
      setIsLoading(true);
      const [bookRes, chaptersRes, charsRes] = await Promise.all([
        api.books.getById(bookId),
        api.chapters.getByBookId(bookId),
        api.characters.getByBookId(bookId),
      ]);
      setBook(bookRes.data);
      setChapters(chaptersRes.data || []);
      setCharacters(charsRes.data || []);
      selectBook(bookRes.data);
    } catch (error) {
      showError('加载书籍详情失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterPress = (chapter) => {
    selectChapter(chapter);
    navigation.navigate('Chapter', { chapterId: chapter.id });
  };

  const handleCreateChapter = async () => {
    try {
      const response = await api.chapters.generate(bookId);
      showSuccess('章节生成成功');
      loadBookData();
    } catch (error) {
      showError('生成章节失败');
    }
  };

  const handleDirectorMode = () => {
    navigation.navigate('StoryDirector', { bookId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon={<Text style={styles.emptyIcon}>📚</Text>}
          title="书籍不存在"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.bookHeader}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookInfo}>
            {chapters.length} 章节 · {characters.length} 角色
          </Text>
        </Card>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} onPress={handleCreateChapter}>
            <Text style={styles.actionIcon}>✨</Text>
            <Text style={styles.actionText}>生成章节</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handleDirectorMode}>
            <Text style={styles.actionIcon}>🎬</Text>
            <Text style={styles.actionText}>导演模式</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>章节列表</Text>
        {chapters.length === 0 ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>📖</Text>}
            title="还没有章节"
            message="点击上方生成章节"
          />
        ) : (
          chapters.map((chapter, index) => (
            <TouchableOpacity key={chapter.id} onPress={() => handleChapterPress(chapter)}>
              <Card style={styles.chapterCard}>
                <Text style={styles.chapterNumber}>第 {index + 1} 章</Text>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>角色列表</Text>
        {characters.length > 0 && (
          <View style={styles.characterList}>
            {characters.map(char => (
              <Card key={char.id} style={styles.characterCard}>
                <Text style={styles.characterName}>{char.name}</Text>
                <Text style={styles.characterRole}>{char.role || '角色'}</Text>
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
  bookHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  bookTitle: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
    textAlign: 'center',
  },
  bookInfo: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.primary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  chapterCard: {
    marginBottom: SPACING.md,
  },
  chapterNumber: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.gold.primary,
  },
  chapterTitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  characterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  characterCard: {
    width: '48%',
  },
  characterName: {
    ...TYPOGRAPHY.styles.cardTitle,
    color: COLORS.text.primary,
  },
  characterRole: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  emptyIcon: {
    fontSize: 48,
  },
});

export default BookDetailScreen;
