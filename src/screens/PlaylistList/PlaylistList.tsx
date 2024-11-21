import { TouchableIcon } from '@/components/atoms';
import {
  CustomHeader,
  EmptyListMessage,
  ListItem,
  TextInputModal,
} from '@/components/molecules';
import { SafeScreen } from '@/components/templates';
import { createBundle } from '@/db/bundler';
import { Playlist } from '@/db/Playlist';
import type { Tabs } from '@/navigation/paths';
import { Stack } from '@/navigation/paths';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { alertDelete } from '@/utils/alertDelete';
import createFile from '@/utils/createFile';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import Share from 'react-native-share';

type PlaylistListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, Tabs.PlaylistList>,
  StackNavigationProp<RootStackParamList, Stack.MainTab>
>;

type Props = {
  navigation: PlaylistListScreenNavigationProp;
};

function PlaylistList({ navigation }: Props) {
  const { t } = useTranslation();

  const [playlists, setPlaylists] = useState(Playlist.getAll());
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSelectPlaylist(id: string, name: string) {
    navigation.navigate(Stack.PlaylistView, { id, title: name });
  }

  function onPressDeletePlaylist(id: string) {
    alertDelete('playlist', id, () => {
      setPlaylists(Playlist.getAll());
    });
  }

  async function onPressShare(id: string, name: string) {
    try {
      const bundle = createBundle([id], []);
      const bundleString = JSON.stringify(bundle);
      const path = await createFile(
        'documents',
        'playlist_' + name.toLowerCase(),
        bundleString,
      );

      await Share.open({
        url: 'file://' + path,
        message: t('share_message'),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error.message);
    }
  }

  function onSubmit(playlistName: string) {
    try {
      Playlist.create(playlistName);
      setShowAddPlaylistModal(false);
      setPlaylists(Playlist.getAll());
    } catch (error_) {
      if (error_ instanceof Error) {
        setError(error_.message);
      } else {
        throw error_;
      }
    }
  }

  return (
    <SafeScreen>
      <CustomHeader
        headerRight={
          <TouchableIcon
            name="plus"
            onPress={() => setShowAddPlaylistModal(true)}
          />
        }
        title={t('playlists')}
      />

      <TextInputModal
        enabled={showAddPlaylistModal}
        error={error}
        onDismiss={() => {
          setError(null);
          setShowAddPlaylistModal(false);
        }}
        onSubmit={onSubmit}
        placeholder={t('playlist_name')}
        submitButtonTitle={t('create').toUpperCase()}
      />

      <FlatList
        ListEmptyComponent={
          <EmptyListMessage
            buttonTitle={t('create_new_playlist').toUpperCase()}
            message={t('you_havent_created_any_playlist_yet')}
            onPress={() => setShowAddPlaylistModal(true)}
          />
        }
        contentContainerStyle={playlists.length <= 0 ? { flex: 1 } : {}}
        data={playlists}
        renderItem={({ item }) => {
          return (
            <ListItem
              key={item.id!}
              onPress={() => onSelectPlaylist(item.id!, item.name)}
              options={[
                {
                  title: t('share'),
                  onPress: () => onPressShare(item.id, item.name),
                },
                {
                  title: t('delete'),
                  onPress: () => onPressDeletePlaylist(item.id!),
                },
              ]}
              title={item.name}
            />
          );
        }}
      />
    </SafeScreen>
  );
}

export default PlaylistList;
