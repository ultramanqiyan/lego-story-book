/**
 * colors.js 单元测试
 */

import { getTheme, createThemedStyles } from '../colors';
import themes from '../colors';

describe('colors', () => {
  describe('getTheme', () => {
    it('应该返回指定主题', () => {
      const theme = getTheme('lego');
      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });

    it('应该返回默认主题当主题ID不存在时', () => {
      const theme = getTheme('nonexistent');
      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });

    it('应该返回lego主题', () => {
      const theme = getTheme('lego');
      expect(theme.colors.primary).toBeDefined();
    });

    it('应该返回fairy主题', () => {
      const theme = getTheme('fairy');
      expect(theme.colors.primary).toBe('#FF69B4');
    });

    it('应该返回scifi主题', () => {
      const theme = getTheme('scifi');
      expect(theme.colors.primary).toBe('#00D4FF');
    });

    it('应该返回nature主题', () => {
      const theme = getTheme('nature');
      expect(theme.colors.primary).toBe('#4CAF50');
    });

    it('应该返回gamified主题', () => {
      const theme = getTheme('gamified');
      expect(theme.colors.primary).toBe('#9C27B0');
    });

    it('应该返回immersive主题', () => {
      const theme = getTheme('immersive');
      expect(theme.colors.primary).toBe('#1A1A2E');
    });
  });

  describe('createThemedStyles', () => {
    it('应该创建主题样式', () => {
      const theme = getTheme('lego');
      const styles = createThemedStyles(theme);
      expect(styles.container).toBeDefined();
      expect(styles.surface).toBeDefined();
      expect(styles.text).toBeDefined();
      expect(styles.textLight).toBeDefined();
      expect(styles.primary).toBeDefined();
      expect(styles.primaryText).toBeDefined();
      expect(styles.secondary).toBeDefined();
      expect(styles.secondaryText).toBeDefined();
    });
  });

  describe('themes', () => {
    it('应该导出themes对象', () => {
      expect(themes).toBeDefined();
      expect(typeof themes).toBe('object');
    });

    it('应该包含所有主题', () => {
      expect(themes.lego).toBeDefined();
      expect(themes.fairy).toBeDefined();
      expect(themes.scifi).toBeDefined();
      expect(themes.nature).toBeDefined();
      expect(themes.gamified).toBeDefined();
      expect(themes.immersive).toBeDefined();
    });
  });
});
