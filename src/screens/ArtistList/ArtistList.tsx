import {
  CustomHeader,
  EmptyListMessage,
  ListItem,
  TextInputModal
} from '@/components/molecules';
import { SafeScreen } from '@/components/templates';
import { Artist } from '@/db/Artist';
import { Stack, Tabs } from '@/navigation/paths';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { alertDelete } from '@/utils/alertDelete';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, type CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StatusBar } from 'react-native';

type ArtistListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, Tabs.ArtistList>,
  StackNavigationProp<RootStackParamList, Stack.MainTab>
>;

type Props = {
  navigation: ArtistListScreenNavigationProp;
}

function ArtistList({ navigation }: Props) {
  const { t } = useTranslation();

  const [artists, setArtists] = useState(Artist.getAll())
  const [error, setError] = useState<string | null>(null)
  const [showEditArtistModal, setShowEditArtistModal] = useState(false)
  const [artistEditName, setArtistEditName] = useState<string>('')
  const [artistEditId, setArtistEditId] = useState<string | null>(null)
  
  function onSelectArtist(id: string, name: string) {
    navigation.navigate(Stack.ArtistView, { id, title: name })
  }

  function onPressDeleteArtist(id: string) {
    alertDelete('artist', id, () => {
      setArtists(Artist.getAll())
    })
  }

  function onPressEditArtist(id: string, name: string) {
    setError(null)
    setArtistEditId(id)
    setArtistEditName(name)
    setShowEditArtistModal(true)
  }

  function onSubmitArtistName() {
    try {
      if (artistEditName == '') {
        throw new Error(t('empty_name_not_allowed'))
      } else if (artistEditId) {
        Artist.update(artistEditId, artistEditName)
        setShowEditArtistModal(false)
        setArtists(Artist.getAll())
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        throw error
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      setArtists(Artist.getAll())
    }, [])
  )

  return (
    <SafeScreen>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <CustomHeader title={t('artists')} />
      <TextInputModal
        enabled={showEditArtistModal}
        error={error}
        onChange={(value) => setArtistEditName(value)}
        onDismiss={() => {
          setError(null)
          setShowEditArtistModal(false)
        }}
        onSubmit={onSubmitArtistName}
        value={artistEditName}
      />
      <FlatList
        ListEmptyComponent={
          <EmptyListMessage
            buttonTitle={t('go_to_online_search').toUpperCase()}
            message={t('you_havent_downloaded_any_song_yet')}
            onPress={() => { navigation.navigate(Tabs.OnlineSearch) }}
          />
        }
        contentContainerStyle={artists.length <= 0 ? { flex: 1 } : {}}
        data={artists}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              onPress={() => onSelectArtist(item.id!, item.name)}
              options={[
                { title: t('edit'), onPress: () => onPressEditArtist(item.id, item.name) },
                { title: t('delete'), onPress: () => onPressDeleteArtist(item.id!) }
              ]}
              title={item.name} />
          )
        }}
      />
    </SafeScreen>
  )
}

export default ArtistList;
