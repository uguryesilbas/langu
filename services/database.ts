import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from '../db/schema';
import { INITIAL_WORDS } from '../constants/words';
import type { Word, CustomWord, NewCustomWord } from '../types/word';

export async function initDatabase(db: SQLite.SQLiteDatabase) {
  await db.execAsync(CREATE_TABLES_SQL);
  await seedWordsIfEmpty(db);
}

async function seedWordsIfEmpty(db: SQLite.SQLiteDatabase) {
  const count = await db.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM words'
  );
  if (count && count.cnt > 0) return;

  for (const w of INITIAL_WORDS) {
    await db.runAsync(
      `INSERT INTO words
       (en_word, tr_word, en_sentence, tr_sentence, difficulty, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [w.en_word, w.tr_word, w.en_sentence, w.tr_sentence, w.difficulty, w.sort_order]
    );
  }
}

export async function getUnlearnedWords(db: SQLite.SQLiteDatabase): Promise<Word[]> {
  return db.getAllAsync<Word>(
    'SELECT * FROM words WHERE is_learned=0 ORDER BY sort_order'
  );
}

export async function getLearnedWords(db: SQLite.SQLiteDatabase): Promise<Word[]> {
  return db.getAllAsync<Word>(
    'SELECT * FROM words WHERE is_learned=1 ORDER BY learned_at DESC'
  );
}

export async function markWordAsLearned(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    `UPDATE words SET is_learned=1, learned_at=datetime('now'),
     review_count=review_count+1 WHERE id=?`,
    [id]
  );
}

export async function markWordAsUnlearned(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    'UPDATE words SET is_learned=0, learned_at=NULL WHERE id=?',
    [id]
  );
}

export async function addCustomWord(
  db: SQLite.SQLiteDatabase,
  w: NewCustomWord
): Promise<void> {
  await db.runAsync(
    `INSERT INTO custom_words
     (en_word, tr_word, en_sentence, tr_sentence, source)
     VALUES (?, ?, ?, ?, ?)`,
    [w.en_word, w.tr_word, w.en_sentence, w.tr_sentence, w.source]
  );
  if (w.source === 'rewarded_ad') {
    await db.runAsync('INSERT INTO ad_word_usage DEFAULT VALUES');
  }
}

export async function getCustomWords(db: SQLite.SQLiteDatabase): Promise<CustomWord[]> {
  return db.getAllAsync<CustomWord>(
    'SELECT * FROM custom_words ORDER BY created_at DESC'
  );
}

export async function getLearnedCustomWords(db: SQLite.SQLiteDatabase): Promise<CustomWord[]> {
  return db.getAllAsync<CustomWord>(
    'SELECT * FROM custom_words WHERE is_learned=1 ORDER BY learned_at DESC'
  );
}

export async function getRemainingAdWordSlots(
  db: SQLite.SQLiteDatabase
): Promise<number> {
  const earned = await db.getFirstAsync<{ t: number }>(
    'SELECT COALESCE(SUM(words_earned),0) as t FROM ad_rewards'
  );
  const used = await db.getFirstAsync<{ t: number }>(
    'SELECT COUNT(*) as t FROM ad_word_usage'
  );
  return (earned?.t ?? 0) - (used?.t ?? 0);
}

export async function recordAdReward(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.runAsync('INSERT INTO ad_rewards (words_earned) VALUES (3)');
}

export async function markCustomWordAsLearned(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    `UPDATE custom_words SET is_learned=1, learned_at=datetime('now') WHERE id=?`,
    [id]
  );
}

export async function markCustomWordAsUnlearned(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    'UPDATE custom_words SET is_learned=0, learned_at=NULL WHERE id=?',
    [id]
  );
}

export async function updateCustomWord(
  db: SQLite.SQLiteDatabase,
  id: number,
  w: Pick<NewCustomWord, 'en_word' | 'tr_word' | 'en_sentence' | 'tr_sentence'>
): Promise<void> {
  await db.runAsync(
    'UPDATE custom_words SET en_word=?, tr_word=?, en_sentence=?, tr_sentence=? WHERE id=?',
    [w.en_word, w.tr_word, w.en_sentence, w.tr_sentence, id]
  );
}

export async function deleteCustomWord(
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM custom_words WHERE id=?', [id]);
}

