import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';

export default function NotFoundScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t.notFoundTitle }} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: theme.background,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: theme.textPrimary,
            textAlign: 'center',
          }}
        >
          {t.notFoundTitle}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: theme.textMuted,
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
          }}
        >
          {t.notFoundBody}
        </Text>

        <Link
          href="/"
          accessibilityRole="link"
          style={{
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: theme.primary,
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '700',
            overflow: 'hidden',
          }}
        >
          {t.goHome}
        </Link>
      </View>
    </>
  );
}
