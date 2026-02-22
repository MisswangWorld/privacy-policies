import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Header } from '../components';
import { ACCENT_COLORS, ACCENT_COLOR_KEYS } from '../constants/colors';
import { CURRENCY_OPTIONS } from '../constants/presets';
import { useTheme } from '../hooks';
import { usePreferencesStore } from '../store';

export const SettingsScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    language,
    theme,
    accentColor,
    currency,
    setLanguage,
    setTheme,
    setAccentColor,
    setCurrency,
  } = usePreferencesStore();

  const renderSectionTitle = (title: string) => (
    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
      {title}
    </Text>
  );

  const renderOption = useCallback(
    (
      label: string,
      isSelected: boolean,
      onPress: () => void,
      colorIndicator?: string,
      optionKey?: string
    ) => (
      <Pressable
        key={optionKey}
        onPress={onPress}
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? colors.accentLight : colors.surface,
          },
        ]}
      >
        {colorIndicator && (
          <View
            style={[styles.colorIndicator, { backgroundColor: colorIndicator }]}
          />
        )}
        <Text
          style={[
            styles.optionText,
            { color: isSelected ? colors.accent : colors.text },
          ]}
        >
          {label}
        </Text>
        {isSelected && (
          <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
        )}
      </Pressable>
    ),
    [colors]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={t('settings')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language */}
        {renderSectionTitle(t('language'))}
        <View style={styles.optionGroup}>
          {renderOption('English', language === 'en', () => setLanguage('en'), undefined, 'lang-en')}
          {renderOption('中文', language === 'zh', () => setLanguage('zh'), undefined, 'lang-zh')}
        </View>

        {/* Appearance */}
        {renderSectionTitle(t('appearance'))}
        <View style={styles.optionGroup}>
          {renderOption(t('light_mode'), theme === 'light', () => setTheme('light'), undefined, 'theme-light')}
          {renderOption(t('dark_mode'), theme === 'dark', () => setTheme('dark'), undefined, 'theme-dark')}
          {renderOption(t('follow_system'), theme === 'system', () => setTheme('system'), undefined, 'theme-system')}
        </View>

        {/* Theme Color */}
        {renderSectionTitle(t('theme_color'))}
        <View style={styles.colorGrid}>
          {ACCENT_COLOR_KEYS.map((key) => {
            const colorValue = ACCENT_COLORS[key];
            const isSelected = accentColor === colorValue;
            return (
              <Pressable
                key={key}
                onPress={() => setAccentColor(colorValue)}
                style={styles.colorItem}
              >
                <View
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: colorValue,
                      borderColor: isSelected ? colors.text : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Text style={styles.colorCheckmark}>✓</Text>}
                </View>
                <Text
                  style={[styles.colorLabel, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {t(`accent_${key}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Currency */}
        {renderSectionTitle(t('default_currency'))}
        <View style={styles.optionGroup}>
          {CURRENCY_OPTIONS.map((curr) =>
            renderOption(t(curr), currency === curr, () => setCurrency(curr), undefined, `currency-${curr}`)
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  optionGroup: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCheckmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  colorLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomSpacer: {
    height: 40,
  },
});
