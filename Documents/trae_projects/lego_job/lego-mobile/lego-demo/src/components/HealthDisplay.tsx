import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { HealthDisplayProps } from '../types';
import { logger } from '../utils/Logger';

const HealthDisplay: React.FC<HealthDisplayProps> = ({ 
  health, 
  maxHealth, 
  armor = 0, 
  isPlayer 
}) => {
  const healthAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevHealthRef = useRef(health);

  useEffect(() => {
    if (health !== prevHealthRef.current) {
      logger.info('生命值变化', { 
        from: prevHealthRef.current, 
        to: health, 
        isPlayer 
      });

      Animated.parallel([
        Animated.sequence([
          Animated.timing(healthAnim, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(healthAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      prevHealthRef.current = health;
    }
  }, [health, isPlayer]);

  const getHealthColor = () => {
    const healthPercent = health / maxHealth;
    if (healthPercent > 0.5) return '#4CAF50';
    if (healthPercent > 0.25) return '#FFC107';
    return '#F44336';
  };

  const healthPercent = (health / maxHealth) * 100;

  return (
    <View style={[styles.container, isPlayer ? styles.playerHealth : styles.opponentHealth]}>
      <View style={styles.healthBarContainer}>
        <View style={styles.healthBarBackground}>
          <View 
            style={[
              styles.healthBarFill, 
              { 
                width: `${healthPercent}%`,
                backgroundColor: getHealthColor() 
              }
            ]} 
          />
        </View>
        
        <Animated.View 
          style={[
            styles.flashOverlay,
            { opacity: flashAnim }
          ]} 
        />
      </View>

      <Animated.View style={[styles.textContainer, { transform: [{ scale: healthAnim }] }]}>
        {armor > 0 && (
          <View style={styles.armorContainer}>
            <Text style={styles.armorText}>{armor}</Text>
            <Text style={styles.armorLabel}>护甲</Text>
          </View>
        )}
        
        <View style={styles.healthTextContainer}>
          <Text style={[styles.healthText, { color: getHealthColor() }]}>
            {health}
          </Text>
          <Text style={styles.maxHealthText}>/{maxHealth}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  playerHealth: {
    transform: [{ rotate: '0deg' }],
  },
  opponentHealth: {
    transform: [{ rotate: '180deg' }],
  },
  healthBarContainer: {
    width: 120,
    height: 12,
    position: 'relative',
  },
  healthBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  armorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#607D8B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  armorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  armorLabel: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 2,
  },
  healthTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  healthText: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  maxHealthText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 2,
  },
});

export default HealthDisplay;
