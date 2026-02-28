import {
  DURATION,
  EASING,
  CARD_ANIMATION,
  TRANSITION_CONFIG,
  ANIMATION_VARIANTS,
  getDuration,
  getEasing,
  getCardAnimationConfig,
} from '../animations';

describe('animations - 动画常量', () => {
  describe('DURATION', () => {
    it('应该定义instant时长', () => {
      expect(DURATION.instant).toBeDefined();
      expect(DURATION.instant).toBe(0);
    });

    it('应该定义fast时长', () => {
      expect(DURATION.fast).toBeDefined();
      expect(DURATION.fast).toBe(150);
    });

    it('应该定义normal时长', () => {
      expect(DURATION.normal).toBeDefined();
      expect(DURATION.normal).toBe(300);
    });

    it('应该定义slow时长', () => {
      expect(DURATION.slow).toBeDefined();
      expect(DURATION.slow).toBe(500);
    });

    it('应该定义verySlow时长', () => {
      expect(DURATION.verySlow).toBeDefined();
      expect(DURATION.verySlow).toBe(800);
    });

    it('时长应该递增', () => {
      expect(DURATION.instant).toBeLessThan(DURATION.fast);
      expect(DURATION.fast).toBeLessThan(DURATION.normal);
      expect(DURATION.normal).toBeLessThan(DURATION.slow);
      expect(DURATION.slow).toBeLessThan(DURATION.verySlow);
    });
  });

  describe('EASING', () => {
    it('应该定义linear缓动', () => {
      expect(EASING.linear).toBeDefined();
    });

    it('应该定义easeIn缓动', () => {
      expect(EASING.easeIn).toBeDefined();
    });

    it('应该定义easeOut缓动', () => {
      expect(EASING.easeOut).toBeDefined();
    });

    it('应该定义easeInOut缓动', () => {
      expect(EASING.easeInOut).toBeDefined();
    });

    it('应该定义bounce缓动', () => {
      expect(EASING.bounce).toBeDefined();
    });

    it('应该定义elastic缓动', () => {
      expect(EASING.elastic).toBeDefined();
    });

    it('缓动函数应该是字符串或对象', () => {
      expect(typeof EASING.linear === 'string' || typeof EASING.linear === 'object').toBe(true);
      expect(typeof EASING.easeOut === 'string' || typeof EASING.easeOut === 'object').toBe(true);
    });
  });

  describe('CARD_ANIMATION', () => {
    it('应该定义flip动画配置', () => {
      expect(CARD_ANIMATION.flip).toBeDefined();
      expect(CARD_ANIMATION.flip.duration).toBeDefined();
    });

    it('应该定义hover动画配置', () => {
      expect(CARD_ANIMATION.hover).toBeDefined();
      expect(CARD_ANIMATION.hover.duration).toBeDefined();
    });

    it('应该定义deal动画配置', () => {
      expect(CARD_ANIMATION.deal).toBeDefined();
      expect(CARD_ANIMATION.deal.duration).toBeDefined();
    });

    it('应该定义shuffle动画配置', () => {
      expect(CARD_ANIMATION.shuffle).toBeDefined();
      expect(CARD_ANIMATION.shuffle.duration).toBeDefined();
    });

    it('应该定义glow动画配置', () => {
      expect(CARD_ANIMATION.glow).toBeDefined();
      expect(CARD_ANIMATION.glow.duration).toBeDefined();
    });

    it('卡牌动画时长应该是合理的数值', () => {
      expect(CARD_ANIMATION.flip.duration).toBeGreaterThan(0);
      expect(CARD_ANIMATION.hover.duration).toBeGreaterThan(0);
      expect(CARD_ANIMATION.deal.duration).toBeGreaterThan(0);
    });
  });

  describe('TRANSITION_CONFIG', () => {
    it('应该定义default配置', () => {
      expect(TRANSITION_CONFIG.default).toBeDefined();
      expect(TRANSITION_CONFIG.default.duration).toBeDefined();
    });

    it('应该定义spring配置', () => {
      expect(TRANSITION_CONFIG.spring).toBeDefined();
      expect(TRANSITION_CONFIG.spring.damping).toBeDefined();
      expect(TRANSITION_CONFIG.spring.stiffness).toBeDefined();
    });

    it('应该定义timing配置', () => {
      expect(TRANSITION_CONFIG.timing).toBeDefined();
      expect(TRANSITION_CONFIG.timing.duration).toBeDefined();
    });
  });

  describe('ANIMATION_VARIANTS', () => {
    it('应该定义fadeIn变体', () => {
      expect(ANIMATION_VARIANTS.fadeIn).toBeDefined();
      expect(ANIMATION_VARIANTS.fadeIn.from).toBeDefined();
      expect(ANIMATION_VARIANTS.fadeIn.to).toBeDefined();
    });

    it('应该定义fadeOut变体', () => {
      expect(ANIMATION_VARIANTS.fadeOut).toBeDefined();
      expect(ANIMATION_VARIANTS.fadeOut.from).toBeDefined();
      expect(ANIMATION_VARIANTS.fadeOut.to).toBeDefined();
    });

    it('应该定义scaleIn变体', () => {
      expect(ANIMATION_VARIANTS.scaleIn).toBeDefined();
      expect(ANIMATION_VARIANTS.scaleIn.from).toBeDefined();
      expect(ANIMATION_VARIANTS.scaleIn.to).toBeDefined();
    });

    it('应该定义scaleOut变体', () => {
      expect(ANIMATION_VARIANTS.scaleOut).toBeDefined();
      expect(ANIMATION_VARIANTS.scaleOut.from).toBeDefined();
      expect(ANIMATION_VARIANTS.scaleOut.to).toBeDefined();
    });

    it('应该定义slideIn变体', () => {
      expect(ANIMATION_VARIANTS.slideIn).toBeDefined();
      expect(ANIMATION_VARIANTS.slideIn.from).toBeDefined();
      expect(ANIMATION_VARIANTS.slideIn.to).toBeDefined();
    });

    it('应该定义slideOut变体', () => {
      expect(ANIMATION_VARIANTS.slideOut).toBeDefined();
      expect(ANIMATION_VARIANTS.slideOut.from).toBeDefined();
      expect(ANIMATION_VARIANTS.slideOut.to).toBeDefined();
    });
  });

  describe('getDuration', () => {
    it('应该返回fast时长', () => {
      expect(getDuration('fast')).toBe(DURATION.fast);
    });

    it('应该返回normal时长', () => {
      expect(getDuration('normal')).toBe(DURATION.normal);
    });

    it('应该返回默认时长当key不存在时', () => {
      expect(getDuration('nonexistent')).toBe(DURATION.normal);
    });
  });

  describe('getEasing', () => {
    it('应该返回linear缓动', () => {
      expect(getEasing('linear')).toBe(EASING.linear);
    });

    it('应该返回easeOut缓动', () => {
      expect(getEasing('easeOut')).toBe(EASING.easeOut);
    });

    it('应该返回默认缓动当key不存在时', () => {
      expect(getEasing('nonexistent')).toBe(EASING.easeInOut);
    });
  });

  describe('getCardAnimationConfig', () => {
    it('应该返回flip动画配置', () => {
      const config = getCardAnimationConfig('flip');
      expect(config).toBeDefined();
      expect(config.duration).toBeDefined();
    });

    it('应该返回deal动画配置', () => {
      const config = getCardAnimationConfig('deal');
      expect(config).toBeDefined();
      expect(config.duration).toBeDefined();
    });

    it('应该返回默认动画配置当key不存在时', () => {
      const config = getCardAnimationConfig('nonexistent');
      expect(config).toBeDefined();
    });
  });
});
