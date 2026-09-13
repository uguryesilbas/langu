import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Native configuration lives here — NOT in ios/Info.plist.
 *
 * `ios/` and `android/` are gitignored generated folders (Continuous Native
 * Generation). Anything hand-edited inside them is destroyed by the next
 * `expo prebuild --clean` or EAS Build. This file is the single source of
 * truth; run `npx expo prebuild --clean` after changing it.
 */

// --- Secrets / environment -------------------------------------------------
// These are *public* client keys (safe to ship in a binary) but they are kept
// out of source control so they can differ per environment and be rotated.
const RC_IOS_KEY = process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '';
const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '';
const ADMOB_IOS_APP_ID = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ?? '';
const ADMOB_ANDROID_APP_ID = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ?? '';
const ADMOB_IOS_REWARDED_ID = process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED_ID ?? '';
const ADMOB_ANDROID_REWARDED_ID = process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED_ID ?? '';
const PRIVACY_POLICY_URL = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '';
const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL ?? '';
const SUPPORT_URL = process.env.EXPO_PUBLIC_SUPPORT_URL ?? '';

// Google's public test IDs. Used only when no real ID is supplied, so a
// developer running `expo start` without a .env still sees working test ads.
const TEST_ADMOB_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';
const TEST_ADMOB_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

/**
 * SKAdNetwork identifiers for Google AdMob. They only affect ad-install
 * attribution (and therefore eCPM) — a stale entry is inert, it simply never
 * matches a network.
 *
 * Inlined rather than imported: Expo loads this config through a CommonJS
 * loader that cannot resolve a relative `.ts` import from here.
 *
 * VERIFY BEFORE EACH RELEASE — Google updates the list regularly:
 * https://developers.google.com/admob/ios/download#skadnetwork-identifiers
 */
const SKADNETWORK_IDS = [
  'cstr6suwn9.skadnetwork',
  '4fzdc2evr5.skadnetwork',
  '2fnua5tdw4.skadnetwork',
  'ydx93a7ass.skadnetwork',
  '5a6flpkh64.skadnetwork',
  'p78axxw75g.skadnetwork',
  'v72qych5uu.skadnetwork',
  'ludvb6z3bs.skadnetwork',
  'cp8zw746q7.skadnetwork',
  '3sh42y64q3.skadnetwork',
  'c6k4g5qg8m.skadnetwork',
  's39g8k73mm.skadnetwork',
  '3qy4746246.skadnetwork',
  'hs6bdukanm.skadnetwork',
  'mlmmfzh3r3.skadnetwork',
  'v4nxqhlyqp.skadnetwork',
  'wzmmz9fp6w.skadnetwork',
  'su67r6k2v3.skadnetwork',
  'yclnxrl5pm.skadnetwork',
  '7ug5zh24hu.skadnetwork',
  'gta9lk7p23.skadnetwork',
  'vutu7akeur.skadnetwork',
  'y5ghdn5j9k.skadnetwork',
  'v9wttpbfk9.skadnetwork',
  'n38lu8286q.skadnetwork',
  '47vhws6wlr.skadnetwork',
  'kbd757ywx3.skadnetwork',
  '9t245vhmpl.skadnetwork',
  'a2p9lx4jpn.skadnetwork',
  '22mmun2rn7.skadnetwork',
  '44jx6755aq.skadnetwork',
  'k674qkevps.skadnetwork',
  '4468km3ulz.skadnetwork',
  '2u9pt9hc89.skadnetwork',
  '8s468mfl3y.skadnetwork',
  'klf5c3l5u5.skadnetwork',
  'ppxm28t8ap.skadnetwork',
  'kbmxgpxpgc.skadnetwork',
  'uw77j35x4d.skadnetwork',
  '578prtvx9j.skadnetwork',
  '4dzt52r2t5.skadnetwork',
  'tl55sbb4fm.skadnetwork',
  'e5fvkxwrpn.skadnetwork',
  '8c4e2ghe7u.skadnetwork',
  '3rd42ekr43.skadnetwork',
  '3qcr597p9d.skadnetwork',
];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'LinguaCard',
  slug: 'LinguaCard',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'linguacard',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F0F4FF',
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.linguacard.app',
    // Build number is managed remotely by EAS (`appVersionSource: "remote"` in
    // eas.json) and auto-incremented on every production build. Setting it
    // here too would conflict with that.
    config: {
      // No proprietary encryption — only standard HTTPS. Avoids the
      // "Missing Compliance" prompt on every TestFlight/App Store upload.
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      // App Transport Security: no arbitrary loads, and no local-networking
      // exception (the app makes no requests of its own).
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: false,
      },
      // Required for SKAdNetwork ad attribution. Without it AdMob eCPM drops.
      SKAdNetworkItems: SKADNETWORK_IDS.map((id) => ({
        SKAdNetworkIdentifier: id,
      })),
      // Portrait-only on iPhone; upside-down is never useful for a card UI.
      UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
      UISupportedInterfaceOrientations$ipad: [
        'UIInterfaceOrientationPortrait',
        'UIInterfaceOrientationPortraitUpsideDown',
        'UIInterfaceOrientationLandscapeLeft',
        'UIInterfaceOrientationLandscapeRight',
      ],
    },

    /**
     * The app's own privacy manifest. AdMob and RevenueCat each ship their
     * own manifest inside their pod, and Expo aggregates them at build time —
     * this declares only what LinguaCard itself is responsible for.
     *
     * `NSPrivacyTracking: false` is consistent with the code: ads are
     * requested with `requestNonPersonalizedAdsOnly: true` and the IDFA is
     * never requested, so there is no ATT prompt. If personalized ads are
     * ever enabled, this must flip to true AND an ATT prompt must be added.
     */
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [
        {
          // RevenueCat records the subscription state tied to the purchase.
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePurchaseHistory',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: [
            'NSPrivacyCollectedDataTypePurposeAppFunctionality',
          ],
        },
      ],
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['0A2A.1', '3B52.1', 'C617.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
          NSPrivacyAccessedAPITypeReasons: ['E174.1', '85F4.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
          NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
        },
      ],
    },
  },

  android: {
    package: 'com.linguacard.app',
    // versionCode likewise comes from EAS remote versioning.
    adaptiveIcon: {
      backgroundColor: '#1565C0',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },

  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-localization',
    [
      'react-native-google-mobile-ads',
      {
        iosAppId: ADMOB_IOS_APP_ID || TEST_ADMOB_IOS_APP_ID,
        androidAppId: ADMOB_ANDROID_APP_ID || TEST_ADMOB_ANDROID_APP_ID,
        // We never request the IDFA, so no ATT prompt and no tracking.
        userTrackingUsageDescription: undefined,
      },
    ],
    './plugins/withInfoPlistCleanup',
  ],

  experiments: {
    typedRoutes: true,
  },

  // Everything under `extra` is readable at runtime via expo-constants.
  extra: {
    rcIosKey: RC_IOS_KEY,
    rcAndroidKey: RC_ANDROID_KEY,
    admobIosRewardedId: ADMOB_IOS_REWARDED_ID,
    admobAndroidRewardedId: ADMOB_ANDROID_REWARDED_ID,
    privacyPolicyUrl: PRIVACY_POLICY_URL,
    termsUrl: TERMS_URL,
    supportUrl: SUPPORT_URL,
  },
});
