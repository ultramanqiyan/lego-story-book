import { ANIMATIONS } from '../animations';

describe('ANIMATIONS', () => {
  describe('动画时长', () => {
    it('应包含fast时长(150ms)', () => {
      expect(ANIMATIONS.duration.fast).toBe(150);
    });

    it('应包含normal时长(300ms)', () => {
      expect(ANIMATIONS.duration.normal).toBe(300);
    });

    it('应包含slow时长(500ms)', () => {
      expect(ANIMATIONS.duration.slow).toBe(500);
    });

    it('应包含verySlow时长(800ms)', () => {
      expect(ANIMATIONS.duration.verySlow).toBe(800);
    });

    it('应包含卡牌入场时长', () => {
      expect(ANIMATIONS.duration.cardEntry).toBe(500);
    });

    it('应包含卡牌翻转时长', () => {
      expect(ANIMATIONS.duration.cardFlip).toBe(300);
    });

    it('应包含粒子动画时长', () => {
      expect(ANIMATIONS.duration.particle).toBe(20000);
    });
  });

  describe('缓动函数', () => {
    it('应包含easeInOut缓动', () => {
      expect(ANIMATIONS.easing.easeInOut).toBeDefined();
    });

    it('应包含easeOut缓动', () => {
      expect(ANIMATIONS.easing.easeOut).toBeDefined();
    });

    it('应包含easeIn缓动', () => {
      expect(ANIMATIONS.easing.easeIn).toBeDefined();
    });

    it('应包含bounce缓动', () => {
      expect(ANIMATIONS.easing.bounce).toBeDefined();
    });

    it('应包含elastic缓动', () => {
      expect(ANIMATIONS.easing.elastic).toBeDefined();
    });
  });

  describe('卡牌动画配置', () => {
    it('应包含卡牌悬停配置', () => {
      expect(ANIMATIONS.card.hover).toBeDefined();
      expect(ANIMATIONS.card.hover.translateY).toBe(-15);
      expect(ANIMATIONS.card.hover.scale).toBe(1.08);
    });

    it('应包含卡牌选中配置', () => {
      expect(ANIMATIONS.card.select).toBeDefined();
      expect(ANIMATIONS.card.select.scale).toBe(1.1);
    });

    it('应包含卡牌翻转配置', () => {
      expect(ANIMATIONS.card.flip).toBeDefined();
      expect(ANIMATIONS.card.flip.rotateY).toBe(180);
    });

    it('应包含卡牌入场配置', () => {
      expect(ANIMATIONS.card.entry).toBeDefined();
      expect(ANIMATIONS.card.entry.fromY).toBeDefined();
    });
  });

  describe('粒子动画配置', () => {
    it('应包含粒子数量配置', () => {
      expect(ANIMATIONS.particle.count).toBeDefined();
    });

    it('应包含粒子大小配置', () => {
      expect(ANIMATIONS.particle.size).toBeDefined();
    });

    it('应包含粒子速度配置', () => {
      expect(ANIMATIONS.particle.speed).toBeDefined();
    });
  });

  describe('发光效果配置', () => {
    it('应包含发光半径配置', () => {
      expect(ANIMATIONS.glow.radius).toBeDefined();
    });

    it('应包含发光动画配置', () => {
      expect(ANIMATIONS.glow.animation).toBeDefined();
    });
  });

  describe('弹簧动画配置', () => {
    it('应包含弹簧配置', () => {
      expect(ANIMATIONS.spring).toBeDefined();
      expect(ANIMATIONS.spring.gentle).toBeDefined();
      expect(ANIMATIONS.spring.gentle.damping).toBeDefined();
      expect(ANIMATIONS.spring.gentle.stiffness).toBeDefined();
    });
  });

  describe('工具函数', () => {
    it('getDuration应返回正确的时长', () => {
      expect(ANIMATIONS.getDuration('fast')).toBe(150);
      expect(ANIMATIONS.getDuration('slow')).toBe(500);
    });

    it('getEasing应返回正确的缓动函数', () => {
      const easeInOut = ANIMATIONS.getEasing('easeInOut');
      expect(easeInOut).toBeDefined();
    });
  });
});
