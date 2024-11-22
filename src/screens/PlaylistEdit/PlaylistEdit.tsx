import { ErrorText, TouchableIcon } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import { Playlist } from '@/db/Playlist';
import type { Song } from '@/db/Song';
import type { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RenderItemInfo } from 'react-native-draggable-flatlist';
import DraggableFlatList from 'react-native-draggable-flatlist';
import DraggableItem from './compoents/DraggableItem';

type PlaylistEditScreenRouteProp = RouteProp<RootStackParamList, Stack.PlaylistEdit>

type PlaylistEditScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.PlaylistEdit>

type Props = {
  navigation: PlaylistEditScreenNavigationProp,
  route: PlaylistEditScreenRouteProp
}

const HEADER_HEIGHT = 60

const PlaylistEdit: FC<Props> = ({route, navigation}: Props) => {
  const { t } = useTranslation();


  const id = route.params.id
  const playlist = Playlist.getById(id)!
  const [name, setName] = useState(playlist.name)
  const [songs, setSongs] = useState(Array.from(playlist.songs))
  const [error, setError] = useState<string | null>(null)

  function onPressCancel() {
    navigation.goBack()
  }

  function onPressSavePlaylist() {
    try {
      Playlist.update(playlist.id, name, songs)

      navigation.goBack()

      Alert.alert(t('info'), t('playlist_saved'))
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        throw error
      }
    }
  }

  function onPressRemoveSong(song: Song) {
    setSongs(songs.filter(s => s != song))
  }

  function renderItem(info: RenderItemInfo<Song>) {
    const { item, move, moveEnd } = info
    return (
      <DraggableItem
        onDragEnd={moveEnd}
        onDragStart={move}
        onPressDelete={() => onPressRemoveSong(item)}
        subtitle={item.artist.name}
        title={item.title}
      />
    )
  }

  return (
    <SafeScreen>
      <View style={styles.header}>
        <TouchableIcon name="close" onPress={onPressCancel} />
        <Text style={styles.headerTitle}>{t('playlist_edit')}</Text>
        <TouchableIcon name="check" onPress={onPressSavePlaylist} />
      </View>
      <View style={styles.playlistNameInputContiner}>
        <TextInput
          onChangeText={value => setName(value)}
          placeholder={t('playlist_name')}
          style={styles.playlistNameInput}
          value={name}
        />
        <ErrorText>{error}</ErrorText>
      </View>
      <DraggableFlatList
        data={songs}
        keyExtractor={item => `draggable-item-${item.id}`}
        onMoveEnd={({ data }) => { if (data != null) {setSongs(Array.from(data))} }}
        renderItem={renderItem}
        scrollPercent={5}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    playlistNameInputContiner: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    playlistNameInput: {
      fontSize: 22,
      textAlign: 'center',
      borderBottomWidth: 2,
      maxWidth: 250
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: HEADER_HEIGHT
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#eee',
      backgroundColor: 'white',
      justifyContent: 'flex-start'
    },
    textContainer: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: 18
    },
    subtitle: {
      fontSize: 14
    }
});

export default PlaylistEdit;
