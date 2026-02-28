import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, EmptyState, Loading, Modal } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';
import { RARITY_STYLES } from '../../components/Card';

const CharacterCard = ({ character, onPress, selected }) => {
  const rarityStyle = RARITY_STYLES[character.rarity || 'common'];
  
  return (
    <TouchableOpacity onPress={() => onPress(character)} activeOpacity={0.8}>
      <Card
        rarity={character.rarity || 'common'}
        selected={selected}
        style={styles.characterCard}
      >
        <View style={styles.characterImageContainer}>
          {character.image ? (
            <Image source={{ uri: character.image }} style={styles.characterImage} />
          ) : (
            <Text style={styles.characterPlaceholder}>🎭</Text>
          )}
        </View>
        <Text style={styles.characterName} numberOfLines={1}>{character.name}</Text>
        <Text style={styles.characterRole}>{character.role || '角色'}</Text>
      </Card>
    </TouchableOpacity>
  );
};

export const CharactersScreen = () => {
  const navigation = useNavigation();
  const { selectedCharacters, addCharacter, removeCharacter } = useGame();
  const { showSuccess, showError } = useToast();
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await api.characters.getAll();
      setCharacters(response.data || []);
    } catch (error) {
      showError('加载角色失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterPress = (character) => {
    const isSelected = selectedCharacters.some(c => c.id === character.id);
    if (isSelected) {
      removeCharacter(character.id);
    } else {
      addCharacter(character);
    }
  };

  const filteredCharacters = filter === 'all' 
    ? characters 
    : characters.filter(c => c.role === filter);

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
        <Text style={styles.pageTitle}>角色收藏</Text>

        <View style={styles.filterContainer}>
          {['all', 'protagonist', 'antagonist', 'supporting'].map(role => (
            <TouchableOpacity
              key={role}
              style={[styles.filterCard, filter === role && styles.filterCardActive]}
              onPress={() => setFilter(role)}
            >
              <Text style={[styles.filterText, filter === role && styles.filterTextActive]}>
                {role === 'all' ? '全部' : role === 'protagonist' ? '主角' : role === 'antagonist' ? '反派' : '配角'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredCharacters.length === 0 ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>🎭</Text>}
            title="没有找到角色"
            message="创建你的第一个角色"
          />
        ) : (
          <View style={styles.characterGrid}>
            {filteredCharacters.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                onPress={handleCharacterPress}
                selected={selectedCharacters.some(c => c.id === character.id)}
              />
            ))}
          </View>
        )}

        {selectedCharacters.length > 0 && (
          <Card style={styles.selectedCard}>
            <Text style={styles.selectedTitle}>已选择 {selectedCharacters.length} 个角色</Text>
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  filterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  filterCardActive: {
    backgroundColor: COLORS.gold.primary,
  },
  filterText: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  filterTextActive: {
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characterCard: {
    width: '48%',
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  characterImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  characterPlaceholder: {
    fontSize: 40,
  },
  characterName: {
    ...TYPOGRAPHY.styles.cardTitle,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  characterRole: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  selectedCard: {
    marginTop: SPACING.xl,
  },
  selectedTitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.gold.primary,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 64,
  },
});

export default CharactersScreen;
