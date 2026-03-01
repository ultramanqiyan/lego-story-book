import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const StagePreview = ({
  characters = [],
  weather = 'sunny',
  terrain = null,
}) => {
  const getCharacterId = (char) => {
    return char.character_id || char.characterId || char.id;
  };

  const getCharacterColor = (char) => {
    return ROLE_COLORS[char.roleType] || COLORS.legoBlue;
  };

  const getCharacterEmoji = (char) => {
    if (char.avatar) return char.avatar;
    if (char.emoji) return char.emoji;
    return ROLE_EMOJIS[char.roleType] || '🧑';
  };

  const getTerrainEmoji = () => {
    return TERRAIN_EMOJIS[terrain] || '🌿';
  };

  const getWeatherEmoji = () => {
    return WEATHER_EMOJIS[weather] || '☀️';
  };

  const renderMiniCard = (char, index) => {
    const charId = getCharacterId(char);
    const charName = char.custom_name || char.name;
    const charColor = getCharacterColor(char);
    const charEmoji = getCharacterEmoji(char);

    return (
      <View
        key={charId || index}
        style={[styles.miniCard, { borderColor: charColor }]}
      >
        <View style={[styles.miniCardTopBar, { backgroundColor: charColor }]} />
        <View style={styles.miniCardContent}>
          <Text style={styles.miniAvatar}>{charEmoji}</Text>
          <Text style={styles.miniName} numberOfLines={1}>
            {charName}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptySlot = (label, icon) => (
    <View style={styles.emptySlot}>
      <Text style={styles.slotIcon}>{icon}</Text>
      <Text style={styles.slotLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎭 舞台预览</Text>
      </View>

      <WeatherEffect weather={weather}>
        <View style={styles.stage}>
          <View style={styles.background}>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
            <Text style={styles.terrainEmoji}>{getTerrainEmoji()}</Text>
          </View>

          <View style={styles.contentLayer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👥 角色阵容</Text>
              <View style={styles.slotsRow}>
                {characters.length > 0 ? (
                  characters.map((char, index) => renderMiniCard(char, index))
                ) : (
                  renderEmptySlot('选择角色', '👤')
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌍 场景设定</Text>
              <View style={styles.slotsRow}>
                {terrain ? (
                  <View style={[styles.miniCard, styles.terrainCard, { borderColor: '#22c55e' }]}>
                    <View style={[styles.miniCardTopBar, { backgroundColor: '#22c55e' }]} />
                    <View style={styles.miniCardContent}>
                      <Text style={styles.miniAvatar}>{getTerrainEmoji()}</Text>
                      <Text style={styles.miniName} numberOfLines={1}>
                        {terrain === 'forest' ? '森林' : terrain === 'castle' ? '城堡' : terrain === 'ocean' ? '海洋' : terrain === 'desert' ? '沙漠' : terrain === 'mountain' ? '山脉' : terrain === 'glacier' ? '冰川' : terrain === 'volcano' ? '火山' : '城市'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  renderEmptySlot('地形', '🏔️')
                )}
                <View style={[styles.miniCard, styles.weatherCard, { borderColor: '#3b82f6' }]}>
                  <View style={[styles.miniCardTopBar, { backgroundColor: '#3b82f6' }]} />
                  <View style={styles.miniCardContent}>
                    <Text style={styles.miniAvatar}>{getWeatherEmoji()}</Text>
                    <Text style={styles.miniName} numberOfLines={1}>
                      {weather === 'sunny' ? '晴天' : weather === 'rainy' ? '雨天' : weather === 'thunder' ? '雷雨' : weather === 'snow' ? '雪天' : weather === 'foggy' ? '雾天' : '多云'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.previewTextContainer}>
              <Text style={styles.previewText} numberOfLines={2}>
                {characters.length > 0
                  ? `${characters.map(c => c.custom_name || c.name).join('、')}的故事即将开始...`
                  : '选择卡牌来构建你的故事...'}
              </Text>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
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
  stage: {
    minHeight: 180,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    opacity: 0.3,
  },
  terrainEmoji: {
    fontSize: 32,
  },
  contentLayer: {
    flex: 1,
    padding: 12,
    zIndex: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniCard: {
    width: 52,
    height: 70,
    borderRadius: 6,
    backgroundColor: 'rgba(30, 30, 50, 0.9)',
    borderWidth: 2,
    overflow: 'hidden',
  },
  miniCardTopBar: {
    height: 3,
    width: '100%',
  },
  miniCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  miniAvatar: {
    fontSize: 18,
  },
  miniName: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
    textAlign: 'center',
  },
  emptySlot: {
    width: 52,
    height: 70,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotIcon: {
    fontSize: 14,
    opacity: 0.4,
  },
  slotLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  terrainCard: {
    borderColor: '#22c55e',
  },
  weatherCard: {
    borderColor: '#3b82f6',
  },
  previewTextContainer: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
  },
  previewText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default StagePreview;
