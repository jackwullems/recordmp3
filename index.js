/**
 * @format
 */

import {AppRegistry} from 'react-native'
import 'react-native-gesture-handler'
import AppWrapper from './AppWrapper'
import {name as appName} from './app.json'


AppRegistry.registerComponent(appName, () => AppWrapper);
