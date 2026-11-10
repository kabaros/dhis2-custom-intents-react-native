package org.dhis2.intentdemo

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

/**
 * Entry point used when the DHIS2 Capture app fires the custom intent
 * (action org.dhis2.intentdemo.CAPTURE). It renders the "CaptureIntent"
 * React component, which returns a value with CustomIntent.sendResult().
 */
class CaptureActivity : ReactActivity() {
    override fun getMainComponentName(): String = "CaptureIntent"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
