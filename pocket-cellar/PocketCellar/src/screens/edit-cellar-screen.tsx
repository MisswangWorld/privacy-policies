import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button, Header, TextInput } from '../components';
import { useTheme } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { useCellarStore, useWineStore } from '../store';

export const EditCellarScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'EditCellar'>['route']>();
  const { getCellar, updateCellar, deleteCellar, cellars } = useCellarStore();
  const { archiveWinesByCellar, getWinesByCellar } = useWineStore();

  const cellarId = route.params.cellarId;
  const cellar = getCellar(cellarId);

  const [name, setName] = useState(cellar?.name ?? '');
  const [note, setNote] = useState(cellar?.note ?? '');

  const winesInCellar = getWinesByCellar(cellarId);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    updateCellar(cellarId, {
      name: name.trim(),
      note: note.trim() || undefined,
    });
    navigation.goBack();
  }, [cellarId, name, note, updateCellar, navigation]);

  const handleDelete = useCallback(() => {
    if (winesInCellar.length > 0) {
      Alert.alert(
        t('delete_cellar'),
        t('delete_cellar_confirm'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('move_to_archive'),
            onPress: () => {
              archiveWinesByCellar(cellarId);
              deleteCellar(cellarId);
              navigation.reset({
                index: 0,
                routes: [{ name: cellars.length > 1 ? 'CellarGrid' : 'CreateCellar' }],
              });
            },
          },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: () => {
              deleteCellar(cellarId);
              navigation.reset({
                index: 0,
                routes: [{ name: cellars.length > 1 ? 'CellarGrid' : 'CreateCellar' }],
              });
            },
          },
        ]
      );
    } else {
      Alert.alert(
        t('delete_cellar'),
        '',
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: () => {
              deleteCellar(cellarId);
              navigation.reset({
                index: 0,
                routes: [{ name: cellars.length > 1 ? 'CellarGrid' : 'CreateCellar' }],
              });
            },
          },
        ]
      );
    }
  }, [
    cellarId,
    winesInCellar.length,
    archiveWinesByCellar,
    deleteCellar,
    cellars.length,
    navigation,
    t,
  ]);

  if (!cellar) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={t('edit_cellar')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          label={t('cellar_name')}
          value={name}
          onChangeText={setName}
          placeholder={t('cellar_name')}
          required
        />

        <TextInput
          label={t('cellar_note')}
          value={note}
          onChangeText={setNote}
          placeholder={t('notes')}
          multiline
          numberOfLines={3}
        />

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t('rows')} × {t('columns')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {cellar.rows} × {cellar.columns}
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t('bottles')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {winesInCellar.length} / {cellar.rows * cellar.columns}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('save')}
          onPress={handleSave}
          disabled={!name.trim()}
          fullWidth
        />
        <Button
          title={t('delete_cellar')}
          onPress={handleDelete}
          variant="ghost"
          fullWidth
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    gap: 8,
  },
  deleteButton: {
    marginTop: 8,
  },
});
