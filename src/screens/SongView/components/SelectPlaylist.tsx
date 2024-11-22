import { ListItem, TextInputModal } from '@/components/molecules';
import { Playlist } from '@/db/Playlist';
import { Song } from '@/db/Song';
import { useDimensions } from '@/utils/useDimensions';
import type { FC } from "react";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPressClose: () => void,
  show: boolean,
  songId: string
}

const HEADER_HEIGHT = 30

const SelectPlaylist: FC<Props> = ({ show, songId, onPressClose }) => {
  const { t } = useTranslation()

  const [playlists, setPlaylists] = useState(Playlist.getAll())
  const [song] = useState(Song.getById(songId)!)
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dimensionsData = useDimensions()
  const windowHeight = dimensionsData.windowData.height

  function onSelectPlaylist(id: string) {
    const playlist = Playlist.getById(id)!

    if (Playlist.hasSong(playlist, song)) {
      Playlist.removeSong(playlist, song)
    } else {
      Playlist.addSong(playlist, song)
    }
    
    setPlaylists(Playlist.getAll())
  }

  function enablePlaylistInput() {
    setError(null)
    setShowInput(true)
  }

  function onSubmit(playlistName: string) {
    try {
      Playlist.create(playlistName)
      setShowInput(false)
      setPlaylists(Playlist.getAll())
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        throw error
      }
    }
  }

  if (!show) {return null}

  if (showInput)
    {return (
      <TextInputModal
        enabled={showInput}
        error={error}
        onDismiss={() => {
          setError(null)
          setShowInput(false)
        }}
        onSubmit={onSubmit}
        placeholder={t('playlist_name')}
        submitButtonTitle={t('create').toUpperCase()}
      />
    )}

  const scrollHeaderHeight = windowHeight * .6 - HEADER_HEIGHT
  const listContainerHeight = windowHeight - scrollHeaderHeight - HEADER_HEIGHT

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[styles.scrollHeader, { height: scrollHeaderHeight }]}>
        <TouchableOpacity onPress={onPressClose} style={styles.scrollHeaderTouchableBackground}>
        </TouchableOpacity>
      </View>
      <View style={[styles.background, { minHeight: listContainerHeight }]}>
        <TouchableOpacity onPress={enablePlaylistInput} style={styles.createPlaylistButton}>
          <MaterialCommunityIcons
            name='plus'
            size={20} />
          <Text style={styles.createPlaylistButtonText}>{t('create_new_playlist').toUpperCase()}</Text>
        </TouchableOpacity>
        {playlists.length <= 0 && <Text style={styles.emptyMessage}>{t('playlists_not_found')}</Text>}
        {playlists.map(item => {
          return (
            <ListItem
              key={item.id!}
              onPress={() => onSelectPlaylist(item.id)}
              showIcon={Playlist.hasSong(item, song) ? 'check' : 'plus'}
              title={item.name}
            />
          )
        })}
      </View>
    </ScrollView>
  );
}

export default SelectPlaylist

const styles = StyleSheet.create({
  scrollContainer: {
    position: 'absolute',
    backgroundColor: '#00000040',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    zIndex: 999
  },
  background: {
    backgroundColor: 'white'
  },
  scrollHeader: {
    justifyContent: 'flex-end'
  },
  scrollHeaderTouchableBackground: {
    flex: 1
  },
  createPlaylistButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  createPlaylistButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    fontSize: 14,
  },
  emptyMessage: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ccc',
    padding: 10
  }
});