import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { HighlightedText } from '../ui/HighlightedText';
import { useSpeakPulse } from '../../hooks/useSpeakPulse';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import type { Word, CustomWord } from '../../types/word';

interface CardFrontProps {
  word: Word | CustomWord;
}

export function CardFront({ word }: CardFrontProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { pulseStyle, speak } = useSpeakPulse();

  const handleSpeak = () => {
    void speak(word.en_word, 'en');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 24,
      }}
    >
      {/* Word + speaker */}
      <Pressable
        onPress={handleSpeak}
        accessibilityRole="button"
        accessibilityLabel={t.speakWordA11y(word.en_word)}
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
          {word.en_word.charAt(0).toUpperCase() + word.en_word.slice(1)}
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
        sentence={word.en_sentence}
        targetWord={word.en_word}
        highlightColor={theme.primary}
        bodyColor={theme.textSecondary}
        onWordPress={handleSpeak}
        fontSize={16}
      />

      {/* Hint pill */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: theme.tint,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 7,
          marginTop: 28,
        }}
      >
        <Ionicons name="sync-outline" size={13} color={theme.lightBlue} />
        <Text style={{ fontSize: 12, color: theme.lightBlue, fontWeight: '500' }}>
          {t.tapToFlip}
        </Text>
      </View>
    </View>
  );
}
