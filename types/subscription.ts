export interface SubscriptionInfo {
  isPremium: boolean;
  expiresAt: string | null;
  productId: string | null;
}

export type PurchaseErrorCode =
  | 'monthly_not_found'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'no_subscription_to_restore'
  | 'restore_failed'
  | 'not_configured'
  | 'web_not_supported';

export interface PurchaseResult {
  success: boolean;
  errorCode?: PurchaseErrorCode;
}
