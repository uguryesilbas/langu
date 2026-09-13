import { useCallback, useEffect } from 'react';
import { View, Text, Pressable, Alert, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useWordStore } from '../../stores/wordStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { useDeckTotals } from '../../hooks/useDeckTotals';
import { SettingsCard } from '../../components/settings/SettingsCard';
import { SubscriptionHeroCard } from '../../components/settings/SubscriptionHeroCard';
import { StatsCard } from '../../components/settings/StatsCard';
import { LegalCard } from '../../components/settings/LegalCard';
import type { Lang } from '../../constants/translations';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { t } = useTranslation();

  const shuffleWords = useWordStore((s) => s.shuffleWords);
  const { remainingCount } = useDeckTotals();

  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const remainingAdWords = useSubscriptionStore((s) => s.remainingAdWords);
  const checkSubscription = useSubscriptionStore((s) => s.checkSubscription);
  const purchaseMonthly = useSubscriptionStore((s) => s.purchaseMonthly);
  const restorePurchases = useSubscriptionStore((s) => s.restorePurchases);
  const refreshAdWordCount = useSubscriptionStore((s) => s.refreshAdWordCount);
  const loadPrice = useSubscriptionStore((s) => s.loadPrice);

  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  useEffect(() => {
    // The price may not have resolved yet at app start (offline, slow store).
    loadPrice();
  }, [loadPrice]);

  // Refresh on every focus, not just first mount: credits change on the
  // My Words tab and the subscription can change outside the app.
  useFocusEffect(
    useCallback(() => {
      checkSubscription();
      refreshAdWordCount(db);
    }, [db, checkSubscription, refreshAdWordCount])
  );

  const handleSubscribe = async () => {
    const result = await purchaseMonthly();
    if (result.success) {
      Alert.alert(t.success, t.premiumActivatedMsg);
    } else if (result.errorCode) {
      Alert.alert(t.error, t[result.errorCode]);
    }
  };

  const handleRestore = async () => {
    const result = await restorePurchases();
    if (result.success) {
      Alert.alert(t.success, t.subscriptionRestored);
    } else {
      Alert.alert(t.info, result.errorCode ? t[result.errorCode] : t.noActiveSubscription);
    }
  };

  const handleShuffle = () => {
    shuffleWords();
    Alert.alert(t.success, t.shuffleDone);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
        <SubscriptionHeroCard onSubscribe={handleSubscribe} onRestore={handleRestore} />

        {/* Ad credits */}
        {!isPremium && (
          <SettingsCard accent={theme.orange}>
            <View style={{ backgroundColor: theme.adTint, borderRadius: 12, padding: 10 }}>
              <Ionicons name="tv-outline" size={22} color={theme.orange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>
                {t.adCreditsTitle}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                {remainingAdWords > 0
                  ? t.youHaveNCredits(remainingAdWords)
                  : t.watchAdsInWordsTab}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: remainingAdWords > 0 ? theme.adTint : theme.tint,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 8,
                minWidth: 44,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: remainingAdWords > 0 ? theme.orange : theme.textMuted,
                }}
              >
                {remainingAdWords}
              </Text>
            </View>
          </SettingsCard>
        )}

        <StatsCard />

        {/* Dark mode */}
        <SettingsCard accent={theme.primary}>
          <View style={{ backgroundColor: theme.tint, borderRadius: 10, padding: 8 }}>
            <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>
              {isDark ? t.darkTheme : t.lightTheme}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {isDark ? t.darkModeActive : t.lightModeActive}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={() => toggleTheme(db)}
            accessibilityLabel={isDark ? t.darkTheme : t.lightTheme}
            trackColor={{ false: theme.divider, true: theme.primary }}
            thumbColor={isDark ? theme.gold : '#FFFFFF'}
          />
        </SettingsCard>

        {/* Language */}
        <SettingsCard accent={theme.gold}>
          <View style={{ backgroundColor: theme.tint, borderRadius: 10, padding: 8 }}>
            <Ionicons name="language-outline" size={20} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>
              {t.language}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {lang === 'tr' ? t.languageTR : t.languageEN}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['tr', 'en'] as Lang[]).map((code) => (
              <Pressable
                key={code}
                onPress={() => setLang(db, code)}
                accessibilityRole="button"
                accessibilityLabel={code === 'tr' ? t.languageTR : t.languageEN}
                accessibilityState={{ selected: lang === code }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 10,
                  backgroundColor: lang === code ? theme.primary : theme.tint,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: lang === code ? '#FFFFFF' : theme.textMuted,
                  }}
                >
                  {code.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </SettingsCard>

        {/* Shuffle */}
        <SettingsCard accent={theme.orange}>
          <View style={{ backgroundColor: theme.adTint, borderRadius: 10, padding: 8 }}>
            <Ionicons name="shuffle-outline" size={20} color={theme.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>
              {t.shuffleCards}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {t.shuffleCardsDesc}
            </Text>
          </View>
          <Pressable
            onPress={handleShuffle}
            disabled={remainingCount === 0}
            accessibilityRole="button"
            accessibilityLabel={t.shuffleButton}
            accessibilityState={{ disabled: remainingCount === 0 }}
            style={{
              backgroundColor: theme.orange,
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              opacity: remainingCount === 0 ? 0.4 : 1,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
              {t.shuffleButton}
            </Text>
          </Pressable>
        </SettingsCard>

        <LegalCard />

        {/* App info */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
            alignItems: 'center',
            gap: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="shield-checkmark-outline" size={14} color={theme.lightBlue} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.textSecondary }}>
              {t.localFirst}
            </Text>
          </View>
          {/* Honest about AdMob: the old "local first" badge alone implied no
              third-party data leaves the device, which is not true. */}
          <Text
            style={{
              fontSize: 11,
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 16,
            }}
          >
            {t.localFirstDetail}
          </Text>
          <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            LinguaCard v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
