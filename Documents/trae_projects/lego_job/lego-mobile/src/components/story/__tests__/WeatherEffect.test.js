import React from 'react';
import { render } from '@testing-library/react-native';
import WeatherEffect from '../WeatherEffect';

jest.mock('../../../utils/constants', () => ({
  COLORS: {
    legoYellow: '#FFD700',
  },
}));

describe('WeatherEffect', () => {
  describe('基本渲染', () => {
    it('当weather为null时应该返回null', () => {
      const { toJSON } = render(<WeatherEffect weather={null} />);
      expect(toJSON()).toBeNull();
    });

    it('当weather为undefined时应该返回null', () => {
      const { toJSON } = render(<WeatherEffect weather={undefined} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe('晴天效果', () => {
    it('应该渲染晴天效果', () => {
      const { root } = render(<WeatherEffect weather="sunny" />);
      expect(root).toBeTruthy();
    });
  });

  describe('雨天效果', () => {
    it('应该渲染雨天效果', () => {
      const { root } = render(<WeatherEffect weather="rainy" />);
      expect(root).toBeTruthy();
    });
  });

  describe('雷暴效果', () => {
    it('应该渲染雷暴效果', () => {
      const { root } = render(<WeatherEffect weather="thunder" />);
      expect(root).toBeTruthy();
    });
  });

  describe('雪天效果', () => {
    it('应该渲染雪天效果', () => {
      const { root } = render(<WeatherEffect weather="snow" />);
      expect(root).toBeTruthy();
    });
  });

  describe('未知天气', () => {
    it('应该返回null当天气类型未知', () => {
      const { toJSON } = render(<WeatherEffect weather="unknown" />);
      expect(toJSON()).toBeNull();
    });
  });
});
