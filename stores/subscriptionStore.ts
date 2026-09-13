import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';
import {
  checkSubscription,
  purchaseMonthly,
  restorePurchases,
  getMonthlyPrice,
  onSubscriptionChange,
} from '../services/revenuecat';
import { showRewardedAd, type AdResult } from '../services/admob';
import { recordAdReward, getRemainingAdWordSlots } from '../services/database';
import type { PurchaseResult } from '../types/subscription';

interface SubscriptionState {
  isPremium: boolean;
  remainingAdWords: number;
  /** Store-localized price string, e.g. "₺29,99". Null until loaded. */
  price: string | null;
  isLoading: boolean;
  /** True once the first entitlement check has completed. */
  isReady: boolean;

  checkSubscription: () => Promise<void>;
  loadPrice: () => Promise<void>;
  subscribeToChanges: () => () => void;
  purchaseMonthly: () => Promise<PurchaseResult>;
  restorePurchases: () => Promise<PurchaseResult>;
  watchAd: (db: SQLiteDatabase) => Promise<AdResult>;
  refreshAdWordCount: (db: SQLiteDatabase) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  remainingAdWords: 0,
  price: null,
  isLoading: false,
  isReady: false,

  checkSubscription: async () => {
    set({ isLoading: true });
    try {
      const info = await checkSubscription();
      set({ isPremium: info.isPremium });
    } catch (e) {
      console.warn('checkSubscription error:', e);
    } finally {
      set({ isLoading: false, isReady: true });
    }
  },

  loadPrice: async () => {
    try {
      set({ price: await getMonthlyPrice() });
    } catch (e) {
      console.warn('loadPrice error:', e);
    }
  },

  /**
   * Keeps `isPremium` in sync with renewals, expiries and purchases made on
   * another device, without the user having to open any particular screen.
   */
  subscribeToChanges: () => {
    const off = onSubscriptionChange((info) => set({ isPremium: info.isPremium }));
    return off ?? (() => {});
  },

  purchaseMonthly: async () => {
    set({ isLoading: true });
    try {
      const result = await purchaseMonthly();
      if (result.success) {
        const info = await checkSubscription();
        set({ isPremium: info.isPremium });
      }
      return result;
    } finally {
      set({ isLoading: false });
    }
  },

  restorePurchases: async () => {
    set({ isLoading: true });
    try {
      const result = await restorePurchases();
      if (result.success) {
        const info = await checkSubscription();
        set({ isPremium: info.isPremium });
      }
      return result;
    } finally {
      set({ isLoading: false });
    }
  },

  watchAd: async (db) => {
    set({ isLoading: true });
    try {
      const result = await showRewardedAd();
      if (result === 'rewarded') {
        await recordAdReward(db);
        set({ remainingAdWords: await getRemainingAdWordSlots(db) });
      }
      return result;
    } catch (e) {
      console.warn('watchAd error:', e);
      return 'unavailable';
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAdWordCount: async (db) => {
    try {
      set({ remainingAdWords: await getRemainingAdWordSlots(db) });
    } catch (e) {
      console.warn('refreshAdWordCount error:', e);
    }
  },
}));
