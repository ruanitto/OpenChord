import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function AboutDev() {
  const { t } = useTranslation()

  async function goToDevURL() {
    try {
      await Linking.openURL('https://github.com/artutra')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.lightGray}>{t('developed_by')} </Text>
      <TouchableOpacity onPress={goToDevURL} style={styles.devButton}>
        <Text style={styles.primaryColor}>Artur Miranda</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  devButton: {
    paddingVertical: 20
  },
  lightGray: {
    color: '#888'
  },
  primaryColor: {
    color: 'tomato'
  }
})

export default AboutDev