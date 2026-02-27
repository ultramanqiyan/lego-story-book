/**
 * Card3DDemoScreen - 3D卡牌效果演示页面
 * 用于验证3D卡牌翻转和扇形展开效果
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

const DEMO_ITEMS = [
  { id: '1', name: '法师', icon: '🧙' },
  { id: '2', name: '战士', icon: '🦸' },
  { id: '3', name: '精灵', icon: '🧝' },
  { id: '4', name: '盗贼', icon: '🦹' },
];

const Card3DDemoScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'deck'

  const handleSelect = (id) => {
    setSelectedId(id === selectedId ? null : id);
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
          style={[styles.tab, activeTab === 'deck' && styles.tabActive]}
          onPress={() => setActiveTab('deck')}
        >
          <Text style={[styles.tabText, activeTab === 'deck' && styles.tabTextActive]}>
            扇形展开
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'single' ? (
          <View style={styles.singleCardSection}>
            <Text style={styles.sectionTitle}>单张3D卡牌</Text>
            <Text style={styles.sectionDesc}>点击卡牌查看选中效果</Text>

            <View style={styles.cardContainer}>
              <Card3D
                icon="🧙"
                name="法师"
                isSelected={selectedId === 'single'}
                onPress={() => handleSelect('single')}
                variant={selectedId === 'single' ? 'primary' : 'default'}
                width={100}
                height={140}
              />
            </View>

            <View style={styles.variantSection}>
              <Text style={styles.sectionTitle}>不同变体样式</Text>
              <View style={styles.variantRow}>
                <Card3D icon="🔥" name="默认" variant="default" width={80} height={110} />
                <Card3D icon="⭐" name="主色" variant="primary" width={80} height={110} />
                <Card3D icon="💧" name="次要" variant="secondary" width={80} height={110} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.deckSection}>
            <Text style={styles.sectionTitle}>扇形展开卡牌组</Text>
            <Text style={styles.sectionDesc}>点击卡牌进行选择</Text>

            <CardDeck3D
              title="选择你的角色"
              items={DEMO_ITEMS}
              selectedId={selectedId}
              onPress={handleSelect}
              enableFanSpread={true}
            />

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>当前选择</Text>
              <Text style={styles.infoText}>
                {selectedId
                  ? DEMO_ITEMS.find((item) => item.id === selectedId)?.name || '未知'
                  : '未选择'}
              </Text>
            </View>
          </View>
        )}

        {/* 平台信息 */}
        <View style={styles.platformInfo}>
          <Text style={styles.platformTitle}>平台信息</Text>
          <Text style={styles.platformText}>OS: {Platform.OS}</Text>
          <Text style={styles.platformText}>
            3D效果: {Platform.OS === 'web' ? 'Web简化版' : '完整版'}
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
  singleCardSection: {
    alignItems: 'center',
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
    marginBottom: 24,
  },
  cardContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  variantSection: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  variantRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  deckSection: {
    alignItems: 'center',
  },
  infoCard: {
    marginTop: 40,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.legoYellow,
    alignItems: 'center',
    width: '80%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  platformInfo: {
    marginTop: 40,
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
