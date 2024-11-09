import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  color: string;
  focused: boolean;
  name: string;
  size: number;
}

function TabBarIcon(props: Props) {
  let nameUnfocused = props.name;

  if (MaterialCommunityIcons.hasIcon(nameUnfocused + '-outline')) {
    nameUnfocused = props.name + '-outline';
  }

  return (
    <MaterialCommunityIcons
      color={props.color}
      name={props.focused ? props.name : nameUnfocused}
      size={25}
    />
  );
}

export default TabBarIcon;
