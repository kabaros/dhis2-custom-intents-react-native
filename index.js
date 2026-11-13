/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import CaptureScreen from './src/CaptureScreen'
import { name as appName } from './app.json'

// Opened from the launcher icon.
AppRegistry.registerComponent(appName, () => App)
// Opened by the DHIS2 Capture app through the custom intent (CaptureActivity).
AppRegistry.registerComponent('CaptureIntent', () => CaptureScreen)
