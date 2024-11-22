import { TouchableIcon } from '@/components/atoms';
import {
  AutoScrollSlider
} from '@/components/molecules';
import type { SongRenderRef } from '@/components/organisms';
import { ChordTab, SongRender, SongTransformer } from '@/components/organisms';
import { GlobalSettings } from '@/db/GlobalSettings';
import { Song } from '@/db/Song';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import clamp from '@/utils/clamp';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { Chord } from 'chordsheetjs';
import type { FC } from 'react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, Text, TouchableHighlight, View } from 'react-native';
import { FONT_SIZE_STEP, MAX_FONT_SIZE, MIN_FONT_SIZE } from '../FontSizeSelect/FontSizeSelect';
import PageTurner from './components/PageTurner';
import SelectPlaylist from './components/SelectPlaylist';
import SideMenu from './components/SideMenu';

type SongViewScreenRouteProp = RouteProp<RootStackParamList, Stack.SongView>

type SongViewScreenNavigationProp = StackNavigationProp<RootStackParamList, Stack.SongView>

type Props = {
  navigation: SongViewScreenNavigationProp;
  route: SongViewScreenRouteProp
}

interface ToolButtonProps {
  name: string,
  onPress: () => void
}

const ToolButton: FC<ToolButtonProps> = ({ onPress, name }) => (
  <TouchableIcon name={name} onPress={onPress} size={25} style={{ borderWidth: 1, borderRadius: 2, marginLeft: 8 }} />
)

const Divider: FC = () => (
  <View style={{ borderBottomWidth: .5, borderColor: '#00000020' }} />
)

function SongView({ navigation, route }: Props) {
  const { t } = useTranslation();
  
  const songId = route.params.id
  const [content, setContent] = useState<string>("")
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false)
  const [tone, setTone] = useState<number>(0)
  const [showAutoScrollSlider, setShowAutoScrollSlider] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState<number>(0)
  const [fontSize, setFontSize] = useState<number>(GlobalSettings.get().fontSize)
  const [selectedChord, selectChord] = useState<Chord | null>(null)
  const [showTabs, setShowTabs] = useState(GlobalSettings.get().showTablature)
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false)
  const [showPageTurner, setShowPageTurner] = useState(GlobalSettings.get().enablePageTurner)
  const songRenderRef = useRef<SongRenderRef>(null)

  function transposeUp() { 
    setTone(tone + 1 >= 12 ? 0 : tone + 1); 
    selectChord(null) }

  function transposeDown() { 
    setTone(tone - 1 <= -12 ? 0 : tone - 1); 
    selectChord(null) }

  function changeFontSize(amount: number) {
    const newFontSize = clamp(fontSize + amount, MIN_FONT_SIZE, MAX_FONT_SIZE)

    setFontSize(newFontSize)

    Song.setPreferences(Song.getById(songId)!, { fontSize: newFontSize })
  }
  
  function increaseFontSize() { 
    changeFontSize(FONT_SIZE_STEP) 
}

  function decreaseFontSize() { 
    changeFontSize(-FONT_SIZE_STEP)
 }

  function openSideMenu() { 
    setIsSideMenuOpen(!isSideMenuOpen) }

  function onPressNextPage() { 
    if (songRenderRef.current) {
        songRenderRef.current.nextPage()
    } 
    }

  function onPressPreviousPage() { 
    if (songRenderRef.current) {
        songRenderRef.current.previousPage()
    } 
    }

  function onChangeShowTabs(value: boolean) {
    setShowTabs(value)
    Song.setPreferences(Song.getById(songId)!, { showTablature: value })
  }

  function onClickChord(allChords: Array<Chord>, chordString: string) {
    selectChord(allChords.find(c => c.toString() == chordString)!)
  }

  function editSong() {
    navigation.replace(Stack.SongEdit, { id: songId })
  }

  function showTone(tone: number) {
    if (tone === 0) {
        return null
    }

    if (tone > 0) {
        return '+' + tone
    }

    return tone
  }

  function onPressArtist() {
    const song = Song.getById(songId)!
    navigation.navigate(Stack.ArtistView, { id: song.artist.id!, title: song.artist.name })
  }

  function tooglePageTurner(value: boolean) {
    if (value) {
      setShowAutoScrollSlider(false)

      setScrollSpeed(0)
    }

    setShowPageTurner(value)
  }

  useEffect(() => {
    const song = Song.getById(songId)!

    setContent(Song.getChordPro(song))
    setTone(song.transposeAmount ? song.transposeAmount : 0)

    if (song.fontSize != null) {
      setFontSize(song.fontSize)
    }

    if (song.showTablature != null) {
      setShowTabs(song.showTablature)
    }
  }, [])

  useEffect(() => {
    const song = Song.getById(songId)!
    
    Song.setPreferences(song, { transposeAmount: tone })
  }, [tone])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.flexRow}>
          <TouchableIcon name="pencil" onPress={editSong} />
          <TouchableIcon name="dots-vertical" onPress={openSideMenu} />
        </View>
      )
    });
  }, [navigation, isSideMenuOpen]);

  return (
    <>
      <SideMenu isOpen={isSideMenuOpen} onDismiss={() => { setIsSideMenuOpen(false) }}>
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text style={styles.toolLabelSmall} >{t('transpose')}</Text>
            <Text style={styles.toolBadge}>{showTone(tone)}</Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton name="minus" onPress={transposeDown} />
            <ToolButton name="plus" onPress={transposeUp} />
          </View>
        </View>
        <Divider />
        <View style={styles.tool}>
          <View style={styles.toolLabel}>
            <Text style={styles.toolLabelSmall}>{t('text_size')}</Text>
            <Text style={styles.toolBadge}>{fontSize}</Text>
          </View>
          <View style={styles.toolButtonContainer}>
            <ToolButton name="format-font-size-decrease" onPress={decreaseFontSize} />
            <ToolButton name="format-font-size-increase" onPress={increaseFontSize} />
          </View>
        </View>
        <Divider />
        <TouchableHighlight onPress={() => {
          setShowPageTurner(false)
          setIsSideMenuOpen(false)
          setShowAutoScrollSlider(true)
        }} style={styles.tool} underlayColor='#ccc'>
          <Text style={styles.toolLabel}>{t('auto_scroll')}</Text>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight onPress={() => onChangeShowTabs(!showTabs)} underlayColor='#ccc'>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('show_tabs')}</Text>
            <Switch onValueChange={onChangeShowTabs} value={showTabs} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight onPress={() => tooglePageTurner(!showPageTurner)} underlayColor='#ccc'>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('page_turner')}</Text>
            <Switch onValueChange={tooglePageTurner} value={showPageTurner} />
          </View>
        </TouchableHighlight>
        <Divider />
        <TouchableHighlight onPress={() => {
          setIsSideMenuOpen(false)
          setShowPlaylistSelection(!showPlaylistSelection)
        }} underlayColor='#ccc'>
          <View style={styles.tool}>
            <Text style={styles.toolLabel}>{t('add_to_playlist')}</Text>
            <TouchableIcon
              name="playlist-plus"
              onPress={() => {
                setIsSideMenuOpen(false)
                setShowPlaylistSelection(!showPlaylistSelection)
              }}
              size={25} />
          </View>
        </TouchableHighlight>
      </SideMenu>
      <SongTransformer
        chordProSong={content}
        fontSize={fontSize}
        showTabs={showTabs}
        transposeDelta={tone}
      >
        {songProps => (
          <View style={{ flex: 1 }}>
            <SongRender
              chordProContent={songProps.htmlSong}
              onPressArtist={onPressArtist}
              onPressChord={(chordString) => onClickChord(songProps.chords, chordString)}
              ref={songRenderRef}
              scrollSpeed={scrollSpeed}
            />
            <ChordTab
              allChords={songProps.chords}
              closeLabel={t('close')}
              onPressClose={() => selectChord(null)}
              selectedChord={selectedChord}
            />
            <AutoScrollSlider
              onClose={() => setShowAutoScrollSlider(false)}
              onValueChange={setScrollSpeed}
              show={showAutoScrollSlider}
            />
            <SelectPlaylist
              onPressClose={() => setShowPlaylistSelection(false)}
              show={showPlaylistSelection}
              songId={songId}
            />
            <PageTurner
              onPressNext={onPressNextPage}
              onPressPrevious={onPressPreviousPage}
              show={showPageTurner}
            />
          </View>
        )}
      </SongTransformer>
    </>
  );
}

export default SongView;

const styles = StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
    },
    tool: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    toolButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toolLabelSmall: {
      maxWidth: 100,
      paddingRight: 0,
      textTransform: 'uppercase',
    },
    toolLabel: {
      position: 'relative',
      textAlign: 'left',
      textTransform: 'uppercase',
      paddingVertical: 10,
    },
    toolBadge: {
      position: 'absolute',
      top: -5,
      right: -15,
      width: 30,
      height: 20,
      color: 'tomato'
    },
})