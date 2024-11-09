import { ErrorText, PrimaryButton } from "@/components/atoms";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface TextInputModalProps {
  enabled: boolean
  error?: string | null,
  initialValue?: string,
  onChange?: (name: string) => void,
  onDismiss: () => void,
  onSubmit: (name: string) => void,
  placeholder?: string,
  submitButtonTitle?: string,
  value?: string
}

const styles = StyleSheet.create({
  backgroundOverlayer: {
    backgroundColor: '#00000040',
    flex: 1,
    justifyContent: 'flex-end'
  },
  outsideContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000040'
  },
  input: {
    fontSize: 24,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingLeft: 8
  },
  button: {
    paddingVertical: 16
  }
});

function TextInputModal({
  enabled,
  initialValue = "",
  placeholder,
  onDismiss,
  error,
  onSubmit,
  submitButtonTitle = 'OK',
  onChange,
  value: propsValue
}: TextInputModalProps) {

  const [value, setValue] = useState(initialValue)
  const textInput = useRef<TextInput>(null)

  useEffect(() => {
    if (enabled && textInput.current) {
      setTimeout(() => textInput.current?.focus(), 100)
    }
  }, [enabled])

  function onChangeText(value: string) {
    setValue(value)

    if (onChange)
      {onChange(value)}
  }

  if (!enabled) {return null}

  return (
    <Modal onDismiss={onDismiss} transparent>
      <View style={styles.container}>
        <TouchableOpacity onPress={onDismiss} style={styles.outsideContainer} />
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} contentContainerStyle={styles.backgroundOverlayer}>
          <TextInput onChangeText={onChangeText} placeholder={placeholder} ref={textInput} style={styles.input} value={propsValue} />
          <ErrorText>{error}</ErrorText>
          <PrimaryButton onPress={() => onSubmit(value)} style={styles.button} title={submitButtonTitle} />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default TextInputModal
