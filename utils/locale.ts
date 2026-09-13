import { getLocales } from 'expo-localization';

/**
 * Device locale, via expo-localization rather than `Intl.DateTimeFormat()`.
 * The Intl route mis-parsed three-part tags: "zh-Hans-CN".split('-')[1] is
 * "Hans", not a region.
 */
function primaryLocale() {
  return getLocales()[0];
}

export function getSystemLanguage(): 'tr' | 'en' {
  return primaryLocale()?.languageCode === 'tr' ? 'tr' : 'en';
}

export function isTurkeyUser(): boolean {
  return primaryLocale()?.regionCode === 'TR';
}
