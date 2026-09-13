import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { SubscriptionDisclosure } from './SubscriptionDisclosure';

interface SubscriptionBannerProps {
  onSubscribe: () => void;
}

export function SubscriptionBanner({ onSubscribe }: SubscriptionBannerProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const isLoading = useSubscriptionStore((s) => s.isLoading);
  // Store-localized price only — a hard-coded one is wrong in every storefront
  // but the author's, which Apple treats as misleading pricing.
  const price = useSubscriptionStore((s) => s.price);

  if (isPremium) {
    return (
      <View
        style={{
          backgroundColor: theme.card,
          borderRadius: 14,
          padding: 14,
          marginHorizontal: 16,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: theme.gold,
          }}
        />
        <View style={{ backgroundColor: theme.tint, borderRadius: 10, padding: 8, marginLeft: 4 }}>
          <Ionicons name="trophy" size={18} color={theme.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.primary }}>
            {t.premiumMemberBanner}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
            {t.unlimitedWordsActive}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: theme.gold,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', color: theme.primary }}>{t.active}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: theme.primary,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 7 }}>
          <Ionicons name="diamond-outline" size={18} color={theme.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
            {t.subscriptionTitle}
          </Text>
          <Text style={{ fontSize: 12, color: theme.lightBlue, marginTop: 1 }}>
            {price ? t.monthlyForPrice(price) : t.subscriptionBenefits}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onSubscribe}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={price ? t.subscribeForPrice(price) : t.goPremiumBanner}
        accessibilityState={{ disabled: isLoading }}
        style={{
          backgroundColor: theme.gold,
          borderRadius: 10,
          paddingVertical: 11,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 7,
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.primary} size="small" />
        ) : (
          <>
            <Ionicons name="star" size={14} color={theme.primary} />
            <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '700' }}>
              {price ? t.subscribeForPrice(price) : t.goPremiumBanner}
            </Text>
          </>
        )}
      </Pressable>

      <SubscriptionDisclosure onDark />
    </View>
  );
}
