import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { ActionButtonsProps } from '../types';
import { logger } from '../utils/Logger';

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onHeroPower,
  onEndTurn,
  isPlayerTurn,
  heroPowerAvailable,
  heroPowerCost,
  currentMana,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const endTurnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlayerTurn) {
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
  }, [isPlayerTurn]);

  const handleHeroPower = () => {
    if (heroPowerAvailable && currentMana >= heroPowerCost) {
      logger.logUserInteraction('使用英雄技能', { heroPowerCost, currentMana });
      onHeroPower?.();
    } else {
      logger.warn('无法使用英雄技能', { 
        heroPowerAvailable, 
        heroPowerCost, 
        currentMana 
      });
    }
  };

  const handleEndTurn = () => {
    if (isPlayerTurn) {
      Animated.sequence([
        Animated.timing(endTurnScale, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(endTurnScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        logger.logUserInteraction('结束回合');
        onEndTurn?.();
      });
    }
  };

  const canUseHeroPower = heroPowerAvailable && currentMana >= heroPowerCost;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleHeroPower}
        disabled={!canUseHeroPower || !isPlayerTurn}
        style={[
          styles.heroPowerButton,
          !canUseHeroPower && styles.disabled,
          !isPlayerTurn && styles.notYourTurn,
        ]}
      >
        <View style={styles.heroPowerIcon}>
          <Text style={styles.heroPowerEmoji}>⭐</Text>
        </View>
        <View style={styles.heroPowerCost}>
          <Text style={styles.costText}>{heroPowerCost}</Text>
        </View>
      </Pressable>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Pressable
          onPress={handleEndTurn}
          disabled={!isPlayerTurn}
          style={[
            styles.endTurnButton,
            !isPlayerTurn && styles.notYourTurn,
          ]}
        >
          <Animated.View style={[styles.endTurnContent, { transform: [{ scale: endTurnScale }] }]}>
            <Text style={styles.endTurnText}>
              {isPlayerTurn ? '结束回合' : '对手回合'}
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  heroPowerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  heroPowerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPowerEmoji: {
    fontSize: 24,
  },
  heroPowerCost: {
    position: 'absolute',
    bottom: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  costText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  notYourTurn: {
    opacity: 0.6,
  },
  endTurnButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  endTurnContent: {
    alignItems: 'center',
  },
  endTurnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ActionButtons;
