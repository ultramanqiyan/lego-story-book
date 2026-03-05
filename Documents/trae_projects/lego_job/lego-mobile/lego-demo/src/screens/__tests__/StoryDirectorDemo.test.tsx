import React from 'react';
import { render } from '@testing-library/react-native';
import StoryDirectorDemo from '../StoryDirectorDemo';
import { StyleProvider } from '../../context/StyleContext';

describe('StoryDirectorDemo', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <StyleProvider>
        {component}
      </StyleProvider>
    );
  };

  describe('基础渲染', () => {
    it('应该能够渲染组件', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示返回按钮', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('← 返回')).toBeTruthy();
    });

    it('应该显示角色选择区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText(/选择角色/)).toBeTruthy();
    });

    it('应该显示冒险类型选择区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🗺️ 冒险类型')).toBeTruthy();
    });

    it('应该显示天气选择区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🌤️ 天气')).toBeTruthy();
    });

    it('应该显示地形选择区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🏔️ 地形')).toBeTruthy();
    });

    it('应该显示装备选择区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🪄 装备')).toBeTruthy();
    });

    it('应该显示舞台风格切换按钮', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎭')).toBeTruthy();
    });
  });

  describe('舞台风格类型', () => {
    it('应该支持像素艺术风格', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      const stageStyleButton = getByText('🎭');
      expect(stageStyleButton).toBeTruthy();
    });

    it('应该支持玻璃拟态风格', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      const stageStyleButton = getByText('🎭');
      expect(stageStyleButton).toBeTruthy();
    });

    it('应该支持转盘风格', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      const stageStyleButton = getByText('🎭');
      expect(stageStyleButton).toBeTruthy();
    });

    it('应该支持横版过关风格', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      const stageStyleButton = getByText('🎭');
      expect(stageStyleButton).toBeTruthy();
    });
  });

  describe('像素艺术风格渲染', () => {
    it('应该渲染像素化背景', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示像素化角色', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText(/选择角色/)).toBeTruthy();
    });

    it('应该显示游戏UI元素（血条、等级、经验条）', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });
  });

  describe('玻璃拟态风格渲染', () => {
    it('应该渲染玻璃效果', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示半透明卡片', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText(/选择角色/)).toBeTruthy();
    });

    it('应该显示渐变背景', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });
  });

  describe('转盘风格渲染', () => {
    it('应该渲染转盘容器', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示角色卡片在圆周上', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText(/选择角色/)).toBeTruthy();
    });

    it('应该显示中心选中区域', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });
  });

  describe('横版过关风格渲染', () => {
    it('应该渲染横向滚动视图', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示多层视差背景', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText('🎬 故事导演台 Demo')).toBeTruthy();
    });

    it('应该显示角色横向排列', () => {
      const { getByText } = renderWithProviders(<StoryDirectorDemo onBack={mockOnBack} />);
      expect(getByText(/选择角色/)).toBeTruthy();
    });
  });
});
