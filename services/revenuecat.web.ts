// Web platform stub — react-native-purchases is not supported on web.
import type { PurchaseResult, SubscriptionInfo } from '../types/subscription';

export function isConfigured(): boolean {
  return false;
}

export async function initRevenueCat(): Promise<void> {}

export function onSubscriptionChange(
  _listener: (info: SubscriptionInfo) => void
): (() => void) | null {
  return null;
}

export async function checkSubscription(): Promise<SubscriptionInfo> {
  return { isPremium: false, expiresAt: null, productId: null };
}

export async function purchaseMonthly(): Promise<PurchaseResult> {
  return { success: false, errorCode: 'web_not_supported' };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  return { success: false, errorCode: 'web_not_supported' };
}

export async function getMonthlyPrice(): Promise<string | null> {
  return null;
}
