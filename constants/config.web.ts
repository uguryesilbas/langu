// Web platform stub — no native ad/IAP modules on web.
import Constants from 'expo-constants';

type Extra = {
  privacyPolicyUrl?: string;
  termsUrl?: string;
  supportUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

export const RC_IOS_KEY = '';
export const RC_ANDROID_KEY = '';
export const RC_API_KEY = '';

export const RC_MONTHLY_PRODUCT_ID_TR = 'linguacard_monthly_10try';
export const RC_ENTITLEMENT_ID = 'premium';

export const ADMOB_REWARDED_UNIT_ID = '';

export const PRIVACY_POLICY_URL = extra.privacyPolicyUrl ?? '';
export const TERMS_URL = extra.termsUrl ?? '';
export const SUPPORT_URL = extra.supportUrl ?? '';

export const AD_WORDS_PER_REWARD = 3;

export function missingReleaseConfig(): string[] {
  return [];
}

export function assertReleaseConfig(): void {}
