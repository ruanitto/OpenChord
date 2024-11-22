import {
    EmptyListMessage,
    ListItem,
    SearchBar
} from '@/components/molecules';
import { Playlist } from '@/db/Playlist';
import { Song } from '@/db/Song';
import type { Stack } from '@/navigation/paths';
import { Tabs } from '@/navigation/paths';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';

type PlaylistAddSongsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, Stack.PlaylistAddSongs>,
  BottomTabNavigationProp<MainTabParamList, Tabs.PlaylistList>
>;

type PlaylistAddSongsScreenRouteProp = RouteProp<RootStackParamList, Stack.PlaylistAddSongs>

type Props = {
  navigation: PlaylistAddSongsScreenNavigationProp,
  route: PlaylistAddSongsScreenRouteProp
}

function PlaylistAddSongs({ navigation, route }: Props) {
  const { t } = useTranslation();

  const id = route.params.id
  const [playlist] = useState(Playlist.getById(id)!)
  const [songs, setSongs] = useState(Song.getAll())
  const [query, setQuery] = useState('')
  
  const searchInput = useRef<TextInput>(null)
  
  function onSelectSong(id: string, title: string) {
    const song = Song.getById(id)!

    if (Playlist.hasSong(playlist, song)) {
      Playlist.removeSong(playlist, song)
    } else {
      Playlist.addSong(playlist, song)
    }

    setSongs(Song.search(query))
  }

  function onSubmitEditing() { }

  useEffect(() => {
    setSongs(Song.search(query))
  }, [query])

  return (<>
      <SearchBar
        inputRef={searchInput}
        onChangeText={(value) => setQuery(value)}
        onSubmitEditing={onSubmitEditing}
        placeholder={t('search')}
        query={query}
      />
      <FlatList
        ListEmptyComponent={
          <EmptyListMessage
            buttonTitle={t('go_to_online_search').toUpperCase()}
            message={t('you_havent_downloaded_any_song_yet')}
            onPress={() => { navigation.navigate(Tabs.OnlineSearch) }}
          />
        }
        contentContainerStyle={styles.container}
        data={songs}
        renderItem={({ item }) => {
          return <ListItem
            key={item.id!}
            onPress={() => onSelectSong(item.id!, item.title)}
            showIcon={Playlist.hasSong(playlist, item) ? 'check' : 'plus'}
            subtitle={item.artist.name}
            title={item.title}
          />
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default PlaylistAddSongs;
