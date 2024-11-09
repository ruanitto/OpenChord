import { useEffect, useState } from "react";
import type { ScaledSize } from "react-native";
import { Dimensions } from "react-native";

export const useDimensions = () => {
  const [windowData, setWindowData] = useState(Dimensions.get('window'));
  const [screenData, setScreenData] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const onChange = (result: { screen: ScaledSize, window: ScaledSize; }) => {
      setWindowData(result.window)
      setScreenData(result.screen)
    };

    Dimensions.addEventListener('change', onChange);

    // return () => Dimensions.removeEventListener('change', onChange);
  });

  return {
    windowData,
    screenData,
    isLandscape: screenData.width > screenData.height,
  };
};