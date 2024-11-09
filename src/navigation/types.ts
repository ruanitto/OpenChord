import type { Paths, Tabs } from '@/navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  [Paths.Startup]: undefined;
  [Paths.MainTab]: undefined;
  [Paths.Example]: undefined;
  [Paths.PlaylistView]: { id: string, title: string }
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

// export type MainTabScreenProps<
//   S extends keyof RootStackParamList = keyof RootStackParamList,
// > = StackScreenProps<RootStackParamList, S>;