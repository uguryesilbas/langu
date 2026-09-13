import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';
import { RC_API_KEY, RC_ENTITLEMENT_ID, RC_MONTHLY_PRODUCT_ID_TR } from '../constants/config';
import { isTurkeyUser } from '../utils/locale';
import type { PurchaseResult, SubscriptionInfo } from '../types/subscription';

let _configured = false;

const NOT_PREMIUM: SubscriptionInfo = { isPremium: false, expiresAt: null, productId: null };

export function isConfigured(): boolean {
  return _configured;
}

export async function initRevenueCat(): Promise<void> {
  if (_configured) return;
  if (!RC_API_KEY) {
    // `assertReleaseConfig()` already throws for this in release builds; in dev
    // we stay runnable so the rest of the app can be worked on without keys.
    console.warn('RevenueCat: no API key configured, purchases disabled.');
    return;
  }
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey: RC_API_KEY });
  _configured = true;
}

function toInfo(customerInfo: CustomerInfo): SubscriptionInfo {
  const entitlement = customerInfo.entitlements.active[RC_ENTITLEMENT_ID];
  return {
    isPremium: entitlement != null,
    expiresAt: entitlement?.expirationDate ?? null,
    productId: entitlement?.productIdentifier ?? null,
  };
}

/**
 * Subscribes to entitlement changes (renewal, expiry, purchase on another
 * device). Returns an unsubscribe function, or null when RevenueCat is not
 * configured.
 */
export function onSubscriptionChange(
  listener: (info: SubscriptionInfo) => void
): (() => void) | null {
  if (!_configured) return null;
  // `addCustomerInfoUpdateListener` returns void, so we keep the exact
  // function reference in order to remove it again on unmount.
  const handler = (customerInfo: CustomerInfo) => listener(toInfo(customerInfo));
  Purchases.addCustomerInfoUpdateListener(handler);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(handler);
  };
}

export async function checkSubscription(): Promise<SubscriptionInfo> {
  if (!_configured) return NOT_PREMIUM;
  try {
    return toInfo(await Purchases.getCustomerInfo());
  } catch (e) {
    console.warn('RevenueCat checkSubscription error:', e);
    return NOT_PREMIUM;
  }
}

function findPackage(offerings: Awaited<ReturnType<typeof Purchases.getOfferings>>) {
  const available = offerings.current?.availablePackages ?? [];
  if (isTurkeyUser()) {
    const trPkg = available.find((p) => p.product.identifier === RC_MONTHLY_PRODUCT_ID_TR);
    if (trPkg) return trPkg;
  }
  return offerings.current?.monthly ?? null;
}

export async function purchaseMonthly(): Promise<PurchaseResult> {
  if (!_configured) return { success: false, errorCode: 'not_configured' };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = findPackage(offerings);
    if (!pkg) {
      return { success: false, errorCode: 'monthly_not_found' };
    }
    await Purchases.purchasePackage(pkg);
    return { success: true };
  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean };
    if (err.userCancelled) {
      return { success: false, errorCode: 'purchase_cancelled' };
    }
    console.warn('RevenueCat purchase error:', e);
    return { success: false, errorCode: 'purchase_failed' };
  }
}

export async function restorePurchases(): Promise<PurchaseResult> {
  if (!_configured) return { success: false, errorCode: 'not_configured' };
  try {
    const customerInfo = await Purchases.restorePurchases();
    const { isPremium } = toInfo(customerInfo);
    return {
      success: isPremium,
      errorCode: isPremium ? undefined : 'no_subscription_to_restore',
    };
  } catch (e) {
    console.warn('RevenueCat restore error:', e);
    return { success: false, errorCode: 'restore_failed' };
  }
}

/**
 * The localized, store-provided price string (e.g. "₺29,99", "$0.99").
 * This is the ONLY price that may be shown to the user — a hard-coded price
 * would be wrong in every storefront but one, which Apple treats as
 * misleading pricing.
 */
export async function getMonthlyPrice(): Promise<string | null> {
  if (!_configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return findPackage(offerings)?.product.priceString ?? null;
  } catch {
    return null;
  }
}
