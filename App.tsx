/**
 * Launcher entry point. Shows the same CaptureScreen that opens when the DHIS2
 * Capture app fires the custom intent (see src/CaptureScreen.tsx), so it can
 * be tried out directly from the launcher icon.
 *
 * @format
 */

import React from 'react'
import CaptureScreen from './src/CaptureScreen'

export default function App() {
    return <CaptureScreen />
}
