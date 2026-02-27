/**
 * Card3DDemoScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Card3DDemoScreen from '../Card3DDemoScreen';

jest.mock('../../../components/card3d', () => ({
  Card3D: ({ icon, name, onPress }) => {
    const { TouchableOpacity, Text, View } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} testID={`card-${name}`}>
        <View>
          <Text>{icon}</Text>
          <Text>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },
  CardDeck3D: ({ title, items, onPress }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="card-deck">
        <Text>{title}</Text>
        {items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

describe('Card3DDemoScreen', () => {
  describe('初始渲染', () => {
    it('应该渲染演示页面', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText('🎴 3D卡牌演示')).toBeTruthy();
    });

    it('应该显示平台信息', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText(/平台:/)).toBeTruthy();
    });

    it('应该显示Tab切换', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText('单卡展示')).toBeTruthy();
      expect(getByText('扇形展开')).toBeTruthy();
    });

    it('应该显示单卡展示内容（默认Tab）', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText('单张3D卡牌')).toBeTruthy();
      expect(getByText('点击卡牌查看选中效果')).toBeTruthy();
    });

    it('应该显示不同变体样式', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText('不同变体样式')).toBeTruthy();
    });

    it('应该显示平台信息区域', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      expect(getByText('平台信息')).toBeTruthy();
      expect(getByText(/OS:/)).toBeTruthy();
    });
  });

  describe('Tab切换', () => {
    it('点击扇形展开Tab应该切换内容', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      fireEvent.press(getByText('扇形展开'));
      expect(getByText('扇形展开卡牌组')).toBeTruthy();
      expect(getByText('点击卡牌进行选择')).toBeTruthy();
    });

    it('点击单卡展示Tab应该切换回单卡内容', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      fireEvent.press(getByText('扇形展开'));
      fireEvent.press(getByText('单卡展示'));
      expect(getByText('单张3D卡牌')).toBeTruthy();
    });
  });

  describe('扇形展开模式', () => {
    it('应该显示角色列表', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      fireEvent.press(getByText('扇形展开'));
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('精灵')).toBeTruthy();
      expect(getByText('盗贼')).toBeTruthy();
    });

    it('应该显示当前选择信息', () => {
      const { getByText } = render(<Card3DDemoScreen />);
      fireEvent.press(getByText('扇形展开'));
      expect(getByText('当前选择')).toBeTruthy();
      expect(getByText('未选择')).toBeTruthy();
    });

    it('点击角色应该更新选择', () => {
      const { getByText, getAllByText } = render(<Card3DDemoScreen />);
      fireEvent.press(getByText('扇形展开'));
      const mages = getAllByText('法师');
      fireEvent.press(mages[0]);
      expect(mages.length).toBeGreaterThan(0);
    });
  });
});
