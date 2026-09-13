import * as Speech from 'expo-speech';

interface SpeakOptions {
  /** Called once when speech finishes, is stopped, or errors — exactly once. */
  onSettled?: () => void;
}

/**
 * Speaks `text`. Resolves as soon as speech has been handed to the engine;
 * use `onSettled` to react to speech actually finishing.
 */
export async function speakWord(
  text: string,
  lang: 'en' | 'tr',
  options: SpeakOptions = {}
): Promise<void> {
  const { onSettled } = options;

  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    onSettled?.();
  };

  try {
    if (await Speech.isSpeakingAsync()) {
      await Speech.stop();
    }

    Speech.speak(text, {
      language: lang === 'en' ? 'en-US' : 'tr-TR',
      rate: 0.85,
      pitch: 1.0,
      onDone: settle,
      onStopped: settle,
      onError: (err) => {
        console.warn('TTS error:', err);
        settle();
      },
    });
  } catch (e) {
    // expo-speech is unavailable on some devices (notably Android Expo Go).
    console.warn('TTS unavailable:', e);
    settle();
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    if (await Speech.isSpeakingAsync()) {
      await Speech.stop();
    }
  } catch (e) {
    console.warn('TTS stop error:', e);
  }
}
