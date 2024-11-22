import { TouchableIcon } from '@/components/atoms';
import { Artist } from '@/db/Artist';
import { Song } from '@/db/Song';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import ChordSheetJS from 'chordsheetjs';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SongEditScreenRouteProp = RouteProp<RootStackParamList, Stack.SongEdit>

type SongEditScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.SongEdit>

type Props = {
  navigation: SongEditScreenNavigationProp;
  route: SongEditScreenRouteProp
}

function SongEdit({ navigation, route }: Props) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'CHORD_PRO' | 'CHORD_SHEET'>('CHORD_PRO')

  function removeMetaTags(text: string) {
    text = text.replaceAll(/{title:[^}]+}\n?/g, '')
    text = text.replaceAll(/{t:[^}]+}\n?/g, '')
    text = text.replaceAll(/{artist:[^}]+}\n?/g, '')
    text = text.replaceAll(/{a:[^}]+}\n?/g, '')
    return text
  }
 
  useEffect(() => {
    const id = route.params?.id

    if (id != null) {
      const song = Song.getById(id)!

      setTitle(song.title)
      setArtist(song.artist.name)
      setContent(removeMetaTags(song.content))
    }
  }, [])

  function saveSong() {
    if (title.trim() == '') {return setError(t('invalid_title'))}

    if (artist.trim() == '') {return setError(t('invalid_artist'))}

    if (content.trim() == '') {return setError(t('invalid_content'))}

    const artistName = artist.trim()
    const songTitle = title.trim()
    let chordPro = content

    if (mode == 'CHORD_SHEET') {
      const formatter = new ChordSheetJS.ChordProFormatter();
      const chordSheetSong = new ChordSheetJS.ChordSheetParser({ preserveWhitespace: false }).parse(content)
      
      chordPro = formatter.format(chordSheetSong)
    }

    let songId = route.params?.id
    let artistDb: Artist | undefined = Artist.getByName(artistName)

    if (artistDb == null) {
      artistDb = Artist.create(artistName)
    }

    if (songId) {
      Song.update(songId, artistDb, songTitle, chordPro)
    } else {
      const song = Song.create(artistDb, songTitle, chordPro)

      songId = song.id
    }

    navigation.replace(Stack.SongView, { id: songId, title: songTitle })
  }

  function switchToChordPro() {
    const song = new ChordSheetJS.ChordSheetParser({ preserveWhitespace: false }).parse(content)
    const chordPro = new ChordSheetJS.ChordProFormatter().format(song)

    setContent(chordPro)
    setMode('CHORD_PRO')
  }

  function switchToChordSheet() {
    const song = new ChordSheetJS.ChordProParser().parse(content)
    const plainText = new ChordSheetJS.TextFormatter().format(song)
    
    setContent(plainText)
    setMode('CHORD_SHEET')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TouchableIcon name="content-save" onPress={saveSong} />,
    });
  }, [navigation, title, content, artist]);

  const contentPlaceholder = mode == 'CHORD_PRO' ?
    "You can edit any song here\n" +
    "U[C]sing the [Dm]chordPro format[G]\n\n\n" :
    "You can edit any song here\n" +
    " C              Dm          G\n" +
    "Using the chord sheet format\n\n\n"

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="none"
    >
      <KeyboardAvoidingView>
        {error != null && <Text style={{ color: 'red' }}>{error}</Text>}
        <TextInput
          autoCapitalize='words'
          autoCorrect={false}
          autoFocus={false}
          onChangeText={setTitle}
          placeholder={t('song_title')}
          style={styles.input}
          value={title}
        />
        <TextInput
          autoCapitalize='words'
          autoCorrect={false}
          autoFocus={false}
          onChangeText={setArtist}
          placeholder={t('artist_name')}
          style={styles.input}
          value={artist}
        />
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            disabled={mode == 'CHORD_PRO'}
            onPress={switchToChordPro} style={mode == 'CHORD_PRO' ? styles.tabActive : styles.tabInactive}>
            <Text>ChordPro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={mode == 'CHORD_SHEET'}
            onPress={switchToChordSheet} style={mode == 'CHORD_SHEET' ? styles.tabActive : styles.tabInactive}>
            <Text>{t('chords_over_lyrics')}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          autoCapitalize='sentences'
          autoCorrect={false}
          autoFocus={false}
          multiline
          numberOfLines={4}
          onChangeText={setContent}
          placeholder={contentPlaceholder}
          placeholderTextColor="#aaa"
          style={styles.content}
          textAlignVertical="top"
          value={content}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default SongEdit;

const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: 'white'
    },
    tabsContainer: {
      flexDirection: 'row'
    },
    tabActive: {
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#eee'
    },
    tabInactive: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#fff'
    },
    input: {
      fontSize: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      marginBottom: 5
    },
    content: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      flex: 1,
      minHeight: 200,
      padding: 10,
      backgroundColor: '#eee',
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
    },
    sideMenuContainer: {
      backgroundColor: '#eee',
      flex: 1
    },
    toolbarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ccc'
    }
  })