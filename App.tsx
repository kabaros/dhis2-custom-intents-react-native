/**
 * Launcher screen. The real work happens in src/CaptureScreen.tsx, which
 * opens when the DHIS2 Capture app fires the custom intent.
 *
 * @format
 */

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>DHIS2 Custom Intent demo</Text>
        <Text style={styles.body}>
          This app is opened by the DHIS2 Capture app. In the Android Settings
          web app, set a custom intent with Package Name:
        </Text>
        <Text style={styles.mono}>org.dhis2.intentdemo.CAPTURE</Text>
        <Text style={styles.body}>
          and a response with Extra Name VALUE and Extra Type String.
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', color: '#000' },
  body: { color: '#333' },
  mono: { fontFamily: 'monospace', color: '#000' },
});
