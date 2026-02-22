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

type SelectFieldProps = {
  label: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
  allowCustom?: boolean;
  placeholder?: string;
  getOptionLabel?: (option: string) => string;
  editable?: boolean;
};

export const SelectField = memo(function SelectField({
  label,
  value,
  options,
  onSelect,
  allowCustom = true,
  placeholder,
  getOptionLabel,
  editable = true,
}: SelectFieldProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onSelect(customValue.trim());
      setCustomValue('');
      setIsOpen(false);
    }
  };

  const resolveLabel = (option: string): string => {
    if (getOptionLabel) return getOptionLabel(option);
    const translated = t(option);
    return translated !== option ? translated : option;
  };

  const displayValue = value ? resolveLabel(value) : '';

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
            { color: value ? colors.text : colors.textSecondary },
          ]}
        >
          {displayValue || placeholder || t('select')}
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
              {options.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => handleSelect(option)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        value === option ? colors.accentLight : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: value === option ? colors.accent : colors.text,
                      },
                    ]}
                  >
                    {resolveLabel(option)}
                  </Text>
                </Pressable>
              ))}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
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
