package org.dhis2.intentdemo.customintent

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import org.json.JSONObject

/**
 * Reads the extras sent by the DHIS2 Capture app and returns the result.
 *
 * The Capture app reads the returned extras by "Extra Type" (see the custom
 * intent configuration in the Android Settings web app):
 *  - String              -> getStringExtra
 *  - Integer             -> getIntExtra    (must be an Int, not a Long)
 *  - Float               -> getFloatExtra  (must be a Float, not a Double)
 *  - Boolean             -> getBooleanExtra
 *  - JSON Object / List  -> getStringExtra, then parsed as JSON
 */
class CustomIntentModule(
    reactContext: ReactApplicationContext,
) : NativeCustomIntentSpec(reactContext) {
    override fun getName() = NAME

    override fun getLaunchInfo(): String {
        val intent = reactApplicationContext.currentActivity?.intent
        val extras = JSONObject()
        intent?.extras?.let { bundle ->
            for (key in bundle.keySet()) {
                @Suppress("DEPRECATION")
                val value = bundle.get(key)
                extras.put(
                    key,
                    JSONObject()
                        .put("type", value?.javaClass?.simpleName ?: "null")
                        .put("value", value?.toString() ?: JSONObject.NULL),
                )
            }
        }
        return JSONObject()
            .put("action", intent?.action ?: JSONObject.NULL)
            .put("extras", extras)
            .toString()
    }

    override fun sendResult(extrasJson: String) {
        val data = Intent()
        val extras = JSONObject(extrasJson)
        for (key in extras.keys()) {
            val entry = extras.getJSONObject(key)
            val value = entry.get("value")
            when (entry.getString("type")) {
                "int" -> data.putExtra(key, entry.getInt("value"))
                "float" -> data.putExtra(key, entry.getDouble("value").toFloat())
                "boolean" -> data.putExtra(key, entry.getBoolean("value"))
                // "json" and "string": JSONObject/JSONArray.toString() yields the JSON text
                else -> data.putExtra(key, value.toString())
            }
        }
        finishWith(Activity.RESULT_OK, data)
    }

    override fun cancel() = finishWith(Activity.RESULT_CANCELED, null)

    private fun finishWith(
        resultCode: Int,
        data: Intent?,
    ) {
        UiThreadUtil.runOnUiThread {
            reactApplicationContext.currentActivity?.apply {
                setResult(resultCode, data)
                finish()
            }
        }
    }

    companion object {
        const val NAME = "CustomIntent"
    }
}
