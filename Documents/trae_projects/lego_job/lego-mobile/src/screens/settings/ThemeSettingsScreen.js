import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ThemeSettingsScreen = ({ navigation }) => {
  const {
    theme,
    card2DStyle,
    card2DStyles,
    changeCard2DStyle,
    card3DStyle,
    card3DStyles,
    changeCard3DStyle,
    particleEffect,
    particleEffects,
    changeParticleEffect,
    weatherEffect,
    weatherEffects,
    changeWeatherEffect,
  } = useTheme();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('card2d');
  const [previewStyle, setPreviewStyle] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  const handleSelect = async (type, styleId, changeFunc) => {
    await changeFunc(styleId);
    toast.success('风格已切换！');
  };

  const handlePreview = (type, style) => {
    setPreviewType(type);
    setPreviewStyle(style);
  };

  const closePreview = () => {
    setPreviewStyle(null);
    setPreviewType(null);
  };

  const renderStyleCard = (type, style, currentStyle, changeFunc) => {
    const isSelected = currentStyle.id === style.id;
    return (
      <TouchableOpacity
        key={style.id}
        style={[
          styles.styleCard,
          isSelected && styles.styleCardSelected,
          { borderColor: isSelected ? theme.colors.primary : 'rgba(255,255,255,0.1)' },
        ]}
        onPress={() => handleSelect(type, style.id, changeFunc)}
        onLongPress={() => handlePreview(type, style)}
        activeOpacity={0.7}
      >
        <Text style={styles.stylePreview}>{style.preview}</Text>
        <Text style={[styles.styleName, { color: theme.colors.text }]}>
          {style.nameZh}
        </Text>
        <Text style={[styles.styleDesc, { color: theme.colors.textMuted }]}>
          {style.description}
        </Text>
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (sectionId, title, stylesData, currentStyle, changeFunc) => {
    const stylesArray = Object.values(stylesData);
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stylesList}
        >
          {stylesArray.map((style) =>
            renderStyleCard(sectionId, style, currentStyle, changeFunc)
          )}
        </ScrollView>
      </View>
    );
  };

  const renderPreview = () => {
    if (!previewStyle) return null;

    return (
      <TouchableOpacity
        style={styles.previewOverlay}
        onPress={closePreview}
        activeOpacity={1}
      >
        <View style={[styles.previewContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
            {previewStyle.nameZh} 预览
          </Text>
          <View style={styles.previewContent}>
            {previewType === 'card2d' && render2DCardPreview(previewStyle)}
            {previewType === 'card3d' && render3DCardPreview(previewStyle)}
            {previewType === 'particle' && renderParticlePreview(previewStyle)}
            {previewType === 'weather' && renderWeatherPreview(previewStyle)}
          </View>
          <Text style={[styles.previewHint, { color: theme.colors.textMuted }]}>
            点击任意位置关闭
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const render2DCardPreview = (style) => {
    const config = style.config;
    return (
      <View
        style={[
          styles.previewCard,
          {
            borderRadius: config.borderRadius,
            borderWidth: config.borderWidth || 0,
            borderColor: config.borderColor || 'transparent',
            shadowOpacity: config.shadowOpacity,
            shadowRadius: config.shadowRadius,
            shadowOffset: config.shadowOffset || { width: 0, height: 0 },
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Text style={styles.previewCardEmoji}>🎭</Text>
        <Text style={[styles.previewCardText, { color: theme.colors.text }]}>
          {style.nameZh}
        </Text>
      </View>
    );
  };

  const render3DCardPreview = (style) => {
    return (
      <View style={styles.preview3DContainer}>
        <Text style={styles.preview3DEmoji}>🎴</Text>
        <Text style={[styles.preview3DText, { color: theme.colors.text }]}>
          {style.nameZh}
        </Text>
        <Text style={[styles.preview3DDesc, { color: theme.colors.textMuted }]}>
          {style.description}
        </Text>
      </View>
    );
  };

  const renderParticlePreview = (style) => {
    const config = style.config;
    return (
      <View style={styles.previewParticleContainer}>
        <Text style={styles.previewParticleEmoji}>{style.preview}</Text>
        <Text style={[styles.previewParticleText, { color: theme.colors.text }]}>
          {style.nameZh}
        </Text>
        <Text style={[styles.previewParticleDesc, { color: theme.colors.textMuted }]}>
          粒子数量: {config.count || config.starCount || config.flakeCount || '-'}
        </Text>
      </View>
    );
  };

  const renderWeatherPreview = (style) => {
    return (
      <View style={styles.previewWeatherContainer}>
        <Text style={styles.previewWeatherEmoji}>{style.preview}</Text>
        <Text style={[styles.previewWeatherText, { color: theme.colors.text }]}>
          {style.nameZh}
        </Text>
        <Text style={[styles.previewWeatherDesc, { color: theme.colors.textMuted }]}>
          {style.description}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← 返回</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>主题风格设置</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.tabBar}>
        {[
          { id: 'card2d', label: '2D卡牌', icon: '🃏' },
          { id: 'card3d', label: '3D卡牌', icon: '🎴' },
          { id: 'particle', label: '粒子特效', icon: '✨' },
          { id: 'weather', label: '天气效果', icon: '🌤️' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeSection === tab.id && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => setActiveSection(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabText,
                { color: activeSection === tab.id ? '#333' : theme.colors.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeSection === 'card2d' &&
          renderSection(
            'card2d',
            '2D卡牌风格',
            card2DStyles,
            card2DStyle,
            changeCard2DStyle
          )}

        {activeSection === 'card3d' &&
          renderSection(
            'card3d',
            '3D卡牌风格',
            card3DStyles,
            card3DStyle,
            changeCard3DStyle
          )}

        {activeSection === 'particle' &&
          renderSection(
            'particle',
            '粒子特效',
            particleEffects,
            particleEffect,
            changeParticleEffect
          )}

        {activeSection === 'weather' &&
          renderSection(
            'weather',
            '天气效果',
            weatherEffects,
            weatherEffect,
            changeWeatherEffect
          )}

        <View style={styles.hintSection}>
          <Text style={[styles.hintTitle, { color: theme.colors.text }]}>
            💡 使用提示
          </Text>
          <Text style={[styles.hintText, { color: theme.colors.textMuted }]}>
            • 点击卡片切换风格{'\n'}
            • 长按卡片预览效果{'\n'}
            • 设置会自动保存
          </Text>
        </View>
      </ScrollView>

      {renderPreview()}
    </View>
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
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stylesList: {
    gap: 12,
    paddingBottom: 8,
  },
  styleCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    alignItems: 'center',
  },
  styleCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stylePreview: {
    fontSize: 36,
    marginBottom: 8,
  },
  styleName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  styleDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hintSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 20,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: SCREEN_WIDTH - 48,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewContent: {
    width: '100%',
    alignItems: 'center',
    minHeight: 150,
    justifyContent: 'center',
  },
  previewHint: {
    fontSize: 12,
    marginTop: 20,
  },
  previewCard: {
    width: 120,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 5,
  },
  previewCardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  previewCardText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  preview3DContainer: {
    alignItems: 'center',
  },
  preview3DEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  preview3DText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview3DDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  previewParticleContainer: {
    alignItems: 'center',
  },
  previewParticleEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  previewParticleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewParticleDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  previewWeatherContainer: {
    alignItems: 'center',
  },
  previewWeatherEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  previewWeatherText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewWeatherDesc: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ThemeSettingsScreen;
