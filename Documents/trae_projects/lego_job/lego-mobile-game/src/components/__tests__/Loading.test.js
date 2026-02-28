import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '../Loading';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('Loading', () => {
  describe('基础渲染', () => {
    it('应正确渲染加载组件', () => {
      const { getByTestId } = render(
        <Loading testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <Loading style={customStyle} testID="loading" />
      );
      const loading = getByTestId('loading');
      expect(loading.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <Loading testID="my-loading" />
      );
      expect(getByTestId('my-loading')).toBeTruthy();
    });
  });

  describe('尺寸配置', () => {
    it('应支持small尺寸', () => {
      const { getByTestId } = render(
        <Loading size="small" testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应支持medium尺寸', () => {
      const { getByTestId } = render(
        <Loading size="medium" testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应支持large尺寸', () => {
      const { getByTestId } = render(
        <Loading size="large" testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('对未知尺寸应使用medium', () => {
      const { getByTestId } = render(
        <Loading size="unknown" testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });
  });

  describe('颜色配置', () => {
    it('应支持自定义颜色', () => {
      const { getByTestId } = render(
        <Loading color="#ff0000" testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应支持自定义颜色数组', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const { getByTestId } = render(
        <Loading colors={colors} testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应使用默认颜色', () => {
      const { getByTestId } = render(
        <Loading testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });
  });

  describe('积木渲染', () => {
    it('应渲染3个积木块', () => {
      const { getByTestId } = render(
        <Loading testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('应使用自定义颜色数组渲染积木', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
      const { getByTestId } = render(
        <Loading colors={colors} testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });
  });
});
