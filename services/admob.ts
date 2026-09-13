import mobileAds, {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { ADMOB_REWARDED_UNIT_ID } from '../constants/config';

/** How long we wait for an ad to load and finish before giving up. */
const AD_TIMEOUT_MS = 20_000;

export type AdResult = 'rewarded' | 'dismissed' | 'unavailable';

let initPromise: Promise<void> | null = null;

/**
 * Initializes the Google Mobile Ads SDK. Idempotent and safe to await from
 * several places — the SDK must be initialized before any ad request, and
 * forgetting this call is why the reward flow silently did nothing before.
 */
export function initAdMob(): Promise<void> {
  if (!initPromise) {
    initPromise = mobileAds()
      .initialize()
      .then(() => undefined)
      .catch((e) => {
        // Allow a later attempt to retry rather than caching the failure.
        initPromise = null;
        throw e;
      });
  }
  return initPromise;
}

/**
 * Loads and shows a rewarded ad.
 *
 * Resolves with:
 *  - 'rewarded'    the user watched enough of the ad to earn the reward
 *  - 'dismissed'   the ad showed but the user closed it early
 *  - 'unavailable' no ad could be loaded/shown (no fill, offline, misconfigured)
 *
 * Always resolves — never hangs — so the caller's loading state can't get stuck.
 */
export async function showRewardedAd(): Promise<AdResult> {
  if (!ADMOB_REWARDED_UNIT_ID) {
    console.warn('AdMob: no rewarded ad unit configured.');
    return 'unavailable';
  }

  try {
    await initAdMob();
  } catch (e) {
    console.warn('AdMob initialize error:', e);
    return 'unavailable';
  }

  return new Promise<AdResult>((resolve) => {
    const rewarded = RewardedAd.createForAdRequest(ADMOB_REWARDED_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribers: (() => void)[] = [];
    let rewardEarned = false;
    let settled = false;

    const timeout = setTimeout(() => {
      console.warn('AdMob: timed out waiting for rewarded ad.');
      finish('unavailable');
    }, AD_TIMEOUT_MS);

    function finish(result: AdResult) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      for (const off of unsubscribers) {
        try {
          off();
        } catch {
          // A listener that is already gone is not an error.
        }
      }
      resolve(result);
    }

    unsubscribers.push(
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        rewardEarned = true;
      }),
      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewarded.show().catch((e) => {
          console.warn('AdMob show error:', e);
          finish('unavailable');
        });
      }),
      rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        console.warn('AdMob load error:', error);
        finish('unavailable');
      }),
      rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        finish(rewardEarned ? 'rewarded' : 'dismissed');
      })
    );

    rewarded.load();
  });
}
