import {
  TABLETOP_COLORS,
  RARITY_COLORS,
  CHARACTER_TYPE_COLORS,
  GRADIENT_PRESETS,
  getRarityColor,
  getCharacterTypeColor,
  createGradientColors,
} from '../colors';

describe('colors - 桌游风格主题', () => {
  describe('TABLETOP_COLORS', () => {
    it('应该定义主背景渐变色', () => {
      expect(TABLETOP_COLORS.background.primary).toBe('#1a1a2e');
      expect(TABLETOP_COLORS.background.secondary).toBe('#16213e');
      expect(TABLETOP_COLORS.background.tertiary).toBe('#0f3460');
    });

    it('应该定义卡牌背景羊皮纸色', () => {
      expect(TABLETOP_COLORS.card.primary).toBe('#f4e4ba');
      expect(TABLETOP_COLORS.card.secondary).toBe('#e8d5a3');
    });

    it('应该定义金色装饰色', () => {
      expect(TABLETOP_COLORS.gold.primary).toBe('#ffd700');
      expect(TABLETOP_COLORS.gold.secondary).toBe('#ffaa00');
    });

    it('应该定义魔法蓝色', () => {
      expect(TABLETOP_COLORS.magic.blue).toBe('#4fc3f7');
    });

    it('应该定义魔法紫色', () => {
      expect(TABLETOP_COLORS.magic.purple).toBe('#ba68c8');
    });

    it('应该定义文本颜色', () => {
      expect(TABLETOP_COLORS.text.primary).toBeDefined();
      expect(TABLETOP_COLORS.text.secondary).toBeDefined();
      expect(TABLETOP_COLORS.text.muted).toBeDefined();
    });
  });

  describe('RARITY_COLORS', () => {
    it('应该定义普通稀有度颜色', () => {
      expect(RARITY_COLORS.common).toBe('#ffffff');
    });

    it('应该定义稀稀有度颜色', () => {
      expect(RARITY_COLORS.rare).toBe('#4fc3f7');
    });

    it('应该定义史诗稀有度颜色', () => {
      expect(RARITY_COLORS.epic).toBe('#ba68c8');
    });

    it('应该定义传说稀有度颜色', () => {
      expect(RARITY_COLORS.legendary).toBe('#ff9800');
    });
  });

  describe('CHARACTER_TYPE_COLORS', () => {
    it('应该定义主角金色', () => {
      expect(CHARACTER_TYPE_COLORS.protagonist).toBe('#d4af37');
    });

    it('应该定义配角蓝色', () => {
      expect(CHARACTER_TYPE_COLORS.supporting).toBe('#3498db');
    });

    it('应该定义反派红色', () => {
      expect(CHARACTER_TYPE_COLORS.antagonist).toBe('#e74c3c');
    });

    it('应该定义路人灰色', () => {
      expect(CHARACTER_TYPE_COLORS.bystander).toBe('#95a5a6');
    });
  });

  describe('GRADIENT_PRESETS', () => {
    it('应该定义深蓝紫渐变预设', () => {
      expect(GRADIENT_PRESETS.darkBluePurple).toBeDefined();
      expect(GRADIENT_PRESETS.darkBluePurple.colors).toHaveLength(3);
    });

    it('应该定义金色渐变预设', () => {
      expect(GRADIENT_PRESETS.gold).toBeDefined();
      expect(GRADIENT_PRESETS.gold.colors).toHaveLength(2);
    });

    it('应该定义魔法渐变预设', () => {
      expect(GRADIENT_PRESETS.magic).toBeDefined();
      expect(GRADIENT_PRESETS.magic.colors).toHaveLength(2);
    });

    it('应该定义卡牌渐变预设', () => {
      expect(GRADIENT_PRESETS.card).toBeDefined();
      expect(GRADIENT_PRESETS.card.colors).toHaveLength(2);
    });
  });

  describe('getRarityColor', () => {
    it('应该返回普通稀有度颜色', () => {
      expect(getRarityColor('common')).toBe('#ffffff');
    });

    it('应该返回稀稀有度颜色', () => {
      expect(getRarityColor('rare')).toBe('#4fc3f7');
    });

    it('应该返回史诗稀有度颜色', () => {
      expect(getRarityColor('epic')).toBe('#ba68c8');
    });

    it('应该返回传说稀有度颜色', () => {
      expect(getRarityColor('legendary')).toBe('#ff9800');
    });

    it('应该返回默认颜色当稀有度不存在时', () => {
      expect(getRarityColor('unknown')).toBe('#ffffff');
    });
  });

  describe('getCharacterTypeColor', () => {
    it('应该返回主角颜色', () => {
      expect(getCharacterTypeColor('protagonist')).toBe('#d4af37');
    });

    it('应该返回配角颜色', () => {
      expect(getCharacterTypeColor('supporting')).toBe('#3498db');
    });

    it('应该返回反派颜色', () => {
      expect(getCharacterTypeColor('antagonist')).toBe('#e74c3c');
    });

    it('应该返回路人颜色', () => {
      expect(getCharacterTypeColor('bystander')).toBe('#95a5a6');
    });

    it('应该返回默认颜色当类型不存在时', () => {
      expect(getCharacterTypeColor('unknown')).toBe('#95a5a6');
    });
  });

  describe('createGradientColors', () => {
    it('应该创建有效的渐变颜色数组', () => {
      const colors = createGradientColors('#1a1a2e', '#0f3460', 5);
      expect(colors).toHaveLength(5);
      expect(colors[0]).toBe('#1a1a2e');
      expect(colors[4]).toBe('#0f3460');
    });

    it('应该处理两个相同颜色', () => {
      const colors = createGradientColors('#ffffff', '#ffffff', 3);
      expect(colors).toHaveLength(3);
      colors.forEach(color => {
        expect(color).toBe('#ffffff');
      });
    });

    it('应该处理步数为2的情况', () => {
      const colors = createGradientColors('#000000', '#ffffff', 2);
      expect(colors).toHaveLength(2);
      expect(colors[0]).toBe('#000000');
      expect(colors[1]).toBe('#ffffff');
    });

    it('应该处理步数为1的情况', () => {
      const colors = createGradientColors('#ff0000', '#0000ff', 1);
      expect(colors).toHaveLength(1);
      expect(colors[0]).toBe('#ff0000');
    });
  });
});
