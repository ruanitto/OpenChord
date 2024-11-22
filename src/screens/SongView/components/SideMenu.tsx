import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDimensions } from "../../../utils/useDimensions";

type Props = PropsWithChildren<{
  isOpen: boolean
  onDismiss: () => void
}>

const SideMenu: FC<Props> = ({ isOpen, onDismiss, children }) => {
  const { isLandscape, windowData } = useDimensions()

  if (!isOpen) {return null}

  const maxHeight = windowData.height
  const heightStyle = isLandscape ? { height: maxHeight - 50 } : {}

  return (
    <Modal onDismiss={onDismiss} transparent  >
      <TouchableOpacity onPress={onDismiss} style={styles.backgroundOverlayer} />
      <SafeAreaView style={[styles.fixed, heightStyle]}>
        <ScrollView bounces={false} contentContainerStyle={[styles.card]}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backgroundOverlayer: {
    flex: 1,
    backgroundColor: '#00000020',
  },
  fixed: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  card: {
    display: 'flex',
    borderRadius: 4,
    elevation: 2,
    backgroundColor: 'white',
  },
})

export default SideMenu