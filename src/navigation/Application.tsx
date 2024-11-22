import MainTab from '@/navigation/MainTab';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { ArtistView, Example, OnlineArtistView, PlaylistView, SongPreview, Startup } from '@/screens';
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
          <RootStack.Screen component={SongPreview} name={Stack.SongPreview} options={{ title: t('preview') }} />
          <RootStack.Screen component={ArtistView} name={Stack.ArtistView} options={({ route }) => ({ title: route.params.title })} />
          {/* <RootStack.Screen
            name="SongView"
            component={SongView}
            options={({ route }) => ({ title: route.params.title })} />
          <RootStack.Screen
            name="SongEdit"
            component={SongEdit} /> */}
        <RootStack.Screen component={PlaylistView} name={Stack.PlaylistView} options={({ route }) => ({ title: route.params.title })} />
          {/* <RootStack.Screen
            name="PlaylistAddSongs"
            component={PlaylistAddSongs}
            options={{ title: t('add_songs') }} />
          <RootStack.Screen
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
