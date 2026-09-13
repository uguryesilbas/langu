export interface Word {
  id: number;
  en_word: string;
  tr_word: string;
  en_sentence: string;
  tr_sentence: string;
  difficulty: 1 | 2 | 3;
  sort_order: number;
  is_learned: 0 | 1;
  learned_at: string | null;
  review_count: number;
  last_seen_at: string | null;
}

export interface CustomWord {
  id: number;
  en_word: string;
  tr_word: string;
  en_sentence: string;
  tr_sentence: string;
  is_learned: 0 | 1;
  learned_at: string | null;
  source: 'premium' | 'rewarded_ad';
  created_at: string;
}

export type NewCustomWord = Pick<
  CustomWord,
  'en_word' | 'tr_word' | 'en_sentence' | 'tr_sentence' | 'source'
>;

export interface SeedWord {
  en_word: string;
  tr_word: string;
  en_sentence: string;
  tr_sentence: string;
  difficulty: 1 | 2 | 3;
  sort_order: number;
}
