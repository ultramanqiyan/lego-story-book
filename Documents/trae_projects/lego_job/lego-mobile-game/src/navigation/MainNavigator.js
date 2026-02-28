import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import BookshelfScreen from '../screens/bookshelf/BookshelfScreen';
import CharactersScreen from '../screens/characters/CharactersScreen';
import AdventureScreen from '../screens/adventure/AdventureScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import StoryCreateScreen from '../screens/story/StoryCreateScreen';
import BookDetailScreen from '../screens/story/BookDetailScreen';
import StoryDirectorScreen from '../screens/story/StoryDirectorScreen';
import ChapterScreen from '../screens/chapter/ChapterScreen';
import ShareScreen from '../screens/share/ShareScreen';
import ParentControlScreen from '../screens/settings/ParentControlScreen';
import ThemeSettingsScreen from '../screens/settings/ThemeSettingsScreen';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Bookshelf" component={BookshelfScreen} />
      <Stack.Screen name="Characters" component={CharactersScreen} />
      <Stack.Screen name="Adventure" component={AdventureScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="StoryCreate" component={StoryCreateScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="StoryDirector" component={StoryDirectorScreen} />
      <Stack.Screen name="Chapter" component={ChapterScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name="ParentControl" component={ParentControlScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
