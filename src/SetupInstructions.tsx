import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/**
 * Step-by-step setup for the DHIS2 play demo: a custom intent on the
 * "First name" attribute of the Child Programme. Labels match the Android
 * Settings web app 2.5.2 (installed on play).
 */
const SERVER = 'https://play.im.dhis2.org/stable-2-43-2-1'
const ACTION = 'org.dhis2.intentdemo.CAPTURE'

export default function SetupInstructions() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Set it up on DHIS2 play: Child Programme, First name
            </Text>
            <Text style={styles.body}>
                These steps make the First name field in the Child Programme
                open this app. The value you send back fills that field.
            </Text>

            <Table
                rows={[
                    ['Server', SERVER],
                    ['Login', 'admin / district'],
                    ['Program', 'Child Programme (IpHINAT79UW)'],
                    ['Attribute', 'First name (w75KJ2mc4zz), TEXT'],
                    ['Org unit', 'Ngelehun CHC (DiszpKrYNg8)'],
                ]}
            />

            <Step n={1} title="Open the Android Settings app">
                <Text style={styles.body}>
                    Log in to the server above in a browser and open the Android
                    Settings app. If it asks for a First time setup, choose “Set
                    defaults and save”.
                </Text>
            </Step>

            <Step n={2} title="Add the intent">
                <Text style={styles.body}>
                    Go to Custom Intents and press “Add intent”. On the
                    Identifiers tab:
                </Text>
                <Table
                    rows={[
                        ['Intent name', 'Child first name (RN demo)'],
                        ['Element type', 'Tracked entity attribute'],
                        ['Attribute', 'First name'],
                        ['Screen/Action', 'Data Entry'],
                        ['Package name', ACTION],
                    ]}
                />
            </Step>

            <Step n={3} title="Request (optional)">
                <Text style={styles.body}>
                    On the Request tab, press “Add parameter” for each row. This
                    app shows whatever it receives.
                </Text>
                <Table
                    headers={['Key', 'Value']}
                    rows={[
                        ['orgunit_id', 'VAR{orgunit_id}'],
                        ['username', 'VAR{user_username}'],
                        ['source', "'child-programme'"],
                    ]}
                />
                <Text style={styles.note}>
                    Fixed text needs single quotes. Variables need curly braces:
                    VAR(orgunit_id) does not work.
                </Text>
            </Step>

            <Step n={4} title="Response">
                <Text style={styles.body}>On the Response tab:</Text>
                <Table
                    rows={[
                        ['Extra name', 'VALUE'],
                        ['Extra type', 'String'],
                    ]}
                />
                <Text style={styles.body}>
                    Press “Save Intent”, then “Save” at the bottom of the Custom
                    Intents page.
                </Text>
            </Step>

            <Step n={5} title="Sync the Capture app">
                <Text style={styles.body}>
                    In the DHIS2 Capture app on this device, log in to the same
                    server (admin / district), then sync the configuration, or
                    log out and back in.
                </Text>
            </Step>

            <Step n={6} title="Try it">
                <Text style={styles.body}>
                    Open Child Programme in Ngelehun CHC and enroll a new child
                    (or open an existing one). Tap the First name field: Android
                    opens this app. Type a name and press “Send to DHIS2”.
                </Text>
                <Text style={styles.note}>
                    The intent is attached to the attribute, so it also appears
                    wherever First name is used in other programs.
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

/** Without headers, the first column is styled as row labels. */
function Table({ headers, rows }: { headers?: string[]; rows: string[][] }) {
    const all = headers ? [headers, ...rows] : rows
    return (
        <View style={styles.table}>
            {all.map((row, i) => {
                const isHeader = !!headers && i === 0
                return (
                    <View
                        key={i}
                        style={[
                            styles.row,
                            i === 0 && styles.firstRow,
                            isHeader && styles.headerRow,
                        ]}
                    >
                        {row.map((cell, j) => {
                            const isLabel = !headers && j === 0
                            return (
                                <Text
                                    key={j}
                                    selectable
                                    style={[
                                        styles.cell,
                                        isHeader || isLabel
                                            ? styles.labelCell
                                            : styles.mono,
                                        isLabel && styles.labelColumn,
                                    ]}
                                >
                                    {cell}
                                </Text>
                            )
                        })}
                    </View>
                )
            })}
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
    table: { borderWidth: 1, borderColor: '#e8edf2', borderRadius: 3 },
    row: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e8edf2',
    },
    firstRow: { borderTopWidth: 0 },
    headerRow: { backgroundColor: '#f8f9fa' },
    cell: { flex: 1, padding: 6, fontSize: 12 },
    labelColumn: { flex: 0.5, backgroundColor: '#f8f9fa' },
    labelCell: { fontWeight: '600', color: '#404b5a' },
    mono: { fontFamily: 'monospace', color: '#212934' },
})
