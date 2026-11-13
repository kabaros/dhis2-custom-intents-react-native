import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

/**
 * Bridge to the Android Activity that the DHIS2 Capture app launched.
 *
 * Values cross the bridge as JSON strings to keep the codegen spec simple.
 */
export interface Spec extends TurboModule {
    /**
     * JSON: { action: string | null, extras: { [key]: { type, value } } }
     * Describes the intent that started the current Activity.
     */
    getLaunchInfo(): string

    /**
     * JSON: { [extraName]: { type: 'string'|'int'|'float'|'boolean'|'json', value } }
     * Sets RESULT_OK with these extras and closes the Activity.
     */
    sendResult(extrasJson: string): void

    /** Sets RESULT_CANCELED and closes the Activity. */
    cancel(): void
}

export default TurboModuleRegistry.getEnforcing<Spec>('CustomIntent')
