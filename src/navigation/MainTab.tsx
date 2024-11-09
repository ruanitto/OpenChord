import { TabBarIcon } from '@/components/atoms';
import { Tabs } from '@/navigation/paths';
import type { MainTabParamList } from '@/navigation/types';
import { PlaylistList } from '@/screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTab() {
  const { t } = useTranslation() // define

  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'tomato', headerShown: false }}>
      <Tab.Screen
        component={PlaylistList}
        name={Tabs.PlaylistList}
        options={{ title: t('playlists'), tabBarIcon: (props) => <TabBarIcon {...props} name='playlist-music' /> }} />
      {/* <Tab.Screen
            name="ArtistList"
            options={{ title: t('artists'), tabBarIcon: (props) => <TabBarIcon {...props} name="artist" /> }}
            component={ArtistList} />
          <Tab.Screen
            name="SongList"
            options={{ title: t('songs'), tabBarIcon: (props) => <TabBarIcon {...props} name="format-list-bulleted-square" /> }}
            component={SongList}
          />
          <Tab.Screen
            name="OnlineSearch"
            options={{ title: t('online_search'), tabBarIcon: (props) => <TabBarIcon {...props} name="magnify" /> }}
            component={OnlineSearch} />
          <Tab.Screen
            name="Settings"
            options={{ title: t('settings'), tabBarIcon: (props) => <TabBarIcon {...props} name="settings" /> }}
            component={SettingsTab} /> */}
    </Tab.Navigator>
  )
}

export default MainTab