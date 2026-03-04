import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Pressable } from 'react-native';
import { HeroAvatarProps } from '../types';
import { logger } from '../utils/Logger';

const HeroAvatar: React.FC<HeroAvatarProps> = ({ hero, isPlayer, onAttack }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const healthAnim = useRef(new Animated.Value(1)).current;
  const prevHealthRef = useRef(hero.health);

  useEffect(() => {
    if (hero.health < prevHealthRef.current) {
      Animated.sequence([
        Animated.timing(healthAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(healthAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevHealthRef.current = hero.health;
  }, [hero.health]);

  useEffect(() => {
    if (hero.canAttack && isPlayer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [hero.canAttack, isPlayer]);

  const handlePress = () => {
    if (onAttack && hero.canAttack) {
      logger.logUserInteraction('点击英雄攻击', { heroName: hero.name, isPlayer });
      onAttack();
    }
  };

  const getHealthColor = () => {
    const healthPercent = hero.health / hero.maxHealth;
    if (healthPercent > 0.5) return '#4CAF50';
    if (healthPercent > 0.25) return '#FFC107';
    return '#F44336';
  };

  return (
    <Pressable onPress={handlePress} disabled={!hero.canAttack}>
      <Animated.View
        style={[
          styles.container,
          isPlayer ? styles.playerContainer : styles.opponentContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <View style={styles.avatarFrame}>
          <View style={styles.avatarInner}>
            <Text style={styles.heroInitial}>{hero.name.charAt(0)}</Text>
          </View>
          <View style={styles.frameBorder} />
        </View>

        <Animated.View
          style={[
            styles.healthContainer,
            { transform: [{ scale: healthAnim }] },
          ]}
        >
          {hero.armor > 0 && (
            <View style={styles.armorBadge}>
              <Text style={styles.armorText}>{hero.armor}</Text>
            </View>
          )}
          <View style={[styles.healthBadge, { backgroundColor: getHealthColor() }]}>
            <Text style={styles.healthText}>{hero.health}</Text>
          </View>
        </Animated.View>

        <Text style={styles.heroName}>{hero.name}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  playerContainer: {
    transform: [{ rotate: '0deg' }],
  },
  opponentContainer: {
    transform: [{ rotate: '180deg' }],
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B4513',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 36,
    backgroundColor: '#4a3c2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  frameBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  healthContainer: {
    position: 'absolute',
    bottom: -10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  healthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  armorBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#607D8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  armorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroName: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default HeroAvatar;
