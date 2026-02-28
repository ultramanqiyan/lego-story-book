import {
  TABLETOP_THEME,
  createTabletopTheme,
  getTabletopTheme,
  mergeThemes,
  createThemedStyleSheet,
} from '../theme';
import { TABLETOP_COLORS } from '../colors';
import { TABLETOP_TYPOGRAPHY } from '../typography';

describe('theme - 桌游风格主题配置', () => {
  describe('TABLETOP_THEME', () => {
    it('应该定义colors属性', () => {
      expect(TABLETOP_THEME.colors).toBeDefined();
    });

    it('应该定义typography属性', () => {
      expect(TABLETOP_THEME.typography).toBeDefined();
    });

    it('应该定义spacing属性', () => {
      expect(TABLETOP_THEME.spacing).toBeDefined();
    });

    it('应该定义animations属性', () => {
      expect(TABLETOP_THEME.animations).toBeDefined();
    });

    it('应该定义shadows属性', () => {
      expect(TABLETOP_THEME.shadows).toBeDefined();
    });

    it('应该定义borderRadius属性', () => {
      expect(TABLETOP_THEME.borderRadius).toBeDefined();
    });

    it('colors应该包含背景色', () => {
      expect(TABLETOP_THEME.colors.background).toBeDefined();
    });

    it('colors应该包含卡牌色', () => {
      expect(TABLETOP_THEME.colors.card).toBeDefined();
    });

    it('typography应该包含h1样式', () => {
      expect(TABLETOP_THEME.typography.h1).toBeDefined();
    });

    it('typography应该包含body样式', () => {
      expect(TABLETOP_THEME.typography.body).toBeDefined();
    });
  });

  describe('createTabletopTheme', () => {
    it('应该创建默认主题', () => {
      const theme = createTabletopTheme();
      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
      expect(theme.typography).toBeDefined();
    });

    it('应该允许覆盖颜色', () => {
      const customColors = {
        background: {
          primary: '#000000',
        },
      };
      const theme = createTabletopTheme({ colors: customColors });
      expect(theme.colors.background.primary).toBe('#000000');
    });

    it('应该允许覆盖字体', () => {
      const customTypography = {
        h1: {
          fontSize: 40,
        },
      };
      const theme = createTabletopTheme({ typography: customTypography });
      expect(theme.typography.h1.fontSize).toBe(40);
    });

    it('应该保留未覆盖的属性', () => {
      const theme = createTabletopTheme({});
      expect(theme.colors.card).toBeDefined();
      expect(theme.typography.body).toBeDefined();
    });
  });

  describe('getTabletopTheme', () => {
    it('应该返回默认主题', () => {
      const theme = getTabletopTheme();
      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });

    it('应该返回指定主题', () => {
      const theme = getTabletopTheme('default');
      expect(theme).toBeDefined();
    });

    it('应该返回默认主题当主题不存在时', () => {
      const theme = getTabletopTheme('nonexistent');
      expect(theme).toBeDefined();
      expect(theme.colors).toBeDefined();
    });
  });

  describe('mergeThemes', () => {
    it('应该合并两个主题', () => {
      const baseTheme = {
        colors: {
          primary: '#ffffff',
          secondary: '#000000',
        },
      };
      const overrideTheme = {
        colors: {
          primary: '#ff0000',
        },
      };
      const merged = mergeThemes(baseTheme, overrideTheme);
      expect(merged.colors.primary).toBe('#ff0000');
      expect(merged.colors.secondary).toBe('#000000');
    });

    it('应该处理嵌套对象合并', () => {
      const baseTheme = {
        colors: {
          background: {
            primary: '#1a1a2e',
            secondary: '#16213e',
          },
        },
      };
      const overrideTheme = {
        colors: {
          background: {
            primary: '#000000',
          },
        },
      };
      const merged = mergeThemes(baseTheme, overrideTheme);
      expect(merged.colors.background.primary).toBe('#000000');
      expect(merged.colors.background.secondary).toBe('#16213e');
    });

    it('应该处理空覆盖主题', () => {
      const baseTheme = {
        colors: {
          primary: '#ffffff',
        },
      };
      const merged = mergeThemes(baseTheme, {});
      expect(merged.colors.primary).toBe('#ffffff');
    });
  });

  describe('createThemedStyleSheet', () => {
    it('应该创建样式表', () => {
      const styles = createThemedStyleSheet(TABLETOP_THEME, {
        container: {
          flex: 1,
          backgroundColor: theme => theme.colors.background.primary,
        },
      });
      expect(styles.container).toBeDefined();
      expect(styles.container.flex).toBe(1);
    });

    it('应该解析主题函数', () => {
      const styles = createThemedStyleSheet(TABLETOP_THEME, {
        card: {
          backgroundColor: theme => theme.colors.card.primary,
        },
      });
      expect(styles.card.backgroundColor).toBe(TABLETOP_COLORS.card.primary);
    });

    it('应该处理静态样式', () => {
      const styles = createThemedStyleSheet(TABLETOP_THEME, {
        text: {
          fontSize: 16,
          color: '#333333',
        },
      });
      expect(styles.text.fontSize).toBe(16);
      expect(styles.text.color).toBe('#333333');
    });

    it('应该处理混合样式', () => {
      const styles = createThemedStyleSheet(TABLETOP_THEME, {
        mixed: {
          flex: 1,
          padding: 16,
          backgroundColor: theme => theme.colors.background.primary,
        },
      });
      expect(styles.mixed.flex).toBe(1);
      expect(styles.mixed.padding).toBe(16);
      expect(styles.mixed.backgroundColor).toBe(TABLETOP_COLORS.background.primary);
    });
  });
});
