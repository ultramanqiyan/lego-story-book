import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { booksAPI, bookCharactersAPI, chaptersAPI, charactersAPI, plotOptionsAPI, shareAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Modal, Header, GlowOrbBackground } from '../../components/common';
import { COLORS, CHARACTER_EMOJIS, ROLE_TYPES } from '../../utils/constants';
import { getRoleLabel } from '../../utils/helpers';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params || {};
  const { user } = useAuth();
  const toast = useToast();
  
  const [book, setBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chapters');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBookModalVisible, setEditBookModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [promptContent, setPromptContent] = useState('');
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [editBookTitle, setEditBookTitle] = useState('');
  const [newCharacter, setNewCharacter] = useState({
    characterId: null,
    customName: '',
    roleType: 'supporting',
  });

  useEffect(() => {
    if (!bookId) {
      toast.error('书籍ID无效');
      navigation.goBack();
      return;
    }
    loadData();
  }, [bookId]);

  const loadData = async () => {
    try {
      const [bookData, charsData] = await Promise.all([
        booksAPI.getDetail(bookId, user?.userId),
        charactersAPI.getList(user?.userId),
      ]);
      
      setBook(bookData.book);
      setCharacters(bookData.characters || []);
      setChapters(bookData.chapters || []);
      setAllCharacters(charsData.characters || []);
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const availableCharacters = allCharacters.filter(
    (c) => !characters.some((bc) => (bc.character_id || bc.characterId) === (c.character_id || c.characterId))
  );

  const stats = {
    chapterCount: chapters.length,
    characterCount: characters.length,
    totalWords: chapters.reduce((sum, ch) => sum + (ch.word_count || ch.wordCount || 0), 0),
  };

  const handleAddCharacter = async () => {
    if (!newCharacter.characterId) {
      toast.error('请选择一个人仔');
      return;
    }
    if (!newCharacter.customName.trim()) {
      toast.error('请填写角色名称');
      return;
    }

    const duplicateName = characters.find(
      (c) => (c.custom_name || c.customName) === newCharacter.customName.trim()
    );
    if (duplicateName) {
      toast.error('角色名称已存在，请使用不同的名称');
      return;
    }

    try {
      await bookCharactersAPI.add(
        bookId,
        newCharacter.characterId,
        newCharacter.customName.trim(),
        newCharacter.roleType
      );
      toast.success('角色添加成功！');
      setAddModalVisible(false);
      setNewCharacter({ characterId: null, customName: '', roleType: 'supporting' });
      loadData();
    } catch (error) {
      toast.error(`添加失败：${error.message}`);
    }
  };

  const handleEditCharacter = async () => {
    if (!editingCharacter.customName.trim()) {
      toast.error('请填写角色名称');
      return;
    }

    const duplicateName = characters.find(
      (c) => (c.custom_name || c.customName) === editingCharacter.customName.trim() && (c.id || c.bookCharacterId) !== editingCharacter.id
    );
    if (duplicateName) {
      toast.error('角色名称已存在，请使用不同的名称');
      return;
    }

    try {
      await bookCharactersAPI.update(editingCharacter.id, {
        customName: editingCharacter.customName.trim(),
        roleType: editingCharacter.role_type,
      });
      toast.success('角色更新成功！');
      setEditModalVisible(false);
      setEditingCharacter(null);
      loadData();
    } catch (error) {
      toast.error(`更新失败：${error.message}`);
    }
  };

  const handleDeleteCharacter = async (id) => {
    Alert.alert(
      '确认删除',
      '确定要从本书中移除这个角色吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookCharactersAPI.delete(id);
              toast.success('角色删除成功！');
              loadData();
            } catch (error) {
              toast.error(`删除失败：${error.message}`);
            }
          },
        },
      ]
    );
  };

  const openEditCharacter = (character) => {
    setEditingCharacter({
      id: character.id || character.bookCharacterId,
      customName: character.custom_name || character.customName || character.name,
      role_type: character.role_type || character.roleType,
    });
    setEditModalVisible(true);
  };

  const handleEditBook = async () => {
    if (!editBookTitle.trim()) {
      toast.error('请输入书名');
      return;
    }

    try {
      await booksAPI.update(bookId, { title: editBookTitle.trim() });
      toast.success('书名更新成功！');
      setEditBookModalVisible(false);
      loadData();
    } catch (error) {
      toast.error(`更新失败：${error.message}`);
    }
  };

  const handleDeleteBook = async () => {
    Alert.alert(
      '确认删除',
      '确定要删除这本书吗？此操作不可恢复！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await booksAPI.delete(bookId);
              toast.success('书籍删除成功！');
              navigation.goBack();
            } catch (error) {
              toast.error(`删除失败：${error.message}`);
            }
          },
        },
      ]
    );
  };

  const openEditBook = () => {
    setEditBookTitle(book?.title || '');
    setEditBookModalVisible(true);
  };

  const handleViewPrompt = async () => {
    setPromptContent(book?.prompt || '提示词信息在章节生成时创建');
    setPromptModalVisible(true);
  };

  const handleShare = async () => {
    try {
      const shareData = await shareAPI.create(bookId, user?.userId);
      await Share.share({
        message: `📖 ${book?.title}\n\n一个精彩的乐高故事！\n\n🔗 分享码: ${shareData.shareCode}`,
        title: book?.title,
      });
    } catch (error) {
      toast.error('分享失败，请稍后重试');
    }
  };

  const renderChapterItem = ({ item, index }) => (
    <Card
      style={styles.chapterCard}
      onPress={() => navigation.navigate('Chapter', { chapterId: item.chapter_id || item.chapterId || item.id, bookId })}
    >
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterNumber}>第{item.chapter_number || item.chapterNumber}章</Text>
        <Text style={styles.chapterTitle}>{item.title}</Text>
      </View>
      {(item.has_puzzle || item.hasPuzzle) && (
        <Text style={styles.puzzleIcon}>
          {(item.puzzle_result || item.puzzleResult) === 1 ? '✅' : (item.puzzle_result || item.puzzleResult) === 0 ? '❌' : '🧩'}
        </Text>
      )}
    </Card>
  );

  const renderCharacterItem = ({ item, index }) => (
    <Card style={styles.characterCard}>
      <Text style={styles.characterEmoji}>
        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
      </Text>
      <Text style={styles.characterName}>{item.custom_name || item.customName || item.name}</Text>
      <View style={[styles.roleBadge, getRoleBadgeStyle(item.role_type || item.roleType)]}>
        <Text style={styles.roleBadgeText}>{getRoleLabel(item.role_type || item.roleType)}</Text>
      </View>
      <View style={styles.characterActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openEditCharacter(item)}
        >
          <Text style={styles.actionBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteCharacter(item.id || item.bookCharacterId)}
        >
          <Text style={styles.actionBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const getRoleBadgeStyle = (roleType) => {
    switch (roleType) {
      case 'protagonist':
        return { backgroundColor: COLORS.legoYellow };
      case 'antagonist':
        return { backgroundColor: COLORS.legoRed };
      case 'supporting':
        return { backgroundColor: COLORS.legoBlue };
      default:
        return { backgroundColor: COLORS.textLight };
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="加载书籍..." />;
  }

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      
      <Header
        title={book?.title || '故事详情'}
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
        rightButton={
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
              <Text style={styles.headerBtnText}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={openEditBook}>
              <Text style={styles.headerBtnText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: BookDetailScreen (书籍详情页)</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.chapterCount}</Text>
          <Text style={styles.statLabel}>章节</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.characterCount}</Text>
          <Text style={styles.statLabel}>角色</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalWords}</Text>
          <Text style={styles.statLabel}>字数</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleViewPrompt}>
          <Text style={styles.actionBtnIcon}>📝</Text>
          <Text style={styles.actionBtnLabel}>查看提示词</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chapters' && styles.tabActive]}
          onPress={() => setActiveTab('chapters')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>📚</Text>
          <Text style={[styles.tabText, activeTab === 'chapters' && styles.tabTextActive]}>
            章节
          </Text>
          {activeTab === 'chapters' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'characters' && styles.tabActive]}
          onPress={() => setActiveTab('characters')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🎭</Text>
          <Text style={[styles.tabText, activeTab === 'characters' && styles.tabTextActive]}>
            角色
          </Text>
          {activeTab === 'characters' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {activeTab === 'chapters' ? (
        <FlatList
          data={chapters}
          renderItem={renderChapterItem}
          keyExtractor={(item) => item.chapter_id || item.chapterId || item.id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="📚"
              title="还没有章节"
              description="点击下方按钮添加章节"
            />
          }
        />
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id || item.bookCharacterId || item.character_id || String(Math.random())}
          numColumns={2}
          columnWrapperStyle={styles.characterRow}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="🎭"
              title="还没有角色"
              description="点击下方按钮添加角色"
            />
          }
        />
      )}

      <View style={styles.bottomBar}>
        {activeTab === 'chapters' ? (
          <Button
            title="➕ 添加章节"
            onPress={() => navigation.navigate('StoryDirector', { bookId })}
            size="lg"
            style={styles.bottomButton}
          />
        ) : (
          <Button
            title="➕ 添加角色"
            onPress={() => setAddModalVisible(true)}
            size="lg"
            style={styles.bottomButton}
          />
        )}
      </View>

      <Modal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title="➕ 添加角色"
      >
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalForm}>
            <Text style={styles.label}>选择人仔 *</Text>
            {availableCharacters.length > 0 ? (
              <View style={styles.characterSelector}>
                {availableCharacters.map((char) => {
              const charId = char.character_id || char.characterId || char.id;
              return (
                <TouchableOpacity
                  key={charId}
                  style={[
                    styles.characterOption,
                    newCharacter.characterId === charId && styles.characterOptionActive,
                  ]}
                  onPress={() => setNewCharacter({ ...newCharacter, characterId: charId })}
                >
                  <Text style={styles.characterOptionText}>{char.name}</Text>
                </TouchableOpacity>
              );
            })}
              </View>
            ) : (
              <View style={styles.emptyCharacters}>
                <Text style={styles.emptyText}>所有角色都已添加</Text>
                <Button
                  title="创建新角色"
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    setAddModalVisible(false);
                    navigation.navigate('Characters');
                  }}
                />
              </View>
            )}
            
            {availableCharacters.length > 0 && (
              <>
                <Text style={styles.label}>自定义名称 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="为角色取个名字"
                  placeholderTextColor={COLORS.textMuted}
                  value={newCharacter.customName}
                  onChangeText={(text) => setNewCharacter({ ...newCharacter, customName: text })}
                  maxLength={20}
                />
                <Text style={styles.hint}>{newCharacter.customName.length}/20</Text>
                
                <Text style={styles.label}>角色类型</Text>
                <View style={styles.roleSelector}>
                  {ROLE_TYPES.map((role) => (
                    <TouchableOpacity
                      key={role.value}
                      style={[
                        styles.roleOption,
                        newCharacter.roleType === role.value && styles.roleOptionActive,
                      ]}
                      onPress={() => setNewCharacter({ ...newCharacter, roleType: role.value })}
                    >
                      <Text style={styles.roleOptionText}>{role.icon} {role.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Button title="✅ 保存" onPress={handleAddCharacter} size="lg" />
              </>
            )}
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingCharacter(null);
        }}
        title="✏️ 编辑角色"
      >
        {editingCharacter && (
          <View style={styles.modalForm}>
            <Text style={styles.label}>角色名称 *</Text>
            <TextInput
              style={styles.input}
              placeholder="角色名称"
              placeholderTextColor={COLORS.textMuted}
              value={editingCharacter.customName}
              onChangeText={(text) => setEditingCharacter({ ...editingCharacter, customName: text })}
              maxLength={20}
            />
            <Text style={styles.hint}>{editingCharacter.customName.length}/20</Text>
            <Text style={styles.label}>角色类型</Text>
            <View style={styles.roleSelector}>
              {ROLE_TYPES.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleOption,
                    editingCharacter.role_type === role.value && styles.roleOptionActive,
                  ]}
                  onPress={() => setEditingCharacter({ ...editingCharacter, role_type: role.value })}
                >
                  <Text style={styles.roleOptionText}>{role.icon} {role.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="✅ 保存修改" onPress={handleEditCharacter} size="lg" />
          </View>
        )}
      </Modal>

      <Modal
        visible={editBookModalVisible}
        onClose={() => setEditBookModalVisible(false)}
        title="⚙️ 书籍设置"
      >
        <View style={styles.modalForm}>
          <Text style={styles.label}>书名</Text>
          <TextInput
            style={styles.input}
            placeholder="输入新书名"
            placeholderTextColor={COLORS.textMuted}
            value={editBookTitle}
            onChangeText={setEditBookTitle}
            maxLength={50}
          />
          <Text style={styles.hint}>{editBookTitle.length}/50</Text>
          
          <Button title="✅ 保存书名" onPress={handleEditBook} size="lg" style={styles.modalButton} />
          
          <TouchableOpacity style={styles.deleteBookBtn} onPress={handleDeleteBook}>
            <Text style={styles.deleteBookText}>🗑️ 删除这本书</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={promptModalVisible}
        onClose={() => setPromptModalVisible(false)}
        title="📝 AI提示词"
      >
        <ScrollView style={styles.promptScroll}>
          <Text style={styles.promptContent}>{promptContent}</Text>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  headerBtnText: {
    fontSize: 20,
  },
  debugLabel: {
    backgroundColor: COLORS.legoPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugLabelText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.legoBlue,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionBtnIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionBtnLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: COLORS.legoYellow,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.legoOrange,
  },
  listContent: {
    padding: 20,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  puzzleIcon: {
    fontSize: 24,
  },
  characterRow: {
    justifyContent: 'space-between',
  },
  characterCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  characterEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  characterActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomButton: {
    width: '100%',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalForm: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: -8,
  },
  characterSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyCharacters: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  characterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  characterOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  characterOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleOptionActive: {
    backgroundColor: COLORS.legoYellow,
    borderColor: COLORS.legoOrange,
  },
  roleOptionText: {
    fontSize: 12,
    color: COLORS.text,
  },
  modalButton: {
    marginTop: 8,
  },
  deleteBookBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deleteBookText: {
    fontSize: 16,
    color: COLORS.legoRed,
    fontWeight: '600',
  },
  promptScroll: {
    maxHeight: 400,
    padding: 16,
  },
  promptContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
});

export default BookDetailScreen;
