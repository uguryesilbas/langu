import { useLanguageStore } from '../stores/languageStore';
import { translations } from '../constants/translations';

export function useTranslation() {
  const lang = useLanguageStore((s) => s.lang);
  return { t: translations[lang], lang };
}
