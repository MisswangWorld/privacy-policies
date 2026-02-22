import { useNavigation } from '@react-navigation/native';
import React, { memo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks';

export const MenuButton = memo(function MenuButton() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: t('list_view'), screen: 'ListView' as const },
    { label: t('archive'), screen: 'Archive' as const },
    { label: t('settings'), screen: 'Settings' as const },
  ];

  const handlePress = (screen: 'ListView' | 'Archive' | 'Settings') => {
    setIsOpen(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <Pressable onPress={() => setIsOpen(true)} style={styles.button}>
        <Text style={[styles.icon, { color: colors.text }]}>☰</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.menu,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {menuItems.map((item, index) => (
              <Pressable
                key={item.screen}
                onPress={() => handlePress(item.screen)}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  icon: {
    fontSize: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menu: {
    position: 'absolute',
    top: 100,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
  },
});
