import type { FunctionComponent } from "react";
import React from "react";
import { View } from "react-native";
import Svg, {
    Circle,
    Line,
    Rect,
    Text,
} from 'react-native-svg';

interface Props {
  chord: Array<string>,
  height?: number,
  showTuning?: boolean,
  tuning?: Array<string>,
  width?: number
}

const ChordChart: FunctionComponent<Props> = (props) => {
  let {
    width = 100,
    height = 120,
    showTuning = false,
    tuning = ['E', 'A', 'D', 'G', 'B', 'E'],
    chord
  } = props

  if (chord == null || chord == undefined || chord.length <= 0) {
    chord = ['x', 'x', 'x', 'x', 'x', 'x']
  }

  let fretPosition = 0
  let lower = 100

  chord.forEach(c => {
    if (c != 'x') {
      if (Number.parseInt(c) < lower)
        {lower = Number.parseInt(c)}
    }
  })
  
  const normalizedChord = chord.slice()

  if (lower == 100) {
    fretPosition = 0
  } else if (lower >= 3) {
    fretPosition = lower
    
    for (let i = 0; i < chord.length; i++) {
      normalizedChord[i] = chord[i] == 'x' ? 'x' : (Number.parseInt(chord[i]) - (lower - 1)).toString()
    }
  }

  const barres: any[] = [
    // { from: 6, to: 1, fret: 1 },
    // { from: 4, to: 5, fret: 4 },
  ]

  const tuningContainerHeight = 20
  const chartWidth = width * 0.75
  const chartHeight = showTuning ? height * 0.75 - tuningContainerHeight : height * 0.75;


  const circleRadius = chartWidth / 15
  const bridgeStrokeWidth = Math.ceil(chartHeight / 36)
  const fontSize = Math.ceil(chartWidth / 8)
  const numStrings = chord.length
  const numFrets = 5

  const fretWidth = 1
  const stringWidth = 1

  const defaultColor = '#666'
  const strokeWidth = 1

  const stringSpacing = (chartWidth / numStrings);

  // Add room on sides for finger positions on 1. and 6. string
  const chartXPos = width - chartWidth
  const chartYPos = showTuning ? height - chartHeight - tuningContainerHeight : height - chartHeight;

  const fretLabelTextWidth = 10
  //start draw func
  const fretSpacing = chartHeight / numFrets

  function drawText(x: number, y: number, msg: string) {
    return <Text
      fill={defaultColor}
      fontSize={fontSize}
      key={"text-" + x + y + msg}
      stroke={defaultColor}
      textAnchor="middle"
      x={x}
      y={y}
    >
      {msg}
    </Text>
  }

  function lightUp(stringNum: number, fret: string) {
    const mute = fret === 'x';
    const fretNum = fret === 'x' ? 0 : Number.parseInt(fret);

    const x = chartXPos + stringSpacing * stringNum;
    const y1 = chartYPos + fretSpacing * fretNum - fretSpacing / 2;

    const stringIsLoose = fretNum == 0
    
    if (!mute && !stringIsLoose) {
      return <Circle
        cx={x}
        cy={y1}
        fill={defaultColor}
        key={"finger-" + stringNum}
        r={circleRadius}
        stroke={defaultColor}
        strokeWidth={strokeWidth}
      />
    }
  }

  function lightBar(stringFrom: number, stringTo: number, fretNum: number) {

    const stringFromNum = numStrings - stringFrom;
    const stringToNum = numStrings - stringTo;

    const y1 = chartYPos + fretSpacing * (fretNum - 1) + fretSpacing / 2;

    return <Line
      stroke={defaultColor}
      strokeLinecap={"round"}
      strokeWidth={circleRadius * 2}
      x1={chartXPos + stringSpacing * stringFromNum}
      x2={chartXPos + stringSpacing * stringToNum}
      y1={y1}
      y2={y1}
    />
  }
  
  return (
    <View
      style={[
        { height: props.height, width: props.width },
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Svg height={props.height} width={props.width}>
        {// Draw guitar bridge
          fretPosition <= 1 ?
            <Rect
              fill={defaultColor}
              height={bridgeStrokeWidth}
              width={chartWidth - stringSpacing}
              x={chartXPos}
              y={chartYPos}
            /> :
            // Draw fret position
            drawText(
              chartXPos - fretLabelTextWidth,
              chartYPos + fontSize - fretWidth + (fretSpacing - fontSize) / 2,
              `${fretPosition}º`)
        }
        {// Draw strings
          Array.from(Array(numStrings)).map((s, i) => {
            return (
              <Line
                key={"string-" + i}
                stroke={defaultColor}
                strokeWidth={stringWidth}
                x1={chartXPos + (stringSpacing * i)}
                x2={chartXPos + (stringSpacing * i)}
                y1={chartYPos}
                y2={chartYPos + fretSpacing * numFrets}
              />
            )
          })}
        {// Draw frets
          Array.from(Array(numFrets)).map((f, i) => {
            return (
              <Line
                key={"fret-" + i}
                stroke={defaultColor}
                strokeWidth={fretWidth}
                x1={chartXPos}
                x2={chartXPos + stringSpacing * (numStrings - 1)}
                y1={chartYPos + fretSpacing * i}
                y2={chartYPos + fretSpacing * i}
              />
            )
          })}
        {// Draw mute and loose strings icons
          normalizedChord.map((c, i) => {
            if (c == 'x') {
              return drawText(
                chartXPos + stringSpacing * i,
                chartYPos - fontSize, 'X')
            } else if (c == '0') {
              return <Circle
                cx={chartXPos + stringSpacing * i}
                cy={chartYPos - fontSize - circleRadius}
                fill="none"
                key={"circle-" + i}
                r={circleRadius}
                stroke={defaultColor}
                strokeWidth={strokeWidth}
              />
            }
          })
        }
        {// Draw finger circles
          normalizedChord.map((c, i) => {
            return lightUp(i, c)
          })
        }
        {// Draw barres
          barres.map(barre => {
            return lightBar(barre.from, barre.to, barre.fret);
          })
        }

        {// Draw tuning
          showTuning && tuning.length == numStrings &&
          tuning.map((t, i) => {
            return drawText(
              chartXPos + stringSpacing * i,
              chartYPos + chartHeight + fontSize,
              t);
          })
        }
      </Svg>
    </View>
  );
}

export default ChordChart