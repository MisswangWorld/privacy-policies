import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '../constants/colors';
import { usePreferencesStore } from '../store';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { theme, accentColor } = usePreferencesStore();

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark';
    }
    return theme === 'dark';
  }, [theme, systemColorScheme]);

  const colors = useMemo(() => {
    const baseColors = isDark ? DARK_THEME : LIGHT_THEME;
    return {
      ...baseColors,
      accent: accentColor,
      accentLight: `${accentColor}20`,
    };
  }, [isDark, accentColor]);

  return {
    isDark,
    colors,
    accentColor,
  };
};
