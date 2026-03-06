import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2;
const BUTTON_HEIGHT = 180;

interface HomeScreenProps {
  onNavigateToBookshelf: () => void;
  onNavigateToCardDemo: () => void;
  onNavigateToStyle: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToBookshelf,
  onNavigateToCardDemo,
  onNavigateToStyle,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([0.8, 0.8, 0.8].map(() => new Animated.Value(0.8))).current;
  const slideAnims = useRef([30, 30, 30].map(() => new Animated.Value(30))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      ...scaleAnims.map((anim, index) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: index * 100,
          useNativeDriver: true,
        })
      ),
      ...slideAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const buttons = [
    {
      key: 'bookshelf',
      title: '📚 书架',
      subtitle: '我的故事书',
      color: '#8B4513',
      accentColor: '#D2691E',
      onPress: onNavigateToBookshelf,
    },
    {
      key: 'card',
      title: '🃏 卡牌Demo',
      subtitle: '故事导演台',
      color: '#2C3E50',
      accentColor: '#34495E',
      onPress: onNavigateToCardDemo,
    },
    {
      key: 'style',
      title: '🎨 风格',
      subtitle: 'UI风格设置',
      color: '#1A5276',
      accentColor: '#2980B9',
      onPress: onNavigateToStyle,
    },
  ];

  const renderButton = (button: typeof buttons[0], index: number) => {
    const isWide = index === 0;
    
    return (
      <Animated.View
        key={button.key}
        style={{
          transform: [{ scale: scaleAnims[index] }, { translateY: slideAnims[index] }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={[
            styles.menuButton,
            isWide && styles.menuButtonWide,
            { backgroundColor: button.color },
          ]}
          onPress={button.onPress}
          activeOpacity={0.85}
        >
          <View style={[styles.buttonAccent, { backgroundColor: button.accentColor }]} />
          <Text style={styles.buttonEmoji}>{button.title.split(' ')[0]}</Text>
          <Text style={styles.buttonTitle}>{button.title.split(' ')[1]}</Text>
          <Text style={styles.buttonSubtitle}>{button.subtitle}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LEGO Story</Text>
        <Text style={styles.headerSubtitle}>创作属于你的故事世界</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.buttonRow}>
          {renderButton(buttons[0], 0)}
        </View>
        <View style={styles.buttonRow}>
          {renderButton(buttons[1], 1)}
          {renderButton(buttons[2], 2)}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ 让想象力自由飞翔 ✨</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#DEB887',
    backgroundColor: '#FFF8DC',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D3A1A',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  menuButtonWide: {
    width: width - 40,
    height: 140,
  },
  buttonAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DEB887',
    backgroundColor: '#FFF8DC',
  },
  footerText: {
    fontSize: 14,
    color: '#8B7355',
  },
});

export default HomeScreen;
