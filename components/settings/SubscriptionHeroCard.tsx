import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { SubscriptionDisclosure } from '../ui/SubscriptionDisclosure';

interface SubscriptionHeroCardProps {
  onSubscribe: () => void;
  onRestore: () => void;
}

export function SubscriptionHeroCard({ onSubscribe, onRestore }: SubscriptionHeroCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const isLoading = useSubscriptionStore((s) => s.isLoading);
  const price = useSubscriptionStore((s) => s.price);

  const buttonLabel = price ? t.subscribeForPrice(price) : t.goPremiumBanner;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 14 }}>
      <View
        style={{
          backgroundColor: theme.primary,
          borderRadius: 20,
          padding: 20,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 8 }}>
            <Ionicons name={isPremium ? 'trophy' : 'diamond-outline'} size={22} color={theme.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>
              {isPremium ? t.premiumMember : t.freeAccount}
            </Text>
            <Text style={{ fontSize: 12, color: theme.lightBlue, marginTop: 2 }}>
              {isPremium ? t.unlimitedActive : t.subscriptionBenefits}
            </Text>
          </View>
          {isPremium && (
            <View
              style={{
                backgroundColor: theme.gold,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: theme.primary }}>
                {t.active}
              </Text>
            </View>
          )}
        </View>

        {!isPremium && (
          <>
            <Pressable
              onPress={onSubscribe}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={buttonLabel}
              accessibilityState={{ disabled: isLoading }}
              style={{
                backgroundColor: theme.gold,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.primary} />
              ) : (
                <>
                  <Ionicons name="star" size={16} color={theme.primary} />
                  <Text style={{ color: theme.primary, fontSize: 15, fontWeight: '700' }}>
                    {buttonLabel}
                  </Text>
                </>
              )}
            </Pressable>

            {/* Restore is required by Guideline 3.1.1 for any non-consumable
                or subscription purchase. */}
            <Pressable
              onPress={onRestore}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={t.restorePurchases}
              style={{ alignItems: 'center', paddingVertical: 6 }}
            >
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                {t.restorePurchases}
              </Text>
            </Pressable>

            <SubscriptionDisclosure onDark />
          </>
        )}
      </View>
    </View>
  );
}
