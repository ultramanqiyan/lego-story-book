import {
  BASE_UNIT,
  SPACING,
  MARGIN,
  PADDING,
  GAP,
  getSpacing,
  getMargin,
  getPadding,
  getGap,
} from '../spacing';

describe('spacing - 间距系统', () => {
  describe('BASE_UNIT', () => {
    it('应该定义基础间距单位为4px', () => {
      expect(BASE_UNIT).toBe(4);
    });
  });

  describe('SPACING', () => {
    it('应该定义xs间距', () => {
      expect(SPACING.xs).toBeDefined();
      expect(SPACING.xs).toBe(BASE_UNIT);
    });

    it('应该定义sm间距', () => {
      expect(SPACING.sm).toBeDefined();
      expect(SPACING.sm).toBe(BASE_UNIT * 2);
    });

    it('应该定义md间距', () => {
      expect(SPACING.md).toBeDefined();
      expect(SPACING.md).toBe(BASE_UNIT * 4);
    });

    it('应该定义lg间距', () => {
      expect(SPACING.lg).toBeDefined();
      expect(SPACING.lg).toBe(BASE_UNIT * 6);
    });

    it('应该定义xl间距', () => {
      expect(SPACING.xl).toBeDefined();
      expect(SPACING.xl).toBe(BASE_UNIT * 8);
    });

    it('应该定义xxl间距', () => {
      expect(SPACING.xxl).toBeDefined();
      expect(SPACING.xxl).toBe(BASE_UNIT * 12);
    });

    it('间距应该递增', () => {
      expect(SPACING.xs).toBeLessThan(SPACING.sm);
      expect(SPACING.sm).toBeLessThan(SPACING.md);
      expect(SPACING.md).toBeLessThan(SPACING.lg);
      expect(SPACING.lg).toBeLessThan(SPACING.xl);
      expect(SPACING.xl).toBeLessThan(SPACING.xxl);
    });
  });

  describe('MARGIN', () => {
    it('应该定义各种margin值', () => {
      expect(MARGIN.xs).toBeDefined();
      expect(MARGIN.sm).toBeDefined();
      expect(MARGIN.md).toBeDefined();
      expect(MARGIN.lg).toBeDefined();
      expect(MARGIN.xl).toBeDefined();
      expect(MARGIN.xxl).toBeDefined();
    });

    it('margin值应该是数字', () => {
      expect(typeof MARGIN.xs).toBe('number');
      expect(typeof MARGIN.md).toBe('number');
    });
  });

  describe('PADDING', () => {
    it('应该定义各种padding值', () => {
      expect(PADDING.xs).toBeDefined();
      expect(PADDING.sm).toBeDefined();
      expect(PADDING.md).toBeDefined();
      expect(PADDING.lg).toBeDefined();
      expect(PADDING.xl).toBeDefined();
      expect(PADDING.xxl).toBeDefined();
    });

    it('padding值应该是数字', () => {
      expect(typeof PADDING.xs).toBe('number');
      expect(typeof PADDING.md).toBe('number');
    });
  });

  describe('GAP', () => {
    it('应该定义各种gap值', () => {
      expect(GAP.xs).toBeDefined();
      expect(GAP.sm).toBeDefined();
      expect(GAP.md).toBeDefined();
      expect(GAP.lg).toBeDefined();
      expect(GAP.xl).toBeDefined();
      expect(GAP.xxl).toBeDefined();
    });

    it('gap值应该是数字', () => {
      expect(typeof GAP.xs).toBe('number');
      expect(typeof GAP.md).toBe('number');
    });
  });

  describe('getSpacing', () => {
    it('应该返回xs间距', () => {
      expect(getSpacing('xs')).toBe(SPACING.xs);
    });

    it('应该返回md间距', () => {
      expect(getSpacing('md')).toBe(SPACING.md);
    });

    it('应该返回默认间距当key不存在时', () => {
      expect(getSpacing('nonexistent')).toBe(SPACING.md);
    });
  });

  describe('getMargin', () => {
    it('应该返回xs margin', () => {
      expect(getMargin('xs')).toBe(MARGIN.xs);
    });

    it('应该返回lg margin', () => {
      expect(getMargin('lg')).toBe(MARGIN.lg);
    });

    it('应该返回默认margin当key不存在时', () => {
      expect(getMargin('nonexistent')).toBe(MARGIN.md);
    });
  });

  describe('getPadding', () => {
    it('应该返回xs padding', () => {
      expect(getPadding('xs')).toBe(PADDING.xs);
    });

    it('应该返回xl padding', () => {
      expect(getPadding('xl')).toBe(PADDING.xl);
    });

    it('应该返回默认padding当key不存在时', () => {
      expect(getPadding('nonexistent')).toBe(PADDING.md);
    });
  });

  describe('getGap', () => {
    it('应该返回xs gap', () => {
      expect(getGap('xs')).toBe(GAP.xs);
    });

    it('应该返回xxl gap', () => {
      expect(getGap('xxl')).toBe(GAP.xxl);
    });

    it('应该返回默认gap当key不存在时', () => {
      expect(getGap('nonexistent')).toBe(GAP.md);
    });
  });
});
