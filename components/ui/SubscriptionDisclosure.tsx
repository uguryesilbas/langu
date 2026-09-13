import { View, Text, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../../constants/config';

interface SubscriptionDisclosureProps {
  /** Render on a dark brand-coloured card instead of a light surface. */
  onDark?: boolean;
}

/**
 * The auto-renewing-subscription disclosure Apple requires inside the purchase
 * flow: term length, renewal behaviour, how to cancel, plus links to the
 * Terms of Use (EULA) and Privacy Policy.
 *
 * App Store Review Guideline 3.1.2(a) — omitting any of this is a standard
 * rejection, and 5.1.1(i) separately requires the privacy policy link because
 * the app serves third-party ads.
 */
export function SubscriptionDisclosure({ onDark = false }: SubscriptionDisclosureProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const bodyColor = onDark ? 'rgba(255,255,255,0.75)' : theme.textMuted;
  const linkColor = onDark ? theme.gold : theme.primary;

  const openUrl = async (url: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.warn('Could not open legal URL:', e);
    }
  };

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontSize: 10, lineHeight: 15, color: bodyColor }}>{t.subscriptionTerms}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 10 }}>
        {TERMS_URL ? (
          <Pressable
            onPress={() => openUrl(TERMS_URL)}
            accessibilityRole="link"
            accessibilityLabel={t.termsOfUse}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: linkColor,
                textDecorationLine: 'underline',
              }}
            >
              {t.termsOfUse}
            </Text>
          </Pressable>
        ) : null}

        {PRIVACY_POLICY_URL ? (
          <Pressable
            onPress={() => openUrl(PRIVACY_POLICY_URL)}
            accessibilityRole="link"
            accessibilityLabel={t.privacyPolicy}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: linkColor,
                textDecorationLine: 'underline',
              }}
            >
              {t.privacyPolicy}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
