import { ErrorText } from '@/components/atoms';
import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    paddingVertical: 20
  }
})

interface LoadingIndicatorProps {
  error?: string | null,
  loading?: boolean,
  style?: StyleProp<ViewStyle>
}

function LoadingIndicator ({ error, loading, style }: LoadingIndicatorProps) {
  return (
    <View style={[styles.container, style]}>
      <ErrorText style={styles.activity}>{error}</ErrorText>
      {loading && <ActivityIndicator style={styles.activity} />}
    </View>
  )
}

export default LoadingIndicator