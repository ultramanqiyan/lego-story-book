import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CardStyleType, AnimationType, CardStyle, CARD_STYLES, ANIMATION_CONFIGS } from '../types/styles';
import { logger } from '../utils/GameLogger';

interface StyleContextType {
  currentStyle: CardStyleType;
  currentAnimation: AnimationType;
  currentCardStyle: CardStyle;
  setStyle: (style: CardStyleType) => void;
  setAnimation: (animation: AnimationType) => void;
  cycleStyle: () => void;
  cycleAnimation: () => void;
  allStyles: CardStyleType[];
  allAnimations: AnimationType[];
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

interface StyleProviderProps {
  children: ReactNode;
}

export const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  const [currentStyle, setCurrentStyle] = useState<CardStyleType>(CardStyleType.CLASSIC);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>(AnimationType.BOUNCE);

  const allStyles = Object.values(CardStyleType);
  const allAnimations = Object.values(AnimationType);

  const setStyle = useCallback((style: CardStyleType) => {
    logger.logInteraction('切换卡牌风格', { style, name: CARD_STYLES[style].name });
    setCurrentStyle(style);
  }, []);

  const setAnimation = useCallback((animation: AnimationType) => {
    logger.logInteraction('切换动画效果', { animation, name: ANIMATION_CONFIGS[animation].name });
    setCurrentAnimation(animation);
  }, []);

  const cycleStyle = useCallback(() => {
    const currentIndex = allStyles.indexOf(currentStyle);
    const nextIndex = (currentIndex + 1) % allStyles.length;
    const nextStyle = allStyles[nextIndex];
    setStyle(nextStyle);
  }, [currentStyle, allStyles, setStyle]);

  const cycleAnimation = useCallback(() => {
    const currentIndex = allAnimations.indexOf(currentAnimation);
    const nextIndex = (currentIndex + 1) % allAnimations.length;
    const nextAnimation = allAnimations[nextIndex];
    setAnimation(nextAnimation);
  }, [currentAnimation, allAnimations, setAnimation]);

  const currentCardStyle = CARD_STYLES[currentStyle];

  const value: StyleContextType = {
    currentStyle,
    currentAnimation,
    currentCardStyle,
    setStyle,
    setAnimation,
    cycleStyle,
    cycleAnimation,
    allStyles,
    allAnimations,
  };

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
};

export const useStyle = (): StyleContextType => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};

export default StyleContext;
