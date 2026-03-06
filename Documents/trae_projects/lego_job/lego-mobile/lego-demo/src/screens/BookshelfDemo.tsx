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

const { width, height } = Dimensions.get('window');
const BOOK_CARD_WIDTH = (width - 60) / 2;
const BOOK_CARD_HEIGHT = BOOK_CARD_WIDTH * 1.4;
const BOOKS_PER_ROW = 2;

interface Book {
  bookId: string;
  title: string;
  chapterCount: number;
  coverEmoji: string;
  bookSpineColor: string;
  lastReadTime?: string;
  progress?: number;
  isNew?: boolean;
}

interface BookshelfDemoProps {
  onBack: () => void;
  onNavigateToBookDetail: (bookId: string, bookTitle: string) => void;
}

const BOOK_COLORS = [
  { spine: '#C0392B', cover: '#E74C3C', accent: '#FADBD8' },
  { spine: '#2C3E50', cover: '#34495E', accent: '#D6DBDF' },
  { spine: '#1A5276', cover: '#2980B9', accent: '#D4E6F1' },
  { spine: '#1E8449', cover: '#27AE60', accent: '#D5F5E3' },
  { spine: '#7D3C98', cover: '#9B59B6', accent: '#E8DAEF' },
  { spine: '#B7950B', cover: '#F1C40F', accent: '#FCF3CF' },
  { spine: '#A04000', cover: '#E67E22', accent: '#FAE5D3' },
  { spine: '#6C3483', cover: '#8E44AD', accent: '#EBDEF0' },
];

const FAKE_BOOKS: Book[] = [
  {
    bookId: 'book-1',
    title: '勇者的冒险之旅',
    chapterCount: 10,
    coverEmoji: '⚔️',
    bookSpineColor: '#C0392B',
    lastReadTime: '2小时前',
    progress: 65,
  },
  {
    bookId: 'book-2',
    title: '魔法学院秘闻',
    chapterCount: 8,
    coverEmoji: '🔮',
    bookSpineColor: '#7D3C98',
    lastReadTime: '昨天',
    progress: 30,
  },
  {
    bookId: 'book-3',
    title: '精灵传说',
    chapterCount: 5,
    coverEmoji: '🧝',
    bookSpineColor: '#1E8449',
    lastReadTime: '3天前',
    progress: 100,
  },
  {
    bookId: 'book-4',
    title: '龙之谷',
    chapterCount: 12,
    coverEmoji: '🐉',
    bookSpineColor: '#A04000',
    lastReadTime: '1周前',
    progress: 45,
  },
  {
    bookId: 'book-5',
    title: '星际旅行',
    chapterCount: 6,
    coverEmoji: '🚀',
    bookSpineColor: '#1A5276',
    lastReadTime: '2周前',
    progress: 20,
  },
  {
    bookId: 'book-6',
    title: '海底世界',
    chapterCount: 7,
    coverEmoji: '🌊',
    bookSpineColor: '#2C3E50',
    lastReadTime: '3周前',
    progress: 80,
  },
  {
    bookId: 'book-7',
    title: '时间裂隙',
    chapterCount: 9,
    coverEmoji: '⏰',
    bookSpineColor: '#6C3483',
    lastReadTime: '1个月前',
    progress: 55,
  },
  {
    bookId: 'book-8',
    title: '永恒传说',
    chapterCount: 11,
    coverEmoji: '💎',
    bookSpineColor: '#B7950B',
    lastReadTime: '2个月前',
    progress: 10,
  },
];

const getBookColorScheme = (index: number) => {
  return BOOK_COLORS[index % BOOK_COLORS.length];
};

const BookshelfDemo: React.FC<BookshelfDemoProps> = ({ onBack, onNavigateToBookDetail }) => {
  const [books, setBooks] = useState<Book[]>(FAKE_BOOKS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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

  const handleCreateBook = () => {
    if (!newBookTitle.trim()) return;
    
    const newBook: Book = {
      bookId: `book-${Date.now()}`,
      title: newBookTitle.trim(),
      chapterCount: 0,
      coverEmoji: '📖',
      bookSpineColor: BOOK_COLORS[books.length % BOOK_COLORS.length].spine,
      isNew: true,
    };
    
    setBooks([newBook, ...books]);
    setShowCreateModal(false);
    setNewBookTitle('');
    
    setTimeout(() => {
      onNavigateToBookDetail(newBook.bookId, newBook.title);
    }, 300);
  };

  const renderBookCard = (book: Book, index: number) => {
    const isSelected = selectedBookId === book.bookId;
    const colorScheme = getBookColorScheme(index);
    
    return (
      <TouchableOpacity
        key={book.bookId}
        style={[
          styles.bookCard,
          { backgroundColor: colorScheme.cover },
          isSelected && styles.bookCardSelected,
        ]}
        onPress={() => handleBookPress(book)}
        activeOpacity={0.85}
      >
        <View style={[styles.bookSpine, { backgroundColor: colorScheme.spine }]} />
        
        <View style={styles.bookCover}>
          <View style={[styles.emojiContainer, { backgroundColor: colorScheme.accent }]}>
            <Text style={styles.bookEmoji}>{book.coverEmoji}</Text>
          </View>
          
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          
          <View style={styles.bookInfo}>
            <Text style={styles.bookChapters}>📚 {book.chapterCount}章</Text>
            {book.progress !== undefined && book.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${book.progress}%` }]} />
              </View>
            )}
          </View>
          
          {book.isNew && (
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
          
          <Text style={styles.modalHint}>💡 好的名字能让故事更精彩！</Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowCreateModal(false);
                setNewBookTitle('');
              }}
            >
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalCreateButton,
                !newBookTitle.trim() && styles.modalCreateButtonDisabled,
              ]}
              onPress={handleCreateBook}
              disabled={!newBookTitle.trim()}
            >
              <Text style={styles.modalCreateText}>✨ 创建</Text>
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
          style={styles.newStoryButton} 
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
    backgroundColor: '#FDF5E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#8B4513',
    borderBottomWidth: 2,
    borderBottomColor: '#654321',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFF8DC',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFF8DC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newStoryButton: {
    backgroundColor: '#D2691E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DEB887',
  },
  newStoryButtonText: {
    color: '#FFF8DC',
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
    backgroundColor: '#8B4513',
    marginHorizontal: -15,
    borderTopWidth: 3,
    borderTopColor: '#A0522D',
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
  },
  emptySlot: {
    width: BOOK_CARD_WIDTH,
  },
  shelfBoard: {
    height: 18,
    backgroundColor: '#8B4513',
    marginHorizontal: -15,
    borderBottomWidth: 3,
    borderBottomColor: '#654321',
  },
  shelfShadow: {
    height: 6,
    backgroundColor: '#5D3A1A',
    marginTop: 'auto',
  },
  shelfBottom: {
    height: 25,
    backgroundColor: '#8B4513',
    marginHorizontal: -15,
    borderBottomWidth: 4,
    borderBottomColor: '#654321',
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    height: BOOK_CARD_HEIGHT,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bookCardSelected: {
    shadowOpacity: 0.5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  bookEmoji: {
    fontSize: 32,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginVertical: 8,
  },
  bookInfo: {
    alignItems: 'center',
    width: '100%',
  },
  bookChapters: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#8B4513',
    borderTopWidth: 2,
    borderTopColor: '#A0522D',
  },
  footerText: {
    color: '#FFF8DC',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF8DC',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DEB887',
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
    color: '#3D2914',
    paddingVertical: 14,
  },
  modalHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
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
    borderWidth: 2,
    borderColor: '#8B4513',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#8B4513',
    alignItems: 'center',
  },
  modalCreateButtonDisabled: {
    backgroundColor: '#D2B48C',
  },
  modalCreateText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default BookshelfDemo;
