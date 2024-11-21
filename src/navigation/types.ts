import type { Config, Stack, Tabs } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  [Stack.Startup]: undefined; // TODO: Remove
  [Stack.MainTab]: undefined;
  [Stack.Example]: undefined; // TODO: Remove
  [Stack.ArtistView]: { id: string, title: string }
  [Stack.PlaylistView]: { id: string, title: string }
  [Stack.OnlineArtistView]: { path: string, serviceName: string, title: string }
  [Stack.SongPreview]: { path: string, serviceName: string }
  [Stack.SongView]: { id: string, title: string }
  [Stack.SongEdit]: undefined | { id: string }
  [Stack.PlaylistAddSongs]: { id: string }
  [Stack.PlaylistEdit]: { id: string }
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type MainTabParamList = {
  [Tabs.PlaylistList]: undefined
  [Tabs.ArtistList]: undefined
  [Tabs.SongList]: undefined
  [Tabs.OnlineSearch]: undefined
  [Tabs.Settings]: undefined
}

export type SettingsStackParamList = {
  [Config.Settings]: undefined;
  [Config.FontSizeSelect]: undefined;
};