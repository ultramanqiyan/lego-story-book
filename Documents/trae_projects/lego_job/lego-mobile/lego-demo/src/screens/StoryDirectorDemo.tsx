import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useStyle } from '../context/StyleContext';
import { CardStyleType, AnimationType, CARD_STYLES } from '../types/styles';

const { width, height } = Dimensions.get('window');

const FAKE_CHARACTERS = [
  { id: '1', name: '勇士', emoji: '⚔️' },
  { id: '2', name: '法师', emoji: '🔮' },
  { id: '3', name: '弓手', emoji: '🏹' },
  { id: '4', name: '牧师', emoji: '✨' },
  { id: '5', name: '盗贼', emoji: '🗡️' },
];

const FAKE_ADVENTURES = [
  { id: 'battle', name: '战斗', emoji: '⚔️' },
  { id: 'explore', name: '探索', emoji: '🔍' },
  { id: 'treasure', name: '寻宝', emoji: '💎' },
  { id: 'puzzle', name: '解谜', emoji: '🏰' },
];

const FAKE_WEATHERS = [
  { id: 'sunny', name: '晴天', emoji: '☀️', bgColor: '#FFD700' },
  { id: 'rainy', name: '雨天', emoji: '🌧️', bgColor: '#4A90D9' },
  { id: 'snowy', name: '雪天', emoji: '❄️', bgColor: '#87CEEB' },
  { id: 'night', name: '夜晚', emoji: '🌙', bgColor: '#2C3E50' },
];

const FAKE_TERRAINS = [
  { id: 'forest', name: '森林', emoji: '🌲', color: '#228B22' },
  { id: 'mountain', name: '山地', emoji: '⛰️', color: '#8B4513' },
  { id: 'beach', name: '沙滩', emoji: '🏖️', color: '#F4A460' },
  { id: 'desert', name: '沙漠', emoji: '🏜️', color: '#DEB887' },
];

const FAKE_EQUIPMENTS = [
  { id: 'sword', name: '宝剑', emoji: '🗡️' },
  { id: 'shield', name: '盾牌', emoji: '🛡️' },
  { id: 'ring', name: '戒指', emoji: '💍' },
  { id: 'scroll', name: '卷轴', emoji: '📜' },
];

interface StoryDirectorDemoProps {
  onBack: () => void;
}

const StoryDirectorDemo: React.FC<StoryDirectorDemoProps> = ({ onBack }) => {
  const { currentStyle, setStyle, allStyles } = useStyle();
  const styleConfig = CARD_STYLES[currentStyle];

  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);

  const pageAnim = useRef(new Animated.Value(0)).current;
  const characterAnims = useRef(FAKE_CHARACTERS.map(() => new Animated.Value(0))).current;
  const adventureAnims = useRef(FAKE_ADVENTURES.map(() => new Animated.Value(0))).current;
  const weatherAnims = useRef(FAKE_WEATHERS.map(() => new Animated.Value(0))).current;
  const terrainAnims = useRef(FAKE_TERRAINS.map(() => new Animated.Value(0))).current;
  const equipmentAnims = useRef(FAKE_EQUIPMENTS.map(() => new Animated.Value(0))).current;
  const stageAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  const pulseAnims = useRef(FAKE_TERRAINS.map(() => new Animated.Value(1))).current;
  const glowAnims = useRef(FAKE_WEATHERS.map(() => ({ scale: new Animated.Value(1), opacity: new Animated.Value(0.8) }))).current;
  const waveAnims = useRef(FAKE_EQUIPMENTS.map(() => ({ y: new Animated.Value(0), rotate: new Animated.Value(0) }))).current;
  const shakeAnims = useRef(FAKE_CHARACTERS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    characterAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    });

    adventureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 200 + index * 100,
        useNativeDriver: true,
      }).start();
    });

    setTimeout(() => {
      Animated.spring(stageAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 300);

    weatherAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 400 + index * 80,
        useNativeDriver: true,
      }).start();
    });

    terrainAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 600 + index * 80,
        useNativeDriver: true,
      }).start();
    });

    equipmentAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 800 + index * 80,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    pulseAnims.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    glowAnims.forEach((anim) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(anim.scale, {
              toValue: 1.3,
              duration: 750,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 750,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 0.4,
              duration: 750,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0.8,
              duration: 750,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    waveAnims.forEach((anim) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(anim.y, {
              toValue: -8,
              duration: 500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.y, {
              toValue: 8,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.y, {
              toValue: 0,
              duration: 500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim.rotate, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    selectedCharacters.forEach((charId) => {
      const index = FAKE_CHARACTERS.findIndex((c) => c.id === charId);
      if (index >= 0) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnims[index], {
              toValue: 3,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnims[index], {
              toValue: -3,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnims[index], {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ).start();
      }
    });
  }, [selectedCharacters]);

  const toggleCharacter = (id: string) => {
    if (selectedCharacters.includes(id)) {
      setSelectedCharacters(selectedCharacters.filter((c) => c !== id));
    } else if (selectedCharacters.length < 5) {
      setSelectedCharacters([...selectedCharacters, id]);
      const index = FAKE_CHARACTERS.findIndex((c) => c.id === id);
      if (index >= 0) {
        Animated.sequence([
          Animated.spring(characterAnims[index], {
            toValue: 1.2,
            tension: 100,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(characterAnims[index], {
            toValue: 1,
            tension: 100,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const handleShoot = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isReady = selectedCharacters.length > 0 && selectedAdventure && selectedWeather && selectedTerrain && selectedEquipment;

  const renderCharacterCard = (char: typeof FAKE_CHARACTERS[0], index: number) => {
    const isSelected = selectedCharacters.includes(char.id);
    const anim = characterAnims[index];
    const shakeAnim = shakeAnims[index];

    return (
      <Animated.View
        key={char.id}
        style={{
          opacity: anim,
          transform: [
            { scale: anim },
            { translateX: isSelected ? shakeAnim : 0 },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.glow : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => toggleCharacter(char.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{char.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{char.name}</Text>
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: styleConfig.colors.accent }]}>
              <Text style={styles.selectedBadgeText}>
                {selectedCharacters.indexOf(char.id) + 1}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAdventureCard = (adv: typeof FAKE_ADVENTURES[0], index: number) => {
    const isSelected = selectedAdventure === adv.id;
    const anim = adventureAnims[index];
    const rotateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg'],
    });

    return (
      <Animated.View
        key={adv.id}
        style={{
          opacity: anim,
          transform: [{ rotateY }, { scale: anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedAdventure(adv.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{adv.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{adv.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderWeatherCard = (weather: typeof FAKE_WEATHERS[0], index: number) => {
    const isSelected = selectedWeather === weather.id;
    const anim = weatherAnims[index];
    const glowAnim = glowAnims[index];

    return (
      <Animated.View
        key={weather.id}
        style={{
          opacity: anim,
          transform: [{ scale: anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedWeather(weather.id)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <Animated.View
              style={[
                styles.glowRing,
                {
                  transform: [{ scale: glowAnim.scale }],
                  opacity: glowAnim.opacity,
                  borderColor: styleConfig.colors.glow || styleConfig.colors.accent,
                },
              ]}
            />
          )}
          <Text style={styles.cardEmoji}>{weather.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{weather.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTerrainCard = (terrain: typeof FAKE_TERRAINS[0], index: number) => {
    const isSelected = selectedTerrain === terrain.id;
    const anim = terrainAnims[index];
    const pulseAnim = pulseAnims[index];

    return (
      <Animated.View
        key={terrain.id}
        style={{
          opacity: anim,
          transform: [{ scale: isSelected ? pulseAnim : anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedTerrain(terrain.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{terrain.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{terrain.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEquipmentCard = (equip: typeof FAKE_EQUIPMENTS[0], index: number) => {
    const isSelected = selectedEquipment === equip.id;
    const anim = equipmentAnims[index];
    const waveAnim = waveAnims[index];
    const rotate = waveAnim.rotate.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '5deg', '0deg'],
    });

    return (
      <Animated.View
        key={equip.id}
        style={{
          opacity: anim,
          transform: [
            { translateY: isSelected ? waveAnim.y : 0 },
            { rotate: isSelected ? rotate : '0deg' },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedEquipment(equip.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{equip.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{equip.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderStage = () => {
    const selectedCharData = FAKE_CHARACTERS.filter((c) =>
      selectedCharacters.includes(c.id)
    );

    return (
      <Animated.View
        style={[
          styles.stage,
          {
            backgroundColor: styleConfig.colors.secondary,
            borderColor: styleConfig.colors.border,
            opacity: stageAnim,
            transform: [{ scale: stageAnim }],
          },
        ]}
      >
        <Text style={[styles.stageTitle, { color: styleConfig.colors.text }]}>🎭 舞台预览</Text>
        <View style={styles.stageContent}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.stageHint, { color: styleConfig.colors.text + '80' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            <View style={styles.stageCharacters}>
              {selectedCharData.map((char, index) => (
                <Animated.View
                  key={char.id}
                  style={[
                    styles.stageCharacter,
                    {
                      backgroundColor: styleConfig.colors.primary,
                      borderColor: styleConfig.colors.accent,
                    },
                  ]}
                >
                  <Text style={styles.stageCharEmoji}>{char.emoji}</Text>
                  <Text style={[styles.stageCharName, { color: styleConfig.colors.text }]}>
                    {char.name}
                  </Text>
                </Animated.View>
              ))}
            </View>
          )}
          {selectedAdventure && (
            <View style={styles.stageInfo}>
              <Text style={styles.stageInfoEmoji}>
                {FAKE_ADVENTURES.find((a) => a.id === selectedAdventure)?.emoji}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: styleConfig.colors.background,
          opacity: pageAnim,
          transform: [
            {
              translateX: pageAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: styleConfig.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: styleConfig.colors.accent }]}>← 返回</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: styleConfig.colors.text }]}>🎬 故事导演台 Demo</Text>
        <TouchableOpacity
          onPress={() => setShowStyleModal(true)}
          style={[styles.styleButton, { borderColor: styleConfig.colors.accent }]}
        >
          <Text style={[styles.styleButtonText, { color: styleConfig.colors.accent }]}>🎨 风格</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>
            👥 选择角色 ({selectedCharacters.length}/5)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {FAKE_CHARACTERS.map((char, index) => renderCharacterCard(char, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🗺️ 冒险类型</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {FAKE_ADVENTURES.map((adv, index) => renderAdventureCard(adv, index))}
            </View>
          </ScrollView>
        </View>

        {renderStage()}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🌤️ 天气</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {FAKE_WEATHERS.map((weather, index) => renderWeatherCard(weather, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🏔️ 地形</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {FAKE_TERRAINS.map((terrain, index) => renderTerrainCard(terrain, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🪄 装备</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {FAKE_EQUIPMENTS.map((equip, index) => renderEquipmentCard(equip, index))}
            </View>
          </ScrollView>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
          <TouchableOpacity
            style={[
              styles.shootButton,
              {
                backgroundColor: isReady ? styleConfig.colors.accent : styleConfig.colors.border,
              },
            ]}
            onPress={handleShoot}
            disabled={!isReady}
            activeOpacity={0.8}
          >
            <Text style={[styles.shootButtonText, { color: isReady ? '#fff' : styleConfig.colors.text + '80' }]}>
              🎬 开始拍摄！
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showStyleModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowStyleModal(false)}
          activeOpacity={1}
        >
          <View style={[styles.modalContent, { backgroundColor: styleConfig.colors.secondary }]}>
            <Text style={[styles.modalTitle, { color: styleConfig.colors.accent }]}>选择风格</Text>
            <View style={styles.styleGrid}>
              {allStyles.map((style) => {
                const config = CARD_STYLES[style];
                const isSelected = currentStyle === style;
                return (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.styleItem,
                      {
                        backgroundColor: config.colors.primary,
                        borderColor: isSelected ? config.colors.accent : config.colors.border,
                        borderWidth: isSelected ? 3 : 1,
                      },
                    ]}
                    onPress={() => {
                      setStyle(style);
                      setShowStyleModal(false);
                    }}
                  >
                    <Text style={[styles.styleItemName, { color: config.colors.text }]}>
                      {config.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  styleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  styleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    width: 80,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 8,
  },
  cardSelected: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  glowRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    borderWidth: 2,
  },
  stage: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    minHeight: 150,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  stageContent: {
    alignItems: 'center',
  },
  stageHint: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  stageCharacters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  stageCharacter: {
    width: 60,
    height: 75,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCharEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  stageCharName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  stageInfo: {
    marginTop: 12,
  },
  stageInfoEmoji: {
    fontSize: 28,
  },
  shootButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shootButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  styleItem: {
    width: (width * 0.85 - 50) / 3,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleItemName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StoryDirectorDemo;
