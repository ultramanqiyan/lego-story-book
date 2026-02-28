import { COLORS } from '../colors';

describe('COLORS', () => {
  describe('背景色', () => {
    it('应包含主背景渐变色', () => {
      expect(COLORS.background.primary).toBe('#1a1a2e');
      expect(COLORS.background.secondary).toBe('#16213e');
      expect(COLORS.background.tertiary).toBe('#0f3460');
    });

    it('应包含卡牌背景色', () => {
      expect(COLORS.background.card).toBe('#2d2d44');
      expect(COLORS.background.cardLight).toBe('#3d3d54');
    });

    it('应包含羊皮纸质感的颜色', () => {
      expect(COLORS.background.parchment).toBe('#f4e4ba');
      expect(COLORS.background.parchmentDark).toBe('#e8d5a3');
    });
  });

  describe('金色装饰色', () => {
    it('应包含金色渐变', () => {
      expect(COLORS.gold.primary).toBe('#ffd700');
      expect(COLORS.gold.secondary).toBe('#ffaa00');
      expect(COLORS.gold.dark).toBe('#b8860b');
    });
  });

  describe('魔法色系', () => {
    it('应包含魔法蓝色', () => {
      expect(COLORS.magic.blue).toBe('#4fc3f7');
      expect(COLORS.magic.blueDark).toBe('#0288d1');
    });

    it('应包含魔法紫色', () => {
      expect(COLORS.magic.purple).toBe('#ba68c8');
      expect(COLORS.magic.purpleDark).toBe('#7b1fa2');
    });
  });

  describe('稀有度色系', () => {
    it('应包含普通稀有度颜色', () => {
      expect(COLORS.rarity.common).toBe('#ffffff');
    });

    it('应包含稀稀有度颜色', () => {
      expect(COLORS.rarity.rare).toBe('#4fc3f7');
    });

    it('应包含史诗稀有度颜色', () => {
      expect(COLORS.rarity.epic).toBe('#ba68c8');
    });

    it('应包含传说稀有度颜色', () => {
      expect(COLORS.rarity.legendary).toBe('#ff9800');
    });

    it('应包含神话稀有度颜色', () => {
      expect(COLORS.rarity.mythic).toBe('#ffd700');
    });
  });

  describe('角色类型色系', () => {
    it('应包含主角颜色', () => {
      expect(COLORS.roleType.protagonist).toBe('#d4af37');
    });

    it('应包含配角颜色', () => {
      expect(COLORS.roleType.supporting).toBe('#3498db');
    });

    it('应包含反派颜色', () => {
      expect(COLORS.roleType.antagonist).toBe('#e74c3c');
    });

    it('应包含路人颜色', () => {
      expect(COLORS.roleType.extra).toBe('#95a5a6');
    });
  });

  describe('文本色', () => {
    it('应包含主要文本色', () => {
      expect(COLORS.text.primary).toBe('#f8fafc');
    });

    it('应包含次要文本色', () => {
      expect(COLORS.text.secondary).toBe('#94a3b8');
    });

    it('应包含禁用文本色', () => {
      expect(COLORS.text.disabled).toBe('#64748b');
    });
  });

  describe('状态色', () => {
    it('应包含成功色', () => {
      expect(COLORS.status.success).toBe('#22c55e');
    });

    it('应包含错误色', () => {
      expect(COLORS.status.error).toBe('#ef4444');
    });

    it('应包含警告色', () => {
      expect(COLORS.status.warning).toBe('#f59e0b');
    });

    it('应包含信息色', () => {
      expect(COLORS.status.info).toBe('#3b82f6');
    });
  });

  describe('边框色', () => {
    it('应包含默认边框色', () => {
      expect(COLORS.border.default).toBe('rgba(255, 255, 255, 0.1)');
    });

    it('应包含金色边框色', () => {
      expect(COLORS.border.gold).toBe('rgba(255, 215, 0, 0.3)');
    });

    it('应包含高亮边框色', () => {
      expect(COLORS.border.highlight).toBe('rgba(255, 255, 255, 0.2)');
    });
  });

  describe('透明色', () => {
    it('应包含各种透明度', () => {
      expect(COLORS.transparent.light).toBe('rgba(0, 0, 0, 0.1)');
      expect(COLORS.transparent.medium).toBe('rgba(0, 0, 0, 0.5)');
      expect(COLORS.transparent.dark).toBe('rgba(0, 0, 0, 0.8)');
    });
  });
});
