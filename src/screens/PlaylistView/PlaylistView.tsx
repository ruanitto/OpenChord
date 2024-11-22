import { PrimaryButton, TouchableIcon } from '@/components/atoms';
import type {
  LeftIconOptions,
  PickerOption
} from '@/components/molecules';
import {
  EmptyListMessage,
  ListItem,
  PickerModal
} from '@/components/molecules';
import type { SortBy } from '@/db/Playlist';
import { Playlist } from '@/db/Playlist';
import type { Song } from '@/db/Song';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { alertDelete } from '@/utils/alertDelete';
import { useFocusEffect, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { List, Results } from 'realm';

type PlaylistViewScreenRouteProp = RouteProp<RootStackParamList, Stack.PlaylistView>;

type PlaylistViewScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.PlaylistView>;

type Props = {
  navigation: PlaylistViewScreenNavigationProp;
  route: PlaylistViewScreenRouteProp
}

function PlaylistView({ navigation, route }: Props) {
  const { t } = useTranslation();

  const id = route.params.id
  const playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState<Results<Song> | List<Song> | Song[]>(playlist.songs)
  const [enableSortSelect, setEnableSortSelect] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('CUSTOM')
  const [reverse, setReverse] = useState(false)
  const [sortOptions, setSortOptions] = useState<PickerOption<SortBy>[]>([])

  function onSelectSong(id: string, title: string) {
    navigation.navigate(Stack.SongView, { id, title })
  }

  function onPressEditSong(id: string) {
    navigation.navigate(Stack.SongEdit, { id })
  }

  function onPressDeleteSong(songId: string) {
    alertDelete('song', songId, () => {
      const playlist = Playlist.getById(id)!
      
      setSongs(playlist.songs)
    })
  }

  function onPressAddSongs() {
    navigation.navigate(Stack.PlaylistAddSongs, { id })
  }

  function onPressEditPlaylist() {
    navigation.navigate(Stack.PlaylistEdit, { id })
  }

  useFocusEffect(
    useCallback(() => {
      setSongs(playlist.songs)
      setName(playlist.name)
    }, [])
  );

  function onChangeSortBy(value: SortBy) {
    if (value === sortBy && value !== 'CUSTOM') {
      setReverse(!reverse)
    } else {
      setSortBy(value)

      if (value === 'CUSTOM') {
        setReverse(false)
      }
    }
  }

  useEffect(() => {
    const sortOptionsValues: { label: string, value: SortBy }[] = [
      { label: t('custom_sort'), value: 'CUSTOM' },
      { label: t('sort_by_title'), value: 'TITLE' },
      { label: t('sort_by_artist'), value: 'ARTIST' }
    ]
    
    const newOptions: PickerOption<SortBy>[] = sortOptionsValues.map(({ label, value }) => {
      let leftIcon: LeftIconOptions = 'empty-space'
      if (value === sortBy) {
        if (value === 'CUSTOM') {
          leftIcon = 'arrow-down'
        } else {
          leftIcon = reverse ? 'arrow-up' : 'arrow-down'
        }
      }

      return { label, leftIcon, value, key: 'sort-' + value }
    })

    setSortOptions(newOptions)

    const sortedSongs = Playlist.getSongs(playlist, sortBy, reverse)
    
    setSongs(sortedSongs)
  }, [reverse, sortBy, t])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TouchableIcon name="pencil" onPress={onPressEditPlaylist} />
    });
  }, [navigation]);
  
  return (
    <>
      <FlatList
        ListEmptyComponent={
          <EmptyListMessage
            buttonTitle={t('add_songs').toUpperCase()}
            message={t('you_havent_added_any_song_to_this_playlist_yet')}
            onPress={onPressAddSongs}
          />
        }
        ListHeaderComponent={() => {
          return songs.length > 0 ? (
              <View style={{ backgroundColor: 'white' }}>
                <PrimaryButton onPress={onPressAddSongs} outline style={{ margin: 10 }} title={t('add_songs').toUpperCase()} />
                <TouchableOpacity onPress={() => setEnableSortSelect(true)} style={{ flexDirection: 'row', paddingVertical: 18, borderBottomWidth: 1, borderColor: '#eee', paddingLeft: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#777' }}>{sortOptions.find(o => o.value === sortBy)?.label.toUpperCase()}</Text>
                  <MaterialCommunityIcons
                    color='#777'
                    name={reverse ? 'arrow-up' : 'arrow-down'}
                    size={20}
                    style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            ) : null;
        }}
        contentContainerStyle={songs.length <= 0 ? { flex: 1 } : {}}
        data={songs}
        renderItem={({ item }) => {
          return <ListItem
            key={item.id!}
            onPress={() => onSelectSong(item.id!, item.title)}
            options={[
              { title: t('edit'), onPress: () => onPressEditSong(item.id!) },
              { title: t('delete'), onPress: () => onPressDeleteSong(item.id!) }
            ]}
            subtitle={item.artist.name}
            title={item.title}
          />
        }}
      />
      <PickerModal
        onChange={onChangeSortBy}
        onDismiss={() => setEnableSortSelect(false)}
        options={sortOptions}
        show={enableSortSelect}
        value={sortBy}
      />
    </>
  );
}

export default PlaylistView;
