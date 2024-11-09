import React from "react";
import { TextProps, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  errorMsg: { color: 'red' }
})

function ErrorText(props: TextProps) {
  let { style, children } = props

  if (children != null) {
    return <Text {...props} style={[styles.errorMsg, style]}>{children}</Text>
  } else {
    return null
  }
}

export default ErrorText