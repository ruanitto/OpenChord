import { useDimensions } from '@/utils/useDimensions';
import type { ForwardRefRenderFunction } from 'react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';

interface Props {
  chordProContent: string
  onPressArtist?: () => void,
  onPressChord?: (chord: string) => void,
  scrollSpeed?: number
}

export interface SongRenderRef {
  nextPage: () => void
  previousPage: () => void
}

const ARTIST_TAG = "<artist>"

const SongRender: ForwardRefRenderFunction<SongRenderRef, Props> = (props, ref) => {
  const webRef = useRef<WebView>(null)
  const { scrollSpeed = 0 } = props
  const dimensionsData = useDimensions()
  const height = dimensionsData.windowData.height

  useImperativeHandle(ref, () => ({
    nextPage() {
      if (webRef.current) {
        webRef.current.injectJavaScript(scriptScrollBy(height * 0.7))
      }
    },
    previousPage() {
      if (webRef.current) {
        webRef.current.injectJavaScript(scriptScrollBy(-height * 0.8))
      }
    }
  }))

  useEffect(() => {
    const run: string = scrollSpeed <= 0 ? `
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      true;
      ` : `
      function pageScroll(){
        window.scrollBy(0,1);
      }
      if(window.intervalId) {
        clearInterval(window.intervalId);
      }
      window.intervalId = setInterval(pageScroll, ${(1 - scrollSpeed) * 200 + 10});
      true;
      `;
    if (webRef.current) {
      webRef.current.injectJavaScript(run)
    }
  }, [props.scrollSpeed])


  function onReceiveMessage(event: NativeSyntheticEvent<WebViewMessage>) {
    const { data } = event.nativeEvent
    if (props.onPressArtist && data.includes(ARTIST_TAG)) {
      props.onPressArtist()
    } else if (props.onPressChord) {
      props.onPressChord(event.nativeEvent.data)
    }
  }

  const htmlStyles = (scrollSpeed > 0) ? styles : smoothScrollStyle + styles
  return (
    <WebView
      injectedJavaScript={onClickChordPostMessage}
      onMessage={onReceiveMessage}
      overScrollMode={'never'}
      ref={webRef}
      source={{ html: renderHtml(props.chordProContent, htmlStyles) }}
      startInLoadingState={true}
    />
  )
}
function renderHtml(body: string, styles: string) {
  return `<html>
    <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
    <body>${body}</body>
    <style>${styles}</style>
  </html>`
}
const scriptScrollBy = (scrollY: number) => {
  return `
  window.scrollBy(0, (${scrollY}))
  true;
  `
}
const onClickChordPostMessage = `
(
  function() {
    function onClickChord (chord) {
      return function () {
        window.ReactNativeWebView.postMessage(chord)
      }
    }
    var anchors = document.getElementsByClassName('chord');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var chord = anchor.innerText || anchor.textContent;
        anchor.onclick = onClickChord(chord)
    }
    var artistNodes = document.getElementsByClassName('artist');
    for(var i = 0; i < artistNodes.length; i++) {
        var anchor = artistNodes[i];
        var artist = anchor.innerText || anchor.textContent;
        anchor.onclick = onClickChord("${ARTIST_TAG}" + artist)
    }
})();

true;
`
const smoothScrollStyle = `
html {
  scroll-behavior: smooth;
}
`
const styles = `
body {
  font-family: monospace;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
   -khtml-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
.title {
  font-size: 20px
}
.artist {
  display: block;
  font-weight: bold;
  color: red;
  cursor: pointer;
  margin-bottom: 24px;
}
.chord:hover {
  color: blue;
}
.line {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: 10px;
  margin-left: 0px;
  position: relative;
  font-size: 14px;
  font-family: monospace;
  white-space: pre-wrap;
}
.line-size-14 { font-size: 14px; }
.line-size-15 { font-size: 15px; }
.line-size-16 { font-size: 16px; }
.line-size-17 { font-size: 17px; }
.line-size-18 { font-size: 18px; }
.line-size-19 { font-size: 19px; }
.line-size-20 { font-size: 20px; }
.line-size-21 { font-size: 21px; }
.line-size-22 { font-size: 22px; }
.line-size-23 { font-size: 23px; }
.line-size-24 { font-size: 24px; }
.chord {
  color: red;
  position: relative;
  display: inline-block;
  padding-top: 20px;
  width: 0px;
  top: -17px;
  cursor: pointer;
}
.chord-inline {
  position: inherit;
  display: inline-block;
  padding-top: 0px;
  width: auto;
  top: auto;
}
.chord-size-14 { top: -14px; }
.chord-size-15 { top: -15px; }
.chord-size-16 { top: -16px; }
.chord-size-17 { top: -17px; }
.chord-size-18 { top: -18px; }
.chord-size-19 { top: -19px; }
.chord-size-20 { top: -20px; }
.chord-size-21 { top: -21px; }
.chord-size-22 { top: -22px; }
.chord-size-23 { top: -23px; }
.chord-size-24 { top: -24px; }
.chord:active {
  color: blue;
}
.word {
  display: inline-block;
}
.tab {
}
.tab-line {
  max-width: 4px;
  display: inline-block;
  word-wrap: break-word;
  padding-bottom: 20px;
}
`
export default forwardRef(SongRender)