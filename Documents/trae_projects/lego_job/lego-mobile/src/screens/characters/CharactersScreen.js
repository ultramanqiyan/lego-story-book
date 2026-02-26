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
  const modalAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

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
    try {
      await charactersAPI.delete(character.character_id, user?.userId);
      toast.success('删除成功');
      loadCharacters();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleFormSubmit = async (characterData) => {
    try {
      if (editingCharacter) {
        await charactersAPI.update(editingCharacter.character_id, user?.userId, characterData);
        toast.success('更新成功');
      } else {
        await charactersAPI.create(user?.userId, characterData);
        toast.success('创建成功');
        triggerCelebration();
      }
      setFormVisible(false);
      loadCharacters();
    } catch (error) {
      toast.error(`操作失败：${error.message}`);
    }
  };

  const triggerCelebration = () => {
    revealAnim.setValue(0);
    Animated.parallel([
      Animated.spring(revealAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      ...celebrationAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          delay: index * 100,
          easing: BOUNCE_EASING,
          useNativeDriver: true,
        })
      ),
    ]).start();
  };

  const openDetail = (character) => {
    setSelectedCharacter(character);
    setDetailVisible(true);
  };

  const presetCharacters = characters.filter((c) => c.creator_id === 'system');
  const userCharacters = characters.filter((c) => c.creator_id !== 'system');

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
        <TouchableOpacity
          style={[styles.card, isPreset && styles.presetCard]}
          onPress={() => openDetail(item)}
          activeOpacity={0.9}
        >
          {isPreset && (
            <View style={styles.presetBadge}>
              <Text style={styles.presetBadgeText}>系统</Text>
            </View>
          )}
          <Text style={styles.cardEmoji}>{emoji}</Text>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description || '神秘角色'}
          </Text>
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
        </TouchableOpacity>
      </Animated.View>
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
            
            {selectedCharacter.traits && (
              <View style={styles.traitsContainer}>
                <Text style={styles.traitsTitle}>✨ 特点</Text>
                <Text style={styles.traitsText}>{selectedCharacter.traits}</Text>
              </View>
            )}
            
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
                    onPress={() => {
                      setDetailVisible(false);
                      handleDelete(selectedCharacter);
                    }}
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
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 160,
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  presetCard: {
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
  },
  presetBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  cardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 8,
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
    marginBottom: 16,
  },
  traitsContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  traitsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  traitsText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailBtn: {
    flex: 1,
  },
});

export default CharactersScreen;
