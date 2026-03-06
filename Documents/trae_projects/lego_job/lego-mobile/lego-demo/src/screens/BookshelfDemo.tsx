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
const BOOK_CARD_WIDTH = 80;
const BOOK_CARD_HEIGHT = 120;
const BOOKS_PER_ROW = 4;

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

const FAKE_BOOKS: Book[] = [
  {
    bookId: 'book-1',
    title: '勇者的冒险之旅',
    chapterCount: 10,
    coverEmoji: '📖',
    bookSpineColor: '#8B0000',
    lastReadTime: '2小时前',
    progress: 65,
  },
  {
    bookId: 'book-2',
    title: '魔法学院秘闻',
    chapterCount: 8,
    coverEmoji: '🔮',
    bookSpineColor: '#4B0082',
    lastReadTime: '昨天',
    progress: 30,
  },
  {
    bookId: 'book-3',
    title: '精灵传说',
    chapterCount: 5,
    coverEmoji: '🧝',
    bookSpineColor: '#006400',
    lastReadTime: '3天前',
    progress: 100,
  },
  {
    bookId: 'book-4',
    title: '龙之谷',
    chapterCount: 12,
    coverEmoji: '🐉',
    bookSpineColor: '#8B0000',
    lastReadTime: '1周前',
    progress: 45,
  },
  {
    bookId: 'book-5',
    title: '星际旅行',
    chapterCount: 6,
    coverEmoji: '🚀',
    bookSpineColor: '#00008B',
    lastReadTime: '2周前',
    progress: 20,
  },
  {
    bookId: 'book-6',
    title: '海底世界',
    chapterCount: 7,
    coverEmoji: '🌊',
    bookSpineColor: '#00008B',
    lastReadTime: '3周前',
    progress: 80,
  },
  {
    bookId: 'book-7',
    title: '时间裂隙',
    chapterCount: 9,
    coverEmoji: '⏰',
    bookSpineColor: '#4B0082',
    lastReadTime: '1个月前',
    progress: 55,
  },
  {
    bookId: 'book-8',
    title: '永恒传说',
    chapterCount: 11,
    coverEmoji: '💎',
    bookSpineColor: '#006400',
    lastReadTime: '2个月前',
    progress: 10,
  },
];

const getRandomSpineColor = (): string => {
  const colors = ['#8B0000', '#4B0082', '#00008B', '#006400'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const BookshelfDemo: React.FC<BookshelfDemoProps> = ({ onBack, onNavigateToBookDetail }) => {
  const [books, setBooks] = useState<Book[]>(FAKE_BOOKS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef(books.map(() => new Animated.Value(50))).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      ...slideAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          delay: index * 50,
          useNativeDriver: true,
        })
      ),
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
      bookSpineColor: getRandomSpineColor(),
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
    
    return (
      <Animated.View
        key={book.bookId}
        style={{
          transform: [{ translateY: slideAnims[index] || 0 }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={[
            styles.bookCard,
            { backgroundColor: book.bookSpineColor },
            isSelected && styles.bookCardSelected,
          ]}
          onPress={() => handleBookPress(book)}
          activeOpacity={0.8}
        >
          <View style={styles.bookSpine} />
          <View style={styles.bookCover}>
            <Text style={styles.bookEmoji}>{book.coverEmoji}</Text>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={styles.bookChapters}>📚 {book.chapterCount}章</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderShelfRow = (rowBooks: Book[], rowIndex: number) => (
    <View key={rowIndex} style={styles.shelfRow}>
      <View style={styles.shelfDivider} />
      <View style={styles.booksRow}>
        {rowBooks.map((book, index) => renderBookCard(book, rowIndex * BOOKS_PER_ROW + index))}
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
          <Text style={styles.modalTitle}>✨ 创建新故事 ✨</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📖</Text>
            <TextInput
              style={styles.textInput}
              placeholder="请输入故事名称..."
              placeholderTextColor="#888"
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
        <ScrollView>
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
    backgroundColor: '#2C1810',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4A3728',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#F5DEB3',
    fontSize: 16,
  },
  headerTitle: {
    color: '#F5DEB3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newStoryButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newStoryButtonText: {
    color: '#F5DEB3',
    fontSize: 14,
  },
  bookshelf: {
    flex: 1,
    padding: 15,
  },
  shelfRow: {
    marginBottom: 5,
  },
  shelfDivider: {
    height: 8,
    backgroundColor: '#654321',
    marginHorizontal: -15,
    marginBottom: 10,
    borderTopWidth: 2,
    borderTopColor: '#8B4513',
  },
  booksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
  },
  shelfBottom: {
    height: 12,
    backgroundColor: '#654321',
    marginHorizontal: -15,
    borderTopWidth: 3,
    borderTopColor: '#8B4513',
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    height: BOOK_CARD_HEIGHT,
    flexDirection: 'row',
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  bookCardSelected: {
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  bookSpine: {
    width: 10,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bookCover: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#4A3728',
  },
  footerText: {
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
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    padding: 24,
    width: width * 0.85,
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3728',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2B48C',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#3D2914',
    paddingVertical: 12,
  },
  modalHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#8B4513',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
