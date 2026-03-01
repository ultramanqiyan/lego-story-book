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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Header, Modal, GlowOrbBackground } from '../../components/common';
import CharacterForm from '../../components/characters/CharacterForm';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

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
    try {
      const data = await charactersAPI.getList(user?.userId);
      setCharacters(data.characters || []);
    } catch (error) {
      toast.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  }, []);

  const handleCreate = () => {
    setEditingCharacter(null);
    setFormVisible(true);
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setFormVisible(true);
  };

  const handleDelete = async (character) => {
    const charId = character.character_id || character.id || character.characterId;
    if (!charId) {
      toast.error('角色信息无效');
      return;
    }
    try {
      await charactersAPI.delete(charId);
      toast.success('删除成功');
      setDetailVisible(false);
      loadCharacters();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleFormSubmit = async (characterData) => {
    try {
      const editingId = editingCharacter?.character_id || editingCharacter?.id || editingCharacter?.characterId;
      if (editingId) {
        await charactersAPI.update(editingId, characterData);
        toast.success('更新成功');
      } else {
        await charactersAPI.create({ ...characterData, creatorId: user?.userId });
        toast.success('创建成功');
      }
      setFormVisible(false);
      loadCharacters();
    } catch (error) {
      toast.error(`操作失败：${error.message}`);
    }
  };

  const openDetail = (character) => {
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
        rightButton={
          <Button
            title="➕ 创建"
            variant="outline"
            size="sm"
            onPress={handleCreate}
          />
        }
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

      <Modal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        title={editingCharacter ? '✏️ 编辑角色' : '✨ 创建新角色'}
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
        title="📋 角色详情"
      >
        {selectedCharacter && (
          <ScrollView style={styles.detailScroll}>
            <View style={styles.detailContent}>
              <Text style={styles.detailEmoji}>
                {CHARACTER_EMOJIS[characters.findIndex(c => c.character_id === selectedCharacter.character_id) % CHARACTER_EMOJIS.length]}
              </Text>
              <Text style={styles.detailName}>{selectedCharacter.name}</Text>
              <Text style={styles.detailDesc}>
                {selectedCharacter.description || '这个角色充满了神秘感...'}
              </Text>

              <View style={styles.attributesContainer}>
                {selectedCharacter.personality && (
                  <View style={styles.attributeRow}>
                    <Text style={styles.attributeLabel}>✨ 性格</Text>
                    <View style={styles.attributeValue}>
                      <Text style={styles.attributeValueText}>{selectedCharacter.personality}</Text>
                    </View>
                  </View>
                )}
                {selectedCharacter.speaking_style && (
                  <View style={styles.attributeRow}>
                    <Text style={styles.attributeLabel}>💬 说话风格</Text>
                    <View style={styles.attributeValue}>
                      <Text style={styles.attributeValueText}>{selectedCharacter.speaking_style}</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.detailActions}>
                {selectedCharacter.creator_id !== 'system' && (
                  <>
                    <Button
                      title="✏️ 编辑"
                      variant="outline"
                      onPress={() => {
                        setDetailVisible(false);
                        handleEdit(selectedCharacter);
                      }}
                      style={styles.detailBtn}
                    />
                    <Button
                      title="🗑️ 删除"
                      variant="danger"
                      onPress={() => handleDelete(selectedCharacter)}
                      style={styles.detailBtn}
                    />
                  </>
                )}
              </View>
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
    paddingBottom: 100,
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
    maxHeight: 400,
  },
  detailContent: {
    alignItems: 'center',
    padding: 16,
  },
  detailEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  attributesContainer: {
    width: '100%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  attributeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    width: 90,
  },
  attributeValue: {
    flex: 1,
    backgroundColor: COLORS.legoYellow + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  attributeValueText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  detailBtn: {
    flex: 1,
  },
});

export default CharactersScreen;
