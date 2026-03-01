import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import WeatherEffect from './WeatherEffect';

const ROLE_COLORS = {
  protagonist: '#ffd700',
  supporting: '#c0c0c0',
  bystander: '#cd7f32',
  antagonist: '#ef4444',
};

const ROLE_EMOJIS = {
  protagonist: '👑',
  supporting: '🎭',
  bystander: '👤',
  antagonist: '👿',
};

const TERRAIN_EMOJIS = {
  forest: '🌲',
  castle: '🏰',
  ocean: '🌊',
  desert: '🏜️',
  mountain: '⛰️',
  glacier: '🧊',
  volcano: '🌋',
  city: '🏙️',
};

const WEATHER_EMOJIS = {
  sunny: '☀️',
  rainy: '🌧️',
  thunder: '⛈️',
  snow: '❄️',
  foggy: '🌫️',
  cloudy: '☁️',
};

const TERRAIN_NAMES = {
  forest: '神秘森林',
  castle: '古老城堡',
  ocean: '深海领域',
  desert: '沙漠绿洲',
  mountain: '高山之巅',
  glacier: '冰封雪原',
  volcano: '火山地带',
  city: '繁华都市',
};

const WEATHER_NAMES = {
  sunny: '晴空万里',
  rainy: '细雨绵绵',
  thunder: '雷雨交加',
  snow: '暴风雪',
  foggy: '诡异迷雾',
  cloudy: '多云天气',
};

const StagePreview = ({
  characters = [],
  weather = 'sunny',
  terrain = null,
  items = [],
  adventureType = null,
  onRemoveCharacter,
  onRemoveTerrain,
  onRemoveWeather,
  onRemoveItem,
}) => {
  const getCharacterId = (char) => {
    return char.character_id || char.characterId || char.id;
  };

  const getCharacterEmoji = (char) => {
    if (char.avatar) return char.avatar;
    if (char.emoji) return char.emoji;
    return ROLE_EMOJIS[char.roleType] || '🧑';
  };

  const getTerrainEmoji = () => {
    return TERRAIN_EMOJIS[terrain] || '🏔️';
  };

  const getWeatherEmoji = () => {
    return WEATHER_EMOJIS[weather] || '☀️';
  };

  const protagonist = characters.find(c => c.roleType === 'protagonist');
  const antagonist = characters.find(c => c.roleType === 'antagonist');
  const supporting = characters.filter(c => c.roleType === 'supporting');

  const renderMiniCard = (card, type, onRemove) => {
    if (!card) return null;
    
    const borderColor = ROLE_COLORS[type] || '#666';
    const emoji = getCharacterEmoji(card);
    const name = card.custom_name || card.name;

    return (
      <View style={[styles.miniCard, { borderColor }]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: borderColor }]} />
        <Text style={styles.miniAvatar}>{emoji}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{name}</Text>
        {onRemove && (
          <TouchableOpacity 
            style={styles.miniRemove} 
            onPress={() => onRemove(getCharacterId(card))}
          >
            <Text style={styles.miniRemoveText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSlot = (icon, label, required = false, highlight = false) => (
    <View style={[styles.stageSlot, required && styles.requiredSlot, highlight && styles.highlightSlot]}>
      <Text style={styles.slotIcon}>{icon}</Text>
      <Text style={styles.slotLabel}>{label}</Text>
      {required && <Text style={styles.requiredLabel}>必选</Text>}
    </View>
  );

  const renderTerrainCard = () => {
    if (!terrain) return null;
    
    return (
      <View style={[styles.miniCard, styles.terrainCard]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: '#22c55e' }]} />
        <Text style={styles.miniAvatar}>{getTerrainEmoji()}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{TERRAIN_NAMES[terrain] || terrain}</Text>
        {onRemoveTerrain && (
          <TouchableOpacity 
            style={styles.miniRemove} 
            onPress={() => onRemoveTerrain()}
          >
            <Text style={styles.miniRemoveText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderWeatherCard = () => {
    return (
      <View style={[styles.miniCard, styles.weatherCard]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: '#3b82f6' }]} />
        <Text style={styles.miniAvatar}>{getWeatherEmoji()}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{WEATHER_NAMES[weather] || weather}</Text>
      </View>
    );
  };

  const renderItemCard = (item, index) => {
    if (!item) return null;
    
    return (
      <View key={index} style={[styles.miniCard, styles.itemCard]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: '#f59e0b' }]} />
        <Text style={styles.miniAvatar}>{item.emoji || item.avatar || '📦'}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{item.name}</Text>
        {onRemoveItem && (
          <TouchableOpacity 
            style={styles.miniRemove} 
            onPress={() => onRemoveItem(index)}
          >
            <Text style={styles.miniRemoveText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAdventureCard = () => {
    if (!adventureType) return null;
    
    const adventureEmojis = {
      exploration: '🗺️',
      battle: '⚔️',
      puzzle: '🧩',
      social: '💬',
      stealth: '🌙',
    };
    
    const adventureNames = {
      exploration: '探索冒险',
      battle: '战斗冒险',
      puzzle: '解谜冒险',
      social: '社交冒险',
      stealth: '潜行冒险',
    };

    return (
      <View style={[styles.miniCard, styles.adventureCard]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: '#8b5cf6' }]} />
        <Text style={styles.miniAvatar}>{adventureEmojis[adventureType] || '🎯'}</Text>
        <Text style={styles.miniName} numberOfLines={1}>{adventureNames[adventureType] || adventureType}</Text>
      </View>
    );
  };

  const getPreviewText = () => {
    const parts = [];
    
    if (protagonist) {
      parts.push(protagonist.custom_name || protagonist.name);
    }
    
    if (supporting.length > 0) {
      parts.push('与' + supporting.map(c => c.custom_name || c.name).join('、'));
    }
    
    if (antagonist) {
      parts.push('对抗' + (antagonist.custom_name || antagonist.name));
    }
    
    if (terrain) {
      parts.push('在' + (TERRAIN_NAMES[terrain] || terrain));
    }
    
    if (weather && weather !== 'sunny') {
      parts.push((WEATHER_NAMES[weather] || weather) + '中');
    }
    
    if (items.length > 0) {
      parts.push('手持' + items.map(i => i.name).join('、'));
    }

    if (parts.length > 0) {
      return parts.join('，') + '...';
    }
    return '选择卡牌来构建你的故事...';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎭 舞台预览</Text>
      </View>

      <WeatherEffect weather={weather}>
        <View style={styles.content}>
          <View style={styles.twoRowsContainer}>
            <View style={styles.row}>
              <View style={styles.rowSection}>
                <Text style={styles.rowTitle}>👥 角色</Text>
                <View style={styles.slotsRow}>
                  {protagonist 
                    ? renderMiniCard(protagonist, 'protagonist', onRemoveCharacter)
                    : renderSlot('👑', '主角', true, true)
                  }
                  {supporting[0] 
                    ? renderMiniCard(supporting[0], 'supporting', onRemoveCharacter)
                    : renderSlot('🎭', '配角')
                  }
                  {supporting[1] 
                    ? renderMiniCard(supporting[1], 'supporting', onRemoveCharacter)
                    : renderSlot('🎭', '配角')
                  }
                  {antagonist 
                    ? renderMiniCard(antagonist, 'antagonist', onRemoveCharacter)
                    : renderSlot('👿', '反派', true, true)
                  }
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowSection}>
                <Text style={styles.rowTitle}>🌍 场景</Text>
                <View style={styles.slotsRow}>
                  {terrain 
                    ? renderTerrainCard()
                    : renderSlot('🏔️', '地形', true, true)
                  }
                  {renderWeatherCard()}
                  {adventureType && renderAdventureCard()}
                  {items.length > 0 && items.slice(0, 2).map((item, index) => renderItemCard(item, index))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.previewTextContainer}>
            <Text style={styles.previewText} numberOfLines={2}>
              {getPreviewText()}
            </Text>
          </View>
        </View>
      </WeatherEffect>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
  },
  content: {
    padding: 10,
  },
  twoRowsContainer: {
    gap: 8,
  },
  row: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 8,
  },
  rowSection: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stageSlot: {
    width: 48,
    height: 66,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  requiredSlot: {
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  highlightSlot: {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  slotIcon: {
    fontSize: 14,
    opacity: 0.5,
  },
  slotLabel: {
    fontSize: 7,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  requiredLabel: {
    position: 'absolute',
    bottom: -8,
    fontSize: 6,
    color: '#ffd700',
  },
  miniCard: {
    width: 48,
    height: 66,
    borderRadius: 6,
    backgroundColor: 'rgba(30, 30, 50, 0.9)',
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  miniAvatar: {
    fontSize: 16,
    marginTop: 6,
  },
  miniName: {
    fontSize: 6,
    fontWeight: '600',
    color: '#fff',
    marginTop: 3,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  miniRemove: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRemoveText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
    marginTop: -1,
  },
  terrainCard: {
    borderColor: '#22c55e',
  },
  weatherCard: {
    borderColor: '#3b82f6',
  },
  itemCard: {
    borderColor: '#f59e0b',
  },
  adventureCard: {
    borderColor: '#8b5cf6',
  },
  previewTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  previewText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 13,
  },
});

export default StagePreview;
