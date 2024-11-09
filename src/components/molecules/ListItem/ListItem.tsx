import { TouchableIcon } from '@/components/atoms';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Option } from "../OptionsMenu/OptionsMenu";
import OptionsMenu from "../OptionsMenu/OptionsMenu";

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  textContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18
  },
  subtitle: {
    fontSize: 14
  },
  leftIcon: {
    width: 30
  }
});

export type LeftIconOptions = null | 'empty-space' | 'arrow-up' | 'arrow-down'

interface ListItemProps {
  leftIcon?: LeftIconOptions,
  onPress: () => void,
  options?: Option[],
  showIcon?: undefined | null | 'plus' | 'check',
  subtitle?: string,
  title: string
}

function ListItem(props: ListItemProps) {
  const [isMenuEnabled, setMenuEnabled] = useState(false)

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.item}>
      {props.leftIcon == 'empty-space' && <View style={styles.leftIcon}></View>}
      {props.leftIcon != null && props.leftIcon != 'empty-space' &&
        <MaterialCommunityIcons
          name={props.leftIcon}
          size={14}
          style={styles.leftIcon} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.title}</Text>
        {props.subtitle && <Text style={styles.subtitle}>{props.subtitle}</Text>}
      </View>
      {props.showIcon == 'check' && <TouchableIcon name="check" onPress={props.onPress} size={25} />}
      {props.showIcon == 'plus' && <TouchableIcon name="plus" onPress={props.onPress} size={25} />}
      {props.options &&
        <TouchableIcon name="dots-vertical" onPress={() => setMenuEnabled(true)} size={25} />
      }
      {props.options &&
        <OptionsMenu
          enabled={isMenuEnabled}
          onDismiss={() => setMenuEnabled(false)}
          options={props.options} />
      }
    </TouchableOpacity>
  );
}

export default ListItem