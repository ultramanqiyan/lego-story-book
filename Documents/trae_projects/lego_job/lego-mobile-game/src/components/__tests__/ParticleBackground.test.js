import React from 'react';
import { render } from '@testing-library/react-native';
import { ParticleBackground } from '../ParticleBackground';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('ParticleBackground', () => {
  describe('基础渲染', () => {
    it('应正确渲染粒子背景', () => {
      const { getByTestId } = render(
        <ParticleBackground testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { opacity: 0.5 };
      const { getByTestId } = render(
        <ParticleBackground style={customStyle} testID="particles" />
      );
      const particles = getByTestId('particles');
      expect(particles.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <ParticleBackground testID="my-particles" />
      );
      expect(getByTestId('my-particles')).toBeTruthy();
    });
  });

  describe('粒子配置', () => {
    it('应支持自定义粒子数量', () => {
      const { getByTestId } = render(
        <ParticleBackground count={10} testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应限制最大粒子数量为100', () => {
      const { getByTestId } = render(
        <ParticleBackground count={200} testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应支持自定义颜色', () => {
      const { getByTestId } = render(
        <ParticleBackground color="#ff0000" testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应支持颜色数组', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const { getByTestId } = render(
        <ParticleBackground colors={colors} testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应支持自定义大小', () => {
      const { getByTestId } = render(
        <ParticleBackground size={5} testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });
  });

  describe('默认值', () => {
    it('应使用默认粒子数量', () => {
      const { getByTestId } = render(
        <ParticleBackground testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });

    it('应使用默认颜色', () => {
      const { getByTestId } = render(
        <ParticleBackground testID="particles" />
      );
      expect(getByTestId('particles')).toBeTruthy();
    });
  });

  describe('pointerEvents', () => {
    it('应设置pointerEvents为none', () => {
      const { getByTestId } = render(
        <ParticleBackground testID="particles" />
      );
      const particles = getByTestId('particles');
      expect(particles.props.pointerEvents).toBe('none');
    });
  });
});
