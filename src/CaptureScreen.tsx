import React, { useMemo, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { cancel, getLaunchInfo, sendResult } from './customIntent';

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
  const launchInfo = useMemo(getLaunchInfo, []);
  const [value, setValue] = useState('');

  const onSend = () =>
    sendResult({
      VALUE: { type: 'string', value },
      VALUE_JSON: { type: 'json', value: { value } },
      VALUE_LIST: {
        type: 'json',
        value: value.split(',').map(v => ({ value: v.trim() })),
      },
    });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Custom intent received</Text>
          <Text style={styles.label}>Action</Text>
          <Text style={styles.mono}>{launchInfo.action ?? '(none)'}</Text>

          <Text style={styles.label}>Request extras</Text>
          {Object.keys(launchInfo.extras).length === 0 ? (
            <Text style={styles.mono}>(none)</Text>
          ) : (
            Object.entries(launchInfo.extras).map(([key, extra]) => (
              <Text key={key} style={styles.mono}>
                {key} ({extra.type}) = {String(extra.value)}
              </Text>
            ))
          )}

          <Text style={styles.label}>Value to return</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="e.g. ABC-123"
            autoFocus
          />
          <View style={styles.buttons}>
            <Button title="Send to DHIS2" onPress={onSend} disabled={!value} />
            <Button title="Cancel" onPress={cancel} color="#888" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 8 },
  label: { fontWeight: '600', color: '#333', marginTop: 12 },
  mono: { fontFamily: 'monospace', color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    padding: 10,
    color: '#000',
  },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
});
