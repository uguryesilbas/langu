export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    en_word TEXT NOT NULL,
    tr_word TEXT NOT NULL,
    en_sentence TEXT NOT NULL,
    tr_sentence TEXT NOT NULL,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
    sort_order INTEGER NOT NULL UNIQUE,
    is_learned INTEGER DEFAULT 0,
    learned_at TEXT,
    review_count INTEGER DEFAULT 0,
    last_seen_at TEXT
  );

  CREATE TABLE IF NOT EXISTS custom_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    en_word TEXT NOT NULL,
    tr_word TEXT NOT NULL,
    en_sentence TEXT NOT NULL,
    tr_sentence TEXT NOT NULL,
    is_learned INTEGER DEFAULT 0,
    learned_at TEXT,
    source TEXT DEFAULT 'premium' CHECK (source IN ('premium','rewarded_ad')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ad_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    words_earned INTEGER DEFAULT 3,
    watched_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ad_word_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consumed_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_words_learned ON words(is_learned);
  CREATE INDEX IF NOT EXISTS idx_words_sort ON words(sort_order);
  CREATE INDEX IF NOT EXISTS idx_custom_source ON custom_words(source);
`;
