import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { useDeckTotals } from '../../hooks/useDeckTotals';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface StatItemProps {
  icon: IoniconName;
  label: string;
  value: string;
  accent?: boolean;
}

function StatItem({ icon, label, value, accent }: StatItemProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: accent ? theme.tint : theme.background,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Ionicons name={icon} size={18} color={accent ? theme.primary : theme.lightBlue} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          color: accent ? theme.primary : theme.textPrimary,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 11, color: theme.textMuted, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

export function StatsCard() {
  const theme = useTheme();
  const { t } = useTranslation();
  // All figures come from one place, so the headline percentage and the
  // per-stat counts can no longer disagree.
  const { learnedCount, remainingCount, customCount, total, progressPercent } = useDeckTotals();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 20,
        padding: 20,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Ionicons name="bar-chart-outline" size={16} color={theme.primary} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: theme.textPrimary,
            letterSpacing: 0.3,
          }}
        >
          {t.progressStats}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <StatItem
          icon="checkmark-circle-outline"
          label={t.learnedLabel}
          value={String(learnedCount)}
          accent
        />
        <StatItem icon="time-outline" label={t.remainingLabel} value={String(remainingCount)} />
        <StatItem icon="create-outline" label={t.customLabel} value={String(customCount)} />
      </View>

      <View style={{ backgroundColor: theme.tint, borderRadius: 12, padding: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>
              {t.overallProgress}
            </Text>
            <Text
              style={{ fontSize: 28, fontWeight: '800', color: theme.primary, lineHeight: 32 }}
            >
              {progressPercent}
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.lightBlue }}>%</Text>
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>{t.totalWords(total)}</Text>
        </View>

        <View
          style={{
            height: 8,
            backgroundColor: theme.divider,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: 8,
              backgroundColor: theme.primary,
              borderRadius: 4,
              width: `${progressPercent}%`,
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          {[25, 50, 75, 100].map((mark) => (
            <Text
              key={mark}
              style={{
                fontSize: 10,
                color: progressPercent >= mark ? theme.primary : theme.textMuted,
                fontWeight: progressPercent >= mark ? '700' : '400',
              }}
            >
              {mark}%
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
