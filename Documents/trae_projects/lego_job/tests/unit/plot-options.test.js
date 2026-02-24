import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('情节选项模块测试', () => {
  let PLOT_OPTIONS, getPlotName, getPlotOption, getRandomPlotSelection, buildPlotPrompt;

  beforeEach(async () => {
    const module = await import('../../functions/api/plot-options.js');
    PLOT_OPTIONS = module.PLOT_OPTIONS;
    getPlotName = module.getPlotName;
    getPlotOption = module.getPlotOption;
    getRandomPlotSelection = module.getRandomPlotSelection;
    buildPlotPrompt = module.buildPlotPrompt;
  });

  describe('PLOT_OPTIONS 数据结构', () => {
    it('应该包含4个维度', () => {
      expect(PLOT_OPTIONS).toHaveProperty('weather');
      expect(PLOT_OPTIONS).toHaveProperty('adventureType');
      expect(PLOT_OPTIONS).toHaveProperty('terrain');
      expect(PLOT_OPTIONS).toHaveProperty('equipment');
    });

    it('每个维度应该包含8个选项', () => {
      expect(PLOT_OPTIONS.weather).toHaveLength(8);
      expect(PLOT_OPTIONS.adventureType).toHaveLength(8);
      expect(PLOT_OPTIONS.terrain).toHaveLength(8);
      expect(PLOT_OPTIONS.equipment).toHaveLength(8);
    });

    it('每个选项应该包含 id, name, icon, description', () => {
      const checkOption = (option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('icon');
        expect(option).toHaveProperty('description');
      };

      PLOT_OPTIONS.weather.forEach(checkOption);
      PLOT_OPTIONS.adventureType.forEach(checkOption);
      PLOT_OPTIONS.terrain.forEach(checkOption);
      PLOT_OPTIONS.equipment.forEach(checkOption);
    });
  });

  describe('getPlotName 函数', () => {
    it('应该返回正确的选项名称', () => {
      expect(getPlotName('weather', 'sunny')).toBe('晴天');
      expect(getPlotName('adventureType', 'friendship')).toBe('友谊考验');
      expect(getPlotName('terrain', 'forest')).toBe('森林');
      expect(getPlotName('equipment', 'wand')).toBe('魔法杖');
    });

    it('当选项不存在时应该返回 id', () => {
      expect(getPlotName('weather', 'nonexistent')).toBe('nonexistent');
    });

    it('当类别不存在时应该返回 id', () => {
      expect(getPlotName('nonexistent', 'sunny')).toBe('sunny');
    });
  });

  describe('getPlotOption 函数', () => {
    it('应该返回完整的选项对象', () => {
      const option = getPlotOption('weather', 'sunny');
      expect(option).toEqual({
        id: 'sunny',
        name: '晴天',
        icon: '☀️',
        description: '阳光明媚，适合户外冒险'
      });
    });

    it('当选项不存在时应该返回 null', () => {
      expect(getPlotOption('weather', 'nonexistent')).toBeNull();
    });

    it('当类别不存在时应该返回 null', () => {
      expect(getPlotOption('nonexistent', 'sunny')).toBeNull();
    });
  });

  describe('getRandomPlotSelection 函数', () => {
    it('应该返回包含4个维度的对象', () => {
      const selection = getRandomPlotSelection();
      expect(selection).toHaveProperty('weather');
      expect(selection).toHaveProperty('adventureType');
      expect(selection).toHaveProperty('terrain');
      expect(selection).toHaveProperty('equipment');
    });

    it('返回的值应该是有效的选项 ID', () => {
      const selection = getRandomPlotSelection();
      const weatherIds = PLOT_OPTIONS.weather.map(o => o.id);
      const adventureTypeIds = PLOT_OPTIONS.adventureType.map(o => o.id);
      const terrainIds = PLOT_OPTIONS.terrain.map(o => o.id);
      const equipmentIds = PLOT_OPTIONS.equipment.map(o => o.id);

      expect(weatherIds).toContain(selection.weather);
      expect(adventureTypeIds).toContain(selection.adventureType);
      expect(terrainIds).toContain(selection.terrain);
      expect(equipmentIds).toContain(selection.equipment);
    });
  });

  describe('buildPlotPrompt 函数', () => {
    it('应该生成包含情节设定的提示词', () => {
      const plotSelection = {
        weather: 'sunny',
        adventureType: 'adventure',
        terrain: 'forest',
        equipment: 'wand'
      };

      const prompt = buildPlotPrompt(plotSelection);
      expect(prompt).toContain('【情节设定】');
      expect(prompt).toContain('天气');
      expect(prompt).toContain('晴天');
      expect(prompt).toContain('冒险类型');
      expect(prompt).toContain('冒险之旅');
      expect(prompt).toContain('地形');
      expect(prompt).toContain('森林');
      expect(prompt).toContain('装备');
      expect(prompt).toContain('魔法杖');
    });

    it('当 plotSelection 为 null 时应该返回空字符串', () => {
      const prompt = buildPlotPrompt(null);
      expect(prompt).toBe('');
    });

    it('当 plotSelection 为 undefined 时应该返回空字符串', () => {
      const prompt = buildPlotPrompt(undefined);
      expect(prompt).toBe('');
    });
  });
});
