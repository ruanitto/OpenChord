import { TouchableIcon } from '@/components/atoms';
import Slider from '@react-native-community/slider';
import type { FunctionComponent } from "react";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface AutoScrollSliderProps {
  onClose: () => void,
  onValueChange: (value: number) => void,
  show: boolean
}

const AutoScrollSlider: FunctionComponent<AutoScrollSliderProps> = (props) => {
  const { show, onClose, onValueChange } = props
  const [isActive, setIsActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(0.5)

  function onSliderValueChange(value: number) {
    setSliderValue(value)
    if (isActive) {
      onValueChange(sliderValue)
    }
  }

  function play() {
    setIsActive(true)
    onValueChange(sliderValue)
  }

  function stop() {
    setIsActive(false)
    onValueChange(0)
  }

  useEffect(() => {
    if (show) {
      setIsActive(true)
    }
  }, [show])

  useEffect(() => {
    if (isActive) {
      onSliderValueChange(sliderValue)
    }
  }, [isActive])

  return !show ? null : (
      <View style={styles.container}>
        {
          isActive ?
            <TouchableIcon name="pause" onPress={stop} /> :
            <TouchableIcon name="play" onPress={play} />
        }
        <Slider
          maximumValue={1}
          minimumValue={0}
          onSlidingComplete={onSliderValueChange}
          onSlidingStart={onSliderValueChange}
          onValueChange={onSliderValueChange}
          style={{ flex: 1 }}
          value={sliderValue}
        />
        <TouchableIcon name="close" onPress={onClose} />
      </View>
    );
}
export default AutoScrollSlider

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ccc'
  }
});