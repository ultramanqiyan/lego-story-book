import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  onBack: () => void;
}

const CHARACTERS = [
  { id: 'warrior', name: '勇士', emoji: '⚔️' },
  { id: 'mage', name: '法师', emoji: '🔮' },
  { id: 'archer', name: '弓箭手', emoji: '🏹' },
];

const LEVELS = [
  { id: 'boss', name: 'BOSS战', emoji: '⚔️' },
  { id: 'explore', name: '探索', emoji: '🔍' },
  { id: 'treasure', name: '寻宝', emoji: '💎' },
];

const WEATHERS = [
  { id: 'sunny', name: '晴天', emoji: '☀️' },
  { id: 'rainy', name: '雨天', emoji: '🌧️' },
  { id: 'snowy', name: '雪天', emoji: '❄️' },
];

const MAPS = [
  { id: 'forest', name: '森林', emoji: '🌲' },
  { id: 'mountain', name: '山地', emoji: '⛰️' },
  { id: 'beach', name: '沙滩', emoji: '🏖️' },
];

const ITEMS = [
  { id: 'sword', name: '剑', emoji: '🗡️' },
  { id: 'shield', name: '盾', emoji: '🛡️' },
  { id: 'ring', name: '戒指', emoji: '💍' },
  { id: 'scroll', name: '卷轴', emoji: '📜' },
];

export default function SideScrollerGameStyle({ onBack }: Props) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [score, setScore] = useState(9999);
  const [coins, setCoins] = useState(120);

  const cloudAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(width * 0.3),
    new Animated.Value(width * 0.6),
  ]).current;

  const characterAnims = useRef(CHARACTERS.map(() => new Animated.Value(0))).current;
  const coinAnims = useRef(ITEMS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    cloudAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: width + 100,
          duration: 15000 + index * 5000,
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  const handleCharacterSelect = (id: string, index: number) => {
    setSelectedCharacter(id);
    Animated.sequence([
      Animated.timing(characterAnims[index], {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(characterAnims[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleItemSelect = (id: string, index: number) => {
    setSelectedItem(id);
    setCoins((prev) => prev + 10);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(coinAnims[index], {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(coinAnims[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameUI}>
        <Text style={styles.scoreText}>🎮 SCORE: {score}</Text>
        <Text style={styles.lifeText}>❤️❤️❤️</Text>
        <Text style={styles.coinText}>💰{coins}</Text>
      </View>

      <View style={styles.gameArea}>
        {cloudAnims.map((anim, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.cloud,
              { transform: [{ translateX: anim }] },
            ]}
          >
            ☁️
          </Animated.Text>
        ))}

        <View style={styles.platform}>
          {CHARACTERS.map((char, index) => (
            <TouchableOpacity
              key={char.id}
              onPress={() => handleCharacterSelect(char.id, index)}
            >
              <Animated.View
                style={[
                  styles.characterSlot,
                  selectedCharacter === char.id && styles.characterSelected,
                  { transform: [{ translateY: characterAnims[index] }] },
                ]}
              >
                <Text style={styles.characterEmoji}>{char.emoji}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.brickRow}>
          {Array(12).fill(null).map((_, index) => (
            <View key={index} style={styles.brick} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.controlArea}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 关卡选择</Text>
          <View style={styles.buttonRow}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.gameButton,
                  selectedLevel === level.id && styles.buttonSelected,
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <Text style={styles.buttonText}>{level.emoji} {level.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ 天气效果</Text>
          <View style={styles.buttonRow}>
            {WEATHERS.map((weather) => (
              <TouchableOpacity
                key={weather.id}
                style={[
                  styles.gameButton,
                  selectedWeather === weather.id && styles.buttonSelected,
                ]}
                onPress={() => setSelectedWeather(weather.id)}
              >
                <Text style={styles.buttonText}>{weather.emoji} {weather.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ 地图选择</Text>
          <View style={styles.buttonRow}>
            {MAPS.map((map) => (
              <TouchableOpacity
                key={map.id}
                style={[
                  styles.gameButton,
                  selectedMap === map.id && styles.buttonSelected,
                ]}
                onPress={() => setSelectedMap(map.id)}
              >
                <Text style={styles.buttonText}>{map.emoji} {map.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎁 道具栏</Text>
          <View style={styles.itemRow}>
            {ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemSlot,
                  selectedItem === item.id && styles.itemSelected,
                ]}
                onPress={() => handleItemSelect(item.id, index)}
              >
                <Animated.Text
                  style={[
                    styles.itemEmoji,
                    { transform: [{ scale: coinAnims[index] }] },
                  ]}
                >
                  {item.emoji}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => setScore((s) => s + 100)}>
          <Text style={styles.startButtonText}>▶️ START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 返回列表</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  gameUI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#2C3E50',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  lifeText: {
    fontSize: 16,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  gameArea: {
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
    fontSize: 40,
    top: 20,
  },
  platform: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  characterSlot: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterSelected: {
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  characterEmoji: {
    fontSize: 30,
  },
  brickRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  brick: {
    width: width / 12,
    height: 20,
    backgroundColor: '#8B4513',
    borderWidth: 1,
    borderColor: '#A0522D',
  },
  controlArea: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameButton: {
    backgroundColor: '#4A6572',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonSelected: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
  },
  itemSlot: {
    width: 50,
    height: 50,
    backgroundColor: '#4A6572',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#666',
  },
  itemSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#3D5A6C',
  },
  itemEmoji: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
