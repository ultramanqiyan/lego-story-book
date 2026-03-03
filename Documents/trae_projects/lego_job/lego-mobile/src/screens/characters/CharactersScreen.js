import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Easing,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Header, Modal, GlowOrbBackground } from '../../components/common';
import CharacterForm from '../../components/characters/CharacterForm';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';
import logger from '../../utils/logger';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const CharactersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    logger.screen.mount('CharactersScreen', { userId: user?.userId });
    return () => logger.screen.unmount('CharactersScreen');
  }, []);

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const loadCharacters = async () => {
    logger.screen.action('CharactersScreen', 'loadCharacters', { userId: user?.userId });
    try {
      const data = await charactersAPI.getList(user?.userId);
      setCharacters(data.characters || []);
      logger.data.fetchSuccess('characters', (data.characters || []).length);
    } catch (error) {
      logger.screen.error('CharactersScreen', 'loadCharacters', error);
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    logger.screen.action('CharactersScreen', 'refresh');
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  }, []);

  const handleCreate = () => {
    logger.screen.action('CharactersScreen', 'handleCreate');
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setEditingCharacter(null);
      setFormVisible(true);
    });
  };

  const handleEdit = (character) => {
    logger.screen.action('CharactersScreen', 'handleEdit', { characterId: character.character_id || character.id });
    setEditingCharacter(character);
    setFormVisible(true);
  };

  const handleDelete = async (character) => {
    const charId = character.character_id || character.id || character.characterId;
    if (!charId) {
      toast.error('角色信息无效');
      return;
    }
    logger.screen.action('CharactersScreen', 'handleDelete', { characterId: charId });
    try {
      await charactersAPI.delete(charId);
      logger.data.delete('character', charId);
      toast.success('删除成功');
      setDetailVisible(false);
      loadCharacters();
    } catch (error) {
      logger.screen.error('CharactersScreen', 'handleDelete', error);
      toast.error('删除失败');
    }
  };

  const handleFormSubmit = async (characterData) => {
    logger.screen.action('CharactersScreen', 'handleFormSubmit', { editing: !!editingCharacter });
    try {
      const editingId = editingCharacter?.character_id || editingCharacter?.id || editingCharacter?.characterId;
      if (editingId) {
        await charactersAPI.update(editingId, characterData);
        logger.data.update('character', editingId, characterData);
        toast.success('更新成功');
      } else {
        const result = await charactersAPI.create({ ...characterData, creatorId: user?.userId });
        logger.data.create('character', characterData);
        toast.success('创建成功');
      }
      setFormVisible(false);
      loadCharacters();
    } catch (error) {
      logger.screen.error('CharactersScreen', 'handleFormSubmit', error);
      toast.error(`操作失败：${error.message}`);
    }
  };

  const openDetail = (character) => {
    logger.screen.action('CharactersScreen', 'openDetail', { characterId: character.character_id || character.id });
    setSelectedCharacter(character);
    setDetailVisible(true);
  };

  if (isLoading) {
    return <Loading fullScreen message="加载角色..." />;
  }

  const renderCharacterCard = ({ item, index }) => {
    const emoji = CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length];
    const isPreset = item.creator_id === 'system';

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => openDetail(item)}
        activeOpacity={0.85}
      >
        <View style={[styles.card, isPreset && styles.cardPreset]}>
          <View style={styles.cardHeader}>
            {isPreset && (
              <View style={styles.presetBadge}>
                <Text style={styles.presetBadgeText}>系统</Text>
              </View>
            )}
            <Text style={styles.cardEmoji}>{emoji}</Text>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.cardName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.description || '神秘角色'}
            </Text>
          </View>

          {item.personality && (
            <View style={styles.tagContainer}>
              <View style={styles.personalityTag}>
                <Text style={styles.tagText} numberOfLines={1}>✨ {item.personality}</Text>
              </View>
            </View>
          )}

          {!isPreset && (
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.actionBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GlowOrbBackground />

      <Header
        title="🎭 角色收集"
        subtitle={`共 ${characters.length} 个角色`}
      />

      <FlatList
        data={characters}
        keyExtractor={(item) => item.character_id || item.id || item.characterId || String(Math.random())}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <Animated.Text
            style={[
              styles.sectionTitle,
              {
                opacity: titleAnim,
                transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
              }
            ]}
          >
            🌟 角色列表
          </Animated.Text>
        }
        renderItem={renderCharacterCard}
        ListEmptyComponent={
          <EmptyState
            icon="🎭"
            title="还没有角色"
            description="创建你的第一个冒险角色吧"
            action={
              <Button title="✨ 创建角色" onPress={handleCreate} />
            }
          />
        }
      />

      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreate}
          activeOpacity={0.9}
        >
          <Text style={styles.fabIcon}>+</Text>
          <Text style={styles.fabText}>创建角色</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        title={editingCharacter ? '✏️ 编辑角色' : '✨ 创建新角色'}
        size="large"
      >
        <CharacterForm
          character={editingCharacter}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormVisible(false)}
        />
      </Modal>

      <Modal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        title="角色详情"
        size="large"
      >
        {selectedCharacter && (
          <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.detailContent}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailEmoji}>
                  {CHARACTER_EMOJIS[characters.findIndex(c => c.character_id === selectedCharacter.character_id) % CHARACTER_EMOJIS.length]}
                </Text>
                <View style={styles.detailTitleWrap}>
                  <Text style={styles.detailName}>{selectedCharacter.name}</Text>
                  {selectedCharacter.creator_id === 'system' && (
                    <View style={styles.systemBadge}>
                      <Text style={styles.systemBadgeText}>系统预设</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.detailDescCard}>
                <Text style={styles.detailDescLabel}>📝 角色简介</Text>
                <Text style={styles.detailDesc}>
                  {selectedCharacter.description || '这个角色充满了神秘感...'}
                </Text>
              </View>

              <View style={styles.attributesContainer}>
                <Text style={styles.attributesTitle}>🎭 角色属性</Text>
                
                {selectedCharacter.personality && (
                  <View style={styles.attributeCard}>
                    <View style={styles.attributeIconWrap}>
                      <Text style={styles.attributeIcon}>✨</Text>
                    </View>
                    <View style={styles.attributeContent}>
                      <Text style={styles.attributeLabel}>性格特点</Text>
                      <Text style={styles.attributeValue}>{selectedCharacter.personality}</Text>
                    </View>
                  </View>
                )}
                
                {selectedCharacter.speaking_style && (
                  <View style={styles.attributeCard}>
                    <View style={styles.attributeIconWrap}>
                      <Text style={styles.attributeIcon}>💬</Text>
                    </View>
                    <View style={styles.attributeContent}>
                      <Text style={styles.attributeLabel}>说话风格</Text>
                      <Text style={styles.attributeValue}>{selectedCharacter.speaking_style}</Text>
                    </View>
                  </View>
                )}
              </View>

              {selectedCharacter.creator_id !== 'system' && (
                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setDetailVisible(false);
                      handleEdit(selectedCharacter);
                    }}
                  >
                    <Text style={styles.editBtnIcon}>✏️</Text>
                    <Text style={styles.editBtnText}>编辑角色</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(selectedCharacter)}
                  >
                    <Text style={styles.deleteBtnIcon}>🗑️</Text>
                    <Text style={styles.deleteBtnText}>删除角色</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.legoYellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.legoYellow,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.legoOrange,
  },
  fabIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 4,
  },
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 12,
    height: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPreset: {
    borderColor: COLORS.legoYellow,
    backgroundColor: '#FFF9E6',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 40,
  },
  cardBody: {
    alignItems: 'center',
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 15,
  },
  presetBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.legoYellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  presetBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tagContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  personalityTag: {
    backgroundColor: COLORS.legoYellow + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 'auto',
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
  detailScroll: {
    maxHeight: 500,
  },
  detailContent: {
    padding: 16,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  detailTitleWrap: {
    alignItems: 'center',
  },
  detailName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  systemBadge: {
    backgroundColor: COLORS.legoYellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  systemBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detailDescCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailDescLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  attributesContainer: {
    marginBottom: 16,
  },
  attributesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  attributeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  attributeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.legoYellow + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  attributeIcon: {
    fontSize: 24,
  },
  attributeContent: {
    flex: 1,
  },
  attributeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.legoYellow,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.legoOrange,
  },
  editBtnIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFB3B3',
  },
  deleteBtnIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D32F2F',
  },
});

export default CharactersScreen;
