import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRewardedAd } from '../../hooks/useRewardedAd';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { AD_WORDS_PER_REWARD } from '../../constants/config';

interface AdRewardButtonProps {
  onRewarded: () => void;
}

export function AdRewardButton({ onRewarded }: AdRewardButtonProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { handleWatchAd, isWatchingAd, remainingAdWords } = useRewardedAd();

  const handlePress = async () => {
    const result = await handleWatchAd();

    // Every outcome now says something. Previously a failed or abandoned ad
    // resolved to `false` and the button simply appeared broken — which is
    // exactly what a reviewer would have hit with no ad fill.
    switch (result) {
      case 'rewarded':
        onRewarded();
        break;
      case 'dismissed':
        Alert.alert(t.watchAdTitle, t.adDismissed);
        break;
      case 'unavailable':
        Alert.alert(t.watchAdTitle, t.adUnavailable);
        break;
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 12,
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
          backgroundColor: theme.orange,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          marginLeft: 4,
        }}
      >
        <View style={{ backgroundColor: theme.adTint, borderRadius: 10, padding: 8 }}>
          <Ionicons name="tv-outline" size={18} color={theme.orange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>
            {t.watchAdTitle}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
            {t.adRewardDesc(AD_WORDS_PER_REWARD)}
          </Text>
        </View>
        {remainingAdWords > 0 && (
          <View
            style={{
              backgroundColor: theme.adTint,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Ionicons name="gift-outline" size={12} color={theme.orange} />
            <Text style={{ color: theme.orange, fontSize: 12, fontWeight: '700' }}>
              {t.nCredits(remainingAdWords)}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={handlePress}
        disabled={isWatchingAd}
        accessibilityRole="button"
        accessibilityLabel={t.watchAdButton}
        accessibilityState={{ disabled: isWatchingAd, busy: isWatchingAd }}
        style={{
          backgroundColor: theme.orange,
          borderRadius: 10,
          paddingVertical: 11,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 7,
          opacity: isWatchingAd ? 0.7 : 1,
        }}
      >
        {isWatchingAd ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="play-circle-outline" size={16} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
              {t.watchAdButton}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
