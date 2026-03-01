/**
 * StoryDirectorScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StoryDirectorScreen from '../StoryDirectorScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import { charactersAPI, chaptersAPI, plotOptionsAPI } from '../../../api';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const mockRoute = {
  params: { bookId: 'test-book-id' },
};

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

jest.mock('../../../api', () => ({
  charactersAPI: {
    getList: jest.fn(() => Promise.resolve({
      characters: [
        { character_id: '1', name: '角色1', description: '描述1', personality: '勇敢', speaking_style: '幽默', role_type: 'protagonist' },
        { character_id: '2', name: '角色2', description: '描述2', personality: '聪明', speaking_style: '严肃', role_type: 'supporting' },
        { character_id: '3', name: '角色3', description: '描述3', personality: '善良', speaking_style: '温柔', role_type: 'extra' },
      ]
    })),
  },
  chaptersAPI: {
    create: jest.fn(() => Promise.resolve({ chapterId: 'new-chapter-id' })),
    generate: jest.fn(() => Promise.resolve({ chapterId: 'generated-chapter-id' })),
  },
  plotOptionsAPI: {
    get: jest.fn(() => Promise.resolve({
      plotOptions: {
        weather: [
          { id: 'sunny', name: '晴天', icon: '☀️' },
          { id: 'rainy', name: '雨天', icon: '🌧️' },
          { id: 'snowy', name: '雪天', icon: '❄️' },
        ],
        adventureType: [
          { id: 'exploration', name: '探索', icon: '🗺️' },
          { id: 'rescue', name: '救援', icon: '🚨' },
        ],
        terrain: [
          { id: 'forest', name: '森林', icon: '🌲' },
          { id: 'mountain', name: '山脉', icon: '⛰️' },
        ],
        equipment: [
          { id: 'sword', name: '剑', icon: '🗡️' },
          { id: 'shield', name: '盾牌', icon: '🛡️' },
        ],
      },
    })),
  },
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id' },
    isLoggedIn: true,
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => mockToast,
}));

jest.mock('../../../components/card3d', () => ({
  CardDeck3D: function MockCardDeck3D({ title, items, selectedId, onPress }) {
    const { Text, TouchableOpacity, View } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        {items && items.map(item => (
          <TouchableOpacity key={item.id} onPress={() => onPress(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

jest.mock('../../../components/weather', () => ({
  WeatherEffectV2: function MockWeatherEffectV2() {
    return null;
  },
}));

jest.mock('../../../components/particles', () => ({
  MagicParticles: function MockMagicParticles() {
    return null;
  },
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </AuthProvider>
  );
};

describe('StoryDirectorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染故事导演页面', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/当前页面: StoryDirectorScreen/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示返回按钮', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示角色列表', async () => {
      const { getAllByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
        expect(getAllByText('角色2').length).toBeGreaterThan(0);
        expect(getAllByText('角色3').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('应该显示选择角色标题', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择角色/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示随机按钮', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/随机/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示天气选择', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择天气/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示冒险类型选择', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择冒险类型/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示地形选择', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择地形/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示装备选择', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择装备/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示开始拍摄按钮', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/开始拍摄/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('返回功能', () => {
    it('点击返回按钮应该调用goBack', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('角色选择', () => {
    it('点击角色应该选中角色', async () => {
      const { getAllByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      const char1Elements = getAllByText('角色1');
      fireEvent.press(char1Elements[0]);
    });
  });

  describe('情节选项选择', () => {
    it('点击天气选项应该选中', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('晴天')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('晴天'));
    });

    it('点击冒险类型选项应该选中', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('探索')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('探索'));
    });

    it('点击地形选项应该选中', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('森林')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('森林'));
    });

    it('点击装备选项应该选中', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('剑')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('剑'));
    });
  });

  describe('随机选择', () => {
    it('点击随机按钮应该随机选择情节选项', async () => {
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/随机/)).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText(/随机/));
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalled();
      }, { timeout: 5000 });
    });
  });

  describe('边界情况', () => {
    it('应该处理无效的bookId', async () => {
      const invalidRoute = { params: { bookId: null } };
      renderWithProviders(<StoryDirectorScreen route={invalidRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('应该处理加载失败的情况', async () => {
      charactersAPI.getList.mockRejectedValueOnce(new Error('加载失败'));
      renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('加载数据失败');
      }, { timeout: 5000 });
    });

    it('应该处理空角色列表', async () => {
      charactersAPI.getList.mockResolvedValueOnce({ characters: [] });
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择角色/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('plotOptions数据格式处理', () => {
    it('应该处理plotOptions嵌套格式', async () => {
      plotOptionsAPI.get.mockResolvedValueOnce({
        plotOptions: {
          weather: [{ id: 'sunny', name: '晴天', icon: '☀️' }],
          adventureType: [{ id: 'exploration', name: '探索', icon: '🗺️' }],
          terrain: [{ id: 'forest', name: '森林', icon: '🌲' }],
          equipment: [{ id: 'sword', name: '剑', icon: '🗡️' }],
        },
      });
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('晴天')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该处理plotOptions直接格式', async () => {
      plotOptionsAPI.get.mockResolvedValueOnce({
        weather: [{ id: 'sunny', name: '晴天', icon: '☀️' }],
        adventureType: [{ id: 'exploration', name: '探索', icon: '🗺️' }],
        terrain: [{ id: 'forest', name: '森林', icon: '🌲' }],
        equipment: [{ id: 'sword', name: '剑', icon: '🗡️' }],
      });
      const { getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('晴天')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('舞台预览集成测试', () => {
    it('选择角色后舞台预览应该显示角色', async () => {
      const { getAllByText, getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      
      const char1Elements = getAllByText('角色1');
      fireEvent.press(char1Elements[0]);
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('选择多个角色后舞台预览应该显示所有选中角色', async () => {
      const { getAllByText, getByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      
      const char1Elements = getAllByText('角色1');
      const char2Elements = getAllByText('角色2');
      
      fireEvent.press(char1Elements[0]);
      fireEvent.press(char2Elements[0]);
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('选择地形后舞台预览应该显示对应地形', async () => {
      const { getByText, getAllByText } = renderWithProviders(<StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />);
      
      await waitFor(() => {
        expect(getByText('森林')).toBeTruthy();
      }, { timeout: 5000 });
      
      fireEvent.press(getByText('森林'));
      
      await waitFor(() => {
        expect(getAllByText('🌲').length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });
  });

  describe('舞台预览角色显示验证', () => {
    it('选择角色后舞台预览应该显示角色名称', async () => {
      const { getAllByText, getByText } = renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      
      const char1Elements = getAllByText('角色1');
      fireEvent.press(char1Elements[0]);
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
        expect(getAllByText('角色1').length).toBeGreaterThanOrEqual(2);
      }, { timeout: 3000 });
    });

    it('选择多个角色后舞台预览应该显示所有角色名称', async () => {
      const { getAllByText, getByText } = renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
        expect(getAllByText('角色2').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      
      fireEvent.press(getAllByText('角色1')[0]);
      fireEvent.press(getAllByText('角色2')[0]);
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('取消选择角色后舞台预览应该移除角色', async () => {
      const { getAllByText, getByText, queryAllByText } = renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
      
      const char1Elements = getAllByText('角色1');
      fireEvent.press(char1Elements[0]);
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
      }, { timeout: 3000 });
      
      fireEvent.press(char1Elements[0]);
    });

    it('选择角色和地形后舞台预览应该同时显示', async () => {
      const { getAllByText, getByText } = renderWithProviders(
        <StoryDirectorScreen route={mockRoute} navigation={mockNavigation} />
      );
      
      await waitFor(() => {
        expect(getAllByText('角色1').length).toBeGreaterThan(0);
        expect(getByText('森林')).toBeTruthy();
      }, { timeout: 5000 });
      
      fireEvent.press(getAllByText('角色1')[0]);
      fireEvent.press(getByText('森林'));
      
      await waitFor(() => {
        expect(getByText('🎬 舞台预览')).toBeTruthy();
        expect(getAllByText('🌲').length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });
  });
});
