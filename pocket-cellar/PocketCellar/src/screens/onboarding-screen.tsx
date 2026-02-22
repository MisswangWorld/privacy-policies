import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button } from '../components';
import { useTheme } from '../hooks';
import { usePreferencesStore } from '../store';

const { width } = Dimensions.get('window');

type SlideData = {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
};

const slides: SlideData[] = [
  {
    id: '1',
    titleKey: 'onboarding_title_1',
    descKey: 'onboarding_desc_1',
    icon: '🍷',
  },
  {
    id: '2',
    titleKey: 'onboarding_title_2',
    descKey: 'onboarding_desc_2',
    icon: '📦',
  },
  {
    id: '3',
    titleKey: 'onboarding_title_3',
    descKey: 'onboarding_desc_3',
    icon: '📝',
  },
];

export const OnboardingScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { completeOnboarding } = usePreferencesStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleComplete = useCallback(() => {
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'CreateCellar', params: { isFirstCellar: true } }],
    });
  }, [completeOnboarding, navigation]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  }, [currentIndex, handleComplete]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
    []
  );

  const renderSlide = useCallback(
    ({ item }: { item: SlideData }) => (
      <View style={[styles.slide, { width }]}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {t(item.titleKey)}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t(item.descKey)}
        </Text>
      </View>
    ),
    [colors, t]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable onPress={handleComplete}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            {t('skip')}
          </Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? colors.accent : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={
            currentIndex === slides.length - 1 ? t('get_started') : t('next')
          }
          onPress={handleNext}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
