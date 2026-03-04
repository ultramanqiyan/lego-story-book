import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Minion from './Minion';
import { MinionFieldProps } from '../types';
import { logger } from '../utils/Logger';

const { width } = Dimensions.get('window');
const MAX_MINIONS = 7;

const MinionField: React.FC<MinionFieldProps> = ({
  minions,
  isPlayerField,
  onMinionSelect,
  onMinionAttack,
}) => {
  const handleMinionAttack = (minionId: string) => {
    const minion = minions.find(m => m.id === minionId);
    if (minion) {
      logger.logUserInteraction('选择随从攻击目标', { 
        minionId, 
        minionName: minion.name,
        isPlayerField 
      });
      onMinionSelect?.(minion);
    }
  };

  const handleMinionDeath = (minionId: string) => {
    logger.info('随从移除', { minionId, isPlayerField });
  };

  const renderMinionSlots = () => {
    const slots = [];
    
    for (let i = 0; i < MAX_MINIONS; i++) {
      const minion = minions[i];
      
      if (minion) {
        slots.push(
          <Minion
            key={minion.id}
            minion={minion}
            isPlayerMinion={isPlayerField}
            onAttack={handleMinionAttack}
            onDeath={handleMinionDeath}
          />
        );
      } else {
        slots.push(
          <View key={`empty-${i}`} style={styles.emptySlot} />
        );
      }
    }
    
    return slots;
  };

  return (
    <View style={[styles.container, !isPlayerField && styles.opponentField]}>
      <View style={styles.slotsContainer}>
        {renderMinionSlots()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentField: {
    transform: [{ rotate: '180deg' }],
  },
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    width: 70,
    height: 90,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
});

export default MinionField;
