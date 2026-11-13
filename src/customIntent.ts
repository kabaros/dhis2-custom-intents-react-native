import NativeCustomIntent from '../specs/NativeCustomIntent'

export type ExtraType = 'string' | 'int' | 'float' | 'boolean' | 'json'

export type ResultExtra =
    | { type: 'string'; value: string }
    | { type: 'int' | 'float'; value: number }
    | { type: 'boolean'; value: boolean }
    | { type: 'json'; value: object }

export type LaunchInfo = {
    action: string | null
    extras: Record<string, { type: string; value: string | null }>
}

/** The action and request extras the Capture app sent. */
export function getLaunchInfo(): LaunchInfo {
    return JSON.parse(NativeCustomIntent.getLaunchInfo())
}

/**
 * Return values to the Capture app and close this screen.
 * Each key is the "Extra Name" set in the Android Settings web app response.
 */
export function sendResult(extras: Record<string, ResultExtra>): void {
    NativeCustomIntent.sendResult(JSON.stringify(extras))
}

/** Close without returning a value. */
export function cancel(): void {
    NativeCustomIntent.cancel()
}
