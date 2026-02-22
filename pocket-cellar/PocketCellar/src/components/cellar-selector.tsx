import React, { memo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks';
import { useCellarStore } from '../store';

type CellarSelectorProps = {
  showAddButton?: boolean;
  onAddPress?: () => void;
};

export const CellarSelector = memo(function CellarSelector({
  showAddButton = true,
  onAddPress,
}: CellarSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { cellars, activeCellarId, setActiveCellar } = useCellarStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeCellar = cellars.find((c) => c.id === activeCellarId);

  const handleSelect = (cellarId: string) => {
    setActiveCellar(cellarId);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={styles.selector}
      >
        <Text style={[styles.selectorText, { color: colors.text }]}>
          {activeCellar?.name || t('select_cellar')}
        </Text>
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>▼</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {t('select_cellar')}
            </Text>
            <ScrollView style={styles.list}>
              {cellars.map((cellar) => (
                <Pressable
                  key={cellar.id}
                  onPress={() => handleSelect(cellar.id)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        cellar.id === activeCellarId
                          ? colors.accentLight
                          : 'transparent',
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.optionName,
                        {
                          color:
                            cellar.id === activeCellarId
                              ? colors.accent
                              : colors.text,
                        },
                      ]}
                    >
                      {cellar.name}
                    </Text>
                    <Text style={[styles.optionInfo, { color: colors.textSecondary }]}>
                      {cellar.rows} × {cellar.columns} ({cellar.rows * cellar.columns} {t('bottles')})
                    </Text>
                  </View>
                  {cellar.id === activeCellarId && (
                    <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
            {showAddButton && (
              <Pressable
                onPress={() => {
                  setIsOpen(false);
                  onAddPress?.();
                }}
                style={[styles.addButton, { borderTopColor: colors.border }]}
              >
                <Text style={[styles.addButtonText, { color: colors.accent }]}>
                  + {t('create_cellar')}
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectorText: {
    fontSize: 17,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: '60%',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    padding: 16,
    textAlign: 'center',
  },
  list: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
