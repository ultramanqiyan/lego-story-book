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

const SCENES = [
  { id: 'action', name: '动作片', emoji: '⚔️' },
  { id: 'suspense', name: '悬疑片', emoji: '🔍' },
  { id: 'adventure', name: '冒险片', emoji: '💎' },
];

const WEATHERS = [
  { id: 'sunny', name: '晴天', emoji: '☀️' },
  { id: 'rainy', name: '雨天', emoji: '🌧️' },
  { id: 'snowy', name: '雪天', emoji: '❄️' },
];

const LOCATIONS = [
  { id: 'forest', name: '森林', emoji: '🌲' },
  { id: 'mountain', name: '山地', emoji: '⛰️' },
  { id: 'beach', name: '沙滩', emoji: '🏖️' },
];

const PROPS = [
  { id: 'sword', name: '剑', emoji: '🗡️' },
  { id: 'shield', name: '盾', emoji: '🛡️' },
  { id: 'ring', name: '戒指', emoji: '💍' },
  { id: 'scroll', name: '卷轴', emoji: '📜' },
];

export default function MovieFilmStyle({ onBack }: Props) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedProp, setSelectedProp] = useState<string | null>(null);
  const [sceneNumber, setSceneNumber] = useState(1);
  const [takeNumber, setTakeNumber] = useState(1);

  const filmAnim = useRef(new Animated.Value(0)).current;
  const projectorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(filmAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(projectorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleSceneSelect = (id: string) => {
    setSelectedScene(id);
    setTakeNumber((t) => t + 1);
  };

  const handleStartFilming = () => {
    setSceneNumber((s) => s + 1);
    setTakeNumber(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.movieUI}>
        <Text style={styles.movieText}>🎬 SCENE {String(sceneNumber).padStart(2, '0')}</Text>
        <Text style={styles.movieText}>🎥 TAKE {takeNumber}</Text>
        <Animated.Text
          style={[
            styles.projectorIcon,
            {
              transform: [
                {
                  rotate: filmAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          📽️
        </Animated.Text>
      </View>

      <View style={styles.filmArea}>
        <View style={styles.filmBorder}>
          <Animated.View
            style={[
              styles.filmStrip,
              {
                transform: [
                  {
                    translateY: filmAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          >
            {Array(10)
              .fill(null)
              .map((_, i) => (
                <View key={i} style={styles.filmHole} />
              ))}
          </Animated.View>
        </View>

        <View style={styles.sceneArea}>
          {CHARACTERS.map((char) => (
            <TouchableOpacity
              key={char.id}
              style={[
                styles.characterSlot,
                selectedCharacter === char.id && styles.characterSelected,
              ]}
              onPress={() => setSelectedCharacter(char.id)}
            >
              <Text style={styles.characterEmoji}>{char.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filmBorderRight}>
          <Animated.View
            style={[
              styles.filmStrip,
              {
                transform: [
                  {
                    translateY: filmAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }),
                  },
                ],
              },
            ]}
          >
            {Array(10)
              .fill(null)
              .map((_, i) => (
                <View key={i} style={styles.filmHole} />
              ))}
          </Animated.View>
        </View>
      </View>

      <ScrollView style={styles.controlArea}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 场景类型</Text>
          <View style={styles.buttonRow}>
            {SCENES.map((scene) => (
              <TouchableOpacity
                key={scene.id}
                style={[
                  styles.sceneButton,
                  selectedScene === scene.id && styles.sceneButtonSelected,
                ]}
                onPress={() => handleSceneSelect(scene.id)}
              >
                <Text style={styles.sceneButtonText}>{scene.emoji} {scene.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ 拍摄天气</Text>
          <View style={styles.buttonRow}>
            {WEATHERS.map((weather) => (
              <TouchableOpacity
                key={weather.id}
                style={[
                  styles.sceneButton,
                  selectedWeather === weather.id && styles.sceneButtonSelected,
                ]}
                onPress={() => setSelectedWeather(weather.id)}
              >
                <Text style={styles.sceneButtonText}>{weather.emoji} {weather.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 拍摄地点</Text>
          <View style={styles.buttonRow}>
            {LOCATIONS.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.sceneButton,
                  selectedLocation === location.id && styles.sceneButtonSelected,
                ]}
                onPress={() => setSelectedLocation(location.id)}
              >
                <Text style={styles.sceneButtonText}>{location.emoji} {location.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 道具</Text>
          <View style={styles.propRow}>
            {PROPS.map((prop) => (
              <TouchableOpacity
                key={prop.id}
                style={[
                  styles.propSlot,
                  selectedProp === prop.id && styles.propSelected,
                ]}
                onPress={() => setSelectedProp(prop.id)}
              >
                <Text style={styles.propEmoji}>{prop.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartFilming}>
          <Text style={styles.startButtonText}>▶️ 开始拍摄</Text>
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
    backgroundColor: '#1A1A1A',
  },
  movieUI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
  },
  movieText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'monospace',
  },
  projectorIcon: {
    fontSize: 24,
  },
  filmArea: {
    flexDirection: 'row',
    height: 150,
    backgroundColor: '#000',
  },
  filmBorder: {
    width: 30,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  filmBorderRight: {
    width: 30,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  filmStrip: {
    paddingVertical: 5,
  },
  filmHole: {
    width: 20,
    height: 12,
    backgroundColor: '#000',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 2,
  },
  sceneArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  characterSlot: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  characterSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#444',
  },
  characterEmoji: {
    fontSize: 30,
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
  sceneButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4A6572',
  },
  sceneButtonSelected: {
    backgroundColor: '#E74C3C',
    borderColor: '#C0392B',
  },
  sceneButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  propRow: {
    flexDirection: 'row',
  },
  propSlot: {
    width: 50,
    height: 50,
    backgroundColor: '#34495E',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#4A6572',
  },
  propSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#4A6572',
  },
  propEmoji: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 15,
    borderRadius: 4,
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
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
