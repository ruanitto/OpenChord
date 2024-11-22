import { TouchableIcon } from '@/components/atoms';
import type { FunctionComponent } from "react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DraggableItemProps {
  onDragEnd: () => void,
  onDragStart: () => void,
  onPressDelete: () => void
  subtitle?: string,
  title: string
}

const DraggableItem: FunctionComponent<DraggableItemProps> = ({ title, subtitle, onDragStart, onDragEnd, onPressDelete }) => {
  return (
    <View style={styles.item}>
      <TouchableIcon name="minus-circle-outline" onPress={onPressDelete} size={20} style={styles.deleteIcon} />
      <View style={styles.labelAndDragContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <TouchableIcon activeOpacity={1} name="drag" onPressIn={onDragStart} onPressOut={onDragEnd} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    paddingVertical: 5
  },
  deleteIcon: {
    flex: 0
  },
  textContainer: {
    flex: 1
  },
  labelAndDragContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  }
})

export default DraggableItem