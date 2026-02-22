import React, { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../hooks';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export const Button = memo(function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = useCallback(() => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.accent;
      case 'secondary':
        return colors.surface;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return colors.accent;
    }
  }, [variant, disabled, colors]);

  const getTextColor = useCallback(() => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return colors.text;
      case 'outline':
      case 'ghost':
        return colors.accent;
      default:
        return '#FFFFFF';
    }
  }, [variant, disabled, colors]);

  const getBorderColor = useCallback(() => {
    if (variant === 'outline') {
      return disabled ? colors.border : colors.accent;
    }
    return 'transparent';
  }, [variant, disabled, colors]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: pressed ? 0.8 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
