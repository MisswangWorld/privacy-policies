import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WINE_TYPE_COLORS } from '../constants/colors';
import { useTheme } from '../hooks';
import { Wine, WineType } from '../types';

type WineCellProps = {
  wine?: Wine;
  onPress: () => void;
  onLongPress?: () => void;
  size: number;
  isHighlighted?: boolean;
};

const LIGHT_WINE_TYPES: WineType[] = ['white', 'sparkling', 'rose', 'sake', 'sweet'];

// Positions as fractions of cell size: { x: left, y: bottom, r: radius }
const BUBBLE_POSITIONS = [
  { x: 0.20, y: 0.16, r: 3 },
  { x: 0.56, y: 0.28, r: 2.5 },
  { x: 0.28, y: 0.48, r: 4 },
  { x: 0.60, y: 0.58, r: 2 },
  { x: 0.42, y: 0.72, r: 3 },
] as const;

export const WineCell = memo(function WineCell({
  wine,
  onPress,
  onLongPress,
  size,
  isHighlighted = false,
}: WineCellProps) {
  const { colors } = useTheme();

  const getCellColor = useCallback((type?: WineType) => {
    if (!type) return WINE_TYPE_COLORS.red;
    return WINE_TYPE_COLORS[type];
  }, []);

  const getVintageTextColor = useCallback((type?: WineType): string => {
    if (!type) return '#FFFFFF';
    return LIGHT_WINE_TYPES.includes(type) ? '#1A1A1A' : '#FFFFFF';
  }, []);

  const isEmpty = !wine;
  const isSparkling = wine?.type === 'sparkling';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.cell,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isEmpty
            ? colors.emptyCellBackground
            : getCellColor(wine?.type),
          borderColor: isHighlighted
            ? wine ? '#FFFFFF' : colors.accent
            : colors.emptyCellBorder,
          borderWidth: isHighlighted ? 3 : 1,
          opacity: pressed ? 0.7 : 1,
          overflow: 'hidden',
        },
      ]}
    >
      {isSparkling && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {BUBBLE_POSITIONS.map((bubble, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                {
                  width: bubble.r * 2,
                  height: bubble.r * 2,
                  borderRadius: bubble.r,
                  left: size * bubble.x,
                  bottom: size * bubble.y,
                },
              ]}
            />
          ))}
        </View>
      )}
      {wine?.vintage && (
        <Text style={[styles.vintageText, { color: getVintageTextColor(wine.type) }]}>
          {String(wine.vintage).slice(-2)}
        </Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  vintageText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
