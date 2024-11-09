import { Config } from '@/navigation/paths';
import type { SettingsStackParamList } from '@/navigation/types';
import { FontSizeSelect, Settings } from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SettingsStack = createStackNavigator<SettingsStackParamList>();

function SettingsTab () {
  const { t } = useTranslation()
  
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen component={Settings} name={Config.Settings} options={{ title: t('settings') }} />
      <SettingsStack.Screen component={FontSizeSelect} name={Config.FontSizeSelect} options={{ title: t('text_size') }} />
    </SettingsStack.Navigator>
  )
}

export default SettingsTab