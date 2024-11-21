import type { Config, Paths, Tabs } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  [Paths.Startup]: undefined;
  [Paths.MainTab]: undefined;
  [Paths.Example]: undefined;
  [Paths.ArtistView]: { id: string, title: string }
  [Paths.PlaylistView]: { id: string, title: string }
  [Paths.OnlineArtistView]: { path: string, serviceName: string, title: string }
  [Paths.SongPreview]: { path: string, serviceName: string }
  [Paths.SongView]: { id: string, title: string }
  [Paths.SongEdit]: undefined | { id: string }
  [Paths.PlaylistAddSongs]: { id: string }
  [Paths.PlaylistEdit]: { id: string }
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