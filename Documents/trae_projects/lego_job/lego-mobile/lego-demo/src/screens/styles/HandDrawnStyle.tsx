import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';

interface Props {
  onBack: () => void;
}

const CHARACTERS = [
  { id: 'warrior', name: '勇士', emoji: '⚔️' },
  { id: 'mage', name: '法师', emoji: '🔮' },
  { id: 'archer', name: '弓箭手', emoji: '🏹' },
];

const STORIES = [
  { id: 'adventure', name: '冒险', emoji: '⚔️' },
  { id: 'explore', name: '探索', emoji: '🔍' },
  { id: 'treasure', name: '寻宝', emoji: '💎' },
];

const WEATHERS = [
  { id: 'sunny', name: '晴天', emoji: '☀️' },
  { id: 'rainy', name: '雨天', emoji: '🌧️' },
  { id: 'snowy', name: '雪天', emoji: '❄️' },
];

const BACKGROUNDS = [
  { id: 'forest', name: '森林', emoji: '🌲' },
  { id: 'mountain', name: '山地', emoji: '⛰️' },
  { id: 'beach', name: '沙滩', emoji: '🏖️' },
];

const TOOLS = [
  { id: 'pencil', name: '铅笔', emoji: '🗡️' },
  { id: 'brush', name: '画笔', emoji: '🛡️' },
  { id: 'eraser', name: '橡皮', emoji: '💍' },
  { id: 'palette', name: '调色板', emoji: '📜' },
];

export default function HandDrawnStyle({ onBack }: Props) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const drawAnims = useRef(CHARACTERS.map(() => new Animated.Value(0))).current;
  const watercolorAnim = useRef(new Animated.Value(0)).current;
  const pencilAnims = useRef(
    Array(5)
      .fill(null)
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(watercolorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(watercolorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    pencilAnims.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleCharacterSelect = (id: string, index: number) => {
    setSelectedCharacter(id);
    Animated.sequence([
      Animated.timing(drawAnims[index], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(drawAnims[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.handDrawnUI}>
        <Text style={styles.handDrawnText}>🖌️ 手绘工作室</Text>
        <Text style={styles.handDrawnText}>🎨 调色板</Text>
        <Text style={styles.handDrawnText}>✏️</Text>
      </View>

      <View style={styles.canvasArea}>
        <View style={styles.canvasFrame}>
          <Text style={styles.frameIcon}>🖼️</Text>

          <View style={styles.canvasContent}>
            {CHARACTERS.map((char, index) => (
              <TouchableOpacity
                key={char.id}
                style={[
                  styles.characterSlot,
                  selectedCharacter === char.id && styles.characterSelected,
                ]}
                onPress={() => handleCharacterSelect(char.id, index)}
              >
                <Animated.Text
                  style={[
                    styles.characterEmoji,
                    {
                      opacity: drawAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.5],
                      }),
                      transform: [
                        {
                          scale: drawAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {char.emoji}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.handDrawnLines}>
            {pencilAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.pencilLine,
                  {
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0.6],
                    }),
                    transform: [
                      {
                        scaleX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Animated.View
          style={[
            styles.watercolorBg,
            {
              opacity: watercolorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
            },
          ]}
        />
      </View>

      <ScrollView style={styles.controlArea}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 故事类型</Text>
          <View style={styles.buttonRow}>
            {STORIES.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={[
                  styles.storyButton,
                  selectedStory === story.id && styles.storyButtonSelected,
                ]}
                onPress={() => setSelectedStory(story.id)}
              >
                <Text style={styles.storyButtonText}>{story.emoji} {story.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ 天气氛围</Text>
          <View style={styles.buttonRow}>
            {WEATHERS.map((weather) => (
              <TouchableOpacity
                key={weather.id}
                style={[
                  styles.storyButton,
                  selectedWeather === weather.id && styles.storyButtonSelected,
                ]}
                onPress={() => setSelectedWeather(weather.id)}
              >
                <Text style={styles.storyButtonText}>{weather.emoji} {weather.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 场景背景</Text>
          <View style={styles.buttonRow}>
            {BACKGROUNDS.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                style={[
                  styles.storyButton,
                  selectedBackground === bg.id && styles.storyButtonSelected,
                ]}
                onPress={() => setSelectedBackground(bg.id)}
              >
                <Text style={styles.storyButtonText}>{bg.emoji} {bg.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✏️ 绘画工具</Text>
          <View style={styles.toolRow}>
            {TOOLS.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[
                  styles.toolSlot,
                  selectedTool === tool.id && styles.toolSelected,
                ]}
                onPress={() => setSelectedTool(tool.id)}
              >
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>▶️ 开始创作</Text>
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
    backgroundColor: '#F5F5DC',
  },
  handDrawnUI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#DEB887',
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
  },
  handDrawnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  canvasArea: {
    height: 180,
    padding: 10,
    position: 'relative',
  },
  canvasFrame: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 4,
    padding: 10,
    position: 'relative',
  },
  frameIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 16,
  },
  canvasContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  characterSlot: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  characterSelected: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  characterEmoji: {
    fontSize: 30,
  },
  handDrawnLines: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 40,
  },
  pencilLine: {
    height: 2,
    width: 60,
    backgroundColor: '#8B4513',
    marginBottom: 5,
    borderRadius: 1,
  },
  watercolorBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87CEEB',
    borderRadius: 4,
  },
  controlArea: {
    flex: 1,
    backgroundColor: '#DEB887',
    padding: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  storyButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  storyButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  storyButtonText: {
    color: '#5D4037',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toolRow: {
    flexDirection: 'row',
  },
  toolSlot: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  toolSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  toolEmoji: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
