import MainTab from '@/navigation/MainTab';
import { Stack } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { ArtistView, Example, OnlineArtistView, PlaylistAddSongs, PlaylistEdit, PlaylistView, SongEdit, SongPreview, SongView, Startup } from '@/screens';
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
        <RootStack.Navigator key={variant}>
          <RootStack.Screen component={MainTab} name={Stack.MainTab} options={{ headerShown: false, title: t('home') }} />
          <RootStack.Screen component={OnlineArtistView} name={Stack.OnlineArtistView} options={({ route }) => ({ title: route.params.title })} />
          <RootStack.Screen component={SongPreview} name={Stack.SongPreview} options={{ title: t('preview') }} />
          <RootStack.Screen component={ArtistView} name={Stack.ArtistView} options={({ route }) => ({ title: route.params.title })} />
          <RootStack.Screen component={SongView} name={Stack.SongView} options={({ route }) => ({ title: route.params.title })} />
          <RootStack.Screen component={SongEdit} name={Stack.SongEdit} options={{ title: t('edit_song') }}/>
          <RootStack.Screen component={PlaylistView} name={Stack.PlaylistView} options={({ route }) => ({ title: route.params.title })} />
          <RootStack.Screen component={PlaylistAddSongs} name={Stack.PlaylistAddSongs} options={{ title: t('add_songs') }} />
          <RootStack.Screen component={PlaylistEdit} name={Stack.PlaylistEdit} options={{ headerShown: false }} />

          {/* OLD SCREENS */}
          <RootStack.Screen component={Startup} name={Stack.Startup} />
          <RootStack.Screen component={Example} name={Stack.Example} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
