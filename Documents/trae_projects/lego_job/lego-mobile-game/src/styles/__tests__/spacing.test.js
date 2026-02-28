import { SPACING } from '../spacing';

describe('SPACING', () => {
  describe('基础间距', () => {
    it('应包含基础单位4px', () => {
      expect(SPACING.base).toBe(4);
    });
  });

  describe('间距值', () => {
    it('应包含xs间距(4px)', () => {
      expect(SPACING.xs).toBe(4);
    });

    it('应包含sm间距(8px)', () => {
      expect(SPACING.sm).toBe(8);
    });

    it('应包含md间距(12px)', () => {
      expect(SPACING.md).toBe(12);
    });

    it('应包含lg间距(16px)', () => {
      expect(SPACING.lg).toBe(16);
    });

    it('应包含xl间距(20px)', () => {
      expect(SPACING.xl).toBe(20);
    });

    it('应包含2xl间距(24px)', () => {
      expect(SPACING['2xl']).toBe(24);
    });

    it('应包含3xl间距(32px)', () => {
      expect(SPACING['3xl']).toBe(32);
    });

    it('应包含4xl间距(40px)', () => {
      expect(SPACING['4xl']).toBe(40);
    });

    it('应包含5xl间距(48px)', () => {
      expect(SPACING['5xl']).toBe(48);
    });
  });

  describe('页面边距', () => {
    it('应包含页面水平边距', () => {
      expect(SPACING.pageHorizontal).toBe(16);
    });

    it('应包含页面垂直边距', () => {
      expect(SPACING.pageVertical).toBe(20);
    });
  });

  describe('卡牌间距', () => {
    it('应包含卡牌内边距', () => {
      expect(SPACING.cardPadding).toBe(12);
    });

    it('应包含卡牌间距', () => {
      expect(SPACING.cardGap).toBe(8);
    });
  });

  describe('组件间距', () => {
    it('应包含按钮内边距', () => {
      expect(SPACING.buttonPadding).toBeDefined();
    });

    it('应包含输入框内边距', () => {
      expect(SPACING.inputPadding).toBeDefined();
    });

    it('应包含列表项间距', () => {
      expect(SPACING.listItemGap).toBeDefined();
    });
  });

  describe('工具函数', () => {
    it('get函数应返回正确的间距值', () => {
      expect(SPACING.get('xs')).toBe(4);
      expect(SPACING.get('lg')).toBe(16);
      expect(SPACING.get('3xl')).toBe(32);
    });

    it('get函数对未知值应返回默认值', () => {
      expect(SPACING.get('unknown')).toBe(0);
      expect(SPACING.get('unknown', 10)).toBe(10);
    });

    it('multiply函数应返回倍数间距', () => {
      expect(SPACING.multiply('sm', 2)).toBe(16);
      expect(SPACING.multiply('lg', 3)).toBe(48);
    });
  });
});
