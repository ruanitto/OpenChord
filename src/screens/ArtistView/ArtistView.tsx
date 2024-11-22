import { ListItem } from '@/components/molecules';
import { Artist } from '@/db/Artist';
import { Song } from '@/db/Song';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { alertDelete } from '@/utils/alertDelete';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

type ArtistViewScreenRouteProp = RouteProp<RootStackParamList, Stack.ArtistView>;

type ArtistViewScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.ArtistView>;

type Props = {
  navigation: ArtistViewScreenNavigationProp;
  route: ArtistViewScreenRouteProp
}

function ArtistView({ navigation, route }: Props) {
  const { t } = useTranslation();

  const id = route.params.id
  const artist = Artist.getById(id)!
  
  const [musics, setMusics] = useState(Song.getByArtist(artist.id!))

  function onSelectSong(id: string, title: string) {
    navigation.navigate(Stack.SongView, { id, title }) // TODO: Make
  }

  function onPressEditSong(id: string) {
    navigation.navigate(Stack.SongEdit, { id }) // TODO: Make
  }

  function onPressDeleteSong(id: string) {
    alertDelete('song', id, () => {
      const songs = Song.getByArtist(artist.id!)
      
      if (songs.length > 0) {
        setMusics(songs)
      } else {
        navigation.goBack()
      }
    })
  }

  return (
    <FlatList
      data={musics}
      renderItem={({ item }) => {
        return <ListItem
          key={item.id!}
          onPress={() => onSelectSong(item.id!, item.title)}
          options={[
            { title: t('edit'), onPress: () => onPressEditSong(item.id!) },
            { title: t('delete'), onPress: () => onPressDeleteSong(item.id!) }
          ]}
          title={item.title}
        />
      }}
    />
  );
}

export default ArtistView;
