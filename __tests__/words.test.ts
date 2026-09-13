import { INITIAL_WORDS } from '../constants/words';

describe('seed words', () => {
  it('ships exactly 100 words', () => {
    expect(INITIAL_WORDS).toHaveLength(100);
  });

  it('has unique sort_order values', () => {
    // `sort_order` is UNIQUE in the schema, so a duplicate would make seeding
    // fail at first launch.
    const orders = INITIAL_WORDS.map((w) => w.sort_order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('has no empty fields', () => {
    for (const w of INITIAL_WORDS) {
      expect(w.en_word.trim()).not.toBe('');
      expect(w.tr_word.trim()).not.toBe('');
      expect(w.en_sentence.trim()).not.toBe('');
      expect(w.tr_sentence.trim()).not.toBe('');
    }
  });

  it('uses a difficulty the schema CHECK constraint accepts', () => {
    for (const w of INITIAL_WORDS) {
      expect([1, 2, 3]).toContain(w.difficulty);
    }
  });

  it('mentions the target word inside its own English sentence', () => {
    // HighlightedText falls back to plain text when the word is absent, so a
    // mismatch silently degrades the card.
    const misses = INITIAL_WORDS.filter(
      (w) => !w.en_sentence.toLowerCase().includes(w.en_word.toLowerCase())
    );
    expect(misses.map((w) => w.en_word)).toEqual([]);
  });
});
