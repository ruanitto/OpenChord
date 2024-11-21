import {
    ListItem,
    LoadingIndicator
} from '@/components/molecules';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { getService } from '@/services';
import type { SongDoc } from '@/services/BaseService';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
  
type OnlineArtistViewScreenRouteProp = RouteProp<RootStackParamList, Paths.OnlineArtistView>

type OnlineArtistViewScreenNavigationProp = StackNavigationProp<RootStackParamList, Paths.OnlineArtistView>

type Props = {
    navigation: OnlineArtistViewScreenNavigationProp 
    route: OnlineArtistViewScreenRouteProp 
}
  
function OnlineArtistView({ navigation, route }: Props) {
    const [songs, setSongs] = useState<SongDoc[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const serviceName = route.params.serviceName
    const path = route.params.path

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getService(serviceName)!.getArtistSongs(path)
        setSongs(docs)
        setIsLoading(false)
      } catch (error_) {
        if (error_ instanceof Error) {
          setError(error_.message)
          setIsLoading(false)
        } else {
          throw error_
        }
      }
    }
    fetchData()
  }, [path, serviceName]);

  function onSelectSong(path: string, serviceName: string) {
    navigation.navigate(Paths.SongPreview, { path, serviceName }) // TODO: Make
  }
  
    return (
        <FlatList
          ListHeaderComponent={<LoadingIndicator error={error} loading={isLoading} />}
          data={songs}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => {
            return <ListItem onPress={() => onSelectSong(item.path, serviceName)} title={item.title} />
          }}
        />
    )
}

export default OnlineArtistView;
