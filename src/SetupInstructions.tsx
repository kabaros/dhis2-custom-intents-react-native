import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ACTION = 'org.dhis2.intentdemo.CAPTURE'

const RESPONSES = [
    { name: 'VALUE', type: 'String', property: '(leave empty)' },
    { name: 'VALUE_JSON', type: 'JSON Object', property: 'value' },
    { name: 'VALUE_LIST', type: 'List of JSON Objects', property: 'value' },
]

const REQUEST_EXAMPLES = [
    { key: 'orgunit_id', value: 'VAR{orgunit_id}' },
    { key: 'username', value: 'VAR{user_username}' },
    { key: 'mode', value: "'demo'" },
]

/**
 * How to configure the custom intent in the Android Settings web app.
 * Shown on the launcher screen and under the intent screen.
 */
export default function SetupInstructions() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Setting up the custom intent</Text>
            <Text style={styles.body}>
                The DHIS2 Capture app opens this app from a form field, and the
                value you enter is sent back into that field. Set it up in the
                Android Settings web app on your DHIS2 server:
            </Text>

            <Step n={1} title="Add a custom intent">
                <Text style={styles.body}>
                    Open the Android Settings web app, go to Custom Intents, and
                    add a new one. Give it a name, and choose the data elements
                    or attributes it applies to (the trigger). Use a text value
                    type for those fields.
                </Text>
            </Step>

            <Step n={2} title="Package name">
                <Text style={styles.body}>
                    Must match this app’s intent action:
                </Text>
                <Text style={styles.code} selectable>
                    {ACTION}
                </Text>
            </Step>

            <Step n={3} title="Response">
                <Text style={styles.body}>
                    Add one of these extras. They are different shapes of the
                    same value, so pick one to try:
                </Text>
                <Table
                    headers={['Extra name', 'Extra type', 'Property']}
                    rows={RESPONSES.map((r) => [r.name, r.type, r.property])}
                />
            </Step>

            <Step n={4} title="Request arguments (optional)">
                <Text style={styles.body}>
                    Keys become intent extras, and this app lists whatever it
                    receives. Values are expressions: wrap fixed text in single
                    quotes, and use VAR
                    {'{…}'} for context variables (orgunit_id, orgunit_code,
                    orgunit_path, user_id, user_username).
                </Text>
                <Table
                    headers={['Key', 'Value']}
                    rows={REQUEST_EXAMPLES.map((r) => [r.key, r.value])}
                />
                <Text style={styles.note}>
                    Use curly braces: VAR(orgunit_id) with parentheses does not
                    parse.
                </Text>
            </Step>

            <Step n={5} title="Sync and try it">
                <Text style={styles.body}>
                    Save, then sync the configuration in the Capture app (or log
                    out and back in). Open a form with the configured field and
                    tap it: Android opens this app, and “Send to DHIS2” fills
                    the field.
                </Text>
            </Step>
        </View>
    )
}

function Step({
    n,
    title,
    children,
}: {
    n: number
    title: string
    children: React.ReactNode
}) {
    return (
        <View style={styles.step}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{n}</Text>
            </View>
            <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{title}</Text>
                {children}
            </View>
        </View>
    )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <View style={styles.table}>
            {[headers, ...rows].map((row, i) => (
                <View key={i} style={[styles.row, i === 0 && styles.headerRow]}>
                    {row.map((cell, j) => (
                        <Text
                            key={j}
                            selectable
                            style={[
                                styles.cell,
                                i === 0 ? styles.headerCell : styles.mono,
                            ]}
                        >
                            {cell}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { gap: 16 },
    heading: { fontSize: 18, fontWeight: '600', color: '#000' },
    body: { color: '#333', lineHeight: 20 },
    note: { color: '#6C7787', fontSize: 12 },
    step: { flexDirection: 'row', gap: 12 },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#00695c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    stepBody: { flex: 1, gap: 6 },
    stepTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
    code: {
        fontFamily: 'monospace',
        color: '#000',
        backgroundColor: '#f3f5f7',
        padding: 8,
        borderRadius: 3,
    },
    table: { borderWidth: 1, borderColor: '#e8edf2', borderRadius: 3 },
    row: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#e8edf2' },
    headerRow: { borderTopWidth: 0, backgroundColor: '#f8f9fa' },
    cell: { flex: 1, padding: 6, fontSize: 12 },
    headerCell: { fontWeight: '600', color: '#404b5a' },
    mono: { fontFamily: 'monospace', color: '#212934' },
})
