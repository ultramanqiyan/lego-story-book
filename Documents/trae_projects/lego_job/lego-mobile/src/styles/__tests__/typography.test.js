import {
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_HEIGHTS,
  FONT_WEIGHTS,
  TABLETOP_TYPOGRAPHY,
  getFontFamily,
  getTypographyStyle,
} from '../typography';

describe('typography - 桌游风格字体系统', () => {
  describe('FONT_FAMILIES', () => {
    it('应该定义标题字体', () => {
      expect(FONT_FAMILIES.heading).toBeDefined();
      expect(Array.isArray(FONT_FAMILIES.heading)).toBe(true);
      expect(FONT_FAMILIES.heading.length).toBeGreaterThan(0);
    });

    it('应该定义正文字体', () => {
      expect(FONT_FAMILIES.body).toBeDefined();
      expect(Array.isArray(FONT_FAMILIES.body)).toBe(true);
      expect(FONT_FAMILIES.body.length).toBeGreaterThan(0);
    });

    it('应该包含Cinzel字体', () => {
      const hasCinzel = FONT_FAMILIES.heading.some(f => 
        f.toLowerCase().includes('cinzel')
      );
      expect(hasCinzel).toBe(true);
    });

    it('应该包含Playfair Display字体', () => {
      const hasPlayfair = FONT_FAMILIES.heading.some(f => 
        f.toLowerCase().includes('playfair')
      );
      expect(hasPlayfair).toBe(true);
    });

    it('应该包含Noto Sans SC字体', () => {
      const hasNoto = FONT_FAMILIES.body.some(f => 
        f.toLowerCase().includes('noto')
      );
      expect(hasNoto).toBe(true);
    });

    it('应该包含Nunito字体', () => {
      const hasNunito = FONT_FAMILIES.body.some(f => 
        f.toLowerCase().includes('nunito')
      );
      expect(hasNunito).toBe(true);
    });
  });

  describe('FONT_SIZES', () => {
    it('应该定义各种字体大小', () => {
      expect(FONT_SIZES.xs).toBeDefined();
      expect(FONT_SIZES.sm).toBeDefined();
      expect(FONT_SIZES.md).toBeDefined();
      expect(FONT_SIZES.lg).toBeDefined();
      expect(FONT_SIZES.xl).toBeDefined();
      expect(FONT_SIZES.xxl).toBeDefined();
      expect(FONT_SIZES.xxxl).toBeDefined();
    });

    it('字体大小应该是合理的数值', () => {
      expect(FONT_SIZES.xs).toBeLessThan(FONT_SIZES.sm);
      expect(FONT_SIZES.sm).toBeLessThan(FONT_SIZES.md);
      expect(FONT_SIZES.md).toBeLessThan(FONT_SIZES.lg);
      expect(FONT_SIZES.lg).toBeLessThan(FONT_SIZES.xl);
      expect(FONT_SIZES.xl).toBeLessThan(FONT_SIZES.xxl);
      expect(FONT_SIZES.xxl).toBeLessThan(FONT_SIZES.xxxl);
    });
  });

  describe('LINE_HEIGHTS', () => {
    it('应该定义各种行高', () => {
      expect(LINE_HEIGHTS.tight).toBeDefined();
      expect(LINE_HEIGHTS.normal).toBeDefined();
      expect(LINE_HEIGHTS.relaxed).toBeDefined();
      expect(LINE_HEIGHTS.loose).toBeDefined();
    });

    it('行高应该是合理的数值', () => {
      expect(LINE_HEIGHTS.tight).toBeLessThan(LINE_HEIGHTS.normal);
      expect(LINE_HEIGHTS.normal).toBeLessThan(LINE_HEIGHTS.relaxed);
      expect(LINE_HEIGHTS.relaxed).toBeLessThan(LINE_HEIGHTS.loose);
    });
  });

  describe('FONT_WEIGHTS', () => {
    it('应该定义各种字重', () => {
      expect(FONT_WEIGHTS.light).toBeDefined();
      expect(FONT_WEIGHTS.normal).toBeDefined();
      expect(FONT_WEIGHTS.medium).toBeDefined();
      expect(FONT_WEIGHTS.semibold).toBeDefined();
      expect(FONT_WEIGHTS.bold).toBeDefined();
    });

    it('字重应该是合理的数值', () => {
      expect(FONT_WEIGHTS.light).toBeLessThan(FONT_WEIGHTS.normal);
      expect(FONT_WEIGHTS.normal).toBeLessThan(FONT_WEIGHTS.medium);
      expect(FONT_WEIGHTS.medium).toBeLessThan(FONT_WEIGHTS.semibold);
      expect(FONT_WEIGHTS.semibold).toBeLessThan(FONT_WEIGHTS.bold);
    });
  });

  describe('TABLETOP_TYPOGRAPHY', () => {
    it('应该定义标题样式', () => {
      expect(TABLETOP_TYPOGRAPHY.h1).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h2).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h3).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h4).toBeDefined();
    });

    it('标题样式应包含fontSize', () => {
      expect(TABLETOP_TYPOGRAPHY.h1.fontSize).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h2.fontSize).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h3.fontSize).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h4.fontSize).toBeDefined();
    });

    it('标题样式应包含fontFamily', () => {
      expect(TABLETOP_TYPOGRAPHY.h1.fontFamily).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.h2.fontFamily).toBeDefined();
    });

    it('应该定义正文样式', () => {
      expect(TABLETOP_TYPOGRAPHY.body).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.bodyLarge).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.bodySmall).toBeDefined();
    });

    it('正文样式应包含fontSize和lineHeight', () => {
      expect(TABLETOP_TYPOGRAPHY.body.fontSize).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.body.lineHeight).toBeDefined();
    });

    it('应该定义卡牌标题样式', () => {
      expect(TABLETOP_TYPOGRAPHY.cardTitle).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.cardTitle.fontSize).toBeDefined();
    });

    it('应该定义卡牌正文样式', () => {
      expect(TABLETOP_TYPOGRAPHY.cardBody).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.cardBody.fontSize).toBeDefined();
    });

    it('应该定义标签样式', () => {
      expect(TABLETOP_TYPOGRAPHY.label).toBeDefined();
      expect(TABLETOP_TYPOGRAPHY.caption).toBeDefined();
    });

    it('标题字体大小应该递减', () => {
      expect(TABLETOP_TYPOGRAPHY.h1.fontSize).toBeGreaterThan(TABLETOP_TYPOGRAPHY.h2.fontSize);
      expect(TABLETOP_TYPOGRAPHY.h2.fontSize).toBeGreaterThan(TABLETOP_TYPOGRAPHY.h3.fontSize);
      expect(TABLETOP_TYPOGRAPHY.h3.fontSize).toBeGreaterThan(TABLETOP_TYPOGRAPHY.h4.fontSize);
    });
  });

  describe('getFontFamily', () => {
    it('应该返回标题字体', () => {
      const fontFamily = getFontFamily('heading');
      expect(fontFamily).toBeDefined();
      expect(typeof fontFamily).toBe('string');
    });

    it('应该返回正文字体', () => {
      const fontFamily = getFontFamily('body');
      expect(fontFamily).toBeDefined();
      expect(typeof fontFamily).toBe('string');
    });

    it('应该返回默认字体当类型不存在时', () => {
      const fontFamily = getFontFamily('unknown');
      expect(fontFamily).toBeDefined();
      expect(typeof fontFamily).toBe('string');
    });
  });

  describe('getTypographyStyle', () => {
    it('应该返回h1样式', () => {
      const style = getTypographyStyle('h1');
      expect(style).toBeDefined();
      expect(style.fontSize).toBeDefined();
    });

    it('应该返回body样式', () => {
      const style = getTypographyStyle('body');
      expect(style).toBeDefined();
      expect(style.fontSize).toBeDefined();
      expect(style.lineHeight).toBeDefined();
    });

    it('应该返回cardTitle样式', () => {
      const style = getTypographyStyle('cardTitle');
      expect(style).toBeDefined();
      expect(style.fontSize).toBeDefined();
    });

    it('应该返回默认样式当样式名不存在时', () => {
      const style = getTypographyStyle('nonexistent');
      expect(style).toBeDefined();
    });
  });
});
