import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { HighlightedText } from '../ui/HighlightedText';
import { useSpeakPulse } from '../../hooks/useSpeakPulse';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import type { Word, CustomWord } from '../../types/word';

interface CardBackProps {
  word: Word | CustomWord;
  onLearned: () => void;
}

export function CardBack({ word, onLearned }: CardBackProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { pulseStyle, speak } = useSpeakPulse();

  const handleSpeak = () => {
    void speak(word.tr_word, 'tr');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 28,
        paddingVertical: 28,
      }}
    >
      {/* Center content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Word + speaker */}
        <Pressable
          onPress={handleSpeak}
          accessibilityRole="button"
          accessibilityLabel={t.speakWordA11y(word.tr_word)}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: '800',
              color: theme.textPrimary,
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            {word.tr_word.charAt(0).toUpperCase() + word.tr_word.slice(1)}
          </Text>
          <Animated.View
            style={[pulseStyle, { backgroundColor: theme.tint, borderRadius: 16, padding: 5 }]}
          >
            <Ionicons name="volume-high-outline" size={16} color={theme.primary} />
          </Animated.View>
        </Pressable>

        {/* Gold divider */}
        <View
          style={{
            width: 48,
            height: 3,
            backgroundColor: theme.gold,
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        {/* Sentence */}
        <HighlightedText
          sentence={word.tr_sentence}
          targetWord={word.tr_word}
          highlightColor={theme.primary}
          bodyColor={theme.textSecondary}
          onWordPress={handleSpeak}
          fontSize={16}
        />
      </View>

      {/* Learned button */}
      <Pressable
        onPress={onLearned}
        accessibilityRole="button"
        accessibilityLabel={t.markLearned}
        style={{
          width: '100%',
          backgroundColor: theme.primary,
          borderRadius: 16,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Ionicons name="checkmark-circle" size={20} color={theme.gold} />
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>{t.markLearned}</Text>
      </Pressable>
    </View>
  );
}
