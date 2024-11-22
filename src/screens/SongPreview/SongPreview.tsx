import {
    LoadingIndicator
} from '@/components/molecules';
import { SongRender, SongTransformer } from '@/components/organisms';
import { Artist } from '@/db';
import { Song } from '@/db/Song';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { getService } from '@/services';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import ChordSheetJS from 'chordsheetjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SongPreviewScreenRouteProp = RouteProp<RootStackParamList, Stack.SongPreview>;

type SongPreviewScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.SongPreview>;

type Props = {
  navigation: SongPreviewScreenNavigationProp;
  route: SongPreviewScreenRouteProp
}

function SongPreview({ navigation, route }: Props) {
  const { t } = useTranslation();
  
  const [chordSheet, setChordCheet] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const serviceName = route.params.serviceName
  const path = route.params.path

  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = getService(serviceName)!
        const chordPro = await service.getChordProSong(path)
        setChordCheet(chordPro)
        setIsLoading(false)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
          setIsLoading(false)
        } else {
          throw error
        }
      }
    }
    fetchData()
  }, []);

  function saveSong() {
    if (isSaving) {return}

    setIsSaving(true)
    const parser = new ChordSheetJS.ChordProParser();
    const parsedSong = parser.parse(chordSheet!);
    const artistName = parsedSong.getMetadata('artist')
    const songTitle = parsedSong.getMetadata('title')

    let headerlessContent = chordSheet!
    headerlessContent = headerlessContent.replaceAll(/{artist:[^}]*}\n/g, '')
    headerlessContent = headerlessContent.replaceAll(/{title:[^}]*}\n/g, '')

    let artist: Artist | undefined = Artist.getByName(artistName!.toString())
    
    if (artist == null) {
      artist = Artist.create(artistName!.toString())
    }

    const song = Song.create(artist, songTitle!.toString(), headerlessContent)

    navigation.replace(Stack.SongView, { id: song.id, title: song.title })
    Alert.alert(t('info'), t('song_downloaded'))
  }

  return (
    <View style={{ flex: 1 }}>
      <LoadingIndicator error={error} loading={isLoading} />
      {chordSheet != null &&
        <SongTransformer
          chordProSong={chordSheet}
          transposeDelta={0}
        >
          {({ chords, htmlSong }) => (
            <View style={{ flex: 1 }}>
              <SongRender
                chordProContent={htmlSong}
              />
              <TouchableOpacity
                onPress={saveSong}
                style={styles.fabButton}>
                <Icon
                  color="white"
                  name="download"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          )}
        </SongTransformer>
      }
        </View>
  );
}

export default SongPreview;

const styles = StyleSheet.create({
    fabButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 100,
        backgroundColor: 'tomato',
        padding: 15
    },
    item: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: 'white',
        justifyContent: 'flex-start'
    },
    itemTitle: {
        fontSize: 18
    }
});