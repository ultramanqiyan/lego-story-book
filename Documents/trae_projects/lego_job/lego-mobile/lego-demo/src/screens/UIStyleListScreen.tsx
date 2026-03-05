import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export type UIStyleType = 'side-scroller-game' | 'pixel-block' | 'movie-film' | 'hand-drawn' | null;

interface Props {
  onSelectStyle: (style: UIStyleType) => void;
  onBack: () => void;
}

const UI_STYLES = [
  {
    id: 'side-scroller-game' as const,
    name: '🎮 横版游戏风格',
    description: '像超级马里奥一样的横版游戏界面',
    color: '#87CEEB',
  },
  {
    id: 'pixel-block' as const,
    name: '👾 像素方块风格',
    description: '像我的世界一样的像素方块界面',
    color: '#8B7355',
  },
  {
    id: 'movie-film' as const,
    name: '🎬 电影风格',
    description: '像电影拍摄现场一样的界面',
    color: '#2C3E50',
  },
  {
    id: 'hand-drawn' as const,
    name: '🎨 手绘风格',
    description: '像手绘素描一样的艺术界面',
    color: '#DEB887',
  },
];

export default function UIStyleListScreen({ onSelectStyle, onBack }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UI风格演示</Text>
        <Text style={styles.subtitle}>选择一种风格查看演示</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {UI_STYLES.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[styles.styleCard, { backgroundColor: style.color }]}
            onPress={() => onSelectStyle(style.id)}
          >
            <Text style={styles.styleName}>{style.name}</Text>
            <Text style={styles.styleDescription}>{style.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← 返回首页</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  styleCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  styleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  styleDescription: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
