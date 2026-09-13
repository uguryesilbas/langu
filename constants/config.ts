import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Runtime configuration, read from `app.config.ts` -> `extra`.
 *
 * Nothing secret lives here: RevenueCat *public* SDK keys and AdMob unit IDs
 * are extractable from any shipped binary by design. Keeping them in env vars
 * is about per-environment values and rotation, not secrecy. The RevenueCat
 * *secret* key (`sk_...`) must never appear in this app.
 */

type Extra = {
  rcIosKey?: string;
  rcAndroidKey?: string;
  admobIosRewardedId?: string;
  admobAndroidRewardedId?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  supportUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// --- RevenueCat ------------------------------------------------------------
export const RC_IOS_KEY = extra.rcIosKey ?? '';
export const RC_ANDROID_KEY = extra.rcAndroidKey ?? '';
export const RC_API_KEY = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY;

export const RC_MONTHLY_PRODUCT_ID_TR = 'linguacard_monthly_10try';
export const RC_ENTITLEMENT_ID = 'premium';

// --- AdMob -----------------------------------------------------------------
const REAL_REWARDED_ID = Platform.select({
  ios: extra.admobIosRewardedId,
  android: extra.admobAndroidRewardedId,
  default: '',
});

/**
 * In development we always use Google's test unit so that ads render without
 * risking policy strikes on the real unit. In production we use the configured
 * unit; if it is missing, `assertReleaseConfig()` below fails loudly at startup
 * rather than shipping a silently dead "Watch ad" button.
 */
export const ADMOB_REWARDED_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : (REAL_REWARDED_ID ?? '');

// --- Legal / support URLs --------------------------------------------------
export const PRIVACY_POLICY_URL = extra.privacyPolicyUrl ?? '';
export const TERMS_URL = extra.termsUrl ?? '';
export const SUPPORT_URL = extra.supportUrl ?? '';

// --- Monetization rules ----------------------------------------------------
export const AD_WORDS_PER_REWARD = 3;

// --- Release guard ---------------------------------------------------------

/**
 * Names every required value that is missing. Empty array === good to ship.
 * Exported so tests and the startup guard can both use it.
 */
export function missingReleaseConfig(): string[] {
  const missing: string[] = [];
  if (!RC_API_KEY) missing.push('RevenueCat API key');
  if (!REAL_REWARDED_ID) missing.push('AdMob rewarded ad unit ID');
  if (!PRIVACY_POLICY_URL) missing.push('Privacy policy URL');
  if (!TERMS_URL) missing.push('Terms of use URL');
  return missing;
}

/**
 * Called once at app start. In a release build a missing value is a hard
 * error: shipping with placeholder monetization config is exactly what got
 * this app flagged in review, so it must never build silently again.
 * In development it is only a warning so the app stays runnable without a .env.
 */
export function assertReleaseConfig(): void {
  const missing = missingReleaseConfig();
  if (missing.length === 0) return;

  const message =
    `LinguaCard config incomplete — missing: ${missing.join(', ')}. ` +
    `Set the matching EXPO_PUBLIC_* variables (see .env.example).`;

  if (__DEV__) {
    console.warn(`[config] ${message}`);
  } else {
    throw new Error(message);
  }
}
