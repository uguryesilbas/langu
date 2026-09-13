// Web platform stub — react-native-google-mobile-ads is not supported on web.
export type AdResult = 'rewarded' | 'dismissed' | 'unavailable';

export function initAdMob(): Promise<void> {
  return Promise.resolve();
}

export async function showRewardedAd(): Promise<AdResult> {
  return 'unavailable';
}
