import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import type { LeftIconOptions } from '../ListItem/ListItem';
import ListItem from '../ListItem/ListItem';

export interface PickerOption<T> {
  description?: string,
  key?: string,
  label: string,
  leftIcon?: LeftIconOptions
  value: T
}

interface Props<T> {
  onChange: (name: T) => void,
  onDismiss: () => void,
  options: PickerOption<T>[]
  show: boolean,
  value: T
}

function PickerModal<T>(props: Props<T>) {
  const {
    value,
    show,
    onDismiss,
    options,
    onChange
  } = props

  if (!show) {return null}

  return (
    <Modal onDismiss={onDismiss} transparent>
      <View style={styles.backgroundOverlayer}>
        <TouchableOpacity onPress={onDismiss} style={styles.outsideContainer} />
        <View style={styles.container}>
          {options.map(o => {
            return (
              <ListItem
                key={o.key}
                leftIcon={o.leftIcon}
                onPress={() => onChange(o.value)}
                showIcon={o.value === value ? 'check' : null}
                subtitle={o.description}
                title={o.label} />
            )
          })}
        </View>
      </View>
    </Modal>
  );
}

export default PickerModal

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
  }
});