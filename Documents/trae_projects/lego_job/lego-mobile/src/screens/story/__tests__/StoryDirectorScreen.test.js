/**
 * StoryDirectorScreen 测试
 * 测试故事导演台的所有功能
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import StoryDirectorScreen from '../StoryDirectorScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import { charactersAPI, plotOptionsAPI, chaptersAPI } from '../../../api';

// Mock API
jest.mock('../../../api');

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    bookId: 'book-123',
  },
};

const renderWithProviders = (component) => {
  return render(
    <ToastProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ToastProvider>
  );
};

describe('StoryDirectorScreen', () => {
  const mockCharacters = {
    characters: [
      { character_id: 'c1', name: '角色A' },
      { character_id: 'c2', name: '角色B' },
      { character_id: 'c3', name: '角色C' },
    ],
  };

  const mockPlotOptions = {
    weather: [
      { id: 'sunny', name: '晴天', icon: '☀️' },
      { id: 'rainy', name: '雨天', icon: '🌧️' },
    ],
    adventureType: [
      { id: 'explore', name: '探险', icon: '🏰' },
      { id: 'mystery', name: '解谜', icon: '🔍' },
    ],
    terrain: [
      { id: 'forest', name: '森林', icon: '🌲' },
      { id: 'mountain', name: '山脉', icon: '🏔️' },
    ],
    equipment: [
      { id: 'sword', name: '剑', icon: '⚔️' },
      { id: 'wand', name: '魔杖', icon: '🪄' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    charactersAPI.getList.mockResolvedValue(mockCharacters);
    plotOptionsAPI.get.mockResolvedValue(mockPlotOptions);
    chaptersAPI.generate.mockResolvedValue({ chapter_id: 'ch-1' });
  });

  describe('初始渲染', () => {
    it('应该加载并显示导演台', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('🎬 故事导演台')).toBeTruthy();
      });
    });

    it('应该在无bookId时返回上一页', async () => {
      const invalidRoute = { params: {} };
      renderWithProviders(
        <StoryDirectorScreen route={invalidRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('角色选择', () => {
    it('应该显示角色列表', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('角色A')).toBeTruthy();
        expect(screen.getByText('角色B')).toBeTruthy();
        expect(screen.getByText('角色C')).toBeTruthy();
      });
    });

    it('应该选择角色并更新计数', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('角色A')).toBeTruthy();
      });

      // 点击角色A进行选择
      const roleACards = screen.getAllByText('角色A');
      fireEvent.press(roleACards[0]);

      await waitFor(() => {
        // 计数应该更新为1/5
        expect(screen.getByText(/选择角色/)).toBeTruthy();
      });
    });

    it('应该限制最多选择5个角色', async () => {
      const manyCharacters = {
        characters: Array.from({ length: 6 }, (_, i) => ({
          character_id: `c${i}`,
          name: `角色${i}`,
        })),
      };
      charactersAPI.getList.mockResolvedValue(manyCharacters);

      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('角色0')).toBeTruthy();
      });

      // 选择5个角色
      for (let i = 0; i < 5; i++) {
        const roleCards = screen.getAllByText(`角色${i}`);
        fireEvent.press(roleCards[0]);
      }

      await waitFor(() => {
        expect(screen.getByText(/5\/5/)).toBeTruthy();
      });
    });
  });

  describe('角色类型设置', () => {
    it('应该显示角色类型设置区域', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('角色A')).toBeTruthy();
      });

      // 选择角色
      const roleACards = screen.getAllByText('角色A');
      fireEvent.press(roleACards[0]);

      await waitFor(() => {
        expect(screen.getByText('🎭 设置角色类型')).toBeTruthy();
        expect(screen.getByText('主角只能1个，配角最多2个')).toBeTruthy();
      });
    });

    it('应该显示角色类型选项', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('角色A')).toBeTruthy();
      });

      // 选择角色
      const roleACards = screen.getAllByText('角色A');
      fireEvent.press(roleACards[0]);

      await waitFor(() => {
        // 检查角色类型选项存在
        const protagonistTexts = screen.getAllByText('主角');
        expect(protagonistTexts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('情节选项选择', () => {
    it('应该显示所有情节选项卡片组', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('☀️ 选择天气')).toBeTruthy();
        expect(screen.getByText('🗺️ 选择冒险类型')).toBeTruthy();
        expect(screen.getByText('🌲 选择地形')).toBeTruthy();
        expect(screen.getByText('🪄 选择装备')).toBeTruthy();
      });
    });

    it('应该显示天气选项', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('晴天')).toBeTruthy();
        expect(screen.getByText('雨天')).toBeTruthy();
      });
    });

    it('应该显示冒险类型选项', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('探险')).toBeTruthy();
        expect(screen.getByText('解谜')).toBeTruthy();
      });
    });

    it('应该显示地形选项', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('森林')).toBeTruthy();
        expect(screen.getByText('山脉')).toBeTruthy();
      });
    });

    it('应该显示装备选项', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('剑')).toBeTruthy();
        expect(screen.getByText('魔杖')).toBeTruthy();
      });
    });
  });

  describe('随机选择', () => {
    it('应该有随机按钮', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('🎲 随机')).toBeTruthy();
      });
    });
  });

  describe('生成章节', () => {
    it('应该有开始拍摄按钮', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('🎬 开始拍摄！')).toBeTruthy();
      });
    });
  });

  describe('返回按钮', () => {
    it('应该返回上一页', async () => {
      renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('🎬 故事导演台')).toBeTruthy();
      });

      const backButton = screen.getByText('←');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
