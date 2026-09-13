import { computeTotals } from '../stores/wordStore';
import type { Word, CustomWord } from '../types/word';

const word = (id: number, learned: 0 | 1 = 0): Word => ({
  id,
  en_word: `w${id}`,
  tr_word: `k${id}`,
  en_sentence: 's',
  tr_sentence: 'c',
  difficulty: 1,
  sort_order: id,
  is_learned: learned,
  learned_at: null,
  review_count: 0,
  last_seen_at: null,
});

const custom = (id: number, learned: 0 | 1 = 0): CustomWord => ({
  id,
  en_word: `c${id}`,
  tr_word: `t${id}`,
  en_sentence: 's',
  tr_sentence: 'c',
  is_learned: learned,
  learned_at: null,
  source: 'premium',
  created_at: '2026-01-01',
});

describe('computeTotals', () => {
  it('returns zeroes for an empty state', () => {
    const t = computeTotals({
      words: [],
      learnedWords: [],
      customWords: [],
      learnedCustomWords: [],
    });
    expect(t.total).toBe(0);
    expect(t.progressPercent).toBe(0);
    expect(t.deck).toHaveLength(0);
  });

  it('counts custom words in both the deck and the total', () => {
    const t = computeTotals({
      words: [word(1), word(2)],
      learnedWords: [word(3, 1)],
      customWords: [custom(10), custom(11, 1)],
      learnedCustomWords: [custom(11, 1)],
    });

    // deck = 2 unlearned base + 1 unlearned custom
    expect(t.deck).toHaveLength(3);
    expect(t.remainingCount).toBe(3);
    // learned = 1 base + 1 custom
    expect(t.learnedCount).toBe(2);
    expect(t.total).toBe(5);
    expect(t.customCount).toBe(2);
  });

  it('keeps the percentage consistent with the learned count', () => {
    const t = computeTotals({
      words: [word(1)],
      learnedWords: [word(2, 1), word(3, 1), word(4, 1)],
      customWords: [],
      learnedCustomWords: [],
    });
    expect(t.learnedCount).toBe(3);
    expect(t.total).toBe(4);
    expect(t.progressPercent).toBe(75);
  });

  it('reports 100% once nothing is left in the deck', () => {
    const t = computeTotals({
      words: [],
      learnedWords: [word(1, 1), word(2, 1)],
      customWords: [custom(5, 1)],
      learnedCustomWords: [custom(5, 1)],
    });
    expect(t.deck).toHaveLength(0);
    expect(t.progressPercent).toBe(100);
  });
});
