import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  backgroundOverlayer: {
    backgroundColor: '#00000040',
    flex: 1,
    justifyContent: 'flex-end'
  },
  outsideContainer: {
    flex: 1
  },
  container: {
    backgroundColor: 'white'
  },
  optionItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionTitle: {
    paddingVertical: 20,
    fontSize: 18
  }
});

export interface Option {
  onPress: () => void,
  title: string
}

interface OptionsMenuProps {
  enabled: boolean
  onDismiss: () => void,
  options: Option[]
}

function OptionsMenu({ enabled, onDismiss, options }: OptionsMenuProps) {

  if (!enabled) {return null}

  return (
    <Modal onDismiss={onDismiss} transparent>
      <View style={styles.backgroundOverlayer}>
        <TouchableOpacity onPress={onDismiss} style={styles.outsideContainer} />
        <View style={styles.container}>
          {options.map(option => {
            return (
              <TouchableOpacity
                key={option.title}
                onPress={() => {
                  onDismiss()
                  option.onPress()
                }}
                style={styles.optionItem}>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </Modal>
  );
}

export default OptionsMenu