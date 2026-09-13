import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Word, CustomWord, NewCustomWord } from '../types/word';
import {
  getUnlearnedWords,
  getLearnedWords,
  markWordAsLearned,
  markWordAsUnlearned,
  addCustomWord,
  getCustomWords,
  getLearnedCustomWords,
  markCustomWordAsLearned,
  markCustomWordAsUnlearned,
  updateCustomWord,
  deleteCustomWord,
} from '../services/database';

interface WordState {
  words: Word[];
  learnedWords: Word[];
  customWords: CustomWord[];
  learnedCustomWords: CustomWord[];
  currentIndex: number;
  /** Starts true: the very first render must not be mistaken for "deck empty". */
  isLoading: boolean;
  /** False until the first successful load, so empty !== finished. */
  hasLoaded: boolean;
  error: string | null;

  loadWords: (db: SQLiteDatabase) => Promise<void>;
  markAsLearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  markAsUnlearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  markCustomAsLearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  markCustomAsUnlearned: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  addCustomWord: (db: SQLiteDatabase, word: NewCustomWord) => Promise<void>;
  updateCustomWord: (
    db: SQLiteDatabase,
    wordId: number,
    word: Pick<NewCustomWord, 'en_word' | 'tr_word' | 'en_sentence' | 'tr_sentence'>
  ) => Promise<void>;
  deleteCustomWord: (db: SQLiteDatabase, wordId: number) => Promise<void>;
  shuffleWords: () => void;
  nextCard: () => void;
  prevCard: () => void;
}

/** Custom words still in the deck (i.e. not yet marked learned). */
function unlearnedCustom(customWords: CustomWord[]): CustomWord[] {
  return customWords.filter((w) => !w.is_learned);
}

export const useWordStore = create<WordState>((set, get) => ({
  words: [],
  learnedWords: [],
  customWords: [],
  learnedCustomWords: [],
  currentIndex: 0,
  isLoading: true,
  hasLoaded: false,
  error: null,

  loadWords: async (db) => {
    set({ isLoading: true, error: null });
    try {
      const [words, learnedWords, customWords, learnedCustomWords] = await Promise.all([
        getUnlearnedWords(db),
        getLearnedWords(db),
        getCustomWords(db),
        getLearnedCustomWords(db),
      ]);
      set({
        words,
        learnedWords,
        customWords,
        learnedCustomWords,
        currentIndex: 0,
        hasLoaded: true,
      });
    } catch (e) {
      console.warn('loadWords error:', e);
      set({ error: e instanceof Error ? e.message : 'load_failed' });
    } finally {
      // Must be in `finally`, otherwise a DB failure leaves the UI spinning
      // forever with no way out.
      set({ isLoading: false });
    }
  },

  markAsLearned: async (db, wordId) => {
    try {
      await markWordAsLearned(db, wordId);
      const words = get().words.filter((w) => w.id !== wordId);
      const learnedWords = await getLearnedWords(db);
      const totalDeck = words.length + unlearnedCustom(get().customWords).length;
      const currentIndex = Math.min(get().currentIndex, Math.max(0, totalDeck - 1));
      set({ words, learnedWords, currentIndex });
    } catch (e) {
      console.warn('markAsLearned error:', e);
    }
  },

  markAsUnlearned: async (db, wordId) => {
    try {
      await markWordAsUnlearned(db, wordId);
      const [words, learnedWords] = await Promise.all([
        getUnlearnedWords(db),
        getLearnedWords(db),
      ]);
      set({ words, learnedWords });
    } catch (e) {
      console.warn('markAsUnlearned error:', e);
    }
  },

  markCustomAsLearned: async (db, wordId) => {
    try {
      await markCustomWordAsLearned(db, wordId);
      const [customWords, learnedCustomWords] = await Promise.all([
        getCustomWords(db),
        getLearnedCustomWords(db),
      ]);
      const totalDeck = get().words.length + unlearnedCustom(customWords).length;
      const currentIndex = Math.min(get().currentIndex, Math.max(0, totalDeck - 1));
      set({ customWords, learnedCustomWords, currentIndex });
    } catch (e) {
      console.warn('markCustomAsLearned error:', e);
    }
  },

  markCustomAsUnlearned: async (db, wordId) => {
    try {
      await markCustomWordAsUnlearned(db, wordId);
      const [customWords, learnedCustomWords] = await Promise.all([
        getCustomWords(db),
        getLearnedCustomWords(db),
      ]);
      set({ customWords, learnedCustomWords });
    } catch (e) {
      console.warn('markCustomAsUnlearned error:', e);
    }
  },

  addCustomWord: async (db, word) => {
    await addCustomWord(db, word);
    set({ customWords: await getCustomWords(db) });
  },

  updateCustomWord: async (db, wordId, word) => {
    await updateCustomWord(db, wordId, word);
    const [customWords, learnedCustomWords] = await Promise.all([
      getCustomWords(db),
      getLearnedCustomWords(db),
    ]);
    set({ customWords, learnedCustomWords });
  },

  deleteCustomWord: async (db, wordId) => {
    try {
      await deleteCustomWord(db, wordId);
      const [customWords, learnedCustomWords] = await Promise.all([
        getCustomWords(db),
        getLearnedCustomWords(db),
      ]);
      const totalDeck = get().words.length + unlearnedCustom(customWords).length;
      const currentIndex = Math.min(get().currentIndex, Math.max(0, totalDeck - 1));
      set({ customWords, learnedCustomWords, currentIndex });
    } catch (e) {
      console.warn('deleteCustomWord error:', e);
    }
  },

  /** Shuffles the whole active deck, base words and custom words alike. */
  shuffleWords: () => {
    const shuffle = <T,>(input: T[]): T[] => {
      const out = [...input];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    };

    const { words, customWords } = get();
    const learnedCustom = customWords.filter((w) => w.is_learned);
    set({
      words: shuffle(words),
      customWords: [...shuffle(unlearnedCustom(customWords)), ...learnedCustom],
      currentIndex: 0,
    });
  },

  nextCard: () => {
    const { words, customWords, currentIndex } = get();
    const total = words.length + unlearnedCustom(customWords).length;
    if (currentIndex < total - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
}));

export interface DeckTotals {
  /** Cards currently in the study deck. */
  deck: (Word | CustomWord)[];
  /** Every learned item, base and custom. */
  learned: (Word | CustomWord)[];
  /** Learned + remaining, across base and custom words. */
  total: number;
  learnedCount: number;
  remainingCount: number;
  customCount: number;
  /** 0-100, rounded. */
  progressPercent: number;
}

/**
 * Single source of truth for the counters. Previously each screen computed
 * these differently, so Settings could show "12 learned" next to "10%".
 *
 * Deliberately NOT a zustand selector: it builds new arrays, and a selector
 * returning a fresh object on every call breaks `useSyncExternalStore`'s
 * snapshot caching in zustand v5. Callers use `useDeckTotals()` instead.
 */
export function computeTotals(state: {
  words: Word[];
  learnedWords: Word[];
  customWords: CustomWord[];
  learnedCustomWords: CustomWord[];
}): DeckTotals {
  const deckCustom = unlearnedCustom(state.customWords);
  const deck = [...state.words, ...deckCustom];
  const learned = [...state.learnedWords, ...state.learnedCustomWords];
  const total = deck.length + learned.length;

  return {
    deck,
    learned,
    total,
    learnedCount: learned.length,
    remainingCount: deck.length,
    customCount: state.customWords.length,
    progressPercent: total === 0 ? 0 : Math.round((learned.length / total) * 100),
  };
}
