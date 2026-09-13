import { create } from 'zustand';
import type { SQLiteDatabase } from 'expo-sqlite';

interface ThemeState {
  isDark: boolean;
  toggleTheme: (db: SQLiteDatabase) => Promise<void>;
  loadTheme: (db: SQLiteDatabase) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,

  toggleTheme: async (db) => {
    const next = !get().isDark;
    set({ isDark: next });
    await db.runAsync(
      `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('theme', ?)`,
      [next ? 'dark' : 'light']
    );
  },

  loadTheme: async (db) => {
    const row = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_settings WHERE key='theme'`
    );
    if (row) {
      set({ isDark: row.value === 'dark' });
    }
  },
}));
