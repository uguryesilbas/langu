import { useCallback, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { AdResult } from '../services/admob';

export function useRewardedAd() {
  const db = useSQLiteContext();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const watchAd = useSubscriptionStore((s) => s.watchAd);
  const remainingAdWords = useSubscriptionStore((s) => s.remainingAdWords);
  const refreshAdWordCount = useSubscriptionStore((s) => s.refreshAdWordCount);

  const handleWatchAd = useCallback(async (): Promise<AdResult> => {
    setIsWatchingAd(true);
    try {
      // `showRewardedAd` is guaranteed to settle (it has its own timeout), so
      // this `finally` always runs and the spinner can't get stuck.
      return await watchAd(db);
    } finally {
      setIsWatchingAd(false);
    }
  }, [db, watchAd]);

  const refresh = useCallback(() => refreshAdWordCount(db), [db, refreshAdWordCount]);

  return { handleWatchAd, isWatchingAd, remainingAdWords, refresh };
}
