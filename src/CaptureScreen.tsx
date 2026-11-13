import React, { useMemo, useState } from 'react'
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { cancel, getLaunchInfo, sendResult } from './customIntent'
import SetupInstructions from './SetupInstructions'

/**
 * Shown when the DHIS2 Capture app launches the custom intent.
 *
 * It lists the request extras that were received, lets the user type a value,
 * and returns it in three shapes so you can try each response "Extra Type":
 *   VALUE      String               -> Property: (empty)
 *   VALUE_JSON JSON Object          -> Property: value
 *   VALUE_LIST List of JSON Objects -> Property: value
 */
export default function CaptureScreen() {
    const launchInfo = useMemo(() => getLaunchInfo(), [])
    const [value, setValue] = useState('')

    const onSend = () =>
        sendResult({
            VALUE: { type: 'string', value },
            VALUE_JSON: { type: 'json', value: { value } },
            VALUE_LIST: {
                type: 'json',
                value: value.split(',').map((v) => ({ value: v.trim() })),
            },
        })

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Custom intent received</Text>
                    <Text style={styles.label}>Intent payload</Text>
                    <ScrollView horizontal style={styles.json}>
                        <Text style={styles.mono} selectable>
                            {JSON.stringify(launchInfo, null, 2)}
                        </Text>
                    </ScrollView>

                    <Text style={styles.label}>Value to return</Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        placeholder="e.g. ABC-123"
                        autoFocus
                    />
                    <View style={styles.buttons}>
                        <Button
                            title="Send to DHIS2"
                            onPress={onSend}
                            disabled={!value}
                        />
                        <Button title="Cancel" onPress={cancel} color="#888" />
                    </View>

                    <View style={styles.divider} />
                    <SetupInstructions />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 16, gap: 8 },
    title: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 8 },
    label: { fontWeight: '600', color: '#333', marginTop: 12 },
    mono: { fontFamily: 'monospace', color: '#222', fontSize: 12 },
    json: {
        backgroundColor: '#f3f5f7',
        borderRadius: 3,
        padding: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 6,
        padding: 10,
        color: '#000',
    },
    buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
    divider: { height: 1, backgroundColor: '#e8edf2', marginVertical: 24 },
})
