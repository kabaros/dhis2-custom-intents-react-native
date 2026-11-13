# DHIS2 Custom Intent demo (React Native)

A minimal Android app that the **DHIS2 Android Capture App** (3.3.0+) can open
through a [custom intent](https://docs.dhis2.org/en/use/android-app/android-web-apps/settings-configuration.html#capture_app_android_settings_webapp_custom_intents).
It shows the request extras it received, lets you type a value, and returns that
value to the Capture app field.

| Thing                                                          | Value                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Intent action ("Package Name" in the Android Settings web app) | `org.dhis2.intentdemo.CAPTURE`                                                                                        |
| Application id                                                 | `org.dhis2.intentdemo`                                                                                                |
| Returned extras                                                | `VALUE` (String), `VALUE_JSON` (JSON Object, property `value`), `VALUE_LIST` (List of JSON Objects, property `value`) |

## Run it

You need Node 20+, JDK 17, and the Android SDK with `platform-tools` on your `PATH`.

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

npm install
npm start               # terminal 1: Metro bundler
npm run android         # terminal 2: build, install and launch on the emulator or device
```

Install the DHIS2 Capture app on the **same** emulator or device, from the Play
Store or by running the capture-app repo (`./gradlew installDhis2Debug`).

### Test without DHIS2

```bash
adb shell am start -a org.dhis2.intentdemo.CAPTURE --es GREETING "hello"
```

This shows the capture screen with `GREETING`. Pressing _Send_ closes it; with
`am start` there is no caller to receive the result.

## Configure it in DHIS2

In the **Android Settings** web app, open **Custom Intents → Add Custom Intent**:

| Field                        | Value                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| Element Type                 | Tracked Entity Attribute (or Data Element)                                                            |
| Attribute / Data Element     | any **TEXT** or **LONG_TEXT** one                                                                     |
| Screen/Action                | `DATA_ENTRY` (and/or `SEARCH`)                                                                        |
| Package Name                 | `org.dhis2.intentdemo.CAPTURE`                                                                        |
| Request parameter (optional) | key `ORG_UNIT`, value `VAR{orgunit_id}`; key `GREETING`, value `'hello'` (strings need single quotes) |
| Response                     | Extra Name `VALUE`, Extra Type `String`, Property empty                                               |

Save, then sync the configuration in the Capture app.

## How it works

The Capture app does `Intent(<Package Name>)` with your request parameters as
extras, wrapped in a chooser, and waits for `RESULT_OK`. It then reads each
configured response extra with the matching getter: `getStringExtra`,
`getIntExtra`, `getFloatExtra` or `getBooleanExtra`. JSON types are read as a
String and parsed. The relevant source is `CustomIntentActivityResultContract.kt`
in the capture app's `form` module.

```
Capture app ──Intent(action=org.dhis2.intentdemo.CAPTURE, extras)──▶ CaptureActivity
                                                                     └─ renders "CaptureIntent" (src/CaptureScreen.tsx)
Capture app ◀──setResult(RESULT_OK, extras: VALUE, VALUE_JSON, ...)── CustomIntent.sendResult()
```

| File                                                                                 | Purpose                                                               |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `android/app/src/main/AndroidManifest.xml`                                           | `CaptureActivity` with the intent-filter for the action               |
| `android/app/src/main/java/org/dhis2/intentdemo/CaptureActivity.kt`                  | ReactActivity that renders the `CaptureIntent` component              |
| `android/app/src/main/java/org/dhis2/intentdemo/customintent/CustomIntentModule.kt`  | Turbo Native Module: reads the extras, calls `setResult` and `finish` |
| `android/app/src/main/java/org/dhis2/intentdemo/customintent/CustomIntentPackage.kt` | Registers the module (added in `MainApplication.kt`)                  |
| `specs/NativeCustomIntent.ts`                                                        | Codegen spec for the module                                           |
| `src/customIntent.ts`                                                                | Typed JS wrapper: `getLaunchInfo()`, `sendResult()`, `cancel()`       |
| `src/CaptureScreen.tsx`                                                              | UI shown when the Capture app opens the intent                        |
| `index.js`                                                                           | Registers `Dhis2IntentApp` (launcher) and `CaptureIntent` (intent)    |

To return numbers or booleans, use
`sendResult({ COUNT: { type: 'int', value: 3 } })`. Supported types are
`'int' | 'float' | 'boolean' | 'string' | 'json'`, and they map to the Extra
Types Integer, Float, Boolean, String and JSON Object / List of JSON Objects.

## How it was created

These are the commands, in order, that produced this repo.

```bash
cd ~/code/dhis

# 1. Scaffold (React Native 0.88.1, TypeScript, New Architecture)
npx --yes @react-native-community/cli@latest init Dhis2IntentApp \
  --directory dhis2-custom-intent-app \
  --package-name org.dhis2.intentdemo \
  --skip-git-init --install-pods false --pm npm

cd dhis2-custom-intent-app

# 2. Rename the npm package and add the codegen config for the native module
node -e '
const fs=require("fs");const p=JSON.parse(fs.readFileSync("package.json"));
p.name="dhis2-custom-intent-app";
p.codegenConfig={name:"NativeCustomIntentSpec",type:"modules",jsSrcsDir:"specs",
  android:{javaPackageName:"org.dhis2.intentdemo.customintent"}};
fs.writeFileSync("package.json",JSON.stringify(p,null,2)+"\n");'

# 3. Folders for the new files
mkdir -p specs src android/app/src/main/java/org/dhis2/intentdemo/customintent
```

4. Add or edit these files by hand (contents are in the repo):
    - New: `specs/NativeCustomIntent.ts`, `src/customIntent.ts`, `src/CaptureScreen.tsx`,
      `android/.../CaptureActivity.kt`, `android/.../customintent/CustomIntentModule.kt`,
      `android/.../customintent/CustomIntentPackage.kt`
    - Edited: `AndroidManifest.xml` (added `CaptureActivity` and its intent-filter),
      `MainApplication.kt` (`add(CustomIntentPackage())`), `index.js` (registered
      `CaptureIntent`), `App.tsx` (simple launcher screen), `README.md`

```bash
# 5. Point Gradle at the Android SDK, then verify
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
npx tsc --noEmit
npx eslint .
(cd android && ./gradlew assembleDebug)   # also runs codegen for NativeCustomIntentSpec
```
