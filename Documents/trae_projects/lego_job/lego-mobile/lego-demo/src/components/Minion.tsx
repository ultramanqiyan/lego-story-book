import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Animated, 
  Pressable,
  Dimensions
} from 'react-native';
import { MinionProps, Minion as MinionType } from '../types';
import { logger } from '../utils/Logger';

const { width } = Dimensions.get('window');
const MINION_WIDTH = 70;
const MINION_HEIGHT = 90;

const Minion: React.FC<MinionProps> = ({
  minion,
  isPlayerMinion,
  onAttack,
  onDeath,
  isSelected = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const attackAnim = useRef(new Animated.Value(1)).current;
  const damageAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [showDamage, setShowDamage] = useState(false);
  const prevHealthRef = useRef(minion.health);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
    
    logger.info('随从召唤', { minionName: minion.name, isPlayerMinion });
  }, []);

  useEffect(() => {
    if (minion.health < prevHealthRef.current) {
      setShowDamage(true);
      
      Animated.parallel([
        Animated.sequence([
          Animated.timing(damageAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(damageAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(attackAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(attackAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setShowDamage(false);
      });
    }
    prevHealthRef.current = minion.health;

    if (minion.health <= 0) {
      logger.info('随从死亡', { minionName: minion.name });
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDeath?.(minion.id);
      });
    }
  }, [minion.health]);

  useEffect(() => {
    if (minion.canAttack && isPlayerMinion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [minion.canAttack, isPlayerMinion]);

  const handlePress = () => {
    if (minion.canAttack && isPlayerMinion && onAttack) {
      logger.logUserInteraction('选择随从攻击', { minionId: minion.id, minionName: minion.name });
      onAttack(minion.id);
    }
  };

  const getHealthColor = () => {
    if (minion.health < minion.maxHealth) return '#F44336';
    if (minion.health > minion.maxHealth) return '#4CAF50';
    return '#fff';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable onPress={handlePress} disabled={!minion.canAttack || !isPlayerMinion}>
        <Animated.View
          style={[
            styles.minion,
            isSelected && styles.selected,
            {
              transform: [{ scale: attackAnim }],
            },
          ]}
        >
          {minion.canAttack && isPlayerMinion && (
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowAnim,
                },
              ]}
            />
          )}

          <View style={styles.imageContainer}>
            <Text style={styles.minionIcon}>👹</Text>
            {minion.hasTaunt && (
              <View style={styles.tauntBorder} />
            )}
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>{minion.name}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{minion.attack}</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: getHealthColor() }]}>
              <Text style={styles.statText}>{minion.health}</Text>
            </View>
          </View>

          {showDamage && (
            <Animated.View
              style={[
                styles.damageOverlay,
                {
                  opacity: damageAnim,
                  transform: [
                    {
                      translateY: damageAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -20],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.damageText}>
                -{prevHealthRef.current - minion.health}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: MINION_WIDTH,
    height: MINION_HEIGHT,
    marginHorizontal: 5,
  },
  minion: {
    flex: 1,
    backgroundColor: '#3a3a4a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  selected: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  minionIcon: {
    fontSize: 28,
  },
  tauntBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  nameContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  name: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  statBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  statText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  damageOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -15,
  },
  damageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});

export default Minion;
