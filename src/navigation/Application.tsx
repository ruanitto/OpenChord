import MainTab from '@/navigation/MainTab';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { Example, OnlineArtistView, Startup } from '@/screens';
import { useTheme } from '@/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { t } = useTranslation()
  const { variant, navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={MainTab} name={Paths.MainTab} options={{ title: t('home') }} />
          <Stack.Screen component={OnlineArtistView} name={Paths.OnlineArtistView} options={({ route }) => ({ title: route.params.title })} />
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
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
