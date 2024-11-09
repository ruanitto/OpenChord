import { PrimaryButton } from "@/components/atoms";
import React from "react";
import { Text, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  }
})

interface EmptyListMessageProps {
  message: string
  onPress?: () => void
  buttonTitle?: string
}

function EmptyListMessage({ message, onPress, buttonTitle }: EmptyListMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {buttonTitle && onPress &&
        <PrimaryButton onPress={onPress} title={buttonTitle} />
      }
    </View>
  )
}

export default EmptyListMessage