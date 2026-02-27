/**
 * typography.js 单元测试
 */

import commonStyles from '../typography';

describe('commonStyles', () => {
  it('应该导出commonStyles对象', () => {
    expect(commonStyles).toBeDefined();
    expect(typeof commonStyles).toBe('object');
  });

  describe('布局样式', () => {
    it('应该包含container样式', () => {
      expect(commonStyles.container).toBeDefined();
    });

    it('应该包含center样式', () => {
      expect(commonStyles.center).toBeDefined();
    });

    it('应该包含row样式', () => {
      expect(commonStyles.row).toBeDefined();
    });

    it('应该包含rowCenter样式', () => {
      expect(commonStyles.rowCenter).toBeDefined();
    });

    it('应该包含rowBetween样式', () => {
      expect(commonStyles.rowBetween).toBeDefined();
    });
  });

  describe('padding样式', () => {
    it('应该包含p16样式', () => {
      expect(commonStyles.p16).toBeDefined();
    });

    it('应该包含px16样式', () => {
      expect(commonStyles.px16).toBeDefined();
    });

    it('应该包含py16样式', () => {
      expect(commonStyles.py16).toBeDefined();
    });
  });

  describe('margin样式', () => {
    it('应该包含m16样式', () => {
      expect(commonStyles.m16).toBeDefined();
    });

    it('应该包含mb16样式', () => {
      expect(commonStyles.mb16).toBeDefined();
    });

    it('应该包含mt16样式', () => {
      expect(commonStyles.mt16).toBeDefined();
    });
  });

  describe('圆角样式', () => {
    it('应该包含rounded样式', () => {
      expect(commonStyles.rounded).toBeDefined();
    });

    it('应该包含roundedMd样式', () => {
      expect(commonStyles.roundedMd).toBeDefined();
    });

    it('应该包含roundedFull样式', () => {
      expect(commonStyles.roundedFull).toBeDefined();
    });
  });

  describe('阴影样式', () => {
    it('应该包含shadow样式', () => {
      expect(commonStyles.shadow).toBeDefined();
    });

    it('应该包含shadowMd样式', () => {
      expect(commonStyles.shadowMd).toBeDefined();
    });

    it('应该包含shadowLg样式', () => {
      expect(commonStyles.shadowLg).toBeDefined();
    });
  });

  describe('文本样式', () => {
    it('应该包含textCenter样式', () => {
      expect(commonStyles.textCenter).toBeDefined();
    });

    it('应该包含fontBold样式', () => {
      expect(commonStyles.fontBold).toBeDefined();
    });

    it('应该包含textLg样式', () => {
      expect(commonStyles.textLg).toBeDefined();
    });
  });
});
