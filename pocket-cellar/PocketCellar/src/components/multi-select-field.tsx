import React, { memo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks';

type MultiSelectFieldProps = {
  label: string;
  values: string[];
  options: string[];
  onSelect: (values: string[]) => void;
  allowCustom?: boolean;
  placeholder?: string;
  editable?: boolean;
};

export const MultiSelectField = memo(function MultiSelectField({
  label,
  values,
  options,
  onSelect,
  allowCustom = true,
  placeholder,
  editable = true,
}: MultiSelectFieldProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onSelect(values.filter((v) => v !== option));
    } else {
      onSelect([...values, option]);
    }
  };

  const handleAddCustom = () => {
    if (customValue.trim() && !values.includes(customValue.trim())) {
      onSelect([...values, customValue.trim()]);
      setCustomValue('');
    }
  };

  const displayValues = values
    .map((v) => (t(v) !== v ? t(v) : v))
    .join(', ');

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Pressable
        onPress={() => editable && setIsOpen(true)}
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.fieldText,
            { color: values.length > 0 ? colors.text : colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {displayValues || placeholder || t('select')}
        </Text>
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>▼</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="slide" supportedOrientations={['portrait', 'landscape']}>
        <Pressable
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {label}
              </Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Text style={[styles.closeButton, { color: colors.accent }]}>
                  {t('done')}
                </Text>
              </Pressable>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = values.includes(option);
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleToggle(option)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? colors.accentLight
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected ? colors.accent : colors.text,
                        },
                      ]}
                    >
                      {t(option) !== option ? t(option) : option}
                    </Text>
                    {isSelected && (
                      <Text style={[styles.checkmark, { color: colors.accent }]}>
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            {allowCustom && (
              <View
                style={[
                  styles.customInputContainer,
                  { borderTopColor: colors.border },
                ]}
              >
                <TextInput
                  style={[
                    styles.customInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder={t('custom')}
                  placeholderTextColor={colors.textSecondary}
                  value={customValue}
                  onChangeText={setCustomValue}
                />
                <Pressable
                  onPress={handleAddCustom}
                  style={[
                    styles.addButton,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  fieldText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 17,
    fontWeight: '500',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  customInputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  customInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '500',
  },
});
