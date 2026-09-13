import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SettingsCardProps {
  children: ReactNode;
  /** Colour of the 4px accent stripe down the left edge. */
  accent?: string;
  row?: boolean;
}

/** Shared surface for the Settings screen cards. */
export function SettingsCard({ children, accent, row = true }: SettingsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 16,
        padding: 16,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
      }}
    >
      {accent ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: accent,
          }}
        />
      ) : null}
      <View
        style={
          row
            ? { flexDirection: 'row', alignItems: 'center', marginLeft: accent ? 4 : 0, gap: 12 }
            : { marginLeft: accent ? 4 : 0 }
        }
      >
        {children}
      </View>
    </View>
  );
}
