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
import { useData } from '../context/DataContext';
import { Character, PlotElement } from '../database/DatabaseService';
import { getCardStyleForBookType } from '../theme/cardStyleMapping';
import { getThemeColors, getGlassStyle, storyThemes } from '../theme';

const DEFAULT_THEME = storyThemes.children.colors;

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = 80;
const CARD_HEIGHT = 100;

type StageStyleType = 
  | 'mini-card-preview'
  | '3d-perspective' 
  | 'battle-arena' 
  | 'immersive-scene'
  | 'pixel-art'
  | 'glassmorphism'
  | 'carousel-wheel'
  | 'side-scroller';

const STAGE_STYLE_NAMES: Record<StageStyleType, string> = {
  'mini-card-preview': '🎴 迷你卡牌预览',
  '3d-perspective': '🎭 3D透视舞台',
  'battle-arena': '⚔️ 游戏战斗界面',
  'immersive-scene': '🌲 沉浸式场景',
  'pixel-art': '👾 像素艺术风格',
  'glassmorphism': '💎 玻璃拟态风格',
  'carousel-wheel': '🎡 转盘风格',
  'side-scroller': '🎮 横版过关风格',
};

const ELEMENT_COLORS = {
  protagonist: '#FFD700',
  supporting: '#C0C0C0',
  antagonist: '#EF4444',
  terrain: '#22C55E',
  weather: '#3B82F6',
  adventure: '#8B5CF6',
  equipment: '#F59E0B',
};

interface StoryDirectorDemoProps {
  bookId: string;
  onBack: () => void;
}

const StoryDirectorDemo: React.FC<StoryDirectorDemoProps> = ({ bookId, onBack }) => {
  const { currentStyle, setStyle, allStyles } = useStyle();
  const { getBookById, getUnlockedElements, addChapter, getCharactersByBookId, getPlotElementsByTypeId, refreshBooks } = useData();
  
  const [bookType, setBookType] = useState<string>('magic');
  const cardStyleType = getCardStyleForBookType(bookType);
  const styleConfig = CARD_STYLES[cardStyleType];
  const themeColors = getThemeColors(bookType);
  const glassStyle = getGlassStyle(bookType);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [adventures, setAdventures] = useState<PlotElement[]>([]);
  const [weathers, setWeathers] = useState<PlotElement[]>([]);
  const [terrains, setTerrains] = useState<PlotElement[]>([]);
  const [equipments, setEquipments] = useState<PlotElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showStageStyleModal, setShowStageStyleModal] = useState(false);
  const [stageStyle, setStageStyle] = useState<StageStyleType>('mini-card-preview');

  const pageAnim = useRef(new Animated.Value(0)).current;
  const characterAnims = useRef<Animated.Value[]>([]).current;
  const adventureAnims = useRef<Animated.Value[]>([]).current;
  const weatherAnims = useRef<Animated.Value[]>([]).current;
  const terrainAnims = useRef<Animated.Value[]>([]).current;
  const equipmentAnims = useRef<Animated.Value[]>([]).current;
  const stageAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  const pulseAnims = useRef<Animated.Value[]>([]).current;
  const glowAnims = useRef<{ scale: Animated.Value; opacity: Animated.Value }[]>([]).current;
  const waveAnims = useRef<{ y: Animated.Value; rotate: Animated.Value }[]>([]).current;
  
  const shakeAnims = useRef<Animated.Value[]>([]).current;
  const stageCharAnims = useRef<{ y: Animated.Value; scale: Animated.Value; opacity: Animated.Value }[]>([]).current;
  const floatAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    loadData();
  }, [bookId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('[StoryDirector] Loading data for bookId:', bookId);
      const book = await getBookById(bookId);
      console.log('[StoryDirector] Book loaded:', book);
      if (book) {
        setBookType(book.typeId || 'magic');
        const unlockedElements = await getUnlockedElements(bookId);
        console.log('[StoryDirector] Unlocked elements:', unlockedElements.length);
        
        const unlockedCharIds = unlockedElements
          .filter(e => e.elementType === 'character')
          .map(e => e.elementId);
        
        const allChars = await getCharactersByBookId(bookId);
        const chars = allChars.filter(c => unlockedCharIds.includes(c.characterId));
        console.log('[StoryDirector] Unlocked characters loaded:', chars.length, chars);
        setCharacters(chars);
        
        const allAdventures = await getPlotElementsByTypeId(book.typeId, 'adventure');
        const unlockedAdventureIds = unlockedElements
          .filter(e => e.elementType === 'adventure')
          .map(e => e.elementId);
        const adventureData = allAdventures.filter(a => unlockedAdventureIds.includes(a.elementId));
        console.log('[StoryDirector] Unlocked adventures loaded:', adventureData.length);
        setAdventures(adventureData);
        
        const allWeathers = await getPlotElementsByTypeId(book.typeId, 'weather');
        const unlockedWeatherIds = unlockedElements
          .filter(e => e.elementType === 'weather')
          .map(e => e.elementId);
        const weatherData = allWeathers.filter(w => unlockedWeatherIds.includes(w.elementId));
        console.log('[StoryDirector] Unlocked weathers loaded:', weatherData.length);
        setWeathers(weatherData);
        
        const allTerrains = await getPlotElementsByTypeId(book.typeId, 'terrain');
        const unlockedTerrainIds = unlockedElements
          .filter(e => e.elementType === 'terrain')
          .map(e => e.elementId);
        const terrainData = allTerrains.filter(t => unlockedTerrainIds.includes(t.elementId));
        console.log('[StoryDirector] Unlocked terrains loaded:', terrainData.length);
        setTerrains(terrainData);
        
        const allEquipments = await getPlotElementsByTypeId(book.typeId, 'equipment');
        const unlockedEquipmentIds = unlockedElements
          .filter(e => e.elementType === 'equipment')
          .map(e => e.elementId);
        const equipmentData = allEquipments.filter(e => unlockedEquipmentIds.includes(e.elementId));
        console.log('[StoryDirector] Unlocked equipments loaded:', equipmentData.length);
        setEquipments(equipmentData);
        
        // Initialize animation arrays immediately after loading data
        shakeAnims.length = 0;
        stageCharAnims.length = 0;
        floatAnims.length = 0;
        characterAnims.length = 0;
        adventureAnims.length = 0;
        weatherAnims.length = 0;
        terrainAnims.length = 0;
        equipmentAnims.length = 0;
        pulseAnims.length = 0;
        glowAnims.length = 0;
        waveAnims.length = 0;
        
        chars.forEach(() => {
          shakeAnims.push(new Animated.Value(0));
          stageCharAnims.push({
            y: new Animated.Value(-50),
            scale: new Animated.Value(0),
            opacity: new Animated.Value(0),
          });
          floatAnims.push(new Animated.Value(0));
          characterAnims.push(new Animated.Value(0));
        });
        
        adventureData.forEach(() => {
          adventureAnims.push(new Animated.Value(0));
        });
        
        weatherData.forEach(() => {
          weatherAnims.push(new Animated.Value(0));
          glowAnims.push({
            scale: new Animated.Value(1),
            opacity: new Animated.Value(0.5),
          });
        });
        
        terrainData.forEach(() => {
          terrainAnims.push(new Animated.Value(0));
          pulseAnims.push(new Animated.Value(1));
        });
        
        equipmentData.forEach(() => {
          equipmentAnims.push(new Animated.Value(0));
          waveAnims.push({
            y: new Animated.Value(0),
            rotate: new Animated.Value(0),
          });
        });
        
        // Start animations after initializing arrays
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
      }
    } catch (error) {
      console.error('Failed to load director data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const particleAnims = useRef(Array(20).fill(null).map(() => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * 200),
    opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
  }))).current;

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
      const index = characters.findIndex((c) => c.characterId === charId);
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
      const index = characters.findIndex((c) => c.characterId === id);
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
      const index = characters.findIndex((c) => c.characterId === id);
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

  const handleShoot = async () => {
    console.log('[StoryDirector] handleShoot called');
    console.log('[StoryDirector] selectedCharacters:', selectedCharacters);
    console.log('[StoryDirector] selectedAdventure:', selectedAdventure);
    console.log('[StoryDirector] selectedWeather:', selectedWeather);
    console.log('[StoryDirector] selectedTerrain:', selectedTerrain);
    console.log('[StoryDirector] selectedEquipment:', selectedEquipment);
    console.log('[StoryDirector] isReady:', isReady);
    
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

    if (!isReady) {
      console.log('[StoryDirector] Early return - isReady is false');
      console.log('[StoryDirector] Missing conditions:');
      if (selectedCharacters.length === 0) console.log('  - No characters selected');
      if (!selectedAdventure) console.log('  - No adventure selected');
      if (!selectedWeather) console.log('  - No weather selected');
      if (!selectedTerrain) console.log('  - No terrain selected');
      if (!selectedEquipment) console.log('  - No equipment selected');
      return;
    }

    try {
      console.log('[StoryDirector] Creating chapter...');
      const selectedCharData = characters.filter(c => selectedCharacters.includes(c.characterId));
      const charNames = selectedCharData.map(c => c.name).join('、');
      const adventureName = adventures.find(a => a.elementId === selectedAdventure)?.name || '冒险';
      const weatherName = weathers.find(w => w.elementId === selectedWeather)?.name || '晴天';
      const terrainName = terrains.find(t => t.elementId === selectedTerrain)?.name || '森林';
      const equipmentName = equipments.find(e => e.elementId === selectedEquipment)?.name || '装备';

      const fakeTitle = `新的冒险`;
      const fakeContent = `这是一个关于${charNames}的故事。

在${weatherName}的${terrainName}中，${charNames}开始了一场${adventureName}之旅。

他们带着${equipmentName}，勇敢地踏上了征程。

一路上，他们遇到了许多有趣的事情...

【谜题】
在这个故事中，主角们使用了什么装备？
A. ${equipmentName}
B. 魔法棒
C. 飞行器
D. 隐身衣`;

      const chapterData = {
        title: fakeTitle,
        content: fakeContent,
        hasPuzzle: true,
        puzzleQuestion: '在这个故事中，主角们使用了什么装备？',
        puzzleOptions: [equipmentName, '魔法棒', '飞行器', '隐身衣'],
        puzzleCorrectIndex: 0,
        characterIds: selectedCharacters,
      };

      console.log('[StoryDirector] Calling addChapter with bookId:', bookId);
      console.log('[StoryDirector] chapterData:', chapterData);
      await addChapter(bookId, chapterData);
      console.log('[StoryDirector] Chapter added successfully, refreshing books');
      await refreshBooks();
      console.log('[StoryDirector] Books refreshed, calling onBack');
      onBack();
    } catch (error) {
      console.error('[StoryDirector] Failed to add chapter:', error);
    }
  };

  const isReady = selectedCharacters.length > 0 && selectedAdventure && selectedWeather && selectedTerrain && selectedEquipment;

  const getWeatherBgColors = () => {
    const weather = weathers.find((w) => w.elementId === selectedWeather);
    return weather?.extraConfig?.bgColors || ['#3a3a5a', '#2a2a4a', '#1a1a3a'];
  };

  const getTerrainDecor = () => {
    const terrain = terrains.find((t) => t.elementId === selectedTerrain);
    return terrain?.extraConfig?.decor || '🌿🌱🌿';
  };

  const renderCharacterCard = (char: Character, index: number) => {
    const isSelected = selectedCharacters.includes(char.characterId);
    const anim = characterAnims[index];

    if (!anim) return null;

    return (
      <Animated.View
        key={char.characterId}
        style={{
          opacity: anim,
          transform: [{ scale: anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => toggleCharacter(char.characterId)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{char.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{char.name}</Text>
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: styleConfig.colors.accent }]}>
              <Text style={styles.selectedBadgeText}>
                {selectedCharacters.indexOf(char.characterId) + 1}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAdventureCard = (adv: PlotElement, index: number) => {
    const isSelected = selectedAdventure === adv.elementId;
    const anim = adventureAnims[index];
    
    if (!anim) return null;
    
    const rotateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg'],
    });

    return (
      <Animated.View
        key={adv.elementId}
        style={{
          opacity: anim,
          transform: [{ rotateY }, { scale: anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedAdventure(adv.elementId)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{adv.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{adv.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderWeatherCard = (weather: PlotElement, index: number) => {
    const isSelected = selectedWeather === weather.elementId;
    const anim = weatherAnims[index];
    const glowAnim = glowAnims[index];

    if (!anim) return null;

    return (
      <Animated.View
        key={weather.elementId}
        style={{
          opacity: anim,
          transform: [{ scale: anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedWeather(weather.elementId)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <Animated.View
              style={[
                styles.glowRing,
                {
                  transform: [{ scale: glowAnim.scale }],
                  opacity: glowAnim.opacity,
                  borderColor: styleConfig.colors.accent,
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

  const renderTerrainCard = (terrain: PlotElement, index: number) => {
    const isSelected = selectedTerrain === terrain.elementId;
    const anim = terrainAnims[index];
    const pulseAnim = pulseAnims[index];

    if (!anim) return null;

    return (
      <Animated.View
        key={terrain.elementId}
        style={{
          opacity: anim,
          transform: [{ scale: isSelected ? pulseAnim : anim }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedTerrain(terrain.elementId)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{terrain.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{terrain.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEquipmentCard = (equip: PlotElement, index: number) => {
    const isSelected = selectedEquipment === equip.elementId;
    const anim = equipmentAnims[index];
    const waveAnim = waveAnims[index];
    
    if (!anim || !waveAnim) return null;
    
    const rotate = waveAnim.rotate.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '5deg', '0deg'],
    });

    return (
      <Animated.View
        key={equip.elementId}
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
              backgroundColor: isSelected ? styleConfig.colors.secondary : styleConfig.colors.primary,
              borderColor: isSelected ? styleConfig.colors.accent : styleConfig.colors.border,
              shadowColor: isSelected ? styleConfig.colors.accent : 'transparent',
            },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => setSelectedEquipment(equip.elementId)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>{equip.emoji}</Text>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{equip.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMiniCard = (
    emoji: string,
    name: string,
    type: keyof typeof ELEMENT_COLORS,
    onRemove?: () => void
  ) => {
    const color = ELEMENT_COLORS[type];
    
    return (
      <View style={[styles.miniCard, { borderColor: color }]}>
        <View style={[styles.miniCardTopBar, { backgroundColor: color }]} />
        <Text style={styles.miniCardEmoji}>{emoji}</Text>
        <Text style={styles.miniCardName} numberOfLines={1}>{name}</Text>
        {onRemove && (
          <TouchableOpacity style={styles.miniCardRemove} onPress={onRemove}>
            <Text style={styles.miniCardRemoveText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptySlot = (
    icon: string,
    label: string,
    required: boolean = false
  ) => {
    return (
      <View style={[styles.emptySlot, required && styles.emptySlotRequired]}>
        <Text style={styles.emptySlotIcon}>{icon}</Text>
        <Text style={styles.emptySlotLabel}>{label}</Text>
        {required && <Text style={styles.emptySlotRequiredLabel}>必选</Text>}
      </View>
    );
  };

  const getPreviewText = () => {
    const parts: string[] = [];
    
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    
    const protagonist = selectedCharData.find(c => c.roleType === '主角');
    const supporting = selectedCharData.filter(c => c.roleType === '伙伴' || c.roleType === '导师');
    const antagonist = selectedCharData.find(c => c.roleType === '反派');
    
    if (protagonist) {
      parts.push(protagonist.name);
    }
    
    if (supporting.length > 0) {
      parts.push('与' + supporting.map(c => c.name).join('、'));
    }
    
    if (antagonist) {
      parts.push('对抗' + antagonist.name);
    }
    
    const selectedTerrainData = terrains.find(t => t.elementId === selectedTerrain);
    if (selectedTerrainData) {
      parts.push('在' + selectedTerrainData.name);
    }
    
    const selectedWeatherData = weathers.find(w => w.elementId === selectedWeather);
    if (selectedWeatherData && selectedWeatherData.name !== '晴天') {
      parts.push(selectedWeatherData.name + '中');
    }
    
    const selectedAdventureData = adventures.find(a => a.elementId === selectedAdventure);
    if (selectedAdventureData) {
      parts.push('展开' + selectedAdventureData.name);
    }
    
    const selectedEquipmentData = equipments.find(e => e.elementId === selectedEquipment);
    if (selectedEquipmentData) {
      parts.push('手持' + selectedEquipmentData.name);
    }

    if (parts.length > 0) {
      return parts.join('，') + '...';
    }
    return '选择卡牌来构建你的故事...';
  };

  const renderMiniCardPreview = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    
    const protagonist = selectedCharData.find(c => c.roleType === '主角');
    const supporting = selectedCharData.filter(c => c.roleType === '伙伴' || c.roleType === '导师');
    const antagonist = selectedCharData.find(c => c.roleType === '反派');
    
    const selectedTerrainData = terrains.find(t => t.elementId === selectedTerrain);
    const selectedWeatherData = weathers.find(w => w.elementId === selectedWeather);
    const selectedAdventureData = adventures.find(a => a.elementId === selectedAdventure);
    const selectedEquipmentData = equipments.find(e => e.elementId === selectedEquipment);

    return (
      <Animated.View style={[styles.miniPreviewContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={styles.miniPreviewHeader}>
          <Text style={styles.miniPreviewTitle}>🎭 舞台预览</Text>
        </View>
        
        <View style={styles.miniPreviewContent}>
          <View style={styles.miniPreviewRow}>
            <Text style={styles.miniPreviewRowTitle}>👥 角色</Text>
            <View style={styles.miniCardsRow}>
              {protagonist 
                ? renderMiniCard(protagonist.emoji, protagonist.name, 'protagonist', () => toggleCharacter(protagonist.characterId))
                : renderEmptySlot('👑', '主角', true)
              }
              {supporting[0] 
                ? renderMiniCard(supporting[0].emoji, supporting[0].name, 'supporting', () => toggleCharacter(supporting[0].characterId))
                : renderEmptySlot('🎭', '配角')
              }
              {supporting[1] 
                ? renderMiniCard(supporting[1].emoji, supporting[1].name, 'supporting', () => toggleCharacter(supporting[1].characterId))
                : renderEmptySlot('🎭', '配角')
              }
              {antagonist 
                ? renderMiniCard(antagonist.emoji, antagonist.name, 'antagonist', () => toggleCharacter(antagonist.characterId))
                : renderEmptySlot('👿', '反派', true)
              }
            </View>
          </View>
          
          <View style={styles.miniPreviewRow}>
            <Text style={styles.miniPreviewRowTitle}>🌍 场景</Text>
            <View style={styles.miniCardsRow}>
              {selectedTerrainData 
                ? renderMiniCard(selectedTerrainData.emoji, selectedTerrainData.name, 'terrain', () => setSelectedTerrain(null))
                : renderEmptySlot('🏔️', '地形', true)
              }
              {selectedWeatherData 
                ? renderMiniCard(selectedWeatherData.emoji, selectedWeatherData.name, 'weather')
                : renderEmptySlot('☀️', '天气')
              }
              {selectedAdventureData 
                ? renderMiniCard(selectedAdventureData.emoji, selectedAdventureData.name, 'adventure', () => setSelectedAdventure(null))
                : renderEmptySlot('🎯', '冒险')
              }
              {selectedEquipmentData 
                ? renderMiniCard(selectedEquipmentData.emoji, selectedEquipmentData.name, 'equipment', () => setSelectedEquipment(null))
                : renderEmptySlot('🎒', '装备')
              }
            </View>
          </View>
          
          <View style={styles.previewTextContainer}>
            <Text style={styles.previewText} numberOfLines={2}>
              {getPreviewText()}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const render3DStage = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
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
              const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              
              if (!anim || !floatAnim) return null;
              
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              });

              return (
                <Animated.View
                  key={char.characterId}
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
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
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
              const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              
              if (!anim || !floatAnim) return null;
              
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              });

              return (
                <Animated.View
                  key={char.characterId}
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
                          width: '80%',
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
                {adventures.find((a) => a.elementId === selectedAdventure)?.emoji}
              </Text>
            </View>
          )}
          {selectedWeather && (
            <View style={[styles.battleStatusTag, { backgroundColor: styleConfig.colors.primary }]}>
              <Text style={styles.battleStatusEmoji}>
                {weathers.find((w) => w.elementId === selectedWeather)?.emoji}
              </Text>
            </View>
          )}
          {selectedTerrain && (
            <View style={[styles.battleStatusTag, { backgroundColor: styleConfig.colors.secondary }]}>
              <Text style={styles.battleStatusEmoji}>
                {terrains.find((t) => t.elementId === selectedTerrain)?.emoji}
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
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
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
              const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              
              if (!anim || !floatAnim) return null;
              
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
                  key={char.characterId}
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

  const renderPixelArtStage = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    const bgColors = getWeatherBgColors();

    return (
      <Animated.View style={[styles.pixelArtContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.pixelArtBackground, { backgroundColor: '#87CEEB' }]} />
        
        <View style={styles.pixelArtGrid}>
          {Array(8).fill(null).map((_, row) => (
            <View key={row} style={styles.pixelArtRow}>
              {Array(10).fill(null).map((_, col) => (
                <View key={col} style={styles.pixelArtCell} />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.pixelArtCharacters}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.pixelArtHint, { color: '#000' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            selectedCharData.map((char, index) => {
              const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
              const anim = stageCharAnims[charIndex];
              const floatAnim = floatAnims[charIndex];
              
              if (!anim || !floatAnim) return null;
              
              const translateY = floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -4],
              });

              return (
                <Animated.View
                  key={char.characterId}
                  style={[
                    styles.pixelArtCharacter,
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
                  <Text style={styles.pixelArtEmoji}>{char.emoji}</Text>
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.pixelArtUI}>
          <View style={styles.pixelArtHealthBar}>
            <Text style={styles.pixelArtHealthText}>❤️❤️❤️♡♡</Text>
          </View>
          <View style={styles.pixelArtStats}>
            <Text style={styles.pixelArtStatText}>LV.5</Text>
            <Text style={styles.pixelArtStatText}>EXP: 340/500</Text>
          </View>
        </View>

        <View style={styles.pixelArtLabel}>
          <Text style={styles.pixelArtLabelText}>👾 像素艺术风格</Text>
        </View>
      </Animated.View>
    );
  };

  const renderGlassmorphismStage = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    const bgColors = getWeatherBgColors();

    return (
      <Animated.View style={[styles.glassmorphismContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.glassmorphismBgGradient, { backgroundColor: '#667eea' }]}>
          <View style={[styles.glassmorphismBgLayer, { backgroundColor: '#764ba2', opacity: 0.5 }]} />
        </View>

        <View style={styles.glassmorphismCard}>
          <View style={styles.glassmorphismCardContent}>
            {selectedCharData.length === 0 ? (
              <Text style={[styles.glassmorphismHint, { color: '#fff' }]}>
                选择角色开始导演你的故事
              </Text>
            ) : (
              selectedCharData.map((char, index) => {
                const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
                const anim = stageCharAnims[charIndex];
                const floatAnim = floatAnims[charIndex];
                
                if (!anim || !floatAnim) return null;
                
                const translateY = floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -6],
                });

                return (
                  <Animated.View
                    key={char.characterId}
                    style={[
                      styles.glassmorphismCharacter,
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
                    <Text style={styles.glassmorphismEmoji}>{char.emoji}</Text>
                  </Animated.View>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.glassmorphismLabel}>
          <Text style={styles.glassmorphismLabelText}>💎 玻璃拟态风格</Text>
        </View>
      </Animated.View>
    );
  };

  const renderCarouselWheel = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    const bgColors = getWeatherBgColors();

    return (
      <Animated.View style={[styles.carouselContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.carouselBackground, { backgroundColor: bgColors[2] }]} />

        <View style={styles.carouselWheel}>
          {selectedCharData.length === 0 ? (
            <Text style={[styles.carouselHint, { color: '#fff' }]}>
              选择角色开始导演你的故事
            </Text>
          ) : (
            selectedCharData.map((char, index) => {
              const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
              const anim = stageCharAnims[charIndex];
              
              if (!anim) return null;
              
              const angle = (index / selectedCharData.length) * 360;
              const radius = 80;
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;

              return (
                <Animated.View
                  key={char.characterId}
                  style={[
                    styles.carouselCharacter,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { scale: anim.scale },
                      ],
                      opacity: anim.opacity,
                    },
                  ]}
                >
                  <Text style={styles.carouselEmoji}>{char.emoji}</Text>
                </Animated.View>
              );
            })
          )}
        </View>

        <View style={styles.carouselIndicator}>
          <Text style={styles.carouselIndicatorText}>▼</Text>
        </View>

        <View style={styles.carouselLabel}>
          <Text style={styles.carouselLabelText}>🎡 转盘风格</Text>
        </View>
      </Animated.View>
    );
  };

  const renderSideScroller = () => {
    const selectedCharData = characters.filter((c) =>
      selectedCharacters.includes(c.characterId)
    );
    const bgColors = getWeatherBgColors();

    return (
      <Animated.View style={[styles.sideScrollerContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
        <View style={[styles.sideScrollerSky, { backgroundColor: bgColors[0] }]} />
        
        <View style={styles.sideScrollerClouds}>
          <Text style={styles.sideScrollerCloud}>☁️</Text>
          <Text style={[styles.sideScrollerCloud, { left: 100 }]}>☁️</Text>
          <Text style={[styles.sideScrollerCloud, { left: 200 }]}>☁️</Text>
        </View>

        <View style={styles.sideScrollerGround}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sideScrollerCharacters}>
              {selectedCharData.length === 0 ? (
                <Text style={[styles.sideScrollerHint, { color: '#000' }]}>
                  选择角色开始导演你的故事
                </Text>
              ) : (
                selectedCharData.map((char, index) => {
                  const charIndex = characters.findIndex((c) => c.characterId === char.characterId);
                  const anim = stageCharAnims[charIndex];
                  const floatAnim = floatAnims[charIndex];
                  
                  if (!anim || !floatAnim) return null;
                  
                  const translateY = floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  });

                  return (
                    <Animated.View
                      key={char.characterId}
                      style={[
                        styles.sideScrollerCharacter,
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
                      <Text style={styles.sideScrollerEmoji}>{char.emoji}</Text>
                    </Animated.View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sideScrollerPlatform}>
          {Array(20).fill(null).map((_, index) => (
            <View key={index} style={styles.sideScrollerBrick} />
          ))}
        </View>

        <View style={styles.sideScrollerUI}>
          <Text style={styles.sideScrollerUIText}>❤️❤️❤️♡♡  金币: 120  ⭐ 3</Text>
        </View>

        <View style={styles.sideScrollerLabel}>
          <Text style={styles.sideScrollerLabelText}>🎮 横版过关风格</Text>
        </View>
      </Animated.View>
    );
  };

  const renderStage = () => {
    switch (stageStyle) {
      case 'mini-card-preview':
        return renderMiniCardPreview();
      case '3d-perspective':
        return render3DStage();
      case 'battle-arena':
        return renderBattleArena();
      case 'immersive-scene':
        return renderImmersiveScene();
      case 'pixel-art':
        return renderPixelArtStage();
      case 'glassmorphism':
        return renderGlassmorphismStage();
      case 'carousel-wheel':
        return renderCarouselWheel();
      case 'side-scroller':
        return renderSideScroller();
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: styleConfig.colors.text }]}>
            加载中...
          </Text>
        </View>
      ) : (
        <>
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
              {characters.map((char, index) => renderCharacterCard(char, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🗺️ 冒险类型</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {adventures.map((adv, index) => renderAdventureCard(adv, index))}
            </View>
          </ScrollView>
        </View>

        {renderStage()}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🌤️ 天气</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {weathers.map((weather, index) => renderWeatherCard(weather, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🏔️ 地形</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {terrains.map((terrain, index) => renderTerrainCard(terrain, index))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: styleConfig.colors.text }]}>🪄 装备</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardRow}>
              {equipments.map((equip, index) => renderEquipmentCard(equip, index))}
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
            onPress={() => {
              console.log('[StoryDirector] ===== SHOOT BUTTON PRESSED =====');
              console.log('[StoryDirector] Button pressed at:', new Date().toISOString());
              console.log('[StoryDirector] isReady:', isReady);
              console.log('[StoryDirector] selectedCharacters:', selectedCharacters);
              console.log('[StoryDirector] selectedAdventure:', selectedAdventure);
              console.log('[StoryDirector] selectedWeather:', selectedWeather);
              console.log('[StoryDirector] selectedTerrain:', selectedTerrain);
              console.log('[StoryDirector] selectedEquipment:', selectedEquipment);
              console.log('[StoryDirector] characters array length:', characters.length);
              console.log('[StoryDirector] adventures array length:', adventures.length);
              console.log('[StoryDirector] weathers array length:', weathers.length);
              console.log('[StoryDirector] terrains array length:', terrains.length);
              console.log('[StoryDirector] equipments array length:', equipments.length);
              handleShoot();
            }}
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
              {([
                'mini-card-preview',
                '3d-perspective',
                'battle-arena',
                'immersive-scene',
                'pixel-art',
                'glassmorphism',
                'carousel-wheel',
                'side-scroller'
              ] as StageStyleType[]).map((style) => {
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
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  miniPreviewContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  miniPreviewHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  miniPreviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  miniPreviewContent: {
    padding: 10,
  },
  miniPreviewRow: {
    marginBottom: 10,
  },
  miniPreviewRowTitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  miniCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  miniCard: {
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  miniCardEmoji: {
    fontSize: 24,
    marginTop: 8,
  },
  miniCardName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  miniCardRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardRemoveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: -1,
  },
  emptySlot: {
    width: 70,
    height: 90,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  emptySlotRequired: {
    borderColor: 'rgba(251, 146, 60, 0.5)',
    backgroundColor: 'rgba(251, 146, 60, 0.05)',
  },
  emptySlotIcon: {
    fontSize: 20,
    opacity: 0.4,
  },
  emptySlotLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  emptySlotRequiredLabel: {
    position: 'absolute',
    bottom: -12,
    fontSize: 8,
    color: '#F97316',
  },
  previewTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  previewText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 40,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 12,
    paddingHorizontal: 16,
    minWidth: 80,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: DEFAULT_THEME.text,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  styleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  styleButtonText: {
    fontSize: 16,
    color: DEFAULT_THEME.primary,
  },
  stageStyleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  stageStyleButtonText: {
    fontSize: 16,
    color: DEFAULT_THEME.primary,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#374151',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
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
    color: '#64748B',
  },
  shootButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DEFAULT_THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    borderWidth: 1,
    alignItems: 'center',
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  stageStyleItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
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
  pixelArtContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#87CEEB',
    borderWidth: 4,
    borderColor: '#000',
  },
  pixelArtBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pixelArtGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  pixelArtRow: {
    flexDirection: 'row',
  },
  pixelArtCell: {
    width: 32,
    height: 25,
    borderWidth: 1,
    borderColor: '#000',
  },
  pixelArtCharacters: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pixelArtCharacter: {
    marginHorizontal: 8,
  },
  pixelArtEmoji: {
    fontSize: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  pixelArtHint: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pixelArtUI: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  pixelArtHealthBar: {
    marginBottom: 8,
  },
  pixelArtHealthText: {
    fontSize: 16,
  },
  pixelArtStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pixelArtStatText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  pixelArtLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pixelArtLabelText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  glassmorphismContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  glassmorphismBgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glassmorphismBgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glassmorphismCard: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    bottom: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  glassmorphismCardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassmorphismCharacter: {
    marginHorizontal: 12,
  },
  glassmorphismEmoji: {
    fontSize: 36,
  },
  glassmorphismHint: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  glassmorphismLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  glassmorphismLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  carouselContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carouselWheel: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselCharacter: {
    position: 'absolute',
  },
  carouselEmoji: {
    fontSize: 32,
  },
  carouselHint: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselIndicator: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  carouselIndicatorText: {
    fontSize: 20,
    color: '#fff',
  },
  carouselLabel: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  carouselLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sideScrollerContainer: {
    margin: 16,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  sideScrollerSky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  sideScrollerClouds: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 40,
  },
  sideScrollerCloud: {
    position: 'absolute',
    fontSize: 24,
    left: 20,
  },
  sideScrollerGround: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 50,
  },
  sideScrollerCharacters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sideScrollerCharacter: {
    marginHorizontal: 16,
  },
  sideScrollerEmoji: {
    fontSize: 36,
  },
  sideScrollerHint: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  sideScrollerPlatform: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 20,
    flexDirection: 'row',
  },
  sideScrollerBrick: {
    width: 32,
    height: 20,
    backgroundColor: '#8B4513',
    borderWidth: 1,
    borderColor: '#654321',
  },
  sideScrollerUI: {
    position: 'absolute',
    bottom: 8,
    left: 16,
  },
  sideScrollerUIText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  sideScrollerLabel: {
    position: 'absolute',
    bottom: 8,
    right: 16,
  },
  sideScrollerLabelText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StoryDirectorDemo;
