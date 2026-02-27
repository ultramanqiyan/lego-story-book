/**
 * MainNavigator 测试
 * 测试主导航器的所有功能
 */

import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MainNavigator from '../MainNavigator';

// Mock 依赖
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ name, component: Component, options }) => {
        return React.createElement(
          React.Fragment,
          { key: name },
          options?.tabBarLabel && React.createElement(Text, null, options.tabBarLabel),
          Component && React.createElement(Component)
        );
      },
    }),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ name }) => React.createElement(Text, { key: name }, name),
    }),
  };
});

// Mock 屏幕组件
jest.mock('../../screens/home/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockHomeScreen() {
    return React.createElement(Text, null, 'Home Screen');
  };
});

jest.mock('../../screens/bookshelf/BookshelfScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockBookshelfScreen() {
    return React.createElement(Text, null, 'Bookshelf Screen');
  };
});

jest.mock('../../screens/characters/CharactersScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCharactersScreen() {
    return React.createElement(Text, null, 'Characters Screen');
  };
});

jest.mock('../../screens/adventure/AdventureScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockAdventureScreen() {
    return React.createElement(Text, null, 'Adventure Screen');
  };
});

jest.mock('../../screens/settings/SettingsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockSettingsScreen() {
    return React.createElement(Text, null, 'Settings Screen');
  };
});

describe('MainNavigator', () => {
  describe('主导航器', () => {
    it('应该渲染导航器', () => {
      render(<MainNavigator />);
      expect(screen.getByText('首页')).toBeTruthy();
    });

    it('应该显示所有标签名称', () => {
      render(<MainNavigator />);
      expect(screen.getByText('首页')).toBeTruthy();
      expect(screen.getByText('书架')).toBeTruthy();
      expect(screen.getByText('角色')).toBeTruthy();
      expect(screen.getByText('冒险')).toBeTruthy();
      expect(screen.getByText('设置')).toBeTruthy();
    });

    it('应该渲染导航屏幕', () => {
      render(<MainNavigator />);
      expect(screen.getByText('HomeMain')).toBeTruthy();
      expect(screen.getByText('BookshelfMain')).toBeTruthy();
      expect(screen.getByText('CharactersMain')).toBeTruthy();
      expect(screen.getByText('AdventureMain')).toBeTruthy();
      expect(screen.getByText('SettingsMain')).toBeTruthy();
    });
  });
});
