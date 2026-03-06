# 书架页Demo实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** 实现书房风格的书架页Demo，首页"结束回合"按钮改为"书架"按钮，点击跳转到书架页，书架页点击书籍跳转到书籍详情页。

**Architecture:** 使用React Native状态管理实现页面导航，书架页采用书房/图书馆风格，书籍以竖立书本样式排列在木质书架上，创建故事时弹出输入书名弹窗。

**Tech Stack:** React Native, TypeScript, Animated API, Modal, Appium E2E Testing

---

## Task 1: 创建BookshelfDemo组件基础结构

**Files:**
- Create: `src/screens/BookshelfDemo.tsx`

**Step 1: 创建组件文件和基础结构**

```typescript
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
  Keyboard,
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

const BookshelfDemo: React.FC<BookshelfDemoProps> = ({ onBack, onNavigateToBookDetail }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📚 我的书架</Text>
        <TouchableOpacity style={styles.newStoryButton} onPress={() => {}}>
          <Text style={styles.newStoryButtonText}>➕ 新建故事</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bookshelf}>
        <Text style={styles.placeholderText}>书架内容</Text>
      </View>
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
  placeholderText: {
    color: '#F5DEB3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BookshelfDemo;
```

**Step 2: 验证文件创建成功**

检查文件是否存在。

**Step 3: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 创建BookshelfDemo组件基础结构"
```

---

## Task 2: 添加假数据和状态管理

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 添加假数据和状态**

在组件顶部添加假数据和状态管理：

```typescript
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
```

在组件内添加状态：

```typescript
const [books, setBooks] = useState<Book[]>(FAKE_BOOKS);
const [showCreateModal, setShowCreateModal] = useState(false);
const [newBookTitle, setNewBookTitle] = useState('');
const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
```

**Step 2: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 添加书架页假数据和状态管理"
```

---

## Task 3: 实现书籍卡片组件

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 添加书籍卡片渲染函数**

```typescript
const renderBookCard = (book: Book, index: number) => {
  const isSelected = selectedBookId === book.bookId;
  
  return (
    <TouchableOpacity
      key={book.bookId}
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
  );
};

const handleBookPress = (book: Book) => {
  setSelectedBookId(book.bookId);
  setTimeout(() => {
    onNavigateToBookDetail(book.bookId, book.title);
  }, 200);
};
```

**Step 2: 添加书籍卡片样式**

```typescript
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
  transform: [{ translateX: 5 }, { rotateY: '5deg' }],
  shadowOpacity: 0.5,
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
```

**Step 3: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 实现书籍卡片组件"
```

---

## Task 4: 实现书架布局

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 实现书架行渲染**

```typescript
const renderShelfRow = (rowBooks: Book[], rowIndex: number) => (
  <View key={rowIndex} style={styles.shelfRow}>
    <View style={styles.shelfDivider} />
    <View style={styles.booksRow}>
      {rowBooks.map((book, index) => renderBookCard(book, rowIndex * BOOKS_PER_ROW + index))}
    </View>
  </View>
);

const rows: Book[][] = [];
for (let i = 0; i < books.length; i += BOOKS_PER_ROW) {
  rows.push(books.slice(i, i + BOOKS_PER_ROW));
}
```

**Step 2: 更新bookshelf渲染**

```typescript
<View style={styles.bookshelf}>
  <ScrollView>
    {rows.map((row, index) => renderShelfRow(row, index))}
    <View style={styles.shelfBottom} />
  </ScrollView>
</View>
```

**Step 3: 添加书架样式**

```typescript
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
```

**Step 4: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 实现书架布局"
```

---

## Task 5: 实现创建故事弹窗

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 添加创建故事弹窗组件**

```typescript
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
```

**Step 2: 更新newStoryButton的onPress**

```typescript
<TouchableOpacity 
  style={styles.newStoryButton} 
  onPress={() => setShowCreateModal(true)}
>
```

**Step 3: 添加弹窗样式**

```typescript
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
```

**Step 4: 在组件return中添加弹窗**

在 `</SafeAreaView>` 之前添加：
```typescript
{renderCreateModal()}
```

**Step 5: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 实现创建故事弹窗"
```

---

## Task 6: 添加进入动画效果

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 添加动画状态和效果**

```typescript
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnims = useRef(books.map(() => new Animated.Value(50))).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
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
```

**Step 2: 更新书籍卡片渲染应用动画**

```typescript
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
        {/* ... 卡片内容保持不变 */}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

**Step 3: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 添加书架页进入动画"
```

---

## Task 7: 更新App.tsx添加书架页导航

**Files:**
- Modify: `App.tsx`

**Step 1: 导入BookshelfDemo组件**

在文件顶部添加导入：
```typescript
import BookshelfDemo from './src/screens/BookshelfDemo';
```

**Step 2: 更新PageState类型**

```typescript
type PageState = 'home' | 'director' | 'ui-style-list' | 'bookshelf' | 'book-detail' | UIStyleType;
```

**Step 3: 更新GameBoard的结束回合按钮为书架按钮**

找到 `endTurnBtn` 相关代码，将"结束回合"按钮改为"书架"按钮：

```typescript
<TouchableOpacity style={styles.styleBtn} onPress={onNavigateToBookshelf}>
  <Text style={styles.btnIcon}>📚</Text>
  <Text style={styles.btnText}>书架</Text>
</TouchableOpacity>
```

**Step 4: 更新GameBoardProps**

```typescript
interface GameBoardProps {
  onNavigateToDirector: () => void;
  onNavigateToUIStyles: () => void;
  onNavigateToBookDetail: () => void;
  onNavigateToBookshelf: () => void;
}
```

**Step 5: 更新renderPage添加书架页**

```typescript
case 'bookshelf':
  return (
    <BookshelfDemo
      onBack={() => setCurrentPage('home')}
      onNavigateToBookDetail={(bookId, bookTitle) => {
        setCurrentPage('book-detail');
      }}
    />
  );
```

**Step 6: 更新GameBoard调用**

```typescript
<GameBoard
  onNavigateToDirector={() => setCurrentPage('director')}
  onNavigateToUIStyles={() => setCurrentPage('ui-style-list')}
  onNavigateToBookDetail={() => setCurrentPage('book-detail')}
  onNavigateToBookshelf={() => setCurrentPage('bookshelf')}
/>
```

**Step 7: Commit**

```bash
git add App.tsx
git commit -m "feat: 更新App.tsx添加书架页导航"
```

---

## Task 8: 构建APK

**Files:**
- None (构建过程)

**Step 1: 运行构建脚本**

```powershell
powershell -ExecutionPolicy Bypass -File run-app.ps1
```

**Step 2: 验证构建成功**

检查输出中是否有 "BUILD AND RUN SUCCESSFUL!"

**Step 3: 如果构建失败，记录问题到经验反思文档**

---

## Task 9: 创建Appium测试脚本

**Files:**
- Create: `appium-bookshelf-test.js`

**Step 1: 创建测试脚本**

创建完整的Appium测试脚本，测试内容：
1. APP状态检测
2. 首页书架按钮点击
3. 书架页标题验证
4. 书籍卡片显示验证
5. 点击书籍跳转到详情页
6. 返回书架页
7. 新建故事按钮测试
8. 创建故事弹窗测试
9. 输入书名并创建
10. 验证新书添加

参考现有测试脚本格式和经验反思文档中的最佳实践。

**Step 2: Commit**

```bash
git add appium-bookshelf-test.js
git commit -m "test: 添加书架页Appium端到端测试"
```

---

## Task 10: 运行Appium测试

**Files:**
- None (测试过程)

**Step 1: 运行测试脚本**

```bash
node appium-bookshelf-test.js
```

**Step 2: 分析测试结果**

检查通过率和失败原因。

**Step 3: 如果测试失败，记录问题到经验反思文档并修复**

---

## Task 11: 最终验证和提交

**Files:**
- All modified files

**Step 1: 确认所有功能正常**

- 首页书架按钮可点击
- 书架页显示正常
- 书籍卡片可点击跳转
- 新建故事弹窗正常
- 创建新故事正常跳转

**Step 2: 提交所有更改**

```bash
git add .
git commit -m "feat: 实现书架页Demo

- 书房/图书馆风格设计
- 书籍竖立书本样式
- 创建故事弹窗
- 首页书架按钮导航
- Appium端到端测试"
```

**Step 3: 推送到远程仓库**

```bash
git push origin main
```

---

## 注意事项

1. **动画属性限制**: `useNativeDriver: true` 只支持 `opacity` 和 `transform`，不要使用 `left`、`top`、`width`、`height`
2. **测试超时设置**: 使用 `waitForDisplayed({ timeout: 2000 })` 而不是 `isDisplayed()`
3. **弹窗状态管理**: 弹窗操作失败后要关闭弹窗
4. **APP状态检测**: 测试前检测APP是否在前台运行
