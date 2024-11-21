import MainTab from '@/navigation/MainTab';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { Example, OnlineArtistView, Startup } from '@/screens';
import { useTheme } from '@/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootStack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { t } = useTranslation()
  const { variant, navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <RootStack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <RootStack.Screen component={MainTab} name={Stack.MainTab} options={{ title: t('home') }} />
          <RootStack.Screen component={OnlineArtistView} name={Stack.OnlineArtistView} options={({ route }) => ({ title: route.params.title })} />
          {/* <Stack.Screen
            name="SongPreview"
            component={SongPreview}
            options={{ title: t('preview') }} />
          <Stack.Screen
            name="ArtistView"
            component={ArtistView}
            options={({ route }) => ({ title: route.params.title })} />
          <Stack.Screen
            name="SongView"
            component={SongView}
            options={({ route }) => ({ title: route.params.title })} />
          <Stack.Screen
            name="SongEdit"
            component={SongEdit} />
          <Stack.Screen
            name="PlaylistView"
            component={PlaylistView}
            options={({ route }) => ({ title: route.params.title })} />
          <Stack.Screen
            name="PlaylistAddSongs"
            component={PlaylistAddSongs}
            options={{ title: t('add_songs') }} />
          <Stack.Screen
            name="PlaylistEdit"
            component={PlaylistEdit}
            options={{ headerShown: false }} /> */}
          {/* OLD SCREENS */}
          <RootStack.Screen component={Startup} name={Stack.Startup} />
          <RootStack.Screen component={Example} name={Stack.Example} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
