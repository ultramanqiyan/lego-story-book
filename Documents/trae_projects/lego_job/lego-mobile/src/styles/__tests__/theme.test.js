/**
 * theme.js 单元测试
 */

import theme, { colors, typography, spacing, borderRadius, shadows } from '../theme';

describe('theme', () => {
  describe('默认导出', () => {
    it('应该导出theme对象', () => {
      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    it('应该包含colors属性', () => {
      expect(theme.colors).toBeDefined();
    });

    it('应该包含typography属性', () => {
      expect(theme.typography).toBeDefined();
    });

    it('应该包含spacing属性', () => {
      expect(theme.spacing).toBeDefined();
    });

    it('应该包含borderRadius属性', () => {
      expect(theme.borderRadius).toBeDefined();
    });

    it('应该包含shadows属性', () => {
      expect(theme.shadows).toBeDefined();
    });
  });

  describe('colors导出', () => {
    it('应该导出colors', () => {
      expect(colors).toBeDefined();
    });
  });

  describe('typography', () => {
    it('应该包含h1样式', () => {
      expect(typography.h1).toBeDefined();
      expect(typography.h1.fontSize).toBe(28);
    });

    it('应该包含h2样式', () => {
      expect(typography.h2).toBeDefined();
      expect(typography.h2.fontSize).toBe(24);
    });

    it('应该包含h3样式', () => {
      expect(typography.h3).toBeDefined();
      expect(typography.h3.fontSize).toBe(20);
    });

    it('应该包含body样式', () => {
      expect(typography.body).toBeDefined();
      expect(typography.body.fontSize).toBe(16);
    });

    it('应该包含caption样式', () => {
      expect(typography.caption).toBeDefined();
      expect(typography.caption.fontSize).toBe(12);
    });
  });

  describe('spacing', () => {
    it('应该包含xs间距', () => {
      expect(spacing.xs).toBe(4);
    });

    it('应该包含sm间距', () => {
      expect(spacing.sm).toBe(8);
    });

    it('应该包含md间距', () => {
      expect(spacing.md).toBe(16);
    });

    it('应该包含lg间距', () => {
      expect(spacing.lg).toBe(24);
    });

    it('应该包含xl间距', () => {
      expect(spacing.xl).toBe(32);
    });
  });

  describe('borderRadius', () => {
    it('应该包含sm圆角', () => {
      expect(borderRadius.sm).toBe(8);
    });

    it('应该包含md圆角', () => {
      expect(borderRadius.md).toBe(12);
    });

    it('应该包含lg圆角', () => {
      expect(borderRadius.lg).toBe(16);
    });

    it('应该包含round圆角', () => {
      expect(borderRadius.round).toBe(999);
    });
  });

  describe('shadows', () => {
    it('应该包含sm阴影', () => {
      expect(shadows.sm).toBeDefined();
      expect(shadows.sm.shadowColor).toBeDefined();
    });

    it('应该包含md阴影', () => {
      expect(shadows.md).toBeDefined();
      expect(shadows.md.shadowColor).toBeDefined();
    });

    it('应该包含lg阴影', () => {
      expect(shadows.lg).toBeDefined();
      expect(shadows.lg.shadowColor).toBeDefined();
    });
  });
});
