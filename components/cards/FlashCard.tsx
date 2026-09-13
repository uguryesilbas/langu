import { useMemo } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import type { Word, CustomWord } from '../../types/word';

const SPRING_CONFIG = { damping: 15, stiffness: 120, mass: 1 };

const MAX_CARD_WIDTH = 460; // keeps the card from ballooning on iPad
const MIN_CARD_HEIGHT = 300;
const MAX_CARD_HEIGHT = 420;

interface FlashCardProps {
  word: Word | CustomWord;
  onLearned: () => void;
}

export function FlashCard({ word, onLearned }: FlashCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const rotation = useSharedValue(0);

  // Read from the hook, not `Dimensions.get()` at module scope — the module
  // value is captured once at startup and never updates for rotation, iPad
  // Split View or Slide Over.
  const { width, height } = useWindowDimensions();

  const { cardWidth, cardHeight } = useMemo(() => {
    const w = Math.min(width - 40, MAX_CARD_WIDTH);
    const h = Math.min(Math.max(height * 0.55, MIN_CARD_HEIGHT), MAX_CARD_HEIGHT);
    return { cardWidth: w, cardHeight: h };
  }, [width, height]);

  function flip() {
    const isFlipped = rotation.value >= 90;
    rotation.value = withSpring(isFlipped ? 0 : 180, SPRING_CONFIG);
  }

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value < 90 ? 1 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value >= 90 ? 1 : 0,
    };
  });

  function handleLearned() {
    rotation.value = withSpring(0, SPRING_CONFIG);
    onLearned();
  }

  const cardBase = {
    position: 'absolute' as const,
    width: cardWidth,
    height: cardHeight,
    borderRadius: 24,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    backfaceVisibility: 'hidden' as const,
  };

  return (
    <Pressable
      onPress={flip}
      accessibilityRole="button"
      accessibilityLabel={t.tapToFlip}
      style={{ width: cardWidth, height: cardHeight }}
    >
      <Animated.View style={[cardBase, frontStyle, { backgroundColor: theme.card }]}>
        <CardFront word={word} />
      </Animated.View>
      <Animated.View style={[cardBase, backStyle, { backgroundColor: theme.cardBack }]}>
        <CardBack word={word} onLearned={handleLearned} />
      </Animated.View>
    </Pressable>
  );
}
