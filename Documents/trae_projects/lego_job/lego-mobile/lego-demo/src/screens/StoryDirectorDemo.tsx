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
  { id: '1', name: '勇士', emoji: '⚔️', energy: 100 },
  { id: '2', name: '法师', emoji: '🔮', energy: 80 },
  { id: '3', name: '弓手', emoji: '🏹', energy: 90 },
  { id: '4', name: '牧师', emoji: '✨', energy: 70 },
  { id: '5', name: '盗贼', emoji: '🗡️', energy: 85 },
];

const FAKE_ADVENTURES = [
  { id: 'battle', name: '战斗', emoji: '⚔️' },
  { id: 'explore', name: '探索', emoji: '🔍' },
  { id: 'treasure', name: '寻宝', emoji: '💎' },
  { id: 'puzzle', name: '解谜', emoji: '🏰' },
];

const FAKE_WEATHERS = [
  { id: 'sunny', name: '晴天', emoji: '☀️', bgColors: ['#FFD700', '#FFA500', '#FF8C00'] },
  { id: 'rainy', name: '雨天', emoji: '🌧️', bgColors: ['#4A90D9', '#2C5AA0', '#1E3A5F'] },
  { id: 'snowy', name: '雪天', emoji: '❄️', bgColors: ['#87CEEB', '#B0E0E6', '#E0FFFF'] },
  { id: 'night', name: '夜晚', emoji: '🌙', bgColors: ['#2C3E50', '#1a1a2e', '#0f0f1a'] },
];

const FAKE_TERRAINS = [
  { id: 'forest', name: '森林', emoji: '🌲', decor: '🌲🌳🌿' },
  { id: 'mountain', name: '山地', emoji: '⛰️', decor: '⛰️🏔️🪨' },
  { id: 'beach', name: '沙滩', emoji: '🏖️', decor: '🏖️🌴🌊' },
  { id: 'desert', name: '沙漠', emoji: '🏜️', decor: '🏜️🌵☀️' },
];

const FAKE_EQUIPMENTS = [
  { id: 'sword', name: '宝剑', emoji: '🗡️' },
  { id: 'shield', name: '盾牌', emoji: '🛡️' },
  { id: 'ring', name: '戒指', emoji: '💍' },
  { id: 'scroll', name: '卷轴', emoji: '📜' },
];

type StageStyleType = '3d-perspective' | 'battle-arena' | 'immersive-scene';

const STAGE_STYLE_NAMES: Record<StageStyleType, string> = {
  '3d-perspective': '🎭 3D透视舞台',
  'battle-arena': '⚔️ 游戏战斗界面',
  'immersive-scene': '🌲 沉浸式场景',
};

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
  const [showStageStyleModal, setShowStageStyleModal] = useState(false);
  const [stageStyle, setStageStyle] = useState<StageStyleType>('3d-perspective');

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

  const stageCharAnims = useRef(FAKE_CHARACTERS.map(() => ({
    y: new Animated.Value(-50),
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  const particleAnims = useRef(Array(20).fill(null).map(() => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * 200),
    opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
  }))).current;

  const floatAnims = useRef(FAKE_CHARACTERS.map(() => new Animated.Value(0))).current;

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
        Animated.sequence([
          Animated.parallel([
            Animated.timing(anim.y, {
              toValue: -8,
              duration: 500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 1,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.y, {
              toValue: 8,
              duration: 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.y, {
              toValue: 0,
              duration: 500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    floatAnims.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    particleAnims.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.y, {
            toValue: 250,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: -10,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  useEffect(() => {
    selectedCharacters.forEach((charId) => {
      const index = FAKE_CHARACTERS.findIndex((c) => c.id === charId);
      if (index >= 0) {
        Animated.parallel([
          Animated.spring(stageCharAnims[index].y, {
            toValue: 0,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.spring(stageCharAnims[index].scale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(stageCharAnims[index].opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [selectedCharacters]);

  const toggleCharacter = (id: string) => {
    if (selectedCharacters.includes(id)) {
      const index = FAKE_CHARACTERS.findIndex((c) => c.id === id);
      if (index >= 0) {
        Animated.parallel([
          Animated.timing(stageCharAnims[index].y, {
            toValue: -50,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(stageCharAnims[index].scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(stageCharAnims[index].opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
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

  const getWeatherBgColors = () => {
    const weather = FAKE_WEATHERS.find((w) => w.id === selectedWeather);
    return weather?.bgColors || ['#3a3a5a', '#2a2a4a', '#1a1a3a'];
  };

  const getTerrainDecor = () => {
    const terrain = FAKE_TERRAINS.find((t) => t.id === selectedTerrain);
    return terrain?.decor || '🌿🌱🌿';
  };

  const renderCharacterCard = (char: typeof FAKE_CHARACTERS[0], index: number) => {
    const isSelected = selectedCharacters.includes(char.id);
    const anim = characterAnims[index];

    return (
      <Animated.View
        key={char.id}
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

  const render3DStage = () => {
    const selectedCharData = FAKE_CHARACTERS.filter((c) =>
      selectedCharacters.includes(c.id)
    );
    const bgColors = getWeatherBgColors();

    return (
      <Animated.View style={[styles.stage3DContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.stage3DBackground, { backgroundColor: bgColors[2] }]} />
        <View style={[styles.stage3DGradient, { backgroundColor: bgColors[1] }]} />
        <View style={[styles.stage3DFront, { backgroundColor: bgColors[0] }]} />
        
        <View style={styles.stage3DFloor}>
          <View style={[styles.stage3DFloorTop, { backgroundColor: styleConfig.colors.primary }]} />
          <View style={[styles.stage3DFloorFront, { backgroundColor: styleConfig.colors.border }]} />
        </View>

        <View style={styles.stage3DCharacters}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.stageHint, { color: '#fff' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            selectedCharData.map((char, index) => {
              const charIndex = FAKE_CHARACTERS.findIndex((c) => c.id === char.id);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              });

              return (
                <Animated.View
                  key={char.id}
                  style={[
                    styles.stage3DCharacter,
                    {
                      transform: [
                        { translateY: anim.y },
                        { translateY: translateY },
                        { scale: anim.scale },
                      ],
                      opacity: anim.opacity,
                    },
                  ]}
                >
                  <Text style={styles.stage3DEmoji}>{char.emoji}</Text>
                  <View style={styles.stage3DShadow} />
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.stage3DLabel}>
          <Text style={styles.stage3DLabelText}>🎭 3D透视舞台</Text>
        </View>
      </Animated.View>
    );
  };

  const renderBattleArena = () => {
    const selectedCharData = FAKE_CHARACTERS.filter((c) =>
      selectedCharacters.includes(c.id)
    );

    return (
      <Animated.View style={[styles.battleArenaContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={styles.battleArenaBg}>
          {particleAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.battleParticle,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <Text style={styles.battleParticleText}>✨</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.battleArenaCharacters}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.stageHint, { color: '#fff' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            selectedCharData.map((char, index) => {
              const charIndex = FAKE_CHARACTERS.findIndex((c) => c.id === char.id);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              });

              return (
                <Animated.View
                  key={char.id}
                  style={[
                    styles.battleCharacterFrame,
                    {
                      transform: [
                        { translateY: anim.y },
                        { translateY: translateY },
                        { scale: anim.scale },
                      ],
                      opacity: anim.opacity,
                    },
                  ]}
                >
                  <View style={[styles.battleAvatar, { borderColor: styleConfig.colors.accent }]}>
                    <Text style={styles.battleAvatarEmoji}>{char.emoji}</Text>
                  </View>
                  <View style={styles.battleEnergyBar}>
                    <View 
                      style={[
                        styles.battleEnergyFill, 
                        { 
                          width: `${char.energy}%`,
                          backgroundColor: styleConfig.colors.accent 
                        }
                      ]} 
                    />
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.battleStatusRow}>
          {selectedAdventure && (
            <View style={[styles.battleStatusTag, { backgroundColor: styleConfig.colors.accent + '30' }]}>
              <Text style={styles.battleStatusEmoji}>
                {FAKE_ADVENTURES.find((a) => a.id === selectedAdventure)?.emoji}
              </Text>
            </View>
          )}
          {selectedWeather && (
            <View style={[styles.battleStatusTag, { backgroundColor: styleConfig.colors.primary }]}>
              <Text style={styles.battleStatusEmoji}>
                {FAKE_WEATHERS.find((w) => w.id === selectedWeather)?.emoji}
              </Text>
            </View>
          )}
          {selectedTerrain && (
            <View style={[styles.battleStatusTag, { backgroundColor: styleConfig.colors.secondary }]}>
              <Text style={styles.battleStatusEmoji}>
                {FAKE_TERRAINS.find((t) => t.id === selectedTerrain)?.emoji}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.battleArenaLabel}>
          <Text style={styles.battleArenaLabelText}>⚔️ 游戏战斗界面</Text>
        </View>
      </Animated.View>
    );
  };

  const renderImmersiveScene = () => {
    const selectedCharData = FAKE_CHARACTERS.filter((c) =>
      selectedCharacters.includes(c.id)
    );
    const bgColors = getWeatherBgColors();
    const decor = getTerrainDecor();

    return (
      <Animated.View style={[styles.immersiveContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.immersiveSky, { backgroundColor: bgColors[0] }]} />
        <View style={[styles.immersiveMid, { backgroundColor: bgColors[1] }]} />

        {selectedWeather === 'sunny' && (
          <View style={styles.immersiveSun}>
            <Text style={styles.immersiveSunEmoji}>☀️</Text>
          </View>
        )}
        {selectedWeather === 'night' && (
          <>
            <View style={[styles.immersiveStar, { top: 20, left: 50 }]}><Text style={styles.immersiveStarText}>⭐</Text></View>
            <View style={[styles.immersiveStar, { top: 40, left: 150 }]}><Text style={styles.immersiveStarText}>✨</Text></View>
            <View style={[styles.immersiveStar, { top: 30, left: 250 }]}><Text style={styles.immersiveStarText}>⭐</Text></View>
            <View style={styles.immersiveMoon}><Text style={styles.immersiveMoonEmoji}>🌙</Text></View>
          </>
        )}

        <View style={styles.immersiveCharacters}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.stageHint, { color: '#fff' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            selectedCharData.map((char, index) => {
              const charIndex = FAKE_CHARACTERS.findIndex((c) => c.id === char.id);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -6],
              });
              const positions = [
                { left: 30, top: 60 },
                { left: 120, top: 40 },
                { left: 210, top: 70 },
                { left: 80, top: 100 },
                { left: 170, top: 90 },
              ];

              return (
                <Animated.View
                  key={char.id}
                  style={[
                    styles.immersiveCharacter,
                    positions[index] || positions[0],
                    {
                      transform: [
                        { translateY: anim.y },
                        { translateY: translateY },
                        { scale: anim.scale },
                      ],
                      opacity: anim.opacity,
                    },
                  ]}
                >
                  <Text style={styles.immersiveEmoji}>{char.emoji}</Text>
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.immersiveGround}>
          <Text style={styles.immersiveDecorText}>{decor}</Text>
        </View>
        <View style={[styles.immersiveFloor, { backgroundColor: bgColors[2] }]} />

        <View style={styles.immersiveLabel}>
          <Text style={styles.immersiveLabelText}>🌲 沉浸式场景</Text>
        </View>
      </Animated.View>
    );
  };

  const renderStage = () => {
    switch (stageStyle) {
      case '3d-perspective':
        return render3DStage();
      case 'battle-arena':
        return renderBattleArena();
      case 'immersive-scene':
        return renderImmersiveScene();
      default:
        return render3DStage();
    }
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
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setShowStageStyleModal(true)}
            style={[styles.stageStyleButton, { borderColor: styleConfig.colors.accent }]}
          >
            <Text style={[styles.stageStyleButtonText, { color: styleConfig.colors.accent }]}>🎭</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowStyleModal(true)}
            style={[styles.styleButton, { borderColor: styleConfig.colors.accent }]}
          >
            <Text style={[styles.styleButtonText, { color: styleConfig.colors.accent }]}>🎨</Text>
          </TouchableOpacity>
        </View>
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

      {showStageStyleModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowStageStyleModal(false)}
          activeOpacity={1}
        >
          <View style={[styles.modalContent, { backgroundColor: styleConfig.colors.secondary }]}>
            <Text style={[styles.modalTitle, { color: styleConfig.colors.accent }]}>选择舞台风格</Text>
            <View style={styles.stageStyleList}>
              {(['3d-perspective', 'battle-arena', 'immersive-scene'] as StageStyleType[]).map((style) => {
                const isSelected = stageStyle === style;
                return (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.stageStyleItem,
                      {
                        backgroundColor: isSelected ? styleConfig.colors.accent + '30' : styleConfig.colors.primary,
                        borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
                      },
                    ]}
                    onPress={() => {
                      setStageStyle(style);
                      setShowStageStyleModal(false);
                    }}
                  >
                    <Text style={[styles.stageStyleItemName, { color: styleConfig.colors.text }]}>
                      {STAGE_STYLE_NAMES[style]}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  styleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  styleButtonText: {
    fontSize: 16,
  },
  stageStyleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  stageStyleButtonText: {
    fontSize: 16,
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
  stageHint: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
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
  stageStyleList: {
    gap: 12,
  },
  stageStyleItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  stageStyleItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stage3DContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  stage3DBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stage3DGradient: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  stage3DFront: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  stage3DFloor: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    transform: [{ perspective: 500 }, { rotateX: '60deg' }],
  },
  stage3DFloorTop: {
    flex: 1,
    borderRadius: 4,
  },
  stage3DFloorFront: {
    height: 10,
    borderRadius: 2,
  },
  stage3DCharacters: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  stage3DCharacter: {
    alignItems: 'center',
  },
  stage3DEmoji: {
    fontSize: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  stage3DShadow: {
    width: 30,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    marginTop: 4,
  },
  stage3DLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stage3DLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  battleArenaContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#1a1a2e',
    overflow: 'hidden',
    position: 'relative',
  },
  battleArenaBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  battleParticle: {
    position: 'absolute',
  },
  battleParticleText: {
    fontSize: 16,
  },
  battleArenaCharacters: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  battleCharacterFrame: {
    alignItems: 'center',
  },
  battleAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  battleAvatarEmoji: {
    fontSize: 28,
  },
  battleEnergyBar: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 6,
    overflow: 'hidden',
  },
  battleEnergyFill: {
    height: '100%',
    borderRadius: 3,
  },
  battleStatusRow: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  battleStatusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  battleStatusEmoji: {
    fontSize: 16,
  },
  battleArenaLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  battleArenaLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  immersiveContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  immersiveSky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  immersiveMid: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: '40%',
    opacity: 0.8,
  },
  immersiveSun: {
    position: 'absolute',
    top: 10,
    right: 30,
  },
  immersiveSunEmoji: {
    fontSize: 36,
  },
  immersiveMoon: {
    position: 'absolute',
    top: 15,
    right: 40,
  },
  immersiveMoonEmoji: {
    fontSize: 32,
  },
  immersiveStar: {
    position: 'absolute',
  },
  immersiveStarText: {
    fontSize: 12,
  },
  immersiveCharacters: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60,
  },
  immersiveCharacter: {
    position: 'absolute',
  },
  immersiveEmoji: {
    fontSize: 36,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  immersiveGround: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  immersiveDecorText: {
    fontSize: 20,
    letterSpacing: 4,
  },
  immersiveFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  immersiveLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  immersiveLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default StoryDirectorDemo;
