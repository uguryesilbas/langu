import { INITIAL_WORDS, INITIAL_WORD_COUNT, SEED_WORD_POOL } from '../constants/words';

describe('seed words', () => {
  it('seeds exactly INITIAL_WORD_COUNT words from the pool', () => {
    expect(INITIAL_WORDS).toHaveLength(INITIAL_WORD_COUNT);
    // A count larger than the pool would silently ship fewer words than
    // intended, because `slice` clamps instead of throwing.
    expect(INITIAL_WORD_COUNT).toBeLessThanOrEqual(SEED_WORD_POOL.length);
  });

  it('keeps the full pool available for later releases', () => {
    expect(SEED_WORD_POOL).toHaveLength(100);
  });

  it('has unique sort_order values', () => {
    // `sort_order` is UNIQUE in the schema, so a duplicate would make seeding
    // fail at first launch.
    const orders = SEED_WORD_POOL.map((w) => w.sort_order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('has no empty fields', () => {
    for (const w of SEED_WORD_POOL) {
      expect(w.en_word.trim()).not.toBe('');
      expect(w.tr_word.trim()).not.toBe('');
      expect(w.en_sentence.trim()).not.toBe('');
      expect(w.tr_sentence.trim()).not.toBe('');
    }
  });

  it('uses a difficulty the schema CHECK constraint accepts', () => {
    for (const w of SEED_WORD_POOL) {
      expect([1, 2, 3]).toContain(w.difficulty);
    }
  });

  it('mentions the target word inside its own English sentence', () => {
    // HighlightedText falls back to plain text when the word is absent, so a
    // mismatch silently degrades the card.
    const misses = SEED_WORD_POOL.filter(
      (w) => !w.en_sentence.toLowerCase().includes(w.en_word.toLowerCase())
    );
    expect(misses.map((w) => w.en_word)).toEqual([]);
  });
});
