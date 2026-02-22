import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks';
import { useCellarStore, usePreferencesStore } from '../store';

export const SplashScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { hasCompletedOnboarding } = usePreferencesStore();
  const { cellars } = useCellarStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      } else if (cellars.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CreateCellar', params: { isFirstCellar: true } }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CellarGrid' }],
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, hasCompletedOnboarding, cellars.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.accent }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.archIcon}>
            <View style={[styles.arch, { borderColor: '#FFFFFF' }]} />
          </View>
        </View>
        <Text style={styles.appName}>{t('app_name')}</Text>
        <Text style={styles.slogan}>{t('slogan')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  archIcon: {
    width: 80,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  arch: {
    width: 60,
    height: 80,
    borderWidth: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
