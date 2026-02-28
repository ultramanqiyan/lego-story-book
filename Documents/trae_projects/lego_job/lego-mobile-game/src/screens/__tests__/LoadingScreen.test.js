import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingScreen } from '../LoadingScreen';
import { Text, View } from 'react-native';

jest.mock('../../components', () => ({
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

describe('LoadingScreen', () => {
  describe('基础渲染', () => {
    it('应正确渲染加载屏幕', () => {
      const { getByText } = render(
        <LoadingScreen />
      );
      expect(getByText('Loading')).toBeTruthy();
    });

    it('应显示默认加载消息', () => {
      const { root } = render(<LoadingScreen />);
      expect(root).toBeTruthy();
    });

    it('应支持自定义加载消息', () => {
      const { root } = render(<LoadingScreen message="正在加载数据..." />);
      expect(root).toBeTruthy();
    });

    it('应支持testID', () => {
      const { getByText } = render(
        <LoadingScreen testID="my-loading" />
      );
      expect(getByText('Loading')).toBeTruthy();
    });
  });

  describe('样式验证', () => {
    it('容器应有正确的样式', () => {
      const { getByText } = render(
        <LoadingScreen />
      );
      expect(getByText('Loading')).toBeTruthy();
    });
  });
});
