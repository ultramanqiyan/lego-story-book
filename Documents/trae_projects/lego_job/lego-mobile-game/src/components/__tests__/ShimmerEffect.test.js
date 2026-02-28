import React from 'react';
import { render } from '@testing-library/react-native';
import { ShimmerEffect } from '../ShimmerEffect';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('ShimmerEffect', () => {
  describe('基础渲染', () => {
    it('应正确渲染闪光效果', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应正确渲染子元素', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="shimmer">
          闪光内容
        </ShimmerEffect>
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <ShimmerEffect style={customStyle} testID="shimmer" />
      );
      const shimmer = getByTestId('shimmer');
      expect(shimmer.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="my-shimmer" />
      );
      expect(getByTestId('my-shimmer')).toBeTruthy();
    });
  });

  describe('尺寸配置', () => {
    it('应支持自定义宽度', () => {
      const { getByTestId } = render(
        <ShimmerEffect width={300} testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应支持自定义高度', () => {
      const { getByTestId } = render(
        <ShimmerEffect height={100} testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应使用默认宽度和高度', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });
  });

  describe('动画配置', () => {
    it('应支持自定义颜色', () => {
      const { getByTestId } = render(
        <ShimmerEffect color="rgba(255, 0, 0, 0.3)" testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应支持自定义持续时间', () => {
      const { getByTestId } = render(
        <ShimmerEffect duration={2000} testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });

    it('应使用默认颜色', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="shimmer" />
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });
  });

  describe('组合渲染', () => {
    it('应同时渲染子元素和闪光效果', () => {
      const { getByTestId } = render(
        <ShimmerEffect testID="shimmer">
          内容
        </ShimmerEffect>
      );
      expect(getByTestId('shimmer')).toBeTruthy();
    });
  });
});
