import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useWordStore } from '../../stores/wordStore';
import { useDeckTotals } from '../../hooks/useDeckTotals';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import type { Word, CustomWord } from '../../types/word';

interface LearnedWordItemProps {
  word: Word | CustomWord;
  onRestore: () => void;
}

function LearnedWordItem({ word, onRestore }: LearnedWordItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isCustom = 'source' in word;
  const accentColor = isCustom
    ? (word.source === 'premium' ? theme.purple : theme.orange)
    : theme.primary;

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 10,
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
          left: 0, top: 0, bottom: 0,
          width: 4,
          backgroundColor: accentColor,
        }}
      />

      <View style={{ paddingLeft: 18, paddingRight: 14, paddingVertical: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: theme.textPrimary }}>
                {word.en_word.charAt(0).toUpperCase() + word.en_word.slice(1)}
              </Text>
              {isCustom && (
                <View
                  style={{
                    marginLeft: 8,
                    backgroundColor: word.source === 'premium' ? theme.premiumTint : theme.adTint,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Ionicons
                    name={word.source === 'premium' ? 'star' : 'tv-outline'}
                    size={11}
                    color={word.source === 'premium' ? theme.purple : theme.orange}
                  />
                </View>
              )}
            </View>

            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.primary, marginBottom: 5 }}>
              {word.tr_word.charAt(0).toUpperCase() + word.tr_word.slice(1)}
            </Text>

            <Text style={{ fontSize: 12, color: theme.textMuted, lineHeight: 17 }}>
              {word.en_sentence}
            </Text>
          </View>

          <Pressable
            onPress={onRestore}
            accessibilityRole="button"
            accessibilityLabel={`${t.review}: ${word.en_word}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: theme.tint,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginLeft: 12,
            }}
          >
            <Ionicons name="refresh-outline" size={14} color={theme.primary} />
            <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>{t.review}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ count }: { count: number }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
      <View
        style={{
          backgroundColor: theme.tint,
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 5,
          marginHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
        <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>
          {t.nWords(count)}
        </Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
    </View>
  );
}

function ProgressCard({ total, learned }: { total: number; learned: number }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const progress = total === 0 ? 0 : learned / total;
  const pct = Math.round(progress * 100);
  const remaining = total - learned;

  const getMessage = () => {
    if (pct === 0) return t.msg0;
    if (pct < 25) return t.msg25;
    if (pct < 50) return t.msg50;
    if (pct < 75) return t.msg75;
    if (pct < 100) return t.msg99;
    return t.msg100;
  };

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
          <Ionicons name="trophy" size={18} color={theme.gold} />
          <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginLeft: 8, opacity: 0.9, letterSpacing: 0.4 }}>
            {t.progressTitle}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 18 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 52, fontWeight: '800', lineHeight: 56 }}>
            {pct}
          </Text>
          <Text style={{ color: theme.lightBlue, fontSize: 26, fontWeight: '700', marginBottom: 6, marginLeft: 2 }}>
            %
          </Text>
          <View style={{ flex: 1 }} />
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>{learned}</Text>
            <Text style={{ color: theme.lightBlue, fontSize: 11, marginTop: 2 }}>{t.learned}</Text>
          </View>
          <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)', marginHorizontal: 4 }} />
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>{remaining}</Text>
            <Text style={{ color: theme.lightBlue, fontSize: 11, marginTop: 2 }}>{t.remaining}</Text>
          </View>
          <View style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.18)', marginHorizontal: 4 }} />
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>{total}</Text>
            <Text style={{ color: theme.lightBlue, fontSize: 11, marginTop: 2 }}>{t.total}</Text>
          </View>
        </View>

        <View style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
          <View style={{ height: 10, backgroundColor: theme.gold, borderRadius: 6, width: `${pct}%` }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          {[25, 50, 75, 100].map((mark) => (
            <Text
              key={mark}
              style={{
                fontSize: 10,
                color: pct >= mark ? theme.gold : 'rgba(255,255,255,0.35)',
                fontWeight: pct >= mark ? '700' : '400',
              }}
            >
              {mark}%
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
          <Ionicons name="sparkles-outline" size={13} color={theme.gold} />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, flex: 1 }}>
            {getMessage()}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function LearnedScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { t } = useTranslation();
  const markAsUnlearned = useWordStore((s) => s.markAsUnlearned);
  const markCustomAsUnlearned = useWordStore((s) => s.markCustomAsUnlearned);

  // Same totals the Cards and Settings screens use, so the numbers agree.
  const { learned: allLearned, total: totalWords, learnedCount } = useDeckTotals();

  if (allLearned.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
        <ProgressCard total={totalWords} learned={0} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View
            style={{
              backgroundColor: theme.card,
              borderRadius: 20,
              padding: 32,
              alignItems: 'center',
              width: '100%',
              shadowColor: theme.shadowColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View
              style={{
                backgroundColor: theme.tint,
                borderRadius: 40,
                width: 80,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="book-outline" size={40} color={theme.primary} />
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.textPrimary, textAlign: 'center', marginBottom: 8 }}>
              {t.noLearnedYet}
            </Text>
            <Text style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center', lineHeight: 20 }}>
              {t.startLearningHint}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <FlatList
        data={allLearned}
        keyExtractor={(item) => `${'source' in item ? 'c' : 'w'}-${item.id}`}
        ListHeaderComponent={
          <>
            <ProgressCard total={totalWords} learned={learnedCount} />
            <SectionHeader count={learnedCount} />
          </>
        }
        renderItem={({ item }) => (
          <LearnedWordItem
            word={item}
            onRestore={() =>
              'source' in item
                ? markCustomAsUnlearned(db, item.id)
                : markAsUnlearned(db, item.id)
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
