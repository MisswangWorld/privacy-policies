import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../hooks';

type TextInputProps = RNTextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
  prefix?: string;
  onPrefixPress?: () => void;
};

export const TextInput = memo(function TextInput({
  label,
  error,
  containerStyle,
  required,
  prefix,
  onPrefixPress,
  style,
  ...props
}: TextInputProps) {
  const { colors } = useTheme();

  const borderColor = error ? '#FF3B30' : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {required && (
            <Text style={[styles.required, { color: colors.accent }]}> *</Text>
          )}
        </View>
      )}
      {prefix ? (
        <View
          style={[
            styles.prefixRow,
            { backgroundColor: colors.surface, borderColor },
          ]}
        >
          <Pressable onPress={onPrefixPress} disabled={!onPrefixPress}>
            <Text
              style={[
                styles.prefixText,
                { color: colors.textSecondary, borderRightColor: colors.border },
              ]}
            >
              {prefix}
            </Text>
          </Pressable>
          <RNTextInput
            style={[styles.prefixInput, { color: colors.text }, style]}
            placeholderTextColor={colors.textSecondary}
            {...props}
          />
        </View>
      ) : (
        <RNTextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, color: colors.text, borderColor },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  prefixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  prefixText: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    borderRightWidth: 1,
  },
  prefixInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
