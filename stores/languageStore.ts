import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';
import { getSystemLanguage } from '../utils/locale';
import type { Lang } from '../constants/translations';

interface LanguageState {
  lang: Lang;
  setLang: (db: SQLiteDatabase, lang: Lang) => Promise<void>;
  loadLang: (db: SQLiteDatabase) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: getSystemLanguage(),

  setLang: async (db, lang) => {
    set({ lang });
    await db.runAsync(
      `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('language', ?)`,
      [lang]
    );
  },

  loadLang: async (db) => {
    const row = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_settings WHERE key='language'`
    );
    if (row && (row.value === 'tr' || row.value === 'en')) {
      set({ lang: row.value });
    }
  },
}));
