import { useThemeStore } from '../stores/themeStore';
import { lightTheme, darkTheme } from '../constants/theme';

export function useTheme() {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? darkTheme : lightTheme;
}
