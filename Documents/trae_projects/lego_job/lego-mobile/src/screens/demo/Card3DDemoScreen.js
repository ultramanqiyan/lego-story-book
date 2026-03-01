/**
 * Card3DDemoScreen - 3D卡牌效果演示页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Card3D, CardDeck3D } from '../../components/card3d';
import { COLORS } from '../../utils/constants';

const Card3DDemoScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'fan'

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const getSelectedName = () => {
    if (!selectedId) return '未选择';
    const characters = [
      { id: '1', name: '法师' },
      { id: '2', name: '战士' },
      { id: '3', name: '精灵' },
      { id: '4', name: '盗贼' },
      { id: '5', name: '龙骑' },
    ];
    const found = characters.find(c => c.id === selectedId);
    return found ? found.name : '未选择';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎴 3D卡牌演示</Text>
        <Text style={styles.subtitle}>
          平台: {Platform.OS === 'web' ? 'Web端' : '移动端'}
        </Text>
      </View>

      {/* Tab切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'single' && styles.tabActive]}
          onPress={() => setActiveTab('single')}
        >
          <Text style={[styles.tabText, activeTab === 'single' && styles.tabTextActive]}>
            单卡展示
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'fan' && styles.tabActive]}
          onPress={() => setActiveTab('fan')}
        >
          <Text style={[styles.tabText, activeTab === 'fan' && styles.tabTextActive]}>
            扇形展开
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'single' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>单张3D卡牌</Text>
            <Text style={styles.sectionDesc}>点击卡牌查看选中效果</Text>
            
            <View style={styles.cardRow}>
              <Card3D icon="🔥" name="火焰" variant="primary" width={80} height={110} />
              <Card3D icon="💧" name="水滴" variant="secondary" width={80} height={110} />
              <Card3D icon="🌿" name="自然" variant="success" width={80} height={110} />
            </View>

            <Text style={styles.subTitle}>不同变体样式</Text>
            <View style={styles.cardRow}>
              <Card3D icon="⚡" name="默认" variant="default" width={70} height={100} />
              <Card3D icon="⭐" name="主色" variant="primary" width={70} height={100} />
              <Card3D icon="💎" name="次要" variant="secondary" width={70} height={100} />
            </View>
          </View>
        )}

        {activeTab === 'fan' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>扇形展开卡牌组</Text>
            <Text style={styles.sectionDesc}>点击卡牌进行选择</Text>
            
            <CardDeck3D
              items={[
                { id: '1', name: '法师', icon: '🧙' },
                { id: '2', name: '战士', icon: '🦸' },
                { id: '3', name: '精灵', icon: '🧝' },
                { id: '4', name: '盗贼', icon: '🦹' },
                { id: '5', name: '龙骑', icon: '🐉' },
              ]}
              selectedId={selectedId}
              onPress={handleSelect}
            />

            <View style={styles.selectedInfo}>
              <Text style={styles.selectedLabel}>当前选择</Text>
              <Text style={styles.selectedValue}>{getSelectedName()}</Text>
            </View>
          </View>
        )}

        <View style={styles.platformInfo}>
          <Text style={styles.platformTitle}>平台信息</Text>
          <Text style={styles.platformText}>OS: {Platform.OS}</Text>
          <Text style={styles.platformText}>
            动画引擎: React Native Reanimated
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.legoYellow,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    gap: 12,
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.legoYellow,
  },
  platformInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    opacity: 0.8,
  },
  platformTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  platformText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
});

export default Card3DDemoScreen;
