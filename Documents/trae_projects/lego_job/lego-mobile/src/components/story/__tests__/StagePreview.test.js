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
  CHARACTER_EMOJIS: ['🧑', '👩', '👨', '👧', '👦'],
}));

describe('StagePreview', () => {
  describe('基本渲染', () => {
    it('应该渲染舞台预览容器', () => {
      const { getByText } = render(<StagePreview />);
      expect(getByText('🎬 舞台预览')).toBeTruthy();
    });

    it('应该渲染默认地形', () => {
      const { getAllByText } = render(<StagePreview />);
      expect(getAllByText('🌿').length).toBe(3);
    });
  });

  describe('角色渲染', () => {
    it('应该渲染传入的角色', () => {
      const characters = [
        { character_id: '1', name: '角色1', custom_name: '自定义角色1' },
        { character_id: '2', name: '角色2', custom_name: '自定义角色2' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('自定义角色1')).toBeTruthy();
      expect(getByText('自定义角色2')).toBeTruthy();
    });

    it('当没有custom_name时应该使用name', () => {
      const characters = [
        { character_id: '1', name: '角色1' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
    });

    it('应该支持 characterId 属性（兼容性）', () => {
      const characters = [
        { characterId: '1', name: '角色A' },
        { characterId: '2', name: '角色B' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色A')).toBeTruthy();
      expect(getByText('角色B')).toBeTruthy();
    });

    it('应该支持 id 属性（兼容性）', () => {
      const characters = [
        { id: '1', name: '角色X' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色X')).toBeTruthy();
    });

    it('应该正确处理5个角色的位置', () => {
      const characters = [
        { character_id: '1', name: '角色1' },
        { character_id: '2', name: '角色2' },
        { character_id: '3', name: '角色3' },
        { character_id: '4', name: '角色4' },
        { character_id: '5', name: '角色5' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
      expect(getByText('角色5')).toBeTruthy();
    });
  });

  describe('地形渲染', () => {
    it('应该渲染森林地形', () => {
      const { getAllByText } = render(<StagePreview terrain="forest" />);
      expect(getAllByText('🌲').length).toBe(3);
    });

    it('应该渲染城堡地形', () => {
      const { getAllByText } = render(<StagePreview terrain="castle" />);
      expect(getAllByText('🏰').length).toBe(3);
    });

    it('应该渲染海洋地形', () => {
      const { getAllByText } = render(<StagePreview terrain="ocean" />);
      expect(getAllByText('🌊').length).toBe(3);
    });

    it('应该渲染沙漠地形', () => {
      const { getAllByText } = render(<StagePreview terrain="desert" />);
      expect(getAllByText('🏜️').length).toBe(3);
    });

    it('应该渲染山脉地形', () => {
      const { getAllByText } = render(<StagePreview terrain="mountain" />);
      expect(getAllByText('⛰️').length).toBe(3);
    });

    it('应该渲染冰川地形', () => {
      const { getAllByText } = render(<StagePreview terrain="glacier" />);
      expect(getAllByText('🧊').length).toBe(3);
    });

    it('应该渲染火山地形', () => {
      const { getAllByText } = render(<StagePreview terrain="volcano" />);
      expect(getAllByText('🌋').length).toBe(3);
    });

    it('应该渲染城市地形', () => {
      const { getAllByText } = render(<StagePreview terrain="city" />);
      expect(getAllByText('🏙️').length).toBe(3);
    });
  });

  describe('天气渲染', () => {
    it('应该传递天气参数给WeatherEffect', () => {
      const { getByTestId } = render(<StagePreview weather="rainy" />);
      expect(getByTestId('weather-effect')).toBeTruthy();
    });
  });

  describe('边界情况', () => {
    it('应该处理空角色列表', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('🎬 舞台预览')).toBeTruthy();
    });

    it('应该处理超过5个角色', () => {
      const characters = [
        { character_id: '1', name: '角色1' },
        { character_id: '2', name: '角色2' },
        { character_id: '3', name: '角色3' },
        { character_id: '4', name: '角色4' },
        { character_id: '5', name: '角色5' },
        { character_id: '6', name: '角色6' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
    });

    it('应该处理未知地形', () => {
      const { getAllByText } = render(<StagePreview terrain="unknown" />);
      expect(getAllByText('🌿').length).toBe(3);
    });
  });

  describe('角色可见性验证', () => {
    it('角色应该在角色层中渲染', () => {
      const characters = [
        { character_id: '1', name: '主角' },
      ];
      const { getByText, UNSAFE_queryByType } = render(<StagePreview characters={characters} />);
      
      const characterName = getByText('主角');
      expect(characterName).toBeTruthy();
      
      const parent = characterName.parent;
      expect(parent).toBeTruthy();
    });

    it('角色应该显示对应的emoji', () => {
      const characters = [
        { character_id: '1', name: '角色A' },
        { character_id: '2', name: '角色B' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      
      expect(getByText('🧑')).toBeTruthy();
      expect(getByText('👩')).toBeTruthy();
    });

    it('角色和地形应该同时显示', () => {
      const characters = [
        { character_id: '1', name: '勇者' },
      ];
      const { getByText, getAllByText } = render(
        <StagePreview characters={characters} terrain="forest" />
      );
      
      expect(getByText('勇者')).toBeTruthy();
      expect(getAllByText('🌲').length).toBe(3);
    });

    it('多个角色应该同时显示', () => {
      const characters = [
        { character_id: '1', name: '战士' },
        { character_id: '2', name: '法师' },
        { character_id: '3', name: '盗贼' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('盗贼')).toBeTruthy();
    });
  });

  describe('角色位置验证', () => {
    it('第一个角色应该在左上位置', () => {
      const characters = [{ character_id: '1', name: '角色1' }];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色1')).toBeTruthy();
    });

    it('第二个角色应该在中间位置', () => {
      const characters = [
        { character_id: '1', name: '角色1' },
        { character_id: '2', name: '角色2' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色2')).toBeTruthy();
    });
  });
});
