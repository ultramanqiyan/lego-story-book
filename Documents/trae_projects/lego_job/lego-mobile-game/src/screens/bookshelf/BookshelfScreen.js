import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, CardDeck, EmptyState, Loading, Modal } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const BookshelfScreen = () => {
  const navigation = useNavigation();
  const { selectBook } = useGame();
  const { showSuccess, showError } = useToast();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.books.getAll();
      setBooks(response.data || []);
    } catch (error) {
      showError('加载书籍失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPress = (book) => {
    setSelectedBook(book);
  };

  const handleBookSelect = () => {
    if (selectedBook) {
      selectBook(selectedBook);
      navigation.navigate('BookDetail', { bookId: selectedBook.id });
    }
  };

  const renderBookCard = (book) => (
    <View style={styles.bookCardContent}>
      <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.bookInfo}>
        {book.chapterCount || book.chapter_count || 0} 章节
      </Text>
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
        <Text style={styles.pageTitle}>我的书架</Text>

        {books.length === 0 ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>📚</Text>}
            title="还没有书籍"
            message="长按创建你的第一本书"
          />
        ) : (
          <CardDeck
            cards={books}
            renderCard={renderBookCard}
            selectedCardId={selectedBook?.id}
            onCardPress={handleBookPress}
            cardWidth={180}
            cardHeight={250}
          />
        )}

        {selectedBook && (
          <Card style={styles.actionCard}>
            <Text style={styles.selectedBookTitle}>{selectedBook.title}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBookSelect}
            >
              <Text style={styles.actionButtonText}>选择这本书</Text>
            </TouchableOpacity>
          </Card>
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
  bookCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    ...TYPOGRAPHY.styles.cardTitle,
    color: COLORS.text.primary,
  },
  bookInfo: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  actionCard: {
    marginTop: SPACING.xl,
  },
  selectedBookTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  actionButton: {
    backgroundColor: COLORS.gold.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 64,
  },
});

export default BookshelfScreen;
