import { TYPOGRAPHY } from '../typography';

describe('TYPOGRAPHY', () => {
  describe('字体族', () => {
    it('应包含标题字体', () => {
      expect(TYPOGRAPHY.fontFamily.title).toBeDefined();
      expect(TYPOGRAPHY.fontFamily.title).toContain('Cinzel');
    });

    it('应包含正文字体', () => {
      expect(TYPOGRAPHY.fontFamily.body).toBeDefined();
      expect(TYPOGRAPHY.fontFamily.body).toContain('Noto Sans SC');
    });

    it('应包含艺术字体', () => {
      expect(TYPOGRAPHY.fontFamily.artistic).toBeDefined();
    });

    it('应包含等宽字体', () => {
      expect(TYPOGRAPHY.fontFamily.mono).toBeDefined();
    });
  });

  describe('字体大小', () => {
    it('应包含xs大小', () => {
      expect(TYPOGRAPHY.fontSize.xs).toBe(10);
    });

    it('应包含sm大小', () => {
      expect(TYPOGRAPHY.fontSize.sm).toBe(12);
    });

    it('应包含md大小', () => {
      expect(TYPOGRAPHY.fontSize.md).toBe(14);
    });

    it('应包含lg大小', () => {
      expect(TYPOGRAPHY.fontSize.lg).toBe(16);
    });

    it('应包含xl大小', () => {
      expect(TYPOGRAPHY.fontSize.xl).toBe(18);
    });

    it('应包含2xl大小', () => {
      expect(TYPOGRAPHY.fontSize['2xl']).toBe(20);
    });

    it('应包含3xl大小', () => {
      expect(TYPOGRAPHY.fontSize['3xl']).toBe(24);
    });

    it('应包含4xl大小', () => {
      expect(TYPOGRAPHY.fontSize['4xl']).toBe(30);
    });

    it('应包含5xl大小', () => {
      expect(TYPOGRAPHY.fontSize['5xl']).toBe(36);
    });
  });

  describe('字体粗细', () => {
    it('应包含light粗细', () => {
      expect(TYPOGRAPHY.fontWeight.light).toBe('300');
    });

    it('应包含normal粗细', () => {
      expect(TYPOGRAPHY.fontWeight.normal).toBe('400');
    });

    it('应包含medium粗细', () => {
      expect(TYPOGRAPHY.fontWeight.medium).toBe('500');
    });

    it('应包含semibold粗细', () => {
      expect(TYPOGRAPHY.fontWeight.semibold).toBe('600');
    });

    it('应包含bold粗细', () => {
      expect(TYPOGRAPHY.fontWeight.bold).toBe('700');
    });
  });

  describe('行高', () => {
    it('应包含tight行高', () => {
      expect(TYPOGRAPHY.lineHeight.tight).toBe(1.2);
    });

    it('应包含normal行高', () => {
      expect(TYPOGRAPHY.lineHeight.normal).toBe(1.5);
    });

    it('应包含relaxed行高', () => {
      expect(TYPOGRAPHY.lineHeight.relaxed).toBe(1.75);
    });

    it('应包含loose行高', () => {
      expect(TYPOGRAPHY.lineHeight.loose).toBe(2);
    });
  });

  describe('字母间距', () => {
    it('应包含tighter间距', () => {
      expect(TYPOGRAPHY.letterSpacing.tighter).toBe(-0.05);
    });

    it('应包含tight间距', () => {
      expect(TYPOGRAPHY.letterSpacing.tight).toBe(-0.025);
    });

    it('应包含normal间距', () => {
      expect(TYPOGRAPHY.letterSpacing.normal).toBe(0);
    });

    it('应包含wide间距', () => {
      expect(TYPOGRAPHY.letterSpacing.wide).toBe(0.025);
    });

    it('应包含wider间距', () => {
      expect(TYPOGRAPHY.letterSpacing.wider).toBe(0.05);
    });
  });

  describe('预定义样式', () => {
    it('应包含h1样式', () => {
      expect(TYPOGRAPHY.styles.h1).toBeDefined();
      expect(TYPOGRAPHY.styles.h1.fontSize).toBe(36);
      expect(TYPOGRAPHY.styles.h1.fontWeight).toBe('700');
    });

    it('应包含h2样式', () => {
      expect(TYPOGRAPHY.styles.h2).toBeDefined();
      expect(TYPOGRAPHY.styles.h2.fontSize).toBe(30);
    });

    it('应包含h3样式', () => {
      expect(TYPOGRAPHY.styles.h3).toBeDefined();
      expect(TYPOGRAPHY.styles.h3.fontSize).toBe(24);
    });

    it('应包含body样式', () => {
      expect(TYPOGRAPHY.styles.body).toBeDefined();
      expect(TYPOGRAPHY.styles.body.fontSize).toBe(14);
    });

    it('应包含caption样式', () => {
      expect(TYPOGRAPHY.styles.caption).toBeDefined();
      expect(TYPOGRAPHY.styles.caption.fontSize).toBe(12);
    });

    it('应包含cardTitle样式', () => {
      expect(TYPOGRAPHY.styles.cardTitle).toBeDefined();
      expect(TYPOGRAPHY.styles.cardTitle.fontFamily).toContain('Cinzel');
    });
  });
});
