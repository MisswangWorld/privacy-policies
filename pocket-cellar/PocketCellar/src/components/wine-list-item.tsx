import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { WINE_TYPE_COLORS } from '../constants/colors';
import { useTheme } from '../hooks';
import { Wine } from '../types';

type WineListItemProps = {
  wine: Wine;
  onPress: () => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
};

export const WineListItem = memo(function WineListItem({
  wine,
  onPress,
  isSelected = false,
  showCheckbox = false,
}: WineListItemProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const wineColor = wine.type ? WINE_TYPE_COLORS[wine.type] : WINE_TYPE_COLORS.red;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.accentLight : colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {showCheckbox && (
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected ? colors.accent : colors.border,
              backgroundColor: isSelected ? colors.accent : 'transparent',
            },
          ]}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      {wine.photos?.[0] ? (
        <Image
          source={{ uri: wine.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: wineColor }]} />
      )}

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {wine.name}
        </Text>
        {wine.winery && (
          <Text
            style={[styles.secondary, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {wine.winery}
          </Text>
        )}
        <View style={styles.details}>
          {wine.vintage && (
            <Text style={[styles.detail, { color: colors.textSecondary }]}>
              {wine.vintage}
            </Text>
          )}
          {wine.type && (
            <View style={styles.typeContainer}>
              <View
                style={[styles.typeIndicator, { backgroundColor: wineColor }]}
              />
              <Text style={[styles.detail, { color: colors.textSecondary }]}>
                {t(wine.type === 'sake' ? 'sake' : `${wine.type}_wine`)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.arrow, { color: colors.textSecondary }]}>→</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: 50,
    height: 65,
    borderRadius: 6,
  },
  placeholder: {
    width: 50,
    height: 65,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  secondary: {
    fontSize: 14,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detail: {
    fontSize: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
  },
});
