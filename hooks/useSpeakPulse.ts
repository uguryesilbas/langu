import { useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { speakWord, stopSpeaking } from '../services/tts';

/**
 * Speaks a word and pulses the speaker icon for exactly as long as the speech
 * lasts.
 *
 * The previous inline version used a fixed `setTimeout(..., 1200)` that was
 * never cleared, so navigating away mid-utterance left a timer writing to an
 * unmounted component's shared value, and the pulse length never matched the
 * actual speech length.
 */
export function useSpeakPulse() {
  const scale = useSharedValue(1);
  const isMounted = useRef(true);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const settle = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withTiming(1, { duration: 150 });
  }, [scale]);

  const speak = useCallback(
    async (text: string, lang: 'en' | 'tr') => {
      cancelAnimation(scale);
      scale.value = withRepeat(withTiming(1.3, { duration: 300 }), -1, true);
      try {
        await speakWord(text, lang, {
          onSettled: () => {
            if (isMounted.current) settle();
          },
        });
      } catch {
        settle();
      }
    },
    [scale, settle]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cancelAnimation(scale);
      void stopSpeaking();
    };
  }, [scale]);

  return { pulseStyle, speak };
}
