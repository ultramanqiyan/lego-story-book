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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import { getThemeColors, getGlassStyle, storyThemes } from '../theme';

const DEFAULT_THEME = storyThemes.children.colors;

const { width, height } = Dimensions.get('window');
const BOOK_CARD_WIDTH = (width - 60) / 2;
const BOOK_CARD_HEIGHT = BOOK_CARD_WIDTH * 1.4;
const BOOKS_PER_ROW = 2;

interface Book {
  bookId: string;
  title: string;
  chapterCount: number;
  coverEmoji: string;
  typeId: string;
  lastReadTime?: string;
  progress?: number;
  isUserCreated?: boolean;
}

interface BookshelfDemoProps {
  onBack: () => void;
  onNavigateToBookDetail: (bookId: string, bookTitle: string) => void;
}

const BookshelfDemo: React.FC<BookshelfDemoProps> = ({ onBack, onNavigateToBookDetail }) => {
  const { books: dataBooks, isLoading, bookTypes, createBook, refreshBooks } = useData();
  const [books, setBooks] = useState<Book[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('children');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!isLoading && dataBooks.length > 0) {
      setBooks(dataBooks.map(b => ({
        bookId: b.bookId,
        title: b.title,
        chapterCount: b.chapterCount,
        coverEmoji: b.coverEmoji,
        typeId: b.typeId,
        lastReadTime: b.lastReadTime,
        progress: b.progress,
        isUserCreated: b.isUserCreated,
      })));
    }
  }, [isLoading, dataBooks]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBookPress = (book: Book) => {
    setSelectedBookId(book.bookId);
    setTimeout(() => {
      onNavigateToBookDetail(book.bookId, book.title);
    }, 200);
  };

  const handleCreateBook = async () => {
    console.log('[BookshelfDemo] handleCreateBook called');
    console.log('[BookshelfDemo] newBookTitle:', newBookTitle);
    console.log('[BookshelfDemo] selectedTypeId:', selectedTypeId);
    console.log('[BookshelfDemo] isCreating:', isCreating);
    
    if (!newBookTitle.trim() || isCreating) {
      console.log('[BookshelfDemo] Early return - title empty or already creating');
      return;
    }
    
    setIsCreating(true);
    try {
      console.log('[BookshelfDemo] Calling createBook...');
      const newBook = await createBook({
        title: newBookTitle.trim(),
        typeId: selectedTypeId,
      });
      console.log('[BookshelfDemo] createBook returned:', newBook);
      console.log('[BookshelfDemo] newBook.bookId:', newBook?.bookId);
      console.log('[BookshelfDemo] newBook.title:', newBook?.title);
      
      setShowCreateModal(false);
      setNewBookTitle('');
      setSelectedTypeId('children');
      
      console.log('[BookshelfDemo] Modal closed, scheduling navigation...');
      setTimeout(() => {
        console.log('[BookshelfDemo] Executing navigation to book detail...');
        console.log('[BookshelfDemo] Calling onNavigateToBookDetail with:', newBook?.bookId, newBook?.title);
        onNavigateToBookDetail(newBook.bookId, newBook.title);
      }, 300);
    } catch (error) {
      console.error('[BookshelfDemo] Failed to create book:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderBookCard = (book: Book, index: number) => {
    const isSelected = selectedBookId === book.bookId;
    const themeColors = getThemeColors(book.typeId);
    
    return (
      <TouchableOpacity
        key={book.bookId}
        style={[
          styles.bookCard,
          { backgroundColor: themeColors.card },
          isSelected && styles.bookCardSelected,
        ]}
        onPress={() => handleBookPress(book)}
        activeOpacity={0.85}
      >
        <View style={[styles.bookSpine, { backgroundColor: themeColors.primary }]} />
        
        <View style={styles.bookCover}>
          <View style={[styles.emojiContainer, { backgroundColor: themeColors.accent }]}>
            <Text style={styles.bookEmoji}>{book.coverEmoji}</Text>
          </View>
          
          <Text style={[styles.bookTitle, { color: themeColors.text }]} numberOfLines={2}>
            {book.title}
          </Text>
          
          <View style={styles.bookInfo}>
            <Text style={[styles.bookChapters, { color: themeColors.textSecondary }]}>📚 {book.chapterCount}章</Text>
            {book.progress !== undefined && book.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${book.progress}%`, backgroundColor: themeColors.accent }]} />
              </View>
            )}
          </View>
          
          {book.isUserCreated && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderShelfRow = (rowBooks: Book[], rowIndex: number) => (
    <View key={rowIndex} style={styles.shelfRow}>
      <View style={styles.booksRow}>
        {rowBooks.map((book, index) => renderBookCard(book, rowIndex * BOOKS_PER_ROW + index))}
        {rowBooks.length === 1 && <View style={styles.emptySlot} />}
      </View>
      <View style={styles.shelfBoard}>
        <View style={styles.shelfShadow} />
      </View>
    </View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>✨ 创建新故事</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📖</Text>
            <TextInput
              style={styles.textInput}
              placeholder="请输入故事名称..."
              placeholderTextColor="#999"
              value={newBookTitle}
              onChangeText={setNewBookTitle}
              maxLength={20}
              autoFocus
            />
          </View>
          
          <Text style={styles.typeSelectorLabel}>选择故事类型：</Text>
          <View style={styles.typeSelector}>
            {bookTypes.map(type => (
              <TouchableOpacity
                key={type.typeId}
                style={[
                  styles.typeOption,
                  selectedTypeId === type.typeId && styles.typeOptionSelected,
                  { borderColor: type.primaryColor },
                ]}
                onPress={() => setSelectedTypeId(type.typeId)}
              >
                <Text style={styles.typeEmoji}>{type.typeEmoji}</Text>
                <Text style={[
                  styles.typeName,
                  selectedTypeId === type.typeId && { color: type.primaryColor },
                ]}>
                  {type.typeName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.modalHint}>💡 系统将为你初始化角色和情节卡牌</Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowCreateModal(false);
                setNewBookTitle('');
                setSelectedTypeId('children');
              }}
            >
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalCreateButton,
                { backgroundColor: DEFAULT_THEME.primary },
                (!newBookTitle.trim() || isCreating) && styles.modalCreateButtonDisabled,
              ]}
              onPress={handleCreateBook}
              disabled={!newBookTitle.trim() || isCreating}
            >
              <Text style={styles.modalCreateText}>
                {isCreating ? '创建中...' : '✨ 创建'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += BOOKS_PER_ROW) {
    rows.push(books.slice(i, i + BOOKS_PER_ROW));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 我的书架</Text>
        <TouchableOpacity 
          style={[styles.newStoryButton, { backgroundColor: DEFAULT_THEME.primary, shadowColor: DEFAULT_THEME.primary }]} 
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.newStoryButtonText}>➕ 新建</Text>
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[styles.bookshelf, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.shelfTop} />
          {rows.map((row, index) => renderShelfRow(row, index))}
          <View style={styles.shelfBottom} />
        </ScrollView>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>共 {books.length} 本故事书</Text>
      </View>
      
      {renderCreateModal()}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  newStoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  newStoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookshelf: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  shelfTop: {
    height: 15,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -15,
    borderTopWidth: 3,
    borderTopColor: '#CBD5E1',
  },
  shelfRow: {
    marginBottom: 8,
  },
  booksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  emptySlot: {
    width: BOOK_CARD_WIDTH,
  },
  shelfBoard: {
    height: 18,
    backgroundColor: '#CBD5E1',
    marginHorizontal: -15,
    borderBottomWidth: 3,
    borderBottomColor: '#94A3B8',
  },
  shelfShadow: {
    height: 6,
    backgroundColor: '#E2E8F0',
    marginTop: 'auto',
  },
  shelfBottom: {
    height: 25,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -15,
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    height: BOOK_CARD_HEIGHT,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  bookCardSelected: {
    shadowOpacity: 0.25,
    shadowRadius: 8,
    transform: [{ scale: 1.02 }],
  },
  bookSpine: {
    width: 12,
    height: '100%',
  },
  bookCover: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookEmoji: {
    fontSize: 32,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginVertical: 8,
  },
  bookInfo: {
    alignItems: 'center',
    width: '100%',
  },
  bookChapters: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EC4899',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    color: '#64748B',
    fontSize: 13,
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
    width: width * 0.85,
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
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 14,
  },
  modalHint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  typeSelectorLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
    borderColor: DEFAULT_THEME.primary,
  },
  typeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  typeName: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCreateButtonDisabled: {
    opacity: 0.5,
  },
  modalCreateText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default BookshelfDemo;
