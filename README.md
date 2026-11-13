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

### Example: Child Programme on DHIS2 play

These steps make the **First name** field in the Child Programme open this app.
The labels match the Android Settings web app 2.5.2, which is installed on play.

| What      | Value                                       |
| --------- | ------------------------------------------- |
| Server    | `https://play.im.dhis2.org/stable-2-43-2-1` |
| Login     | `admin` / `district`                        |
| Program   | Child Programme (`IpHINAT79UW`)             |
| Attribute | First name (`w75KJ2mc4zz`), value type TEXT |
| Org unit  | Ngelehun CHC (`DiszpKrYNg8`)                |

1. Log in to the server in a browser and open the **Android Settings** app. If
   it shows **First time setup**, choose **Set defaults and save**.
2. Go to **Custom Intents** and press **Add intent**. On the **Identifiers** tab:

    | Field         | Value                          |
    | ------------- | ------------------------------ |
    | Intent name   | `Child first name (RN demo)`   |
    | Element type  | Tracked entity attribute       |
    | Attribute     | First name                     |
    | Screen/Action | Data Entry                     |
    | Package name  | `org.dhis2.intentdemo.CAPTURE` |

3. Optional: on the **Request** tab, press **Add parameter** for each row. The
   app shows every extra it receives.

    | Key          | Value                |
    | ------------ | -------------------- |
    | `orgunit_id` | `VAR{orgunit_id}`    |
    | `username`   | `VAR{user_username}` |
    | `source`     | `'child-programme'`  |

    Fixed text needs single quotes. Variables need curly braces:
    `VAR(orgunit_id)` does not parse.

4. On the **Response** tab, set **Extra name** `VALUE` and **Extra type**
   String. Press **Save Intent**, then **Save** at the bottom of the Custom
   Intents page.
5. In the DHIS2 Capture app on the device, log in to the same server as
   `admin` / `district`, then sync the configuration (or log out and back in).
6. Open Child Programme in Ngelehun CHC and enroll a child (or open an existing
   one). Tap **First name**: Android opens this app. Type a name and press
   **Send to DHIS2**.

The intent is attached to the attribute, not the program, so it also appears
wherever First name is used in other programs.

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
