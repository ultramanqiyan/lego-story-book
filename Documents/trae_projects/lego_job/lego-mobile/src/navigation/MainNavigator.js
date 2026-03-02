import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { COLORS } from '../utils/constants';

import HomeScreen from '../screens/home/HomeScreen';
import BookshelfScreen from '../screens/bookshelf/BookshelfScreen';
import CharactersScreen from '../screens/characters/CharactersScreen';
import AdventureScreen from '../screens/adventure/AdventureScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ParentControlScreen from '../screens/settings/ParentControlScreen';
import ThemeSettingsScreen from '../screens/settings/ThemeSettingsScreen';

import StoryCreateScreen from '../screens/story/StoryCreateScreen';
import BookDetailScreen from '../screens/story/BookDetailScreen';
import StoryDirectorScreen from '../screens/story/StoryDirectorScreen';
import ChapterScreen from '../screens/chapter/ChapterScreen';
import ShareScreen from '../screens/share/ShareScreen';
import { Card3DDemoScreen } from '../screens/demo';
import Demo6Grid2D from '../screens/demo/Demo6Grid2D';
import Demo7Flip3D from '../screens/demo/Demo7Flip3D';
import Demo8FanSpread from '../screens/demo/Demo8FanSpread';
import Demo9HorizontalStack from '../screens/demo/Demo9HorizontalStack';
import Demo10VerticalStack from '../screens/demo/Demo10VerticalStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ name, focused, color }) => {
  const icons = {
    Home: '🏠',
    Bookshelf: '📚',
    Characters: '🎭',
    Adventure: '🗺️',
    Settings: '⚙️',
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>{icons[name]}</Text>
    </View>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StoryCreate" component={StoryCreateScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="StoryDirector" component={StoryDirectorScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
      <Stack.Screen name="Card3DDemo" component={Card3DDemoScreen} />
      <Stack.Screen name="Demo6" component={Demo6Grid2D} />
      <Stack.Screen name="Demo7" component={Demo7Flip3D} />
      <Stack.Screen name="Demo8" component={Demo8FanSpread} />
      <Stack.Screen name="Demo9" component={Demo9HorizontalStack} />
      <Stack.Screen name="Demo10" component={Demo10VerticalStack} />
    </Stack.Navigator>
  );
};

const BookshelfStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookshelfMain" component={BookshelfScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="StoryDirector" component={StoryDirectorScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
      <Stack.Screen name="StoryCreate" component={StoryCreateScreen} />
    </Stack.Navigator>
  );
};

const CharactersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CharactersMain" component={CharactersScreen} />
    </Stack.Navigator>
  );
};

const AdventureStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdventureMain" component={AdventureScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="ParentControl" component={ParentControlScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: COLORS.legoBlue,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen 
        name="Bookshelf" 
        component={BookshelfStack}
        options={{ tabBarLabel: '书架' }}
      />
      <Tab.Screen 
        name="Characters" 
        component={CharactersStack}
        options={{ tabBarLabel: '角色' }}
      />
      <Tab.Screen 
        name="Adventure" 
        component={AdventureStack}
        options={{ tabBarLabel: '冒险' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{ tabBarLabel: '设置' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
