import { useMemo } from 'react';
import { useWordStore, computeTotals, type DeckTotals } from '../stores/wordStore';

/**
 * Memoized deck counters shared by the Cards, Learned and Settings screens.
 *
 * Each of the four arrays is selected individually so the reference stays
 * stable between unrelated store updates; the derived object is then built in
 * `useMemo`. Selecting a freshly-built object straight from the store would
 * break zustand v5's snapshot caching and re-render on every state change.
 */
export function useDeckTotals(): DeckTotals {
  const words = useWordStore((s) => s.words);
  const learnedWords = useWordStore((s) => s.learnedWords);
  const customWords = useWordStore((s) => s.customWords);
  const learnedCustomWords = useWordStore((s) => s.learnedCustomWords);

  return useMemo(
    () => computeTotals({ words, learnedWords, customWords, learnedCustomWords }),
    [words, learnedWords, customWords, learnedCustomWords]
  );
}
