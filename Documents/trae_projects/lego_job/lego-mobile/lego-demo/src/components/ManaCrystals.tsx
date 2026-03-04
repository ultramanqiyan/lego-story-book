import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { ManaCrystalsProps } from '../types';
import { logger } from '../utils/Logger';

const MAX_MANA_CRYSTALS = 10;

const ManaCrystals: React.FC<ManaCrystalsProps> = ({ current, max, isPlayer }) => {
  const manaAnims = useRef(
    Array.from({ length: MAX_MANA_CRYSTALS }, () => new Animated.Value(1))
  ).current;
  const prevCurrentRef = useRef(current);

  useEffect(() => {
    const diff = current - prevCurrentRef.current;
    
    if (diff !== 0) {
      logger.info('法力变化', { 
        from: prevCurrentRef.current, 
        to: current, 
        isPlayer 
      });

      if (diff > 0) {
        for (let i = prevCurrentRef.current; i < current; i++) {
          Animated.sequence([
            Animated.timing(manaAnims[i], {
              toValue: 1.3,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(manaAnims[i], {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      } else {
        for (let i = prevCurrentRef.current - 1; i >= current; i--) {
          Animated.sequence([
            Animated.timing(manaAnims[i], {
              toValue: 0.7,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(manaAnims[i], {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    }
    
    prevCurrentRef.current = current;
  }, [current, isPlayer]);

  const renderCrystals = () => {
    const crystals = [];
    
    for (let i = 0; i < MAX_MANA_CRYSTALS; i++) {
      const isAvailable = i < current;
      const isLocked = i >= max;
      
      crystals.push(
        <Animated.View
          key={i}
          style={[
            styles.crystal,
            isAvailable ? styles.crystalAvailable : styles.crystalEmpty,
            isLocked && styles.crystalLocked,
            { transform: [{ scale: manaAnims[i] }] },
          ]}
        >
          <View style={styles.crystalInner}>
            <View style={styles.crystalShine} />
          </View>
        </Animated.View>
      );
    }
    
    return crystals;
  };

  return (
    <View style={[styles.container, isPlayer ? styles.playerMana : styles.opponentMana]}>
      <View style={styles.crystalsRow}>
        {renderCrystals()}
      </View>
      
      <View style={styles.manaInfo}>
        <Text style={styles.manaText}>
          <Text style={styles.manaCurrent}>{current}</Text>
          <Text style={styles.manaSeparator}>/</Text>
          <Text style={styles.manaMax}>{max}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  playerMana: {
    transform: [{ rotate: '0deg' }],
  },
  opponentMana: {
    transform: [{ rotate: '180deg' }],
  },
  crystalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 200,
  },
  crystal: {
    width: 18,
    height: 22,
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  crystalAvailable: {
    backgroundColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  crystalEmpty: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  crystalLocked: {
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  crystalInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crystalShine: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 3,
    position: 'absolute',
    top: 3,
    left: 3,
  },
  manaInfo: {
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  manaText: {
    fontSize: 14,
  },
  manaCurrent: {
    fontWeight: 'bold',
    color: '#2196F3',
    fontSize: 16,
  },
  manaSeparator: {
    color: '#fff',
  },
  manaMax: {
    color: '#ccc',
  },
});

export default ManaCrystals;
