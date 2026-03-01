import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
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

    it('应该渲染空槽位', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('主角')).toBeTruthy();
      expect(getByText('反派')).toBeTruthy();
      expect(getByText('地形')).toBeTruthy();
    });

    it('应该显示必选标签', () => {
      const { getAllByText } = render(<StagePreview />);
      expect(getAllByText('必选').length).toBeGreaterThan(0);
    });
  });

  describe('角色卡牌渲染', () => {
    it('应该渲染主角卡牌', () => {
      const characters = [
        { character_id: '1', name: '龙骑士', roleType: 'protagonist', avatar: '🐉' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('龙骑士')).toBeTruthy();
    });

    it('应该渲染反派卡牌', () => {
      const characters = [
        { character_id: '2', name: '暗影刺客', roleType: 'antagonist', avatar: '🦹' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('暗影刺客')).toBeTruthy();
    });

    it('应该渲染配角卡牌', () => {
      const characters = [
        { character_id: '3', name: '精灵法师', roleType: 'supporting', avatar: '🧝' },
        { character_id: '4', name: '智慧法师', roleType: 'supporting', avatar: '🧙' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('精灵法师')).toBeTruthy();
      expect(getByText('智慧法师')).toBeTruthy();
    });

    it('应该根据角色类型显示不同颜色边框', () => {
      const characters = [
        { character_id: '1', name: '主角', roleType: 'protagonist' },
        { character_id: '2', name: '反派', roleType: 'antagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('主角')).toBeTruthy();
      expect(getByText('反派')).toBeTruthy();
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
      const { getByText } = render(<StagePreview terrain="forest" />);
      expect(getByText('神秘森林')).toBeTruthy();
    });

    it('应该渲染城堡地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="castle" />);
      expect(getByText('古老城堡')).toBeTruthy();
    });

    it('应该渲染火山地形卡牌', () => {
      const { getByText } = render(<StagePreview terrain="volcano" />);
      expect(getByText('火山地带')).toBeTruthy();
    });

    it('没有地形时应该显示空槽位', () => {
      const { getByText } = render(<StagePreview terrain={null} />);
      expect(getByText('地形')).toBeTruthy();
    });
  });

  describe('天气卡牌渲染', () => {
    it('应该渲染晴天天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="sunny" />);
      expect(getByText('晴空万里')).toBeTruthy();
    });

    it('应该渲染雷雨天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="thunder" />);
      expect(getByText('雷雨交加')).toBeTruthy();
    });

    it('应该渲染暴风雪天气卡牌', () => {
      const { getByText } = render(<StagePreview weather="snow" />);
      expect(getByText('暴风雪')).toBeTruthy();
    });
  });

  describe('冒险类型卡牌渲染', () => {
    it('应该渲染探索冒险类型', () => {
      const { getByText } = render(<StagePreview adventureType="exploration" />);
      expect(getByText('探索冒险')).toBeTruthy();
    });

    it('应该渲染战斗冒险类型', () => {
      const { getByText } = render(<StagePreview adventureType="battle" />);
      expect(getByText('战斗冒险')).toBeTruthy();
    });

    it('没有冒险类型时不应该显示', () => {
      const { queryByText } = render(<StagePreview adventureType={null} />);
      expect(queryByText('冒险类型')).toBeNull();
    });
  });

  describe('道具卡牌渲染', () => {
    it('应该渲染道具卡牌', () => {
      const items = [{ name: '勇者之剑', emoji: '🗡️' }];
      const { getByText } = render(<StagePreview items={items} />);
      expect(getByText('勇者之剑')).toBeTruthy();
    });

    it('应该渲染多个道具卡牌', () => {
      const items = [
        { name: '勇者之剑', emoji: '🗡️' },
        { name: '守护之盾', emoji: '🛡️' },
      ];
      const { getByText } = render(<StagePreview items={items} />);
      expect(getByText('勇者之剑')).toBeTruthy();
      expect(getByText('守护之盾')).toBeTruthy();
    });

    it('没有道具时不应该显示道具区域', () => {
      const { queryByText } = render(<StagePreview items={[]} />);
      expect(queryByText('🎒 道具装备')).toBeNull();
    });
  });

  describe('预览文本', () => {
    it('没有选择时应该显示提示文本', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('选择卡牌来构建你的故事...')).toBeTruthy();
    });

    it('有角色时应该显示故事预览', () => {
      const characters = [
        { character_id: '1', name: '勇者', roleType: 'protagonist' },
        { character_id: '2', name: '魔王', roleType: 'antagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText(/勇者.*对抗.*魔王/)).toBeTruthy();
    });

    it('应该包含地形信息', () => {
      const characters = [
        { character_id: '1', name: '勇者', roleType: 'protagonist' },
      ];
      const { getByText } = render(
        <StagePreview characters={characters} terrain="forest" />
      );
      expect(getByText(/在神秘森林/)).toBeTruthy();
    });
  });

  describe('移除功能', () => {
    it('应该调用 onRemoveCharacter 回调', () => {
      const onRemoveCharacter = jest.fn();
      const characters = [
        { character_id: '1', name: '勇者', roleType: 'protagonist' },
      ];
      const { getByText } = render(
        <StagePreview characters={characters} onRemoveCharacter={onRemoveCharacter} />
      );
      
      fireEvent.press(getByText('×'));
      expect(onRemoveCharacter).toHaveBeenCalled();
    });

    it('应该调用 onRemoveTerrain 回调', () => {
      const onRemoveTerrain = jest.fn();
      const { getByText } = render(
        <StagePreview terrain="forest" onRemoveTerrain={onRemoveTerrain} />
      );
      
      fireEvent.press(getByText('×'));
      expect(onRemoveTerrain).toHaveBeenCalled();
    });
  });

  describe('边界情况', () => {
    it('应该处理空角色列表', () => {
      const { getByText } = render(<StagePreview characters={[]} />);
      expect(getByText('🎭 舞台预览')).toBeTruthy();
    });

    it('应该支持 characterId 属性（兼容性）', () => {
      const characters = [
        { characterId: '1', name: '角色A', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色A')).toBeTruthy();
    });

    it('应该支持 id 属性（兼容性）', () => {
      const characters = [
        { id: '1', name: '角色X', roleType: 'protagonist' },
      ];
      const { getByText } = render(<StagePreview characters={characters} />);
      expect(getByText('角色X')).toBeTruthy();
    });
  });
});
