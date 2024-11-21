import type { FunctionComponent } from "react";
import React from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps extends TextInputProps {
  inputRef?: React.RefObject<TextInput> | null | undefined,
  onChangeText: (text: string) => void,
  onSubmitEditing?: () => void,
  placeholder: string,
  query: string
}

const SearchBar: FunctionComponent<SearchBarProps> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon color="#aaa" name="magnify" size={24} />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          keyboardType="default"
          onSubmitEditing={props.onSubmitEditing}
          placeholderTextColor="#aaa"
          ref={props.inputRef}
          style={styles.searchText}
          value={props.query}
          {...props}
        />
      </View>
    </View>
  );
}

export default SearchBar

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 100,
    paddingHorizontal: 10
  },
  searchText: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 8,
    fontSize: 18
  }
});