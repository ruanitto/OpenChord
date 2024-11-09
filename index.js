import { AppRegistry } from 'react-native';
import 'react-native-get-random-values'

import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__) {
  import('@/reactotron.config');
}

AppRegistry.registerComponent(appName, () => App);
