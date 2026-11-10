package org.dhis2.intentdemo.customintent

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CustomIntentPackage : BaseReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? =
        if (name == CustomIntentModule.NAME) CustomIntentModule(reactContext) else null

    override fun getReactModuleInfoProvider() =
        ReactModuleInfoProvider {
            mapOf(
                CustomIntentModule.NAME to
                    ReactModuleInfo(
                        name = CustomIntentModule.NAME,
                        className = CustomIntentModule.NAME,
                        canOverrideExistingModule = false,
                        needsEagerInit = false,
                        isCxxModule = false,
                        isTurboModule = true,
                    ),
            )
        }
}
