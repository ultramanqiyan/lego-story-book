import { THEME, createTheme, getTheme } from '../theme';
import { COLORS } from '../colors';
import { TYPOGRAPHY } from '../typography';
import { SPACING } from '../spacing';
import { ANIMATIONS } from '../animations';

describe('THEME', () => {
  describe('默认主题', () => {
    it('应包含dark主题', () => {
      expect(THEME.dark).toBeDefined();
      expect(THEME.dark.name).toBe('dark');
    });

    it('应包含light主题', () => {
      expect(THEME.light).toBeDefined();
      expect(THEME.light.name).toBe('light');
    });
  });

  describe('dark主题配置', () => {
    it('应包含正确的颜色配置', () => {
      expect(THEME.dark.colors).toBeDefined();
      expect(THEME.dark.colors.background.primary).toBe(COLORS.background.primary);
    });

    it('应包含正确的字体配置', () => {
      expect(THEME.dark.typography).toBeDefined();
    });

    it('应包含正确的间距配置', () => {
      expect(THEME.dark.spacing).toBeDefined();
    });

    it('应包含正确的动画配置', () => {
      expect(THEME.dark.animations).toBeDefined();
    });

    it('应包含卡牌样式配置', () => {
      expect(THEME.dark.card).toBeDefined();
      expect(THEME.dark.card.borderRadius).toBeDefined();
    });
  });

  describe('light主题配置', () => {
    it('应包含正确的颜色配置', () => {
      expect(THEME.light.colors).toBeDefined();
      expect(THEME.light.colors.background).toBeDefined();
    });
  });

  describe('createTheme函数', () => {
    it('应能创建自定义主题', () => {
      const customTheme = createTheme({
        name: 'custom',
        colors: {
          background: {
            primary: '#000000',
          },
        },
      });
      expect(customTheme.name).toBe('custom');
      expect(customTheme.colors.background.primary).toBe('#000000');
    });

    it('应合并默认值', () => {
      const customTheme = createTheme({
        name: 'custom',
      });
      expect(customTheme.colors).toBeDefined();
      expect(customTheme.typography).toBeDefined();
    });
  });

  describe('getTheme函数', () => {
    it('应返回dark主题', () => {
      const theme = getTheme('dark');
      expect(theme.name).toBe('dark');
    });

    it('应返回light主题', () => {
      const theme = getTheme('light');
      expect(theme.name).toBe('light');
    });

    it('对未知主题名应返回dark主题', () => {
      const theme = getTheme('unknown');
      expect(theme.name).toBe('dark');
    });
  });

  describe('主题卡牌样式', () => {
    it('应包含卡牌背景渐变', () => {
      expect(THEME.dark.card.backgroundGradient).toBeDefined();
      expect(Array.isArray(THEME.dark.card.backgroundGradient)).toBe(true);
    });

    it('应包含卡牌边框样式', () => {
      expect(THEME.dark.card.borderColor).toBeDefined();
      expect(THEME.dark.card.borderWidth).toBeDefined();
    });

    it('应包含卡牌阴影样式', () => {
      expect(THEME.dark.card.shadowColor).toBeDefined();
      expect(THEME.dark.card.shadowOpacity).toBeDefined();
    });
  });

  describe('主题按钮样式', () => {
    it('应包含主按钮样式', () => {
      expect(THEME.dark.button.primary).toBeDefined();
    });

    it('应包含次要按钮样式', () => {
      expect(THEME.dark.button.secondary).toBeDefined();
    });

    it('应包含危险按钮样式', () => {
      expect(THEME.dark.button.danger).toBeDefined();
    });
  });
});
