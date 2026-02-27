/**
 * ThemeContext 测试
 * 测试主题上下文的所有功能
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme, ThemeContext } from '../ThemeContext';
import { storage } from '../../utils/storage';

// Mock storage
jest.mock('../../utils/storage', () => ({
  storage: {
    getTheme: jest.fn(),
    setTheme: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// 测试组件
const TestComponent = () => {
  const {
    themeId,
    theme,
    themes,
    card2DStyle,
    card2DStyles,
    changeCard2DStyle,
    card3DStyle,
    card3DStyles,
    changeCard3DStyle,
    particleEffect,
    particleEffects,
    changeParticleEffect,
    weatherEffect,
    weatherEffects,
    changeWeatherEffect,
  } = useTheme();

  return (
    <View>
      <Text testID="theme-id">{themeId}</Text>
      <Text testID="theme-name">{theme.name}</Text>
      <Text testID="themes-count">{themes.length}</Text>
      <Text testID="card2d-id">{card2DStyle.id}</Text>
      <Text testID="card3d-id">{card3DStyle.id}</Text>
      <Text testID="particle-id">{particleEffect.id}</Text>
      <Text testID="weather-id">{weatherEffect.id}</Text>
      <TouchableOpacity onPress={() => changeCard2DStyle('neonCyber')}>
        <Text>Change Card2D</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeCard3DStyle('stack')}>
        <Text>Change Card3D</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeParticleEffect('fireworks')}>
        <Text>Change Particle</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeWeatherEffect('rainy')}>
        <Text>Change Weather</Text>
      </TouchableOpacity>
    </View>
  );
};

const renderWithProvider = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getTheme.mockResolvedValue(null);
    storage.get.mockResolvedValue(null);
  });

  describe('初始状态', () => {
    it('应该使用默认主题初始化', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('theme-id').props.children).toBe('default');
        });
      });

      it('应该加载所有可用主题', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          const count = parseInt(screen.getByTestId('themes-count').props.children);
          expect(count).toBeGreaterThanOrEqual(3);
        });
      });

      it('应该使用默认卡片样式初始化', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('card2d-id').props.children).toBe('classicFlat');
          expect(screen.getByTestId('card3d-id').props.children).toBe('realFlip');
        });
      });

      it('应该使用默认特效初始化', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('particle-id').props.children).toBeTruthy();
          expect(screen.getByTestId('weather-id').props.children).toBeTruthy();
        });
      });
    });

    describe('卡片样式切换', () => {
      it('应该切换2D卡片样式', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('card2d-id').props.children).toBe('classicFlat');
        });

        fireEvent.press(screen.getByText('Change Card2D'));

        await waitFor(() => {
          expect(screen.getByTestId('card2d-id').props.children).toBe('neonCyber');
        });
      });

      it('应该切换3D卡片样式', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('card3d-id').props.children).toBe('realFlip');
        });

        fireEvent.press(screen.getByText('Change Card3D'));

        await waitFor(() => {
          expect(screen.getByTestId('card3d-id').props.children).toBe('stack');
        });
      });
    });

    describe('特效切换', () => {
      it('应该切换粒子特效', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('particle-id').props.children).toBeTruthy();
        });

        fireEvent.press(screen.getByText('Change Particle'));

        await waitFor(() => {
          expect(screen.getByTestId('particle-id').props.children).toBe('fireworks');
        });
      });

      it('应该切换天气特效', async () => {
        renderWithProvider(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('weather-id').props.children).toBeTruthy();
        });

        fireEvent.press(screen.getByText('Change Weather'));

        await waitFor(() => {
          expect(screen.getByTestId('weather-id').props.children).toBe('rainy');
        });
      });
    });

    describe('错误处理', () => {
      it('应该在useTheme在Provider外使用时抛出错误', () => {
        const InvalidComponent = () => {
          useTheme();
          return null;
        };

        // 应该抛出错误
        expect(() => render(<InvalidComponent />)).toThrow();
      });
    });
  });
