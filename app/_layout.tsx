import '../global.css';
import { Suspense, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { getSystemLanguage } from '../utils/locale';
import { initDatabase } from '../services/database';
import { initRevenueCat } from '../services/revenuecat';
import { initAdMob } from '../services/admob';
import { assertReleaseConfig } from '../constants/config';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export { ErrorBoundary } from '../components/ErrorBoundary';

function LoadingScreen() {
  const text = getSystemLanguage() === 'tr' ? 'Yükleniyor...' : 'Loading...';
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#1565C0" />
      <Text className="mt-4 text-base" style={{ color: '#555555' }}>
        {text}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Fails the build loudly rather than shipping placeholder monetization
    // config (dev builds only warn).
    assertReleaseConfig();

    // The ads SDK must be initialized before any ad request. Forgetting this
    // is what made the rewarded-ad button silently do nothing.
    initAdMob().catch((e) => console.warn('AdMob init error:', e));

    let unsubscribe: (() => void) | undefined;

    initRevenueCat()
      .then(async () => {
        const store = useSubscriptionStore.getState();
        // Entitlement must be resolved at launch — otherwise a paying
        // subscriber sees the paywall until they happen to open Settings.
        await store.checkSubscription();
        store.loadPrice();
        unsubscribe = store.subscribeToChanges();
      })
      .catch((e) => console.warn('RevenueCat init error:', e));

    return () => unsubscribe?.();
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLiteProvider databaseName="linguacard.db" onInit={initDatabase} useSuspense>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
