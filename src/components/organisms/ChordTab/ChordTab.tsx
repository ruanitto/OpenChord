import chords from '@/assets/chords/guitar.json';
import { ChordChart } from '@/components/molecules';
import type { Chord } from 'chordsheetjs';
import type { FunctionComponent } from "react";
import React, { useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  allChords: Array<Chord>,
  closeLabel: string,
  onPressClose: () => void
  selectedChord: Chord | null | undefined
}

const ChordTab: FunctionComponent<Props> = ({ selectedChord, allChords, onPressClose, closeLabel }) => {
  const flatList = useRef<FlatList<Chord>>(null)

  if (selectedChord != null && flatList.current != null)
    {flatList.current.scrollToItem({ animated: true, item: selectedChord })}

  if (selectedChord == null)
    {return null}

  return (
    <View style={styles.tabContainter}>
      <TouchableOpacity onPress={onPressClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>{closeLabel}</Text>
      </TouchableOpacity>
      <FlatList
        data={allChords}
        extraData={selectedChord}
        horizontal
        keyExtractor={(item, index) => item.toString()}
        onScrollToIndexFailed={() => { }}
        ref={flatList}
        renderItem={({ item }) => {
          const allChords: any = chords
          let position = null

          if (allChords.hasOwnProperty(item.toString())) {
            const chordObj = allChords[item.toString()].find(() => true)
            if (chordObj != null) {
              position = chordObj.positions
            }
          }

          let selectedStyle: StyleProp<ViewStyle> = null

          if (item.toString() == selectedChord.toString())
            {selectedStyle = styles.itemSelected}

          return (
            <View key={item.toString()} style={[styles.item, selectedStyle]}>
              <ChordChart
                chord={position}
                height={120}
                width={100}
              />
              <Text>{item.toString()}</Text>
            </View>
          )
        }}
        style={styles.chordList}
      />
    </View>

  );
}

export default ChordTab

const styles = StyleSheet.create({
  tabContainter: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 180,
    zIndex: 999
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 2,
    fontSize: 14
  },
  closeButtonText: {
    fontSize: 16
  },
  chordList: {
    backgroundColor: '#eee'
  },
  item: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTitle: {
    fontSize: 18
  },
  itemSelected: {
    borderBottomColor: 'tomato',
    borderBottomWidth: 5
  }
});