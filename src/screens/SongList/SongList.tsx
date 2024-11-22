import { TouchableIcon } from '@/components/atoms';
import {
  CustomHeader,
  EmptyListMessage,
  ListItem,
  SearchBar
} from '@/components/molecules';
import { SafeScreen } from '@/components/templates';
import { Song } from '@/db/Song';
import { Stack, Tabs } from '@/navigation/paths';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { alertDelete } from '@/utils/alertDelete';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, type CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StatusBar } from 'react-native';

type SongListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, Tabs.SongList>,
  StackNavigationProp<RootStackParamList, Stack.MainTab>
>

type Props = {
  navigation: SongListScreenNavigationProp
}

function SongList({ navigation }: Props) {
  const { t } = useTranslation();

  const [songs, setSongs] = useState(Song.getAll())
  const [query, setQuery] = useState('')

  function onSelectSong(id: string, title: string) {
    navigation.navigate(Stack.SongView, { id, title }) // TODO: ADD
  }

  function addNewSong() {
    navigation.navigate(Stack.SongEdit) // TODO: ADD
  }

  function onPressEditSong(id: string) {
    navigation.navigate(Stack.SongEdit, { id }) // TODO: ADD
  }

  function onPressGoToArtist(id: string) {
    const artist = Song.getById(id)!.artist
    navigation.navigate(Stack.ArtistView, { id: artist.id, title: artist.name }) // TODO: ADD
  }

  function onPressDeleteSong(id: string) {
    alertDelete('song', id, () => {
      setSongs(Song.getAll())
    })
  }

  useEffect(() => {
    if (query != '') {
      setSongs(Song.search(query))
    } else {
      setSongs(Song.getAll())
    }
  }, [query])

  useFocusEffect(
    useCallback(() => {
      if (query != '') {
        setSongs(Song.search(query))
      } else {
        setSongs(Song.getAll())
      }
    }, [query])
  )

  return (
    <SafeScreen>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <CustomHeader
        headerRight={<TouchableIcon name="plus" onPress={addNewSong} />}
        title={t('songs')}
      />
      <SearchBar
        onChangeText={(value) => setQuery(value)}
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
        contentContainerStyle={songs.length <= 0 ? { flex: 1 } : {}}
        data={songs}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              onPress={() => onSelectSong(item.id!, item.title)}
              options={[
                { title: t('go_to_artist'), onPress: () => onPressGoToArtist(item.id!) },
                { title: t('edit'), onPress: () => onPressEditSong(item.id!) },
                { title: t('delete'), onPress: () => onPressDeleteSong(item.id!) }
              ]}
              subtitle={item.artist.name}
              title={item.title}
            />
          )
        }}
      />
    </SafeScreen>
  );
}

export default SongList;
