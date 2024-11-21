import {
  EmptyListMessage,
  ListItem,
  LoadingIndicator,
  SearchBar
} from '@/components/molecules';
import { SafeScreen } from '@/components/templates';
import type { Tabs } from '@/navigation/paths';
import { Stack } from '@/navigation/paths';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { getService, services } from '@/services';
import type { Doc } from '@/services/BaseService';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import { FlatList, Platform, StatusBar, StyleSheet, Text } from 'react-native';

type OnlineSearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, Tabs.OnlineSearch>,
  StackNavigationProp<RootStackParamList, Stack.MainTab>
>;

type Props = {
  navigation: OnlineSearchScreenNavigationProp;
}

function OnlineSearch({ navigation }: Props) {
  const { t } = useTranslation();

  const searchInput = useRef<TextInput>(null)
  const [serviceName] = useState(services[0].name)
  const [docs, setDocs] = useState<Doc[] | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function makeSearch() {
    if (query.length > 0) {
      const fetchData = async () => {
        const docs = await getService(serviceName)!.getSearch(query)
        setDocs(docs)
      }

      try {
        setIsLoading(true)
        setError(null)

        await fetchData()

        setIsLoading(false)
      } catch (error) {
        if (error instanceof Error) {
          setIsLoading(false)
          setError(error.message)
        } else {
          throw error
        }
      }
    }
  }

  // useEffect(() => {
    // const showTabBar = () => navigation.setOptions({ tabBarVisible: true })
    // Keyboard.addListener('keyboardDidHide', showTabBar)
    // return () => Keyboard.removeListener('keyboardDidHide', showTabBar)
  // }, [])

  // useEffect(() => {
    // const hideTabBar = () => navigation.setOptions({ tabBarVisible: false })
    // Keyboard.addListener('keyboardDidShow', hideTabBar)
    // return () => Keyboard.removeListener('keyboardDidShow', hideTabBar)
  // }, [])

  if (Platform.OS === 'ios') {
    return (
      <SafeScreen>
        <EmptyListMessage
          buttonTitle={t('create_song').toUpperCase()}
          message={
            t('online_search_not_available') + '. ' +
            t('you_can_still_create_songs_manually')
          }
          onPress={() => navigation.navigate(Stack.SongEdit)} // TODO: MAKE
        />
      </SafeScreen>
    )
  }
  
  return (
    <SafeScreen>
      <StatusBar backgroundColor='white' barStyle='dark-content' />
      <SearchBar
        inputRef={searchInput}
        onChangeText={(value) => setQuery(value)}
        onSubmitEditing={makeSearch}
        placeholder={t('search')}
        query={query}
      />
      <FlatList
        ListEmptyComponent={() => {
          return (docs != null && !isLoading) ?
            <Text style={styles.msgInfo}>{t('artist_or_song_not_found')}</Text> :
            null
        }}
        ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
        data={docs}
        keyExtractor={(item) => item.path}
        renderItem={({ item, index }) => {
          return item.type == 'artist' ? (
              <ListItem
                onPress={() => { navigation.navigate(Stack.OnlineArtistView, { path: item.path, serviceName, title: item.name }) }} // TODO: MAKE
                title={item.name}
              />) : (
              <ListItem
                onPress={() => { navigation.navigate(Stack.SongPreview, { path: item.path, serviceName }) }} // TODO: MAKE
                subtitle={item.artist}
                title={item.title}
              />);
        }}
      />
    </SafeScreen>
  );
}

export default OnlineSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  msgInfo: {
    textAlign: 'center',
    color: '#aaa'
  },
  picker: {
    marginHorizontal: 10
  }
});