/**
 * helpers 工具函数单元测试
 */

import {
  formatDate,
  truncateText,
  formatTime,
  getRoleLabel,
  getPlotNameDisplay,
  escapeRegex,
  highlightKeywords,
  generateId,
} from '../helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
      expect(result).toContain('1');
    });

    it('应该处理不同的日期格式', () => {
      const result = formatDate('2024-12-25T00:00:00.000Z');
      expect(result).toBeTruthy();
    });
  });

  describe('truncateText', () => {
    it('应该截断长文本', () => {
      const longText = '这是一段很长的文本，需要被截断显示';
      const result = truncateText(longText, 10);
      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('不应该截断短文本', () => {
      const shortText = '短文本';
      const result = truncateText(shortText, 50);
      expect(result).toBe('短文本');
    });

    it('应该处理空文本', () => {
      const result = truncateText('', 50);
      expect(result).toBe('');
    });

    it('应该处理null', () => {
      const result = truncateText(null, 50);
      expect(result).toBe('');
    });

    it('应该处理undefined', () => {
      const result = truncateText(undefined, 50);
      expect(result).toBe('');
    });

    it('应该使用默认长度50', () => {
      const text = 'a'.repeat(60);
      const result = truncateText(text);
      expect(result).toContain('...');
    });
  });

  describe('formatTime', () => {
    it('应该格式化分钟', () => {
      const result = formatTime(45);
      expect(result).toBe('45分钟');
    });

    it('应该格式化为小时和分钟', () => {
      const result = formatTime(125);
      expect(result).toBe('2小时5分钟');
    });

    it('应该处理0分钟', () => {
      const result = formatTime(0);
      expect(result).toBe('0分钟');
    });

    it('应该处理整小时', () => {
      const result = formatTime(120);
      expect(result).toBe('2小时0分钟');
    });
  });

  describe('getRoleLabel', () => {
    it('应该返回主角标签', () => {
      const result = getRoleLabel('protagonist');
      expect(result).toBe('⭐ 主角');
    });

    it('应该返回配角标签', () => {
      const result = getRoleLabel('supporting');
      expect(result).toBe('🎭 配角');
    });

    it('应该返回反派标签', () => {
      const result = getRoleLabel('antagonist');
      expect(result).toBe('👿 反派');
    });

    it('应该返回路人标签', () => {
      const result = getRoleLabel('bystander');
      expect(result).toBe('🚶 路人');
    });

    it('应该返回默认标签', () => {
      const result = getRoleLabel('unknown');
      expect(result).toBe('🎭 配角');
    });
  });

  describe('getPlotNameDisplay', () => {
    it('应该返回天气名称', () => {
      expect(getPlotNameDisplay('weather', 'sunny')).toBe('晴天');
      expect(getPlotNameDisplay('weather', 'rainy')).toBe('下雨');
      expect(getPlotNameDisplay('weather', 'snow')).toBe('下雪');
    });

    it('应该返回冒险类型名称', () => {
      expect(getPlotNameDisplay('adventureType', 'friendship')).toBe('友谊考验');
      expect(getPlotNameDisplay('adventureType', 'adventure')).toBe('冒险之旅');
    });

    it('应该返回地形名称', () => {
      expect(getPlotNameDisplay('terrain', 'forest')).toBe('森林');
      expect(getPlotNameDisplay('terrain', 'castle')).toBe('城堡');
    });

    it('应该返回装备名称', () => {
      expect(getPlotNameDisplay('equipment', 'wand')).toBe('魔法杖');
      expect(getPlotNameDisplay('equipment', 'sword')).toBe('宝剑');
    });

    it('应该返回原始ID当找不到对应名称时', () => {
      const result = getPlotNameDisplay('weather', 'unknown');
      expect(result).toBe('unknown');
    });

    it('应该返回原始ID当分类不存在时', () => {
      const result = getPlotNameDisplay('unknown', 'test');
      expect(result).toBe('test');
    });
  });

  describe('escapeRegex', () => {
    it('应该转义特殊字符', () => {
      const result = escapeRegex('.*+?^${}()|[]\\');
      expect(result).toContain('\\');
    });

    it('应该处理普通文本', () => {
      const result = escapeRegex('普通文本');
      expect(result).toBe('普通文本');
    });
  });

  describe('highlightKeywords', () => {
    it('应该高亮角色名称', () => {
      const content = '小明在森林里冒险';
      const characters = [{ custom_name: '小明', role_type: 'protagonist' }];
      const result = highlightKeywords(content, characters);
      expect(result).toContain('**小明**');
    });

    it('应该处理空内容', () => {
      const result = highlightKeywords('', []);
      expect(result).toBe('');
    });

    it('应该处理null内容', () => {
      const result = highlightKeywords(null, []);
      expect(result).toBe('');
    });

    it('应该高亮动作词', () => {
      const content = '他飞向天空';
      const result = highlightKeywords(content, []);
      expect(result).toContain('**飞向**');
    });

    it('应该高亮情感词', () => {
      const content = '他感到开心';
      const result = highlightKeywords(content, []);
      expect(result).toContain('**开心**');
    });

    it('应该高亮地点词', () => {
      const content = '在城堡里';
      const result = highlightKeywords(content, []);
      expect(result).toContain('**城堡**');
    });
  });

  describe('generateId', () => {
    it('应该生成唯一ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('应该生成字符串ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });
});
