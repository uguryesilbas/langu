import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useWordStore } from '../../stores/wordStore';
import { useDeckTotals } from '../../hooks/useDeckTotals';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { FlashCard } from '../../components/cards/FlashCard';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const theme = useTheme();
  const { t } = useTranslation();

  const currentIndex = useWordStore((s) => s.currentIndex);
  const isLoading = useWordStore((s) => s.isLoading);
  const hasLoaded = useWordStore((s) => s.hasLoaded);
  const error = useWordStore((s) => s.error);
  const loadWords = useWordStore((s) => s.loadWords);
  const markAsLearned = useWordStore((s) => s.markAsLearned);
  const markCustomAsLearned = useWordStore((s) => s.markCustomAsLearned);
  const nextCard = useWordStore((s) => s.nextCard);
  const prevCard = useWordStore((s) => s.prevCard);
  const totals = useDeckTotals();

  useEffect(() => {
    loadWords(db);
  }, [db, loadWords]);

  const centered = {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.background,
    paddingHorizontal: 24,
  };

  // Loading must win over every other branch: with an empty deck and no
  // loading flag, the first frame would render the "all done" celebration.
  if (isLoading || !hasLoaded) {
    return (
      <SafeAreaView style={centered} edges={['top']}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={centered} edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          {t.loadFailedTitle}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: theme.textMuted,
            textAlign: 'center',
            marginTop: 6,
            lineHeight: 20,
          }}
        >
          {t.loadFailedBody}
        </Text>
        <Pressable
          onPress={() => loadWords(db)}
          accessibilityRole="button"
          accessibilityLabel={t.retry}
          style={{
            marginTop: 20,
            backgroundColor: theme.primary,
            borderRadius: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>{t.retry}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { deck, learnedCount } = totals;
  const currentWord = deck[currentIndex];
  const totalCards = deck.length;

  if (!currentWord) {
    return (
      <SafeAreaView style={centered} edges={['top']}>
        <View
          style={{
            backgroundColor: theme.primary,
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            width: '100%',
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 40,
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons name="trophy" size={40} color={theme.gold} />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            {t.congratulations}
          </Text>
          <Text
            style={{ fontSize: 14, color: theme.lightBlue, textAlign: 'center', lineHeight: 22 }}
          >
            {t.allWordsLearned}
          </Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="sparkles-outline" size={14} color={theme.gold} />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              {t.wordsLearned(learnedCount)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isCustomWord = 'source' in currentWord;

  function handleLearned() {
    if (isCustomWord) {
      markCustomAsLearned(db, currentWord.id);
    } else {
      markAsLearned(db, currentWord.id);
    }
  }

  const navButton = {
    backgroundColor: theme.card,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FlashCard word={currentWord} onLearned={handleLearned} />

        {/* Navigation row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 16 }}>
          <Pressable
            onPress={prevCard}
            disabled={currentIndex === 0}
            accessibilityRole="button"
            accessibilityLabel={t.previousCardA11y}
            accessibilityState={{ disabled: currentIndex === 0 }}
            style={{ ...navButton, opacity: currentIndex === 0 ? 0.3 : 1 }}
          >
            <Ionicons name="chevron-back" size={20} color={theme.primary} />
          </Pressable>

          <View
            style={{
              backgroundColor: theme.tint,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Ionicons name="layers-outline" size={13} color={theme.lightBlue} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>
              {currentIndex + 1} / {totalCards}
            </Text>
          </View>

          <Pressable
            onPress={nextCard}
            disabled={currentIndex === totalCards - 1}
            accessibilityRole="button"
            accessibilityLabel={t.nextCardA11y}
            accessibilityState={{ disabled: currentIndex === totalCards - 1 }}
            style={{ ...navButton, opacity: currentIndex === totalCards - 1 ? 0.3 : 1 }}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
