/**
 * Launcher screen: explains how to configure the custom intent. The real work
 * happens in src/CaptureScreen.tsx, which opens when the DHIS2 Capture app
 * fires the custom intent.
 *
 * @format
 */

import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import SetupInstructions from './src/SetupInstructions'

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safe}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>DHIS2 Custom Intent demo</Text>
                    <SetupInstructions />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { padding: 16, gap: 16 },
    title: { fontSize: 20, fontWeight: '600', color: '#000' },
})
