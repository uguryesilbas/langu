import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import { useTranslation } from '../../hooks/useTranslation';
import { lightTheme, darkTheme } from '../../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: IoniconName;
  color: string;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 2 }}>
      <View
        style={{
          width: 22,
          height: 3,
          borderRadius: 2,
          backgroundColor: focused ? '#FFD54F' : 'transparent',
          marginBottom: 5,
        }}
      />
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const db = useSQLiteContext();
  const isDark = useThemeStore((s) => s.isDark);
  const loadTheme = useThemeStore((s) => s.loadTheme);
  const loadLang = useLanguageStore((s) => s.loadLang);
  const theme = isDark ? darkTheme : lightTheme;
  const { t } = useTranslation();

  useEffect(() => {
    loadTheme(db);
    loadLang(db);
  }, [db, loadTheme, loadLang]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: theme.background }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.tabBar,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  shadowColor: '#1565C0',
                  shadowOffset: { width: 0, height: -6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                }}
              />
            </View>
          ),
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            paddingBottom: 10,
            paddingTop: 0,
            height: 72,
            elevation: 16,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.2,
            marginTop: 2,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: 'LinguaCard',
            tabBarLabel: t.tabCards,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name="layers" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="learned"
          options={{
            headerTitle: t.tabLearned,
            tabBarLabel: t.tabLearned,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name="ribbon" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="custom-words"
          options={{
            headerTitle: t.tabMyWords,
            tabBarLabel: t.tabMyWords,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name="sparkles" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerTitle: t.tabSettings,
            tabBarLabel: t.tabSettings,
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon name="settings-outline" color={color} size={size} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
