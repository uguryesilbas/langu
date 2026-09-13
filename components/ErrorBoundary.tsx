import { View, Text, Pressable } from 'react-native';
import { getSystemLanguage } from '../utils/locale';

interface ErrorBoundaryProps {
  error: Error;
  retry: () => Promise<void>;
}

const COPY = {
  tr: {
    title: 'Bir sorun oluştu',
    body: 'Uygulama beklenmedik bir hatayla karşılaştı. Tekrar denemek için aşağıdaki düğmeye dokunun.',
    retry: 'Tekrar Dene',
  },
  en: {
    title: 'Something went wrong',
    body: 'The app hit an unexpected error. Tap below to try again.',
    retry: 'Try Again',
  },
};

/**
 * Expo Router picks this up as the root error boundary. Without it an
 * unhandled render error leaves the user on a blank white screen, which
 * App Review treats as a crash.
 *
 * This deliberately avoids the theme/translation stores: if one of those is
 * what failed, the fallback still has to render.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const t = COPY[getSystemLanguage()];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#F0F4FF',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          color: '#1A1A2E',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        {t.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#555555',
          textAlign: 'center',
          lineHeight: 21,
          marginBottom: 24,
        }}
      >
        {t.body}
      </Text>

      <Pressable
        onPress={() => void retry()}
        accessibilityRole="button"
        accessibilityLabel={t.retry}
        style={{
          backgroundColor: '#1565C0',
          borderRadius: 12,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>{t.retry}</Text>
      </Pressable>

      {__DEV__ && (
        <Text style={{ fontSize: 11, color: '#9E9E9E', marginTop: 24, textAlign: 'center' }}>
          {error.message}
        </Text>
      )}
    </View>
  );
}
