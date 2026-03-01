import React from 'react';
import { render } from '@testing-library/react-native';
import StagePreview from '../StagePreview';

jest.mock('../WeatherEffect', () => {
  const { View } = require('react-native');
  return function MockWeatherEffect({ children }) {
    return <View testID="weather-effect">{children}</View>;
  };
});

jest.mock('../../../utils/constants', () => ({
  COLORS: {
    legoBlue: '#0066CC',
    backgroundLight: '#F5F5F5',
    text: '#333333',
  },
}));

describe('StagePreview', () => {
  describe('基本渲染', () => {
    it('应该渲染舞台预览容器', () => {
      const { getByText } = render(<StagePreview />);
      expect(getByText('🎭 舞台预览')).toBeTruthy();
    });

    it('应该渲染默认地形', () => {
      const { getAllByText } = render(<StagePreview />);
      expect(getAllByText('🌿').length).toBe(3);
    });

    it('应该渲染空角色槽位提示', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('选择角色')).toBeTruthy();
    });
  });

  describe('角色卡牌渲染', () => {
    it('应该渲染传入的角色卡牌', () => {
      const characters = [
        { character_id: '1', name: '角色1', custom_name: '自定义角色1', roleType: 'protagonist' },
        { character_id: '2', name: '角色2', custom_name: '自定义角色2', roleType: 'supporting' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('自定义角色1')).toBeTruthy();
      expect(getByText('自定义角色2')).toBeTruthy();
    });

    it('当没有custom_name时应该使用name', () => {
      const characters = [
        { character_id: '1', name: '角色1', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
    });

    it('应该支持 characterId 属性（兼容性）', () => {
      const characters = [
        { characterId: '1', name: '角色A', roleType: 'protagonist' },
        { characterId: '2', name: '角色B', roleType: 'supporting' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色A')).toBeTruthy();
      expect(getByText('角色B')).toBeTruthy();
    });

    it('应该支持 id 属性（兼容性）', () => {
      const characters = [
        { id: '1', name: '角色X', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色X')).toBeTruthy();
    });

    it('应该根据角色类型显示对应emoji', () => {
      const characters = [
        { character_id: '1', name: '主角', roleType: 'protagonist' },
        { character_id: '2', name: '配角', roleType: 'supporting' },
        { character_id: '3', name: '路人', roleType: 'bystander' },
        { character_id: '4', name: '反派', roleType: 'antagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('👑')).toBeTruthy();
      expect(getByText('🎭')).toBeTruthy();
      expect(getByText('👤')).toBeTruthy();
      expect(getByText('👿')).toBeTruthy();
    });

    it('应该支持自定义avatar', () => {
      const characters = [
        { character_id: '1', name: '龙骑士', avatar: '🐉', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('🐉')).toBeTruthy();
    });
  });

  describe('地形卡牌渲染', () => {
    it('应该渲染森林地形卡牌', () => {
      const { getByText, getAllByText } = render(<StagePreview terrain="forest" />);
      expect(getByText('森林')).toBeTruthy();
      expect(getAllByText('🌲').length).toBeGreaterThan(0);
    });

    it('应该渲染城堡地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="castle" />);
      expect(getByText('城堡')).toBeTruthy();
    });

    it('应该渲染海洋地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="ocean" />);
      expect(getByText('海洋')).toBeTruthy();
    });

    it('应该渲染沙漠地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="desert" />);
      expect(getByText('沙漠')).toBeTruthy();
    });

    it('应该渲染山脉地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="mountain" />);
      expect(getByText('山脉')).toBeTruthy();
    });

    it('应该渲染冰川地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="glacier" />);
      expect(getByText('冰川')).toBeTruthy();
    });

    it('应该渲染火山地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="volcano" />);
      expect(getByText('火山')).toBeTruthy();
    });

    it('应该渲染城市地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="city" />);
      expect(getByText('城市')).toBeTruthy();
    });

    it('没有地形时应该显示空槽位', () => {
      const { getByText } = render(<StagePreview terrain={null} />);
      expect(getByText('地形')).toBeTruthy();
    });
  });

  describe('天气卡牌渲染', () => {
    it('应该渲染晴天天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="sunny" />);
      expect(getByText('晴天')).toBeTruthy();
    });

    it('应该渲染雨天天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="rainy" />);
      expect(getByText('雨天')).toBeTruthy();
    });

    it('应该渲染雷雨天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="thunder" />);
      expect(getByText('雷雨')).toBeTruthy();
    });

    it('应该渲染雪天天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="snow" />);
      expect(getByText('雪天')).toBeTruthy();
    });

    it('应该渲染雾天天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="foggy" />);
      expect(getByText('雾天')).toBeTruthy();
    });
  });

  describe('预览文本', () => {
    it('没有角色时应该显示提示文本', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('选择卡牌来构建你的故事...')).toBeTruthy();
    });

    it('有角色时应该显示故事预览', () => {
      const characters = [
        { character_id: '1', name: '勇者', roleType: 'protagonist' },
        { character_id: '2', name: '法师', roleType: 'supporting' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText(/勇者、法师的故事即将开始/)).toBeTruthy();
    });
  });

  describe('边界情况', () => {
    it('应该处理空角色列表', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('🎭 舞台预览')).toBeTruthy();
    });

    it('应该处理超过5个角色', () => {
      const characters = [
        { character_id: '1', name: '角色1', roleType: 'protagonist' },
        { character_id: '2', name: '角色2', roleType: 'supporting' },
        { character_id: '3', name: '角色3', roleType: 'supporting' },
        { character_id: '4', name: '角色4', roleType: 'bystander' },
        { character_id: '5', name: '角色5', roleType: 'bystander' },
        { character_id: '6', name: '角色6', roleType: 'antagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
      expect(getByText('角色6')).toBeTruthy();
    });

    it('应该处理未知地形', () => {
      const { getAllByText } = render(<StagePreview terrain="unknown" />);
      expect(getAllByText('🌿').length).toBeGreaterThan(0);
    });
  });

  describe('角色可见性验证', () => {
    it('角色卡牌应该在舞台中渲染', () => {
      const characters = [
        { character_id: '1', name: '主角', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      const characterName = getByText('主角');
      expect(characterName).toBeTruthy();
    });

    it('角色和地形卡牌应该同时显示', () => {
      const characters = [
        { character_id: '1', name: '勇者', roleType: 'protagonist' },
      ];
      const { getByText, getAllByText } = render(
        <StagePreview characters={characters} terrain="forest" />
      );
      expect(getByText('勇者')).toBeTruthy();
      expect(getAllByText('🌲').length).toBeGreaterThan(0);
    });

    it('多个角色卡牌应该同时显示', () => {
      const characters = [
        { character_id: '1', name: '战士', roleType: 'protagonist' },
        { character_id: '2', name: '法师', roleType: 'supporting' },
        { character_id: '3', name: '盗贼', roleType: 'supporting' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('盗贼')).toBeTruthy();
    });
  });
});
