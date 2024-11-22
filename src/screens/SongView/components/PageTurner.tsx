import type { FC } from "react";
import React, { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onPressNext: () => void,
  onPressPrevious: () => void,
  show: boolean
}

const PageTurner: FC<Props> = ({ show, onPressNext, onPressPrevious }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (show) {
      Animated.sequence([
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }
        ),
      ]).start()
    }
  }, [show])

  if (!show) {return null}

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={onPressPrevious}
          style={styles.touchableArea}
          underlayColor="#00000000">
          <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="arrow-up" size={40} />
          </Animated.View>
        </TouchableHighlight>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={onPressNext}
          style={styles.touchableArea}
          underlayColor="#00000000">
          <Animated.View style={[styles.button, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="arrow-down" size={40} />
          </Animated.View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default PageTurner

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  },
  buttonContainer: { flex: 1 },
  touchableArea: {
    width: '100%',
    height: '100%'
  },
  button: {
    borderRadius: 5,
    flex: 1,
    backgroundColor: '#00000030',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});