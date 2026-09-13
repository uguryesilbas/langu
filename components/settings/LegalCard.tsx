import { View, Text, Pressable, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { PRIVACY_POLICY_URL, TERMS_URL, SUPPORT_URL } from '../../constants/config';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * In-app access to the privacy policy and terms.
 *
 * Guideline 5.1.1(i) requires a reachable privacy policy for any app serving
 * third-party ads, and 3.1.2 requires the terms link alongside a subscription.
 * Before this existed neither was reachable anywhere in the app.
 */
export function LegalCard() {
  const theme = useTheme();
  const { t } = useTranslation();

  const allRows: { key: string; icon: IoniconName; label: string; url: string }[] = [
    {
      key: 'privacy',
      icon: 'shield-checkmark-outline',
      label: t.privacyPolicy,
      url: PRIVACY_POLICY_URL,
    },
    { key: 'terms', icon: 'document-text-outline', label: t.termsOfUse, url: TERMS_URL },
    { key: 'support', icon: 'help-circle-outline', label: t.support, url: SUPPORT_URL },
  ];
  const rows = allRows.filter((r) => r.url.length > 0);

  if (rows.length === 0) return null;

  const open = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.warn('Could not open legal URL:', e);
      Alert.alert(t.legalSectionTitle, t.legalLinkUnavailable);
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 16,
        paddingVertical: 4,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: theme.textMuted,
          letterSpacing: 0.6,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 4,
        }}
      >
        {t.legalSectionTitle.toUpperCase()}
      </Text>

      {rows.map((row, i) => (
        <View key={row.key}>
          {i > 0 && (
            <View style={{ height: 1, backgroundColor: theme.divider, marginHorizontal: 16 }} />
          )}
          <Pressable
            onPress={() => open(row.url)}
            accessibilityRole="link"
            accessibilityLabel={row.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Ionicons name={row.icon} size={18} color={theme.primary} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.textPrimary }}>
              {row.label}
            </Text>
            <Ionicons name="open-outline" size={16} color={theme.textMuted} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
