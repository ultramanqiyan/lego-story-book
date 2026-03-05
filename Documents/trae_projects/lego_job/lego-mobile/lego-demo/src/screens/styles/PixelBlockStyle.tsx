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

const MODES = [
  { id: 'survival', name: '生存', emoji: '⚔️' },
  { id: 'adventure', name: '冒险', emoji: '🔍' },
  { id: 'creative', name: '创造', emoji: '💎' },
];

const WORLDS = [
  { id: 'normal', name: '普通', emoji: '☀️' },
  { id: 'jungle', name: '雨林', emoji: '🌧️' },
  { id: 'snow', name: '雪原', emoji: '❄️' },
];

const BIOMES = [
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

export default function PixelBlockStyle({ onBack }: Props) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [health, setHealth] = useState(3);
  const [hunger, setHunger] = useState(3);

  const blockAnims = useRef(
    Array(24)
      .fill(null)
      .map(() => ({
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
      }))
  ).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * blockAnims.length);
      Animated.sequence([
        Animated.timing(blockAnims[randomIndex].opacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(blockAnims[randomIndex].opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleBlockPress = (index: number) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(blockAnims[index].scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(blockAnims[index].opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(blockAnims[index].scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(blockAnims[index].opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const renderBlockGrid = () => {
    const blocks = [];
    for (let row = 0; row < 3; row++) {
      const rowBlocks = [];
      for (let col = 0; col < 8; col++) {
        const index = row * 8 + col;
        const isCharacter = row === 1 && (col === 1 || col === 4 || col === 6);
        const character = isCharacter
          ? CHARACTERS.find((_, i) => [1, 4, 6][i] === col)
          : null;
        rowBlocks.push(
          <TouchableOpacity
            key={col}
            onPress={() => {
              if (character) {
                setSelectedCharacter(character.id);
              } else {
                handleBlockPress(index);
              }
            }}
          >
            <Animated.View
              style={[
                styles.block,
                character && selectedCharacter === character.id && styles.blockSelected,
                {
                  opacity: blockAnims[index].opacity,
                  transform: [{ scale: blockAnims[index].scale }],
                },
              ]}
            >
              {character ? (
                <Text style={styles.blockEmoji}>{character.emoji}</Text>
              ) : (
                <View style={styles.blockInner} />
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      }
      blocks.push(
        <View key={row} style={styles.blockRow}>
          {rowBlocks}
        </View>
      );
    }
    return blocks;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pixelUI}>
        <Text style={styles.pixelText}>⛏️ MINECRAFT MODE</Text>
        <Text style={styles.pixelText}>❤️{'️'.repeat(health)}</Text>
        <Text style={styles.pixelText}>🍖{'️'.repeat(hunger)}</Text>
      </View>

      <View style={styles.blockContainer}>{renderBlockGrid()}</View>

      <ScrollView style={styles.controlArea}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚔️ 游戏模式</Text>
          <View style={styles.buttonRow}>
            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.pixelButton,
                  selectedMode === mode.id && styles.pixelButtonSelected,
                ]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <Text style={styles.pixelButtonText}>{mode.emoji} {mode.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌤️ 世界类型</Text>
          <View style={styles.buttonRow}>
            {WORLDS.map((world) => (
              <TouchableOpacity
                key={world.id}
                style={[
                  styles.pixelButton,
                  selectedWorld === world.id && styles.pixelButtonSelected,
                ]}
                onPress={() => setSelectedWorld(world.id)}
              >
                <Text style={styles.pixelButtonText}>{world.emoji} {world.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ 生物群系</Text>
          <View style={styles.buttonRow}>
            {BIOMES.map((biome) => (
              <TouchableOpacity
                key={biome.id}
                style={[
                  styles.pixelButton,
                  selectedBiome === biome.id && styles.pixelButtonSelected,
                ]}
                onPress={() => setSelectedBiome(biome.id)}
              >
                <Text style={styles.pixelButtonText}>{biome.emoji} {biome.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 物品栏</Text>
          <View style={styles.inventoryRow}>
            {ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.inventorySlot,
                  selectedItem === item.id && styles.inventorySelected,
                ]}
                onPress={() => setSelectedItem(item.id)}
              >
                <Text style={styles.inventoryEmoji}>{item.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setHealth((h) => Math.min(h + 1, 3));
            setHunger((h) => Math.min(h + 1, 3));
          }}
        >
          <Text style={styles.startButtonText}>▶️ 开始游戏</Text>
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
    backgroundColor: '#8B7355',
  },
  pixelUI: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#2C3E50',
    borderBottomWidth: 4,
    borderBottomColor: '#1A252F',
  },
  pixelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'monospace',
  },
  blockContainer: {
    padding: 10,
    backgroundColor: '#6B5344',
  },
  blockRow: {
    flexDirection: 'row',
  },
  block: {
    width: 44,
    height: 44,
    backgroundColor: '#8B7355',
    borderWidth: 2,
    borderColor: '#6B5344',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFF',
  },
  blockInner: {
    width: 30,
    height: 30,
    backgroundColor: '#9B8365',
  },
  blockEmoji: {
    fontSize: 24,
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
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pixelButton: {
    backgroundColor: '#4A6572',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#3D5A6C',
  },
  pixelButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  pixelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  inventoryRow: {
    flexDirection: 'row',
  },
  inventorySlot: {
    width: 50,
    height: 50,
    backgroundColor: '#8B7355',
    borderWidth: 3,
    borderColor: '#6B5344',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inventorySelected: {
    borderColor: '#FFD700',
    backgroundColor: '#9B8365',
  },
  inventoryEmoji: {
    fontSize: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderWidth: 4,
    borderColor: '#388E3C',
    alignItems: 'center',
    marginVertical: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  backButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: '#546E7A',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
