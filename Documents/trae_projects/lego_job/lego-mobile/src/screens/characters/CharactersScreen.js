import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI } from '../../api';
import { Card, Button, Loading, EmptyState, Header, Modal, GlowOrbBackground } from '../../components/common';
import CharacterForm from '../../components/characters/CharacterForm';
import Card3D from '../../components/card3d/Card3D';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

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

  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef([]).current;

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
      cardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: index * 60,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isLoading]);

  const loadCharacters = async () => {
    try {
      const data = await charactersAPI.getList(user?.userId);
      setCharacters(data.characters || []);
      data.characters?.forEach((_, i) => {
        if (!cardAnims[i]) cardAnims[i] = new Animated.Value(0);
      });
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
    if (!character?.character_id) {
      toast.error('角色信息无效');
      return;
    }
    try {
      await charactersAPI.delete(character.character_id);
      toast.success('删除成功');
      setDetailVisible(false);
      loadCharacters();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleFormSubmit = async (characterData) => {
    try {
      if (editingCharacter?.character_id) {
        await charactersAPI.update(editingCharacter.character_id, characterData);
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

  const renderCharacterCard = ({ item, index, isPreset }) => {
    const anim = cardAnims[index] || new Animated.Value(1);
    const emoji = CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length];

    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
          ],
        }}
      >
        <Card3D
          icon={emoji}
          name={item.name}
          isSelected={false}
          onSelect={() => openDetail(item)}
          variant={isPreset ? 'primary' : 'default'}
          width={100}
          height={140}
          enableTilt={true}
          enableFlip={true}
          frontContent={
            <>
              {isPreset && (
                <View style={styles.presetBadge}>
                  <Text style={styles.presetBadgeText}>系统</Text>
                </View>
              )}
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description || '神秘角色'}
              </Text>
              {item.personality && (
                <View style={styles.tagContainer}>
                  <View style={styles.personalityTag}>
                    <Text style={styles.tagText}>✨ {item.personality}</Text>
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
            </>
          }
          backContent={
            <View style={styles.cardBackContent}>
              <View style={styles.legoPattern}>
                {[...Array(4)].map((_, i) => (
                  <View key={i} style={styles.legoDot} />
                ))}
              </View>
              <Text style={styles.backText}>🧱</Text>
            </View>
          }
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <GlowOrbBackground />

      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: CharactersScreen (角色页)</Text>
      </View>

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
        keyExtractor={(item) => item.character_id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <Animated.RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
            🌟 预设人仔
          </Animated.Text>
        }
        renderItem={({ item, index }) =>
          renderCharacterCard({ item, index, isPreset: item.creator_id === 'system' })
        }
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
  debugLabel: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  debugLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  presetBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.legoYellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  presetBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  personalityTag: {
    backgroundColor: COLORS.legoYellow + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 'auto',
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
  detailContent: {
    alignItems: 'center',
    padding: 16,
  },
  detailEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  detailDesc: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  attributesContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 100,
  },
  attributeValue: {
    flex: 1,
    backgroundColor: COLORS.legoYellow + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  attributeValueText: {
    fontSize: 14,
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
  cardBackContent: {
    backgroundColor: COLORS.background,
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  legoPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 40,
    height: 40,
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginBottom: 8,
  },
  legoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.legoYellow,
    opacity: 0.6,
  },
  backText: {
    fontSize: 24,
  },
});

export default CharactersScreen;
