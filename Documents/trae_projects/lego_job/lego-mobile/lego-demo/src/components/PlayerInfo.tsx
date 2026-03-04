import React from 'react';
import { StyleSheet, View } from 'react-native';
import HeroAvatar from './HeroAvatar';
import HealthDisplay from './HealthDisplay';
import ManaCrystals from './ManaCrystals';
import { Player } from '../types';
import { logger } from '../utils/Logger';

interface PlayerInfoProps {
  player: Player;
  isPlayer: boolean;
  onHeroAttack?: () => void;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  player, 
  isPlayer, 
  onHeroAttack 
}) => {
  React.useEffect(() => {
    logger.debug('玩家信息组件渲染', { 
      playerName: player.hero.name, 
      isPlayer,
      health: player.hero.health,
      mana: player.mana.current
    });
  }, [player, isPlayer]);

  return (
    <View style={[styles.container, isPlayer ? styles.playerInfo : styles.opponentInfo]}>
      <View style={styles.heroSection}>
        <HeroAvatar 
          hero={player.hero} 
          isPlayer={isPlayer} 
          onAttack={onHeroAttack}
        />
        
        <View style={styles.statsSection}>
          <HealthDisplay
            health={player.hero.health}
            maxHealth={player.hero.maxHealth}
            armor={player.hero.armor}
            isPlayer={isPlayer}
          />
        </View>
      </View>

      <View style={styles.manaSection}>
        <ManaCrystals
          current={player.mana.current}
          max={player.mana.max}
          isPlayer={isPlayer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  playerInfo: {
    justifyContent: 'flex-end',
  },
  opponentInfo: {
    justifyContent: 'flex-start',
    transform: [{ rotate: '180deg' }],
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsSection: {
    flex: 1,
    marginLeft: 10,
  },
  manaSection: {
    marginTop: 5,
    alignItems: 'center',
  },
});

export default PlayerInfo;
