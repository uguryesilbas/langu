import { translations } from '../constants/translations';

describe('translations', () => {
  it('has identical key sets for tr and en', () => {
    const tr = Object.keys(translations.tr).sort();
    const en = Object.keys(translations.en).sort();
    expect(en).toEqual(tr);
  });

  it('has no empty strings', () => {
    for (const [lang, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        if (typeof value === 'string') {
          expect(`${lang}.${key}`).toBeTruthy();
          expect(value.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('covers every purchase error code', () => {
    const codes = [
      'monthly_not_found',
      'purchase_cancelled',
      'purchase_failed',
      'no_subscription_to_restore',
      'restore_failed',
      'not_configured',
      'web_not_supported',
    ] as const;

    for (const code of codes) {
      expect(typeof translations.tr[code]).toBe('string');
      expect(typeof translations.en[code]).toBe('string');
    }
  });

  it('includes the auto-renewal disclosure Apple requires', () => {
    // Guideline 3.1.2(a): term, renewal behaviour and cancellation must be
    // stated in the purchase flow.
    expect(translations.en.subscriptionTerms).toMatch(/renew/i);
    expect(translations.en.subscriptionTerms).toMatch(/cancel/i);
    expect(translations.tr.subscriptionTerms).toMatch(/yenile/i);
    expect(translations.tr.subscriptionTerms).toMatch(/iptal/i);
  });
});
