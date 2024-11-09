import { ListItem, LoadingIndicator, PickerModal } from '@/components/molecules';
import { createBundle, decodeJsonBundle, importBundle } from '@/db/bundler';
import { GlobalSettings } from '@/db/GlobalSettings';
import { useI18n } from '@/hooks';
import { languages, type Language } from '@/hooks/language/schema';
import { Config } from '@/navigation/paths';
import type { SettingsStackParamList } from '@/navigation/types';
import { resources } from '@/translations';
import createFile from '@/utils/createFile';
import pad from '@/utils/pad';
import { useFocusEffect } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, PermissionsAndroid, Platform, ScrollView, StyleSheet } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import AboutDev from './components/AboutDev';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

type SettingsScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  Config.Settings
>

type Props = {
  navigation: SettingsScreenNavigationProp
}

function Settings(props: Props) {
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()
  const [loading, setLoading] = useState(false)
  const [activeLanguageSelect, setActiveLanguageSelect] = useState(false)
  const [activeShowTablatureSelect, setActiveShowTablatureSelect] = useState(false)
  const [activeEnablePageTurnerSelect, setActiveEnablePageTurnerSelect] = useState(false)
  const [fontSize, setFontSize] = useState(GlobalSettings.get().fontSize)
  const [showTablature, setShowTablature] = useState(GlobalSettings.get().showTablature)
  const [enablePageTurner, setEnablePageTurner] = useState(GlobalSettings.get().enablePageTurner)

  const showTablatureOptions = [
    { key: 'default-show-true', label: t('show_tabs_by_default'), value: true },
    { key: 'default-show-false', label: t('hide_tabs_by_default'), value: false },
  ]
  const enablePageTurnerOptions = [
    { key: 'page-turner-true', label: t('enable_page_turner_by_default'), value: true },
    { key: 'page-turner-false', label: t('disable_page_turner_by_default'), value: false },
  ]

  async function requestWritePermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: t('permission_title'),
        message: t('permission_message'),
        buttonNegative: t('permission_button_negative'),
        buttonPositive: t('permission_button_positive')
      }
    )
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // eslint-disable-next-line no-console
      console.log('You can write on the external storage');
    } else {
      throw new Error(t('permission_denied'))
    }
  }

  async function onPressExport() {
    if (loading) {return}
    setLoading(true)
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid
          .check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        if (!hasPermission) {
          await requestWritePermission()
        }
      }
      const bundle = createBundle()
      const bundleString = JSON.stringify(bundle)
      const today = new Date()
      const day = pad(today.getDate())
      const month = pad(today.getMonth() + 1)
      const year = today.getFullYear()
      const path = await createFile('downloads', `backup-${year}_${month}_${day}`, bundleString)
      
      if (Platform.OS === 'android') {
        Alert.alert(t('success'), t('backup_saved_at_path') + ': ' + path)
      } else {
        await Share.open({ url: "file://" + path })
      }
    } catch (error) {
      Alert.alert('Error', error.message)
      // eslint-disable-next-line no-console
      console.warn(error.message)
    }

    setLoading(false)
  }

  async function onPressImport() {
    if (loading) {
        return
    }

    setLoading(true)

    try {
      let type = [DocumentPicker.types.allFiles]

      if (Platform.OS === 'ios') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const iosAllFileTypes: any = 'public.item'
        type = [iosAllFileTypes]
      }
      
      const res = await DocumentPicker.pick({ type });
      const success = await RNFS.readFile(res[0]?.uri, 'utf8')
      const bundle = await decodeJsonBundle(success)

      importBundle(bundle)

      Alert.alert(t('info'), t('songs_imported_successfully'))
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (error instanceof Error) {
        Alert.alert(t('error'), t('invalid_file'))
      }
    }

    setLoading(false)
  }

  function onChangeLanguage(value: Language) {
    GlobalSettings.setLanguage(value)
    changeLanguage(value)
  }

  function onChangeShowTablature(value: boolean) {
    GlobalSettings.setShowTablature(value)
    setShowTablature(value)
  }

  function onChangeEnablePageTurner(value: boolean) {
    GlobalSettings.setEnablePageTurner(value)
    setEnablePageTurner(value)
  }

  function configureFontSize() {
    props.navigation.navigate(Config.FontSizeSelect)
  }

  useFocusEffect(
    useCallback(() => {
      setFontSize(GlobalSettings.get().fontSize)
    }, [])
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <ListItem onPress={onPressExport} subtitle={t('create_backup_description')} title={t('create_backup')} />
        <ListItem onPress={onPressImport} subtitle={t('import_description')} title={t('import')} />
        <ListItem onPress={() => setActiveLanguageSelect(true)} subtitle={t('language_name')} title={t('language')} />
        <ListItem onPress={configureFontSize} subtitle={fontSize.toString()} title={t('text_size')} />
        <ListItem
          onPress={() => setActiveShowTablatureSelect(true)}
          title={showTablatureOptions.find(o => o.value === showTablature)!.label}
        />
        <ListItem
          onPress={() => setActiveEnablePageTurnerSelect(true)}
          title={enablePageTurnerOptions.find(o => o.value === enablePageTurner)!.label}
        />
        <LoadingIndicator loading={loading} />
        <AboutDev />
      </ScrollView>
      <PickerModal
        onChange={onChangeLanguage}
        onDismiss={() => setActiveLanguageSelect(false)}
        options={languages.map(l => ({
          key: 'lang-option-' + l,
          label: resources[l].openchord.language_name,
          description: resources[l].openchord.language_english_name,
          value: l
        }))}
        show={activeLanguageSelect}
        value={language}
      />
      <PickerModal
        onChange={onChangeShowTablature}
        onDismiss={() => setActiveShowTablatureSelect(false)}
        options={showTablatureOptions}
        show={activeShowTablatureSelect}
        value={showTablature}
      />
      <PickerModal
        onChange={onChangeEnablePageTurner}
        onDismiss={() => setActiveEnablePageTurnerSelect(false)}
        options={enablePageTurnerOptions}
        show={activeEnablePageTurnerSelect}
        value={enablePageTurner}
      />
    </>
  )
}

export default Settings