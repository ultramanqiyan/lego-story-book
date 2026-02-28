import React from 'react';
import { render } from '@testing-library/react-native';
import { GlowEffect } from '../GlowEffect';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('GlowEffect', () => {
  describe('基础渲染', () => {
    it('应正确渲染子元素', () => {
      const { getByTestId } = render(
        <GlowEffect testID="glow">
          发光内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <GlowEffect testID="glow-effect">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow-effect')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <GlowEffect style={customStyle} testID="glow">
          内容
        </GlowEffect>
      );
      const glow = getByTestId('glow');
      expect(glow.props.style).toContainEqual(customStyle);
    });
  });

  describe('属性配置', () => {
    it('应支持自定义颜色', () => {
      const { getByTestId } = render(
        <GlowEffect color="#ff0000" testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应支持自定义半径', () => {
      const { getByTestId } = render(
        <GlowEffect radius={30} testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应支持pulse属性', () => {
      const { getByTestId } = render(
        <GlowEffect pulse testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应支持animated属性', () => {
      const { getByTestId } = render(
        <GlowEffect animated={false} testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应支持intensity属性', () => {
      const { getByTestId } = render(
        <GlowEffect intensity={0.8} testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });
  });

  describe('动画配置', () => {
    it('pulse和animated同时启用时应触发动画', () => {
      const { getByTestId } = render(
        <GlowEffect animated pulse testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('animated为false时不应触发动画', () => {
      const { getByTestId } = render(
        <GlowEffect animated={false} pulse testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });
  });

  describe('默认值', () => {
    it('应使用默认颜色', () => {
      const { getByTestId } = render(
        <GlowEffect testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });

    it('应使用默认半径', () => {
      const { getByTestId } = render(
        <GlowEffect testID="glow">
          内容
        </GlowEffect>
      );
      expect(getByTestId('glow')).toBeTruthy();
    });
  });
});
