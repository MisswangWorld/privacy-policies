import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button, Header, TextInput } from '../components';
import { CELLAR_TEMPLATES } from '../constants/presets';
import { useTheme } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { useCellarStore } from '../store';
import { CellarTemplate } from '../types';

export const CreateCellarScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'CreateCellar'>['route']>();
  const { addCellar } = useCellarStore();

  const isFirstCellar = route.params?.isFirstCellar ?? false;

  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CellarTemplate | null>(
    null
  );
  const [customRows, setCustomRows] = useState('6');
  const [customColumns, setCustomColumns] = useState('6');

  const isCustom = selectedTemplate?.id === 'custom';

  const rows = useMemo(() => {
    if (isCustom) {
      return parseInt(customRows, 10) || 0;
    }
    return selectedTemplate?.rows ?? 0;
  }, [isCustom, customRows, selectedTemplate]);

  const columns = useMemo(() => {
    if (isCustom) {
      return parseInt(customColumns, 10) || 0;
    }
    return selectedTemplate?.columns ?? 0;
  }, [isCustom, customColumns, selectedTemplate]);

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (!selectedTemplate) return false;
    if (rows < 1 || rows > 20) return false;
    if (columns < 1 || columns > 20) return false;
    return true;
  }, [name, selectedTemplate, rows, columns]);

  const handleCreate = useCallback(() => {
    if (!isValid) return;

    Alert.alert(
      t('layout_warning'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            addCellar({
              name: name.trim(),
              note: note.trim() || undefined,
              rows,
              columns,
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'CellarGrid' }],
            });
          },
        },
      ]
    );
  }, [isValid, name, note, rows, columns, addCellar, navigation, t]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header
        title={t('create_cellar')}
        showBack={!isFirstCellar}
      />

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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('template')}
        </Text>

        <View style={styles.templates}>
          {CELLAR_TEMPLATES.map((template) => (
            <Pressable
              key={template.id}
              onPress={() => setSelectedTemplate(template)}
              style={[
                styles.templateCard,
                {
                  backgroundColor:
                    selectedTemplate?.id === template.id
                      ? colors.accentLight
                      : colors.surface,
                  borderColor:
                    selectedTemplate?.id === template.id
                      ? colors.accent
                      : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.templateName,
                  {
                    color:
                      selectedTemplate?.id === template.id
                        ? colors.accent
                        : colors.text,
                  },
                ]}
              >
                {t(template.nameKey)}
              </Text>
              {template.id !== 'custom' && (
                <Text
                  style={[styles.templateInfo, { color: colors.textSecondary }]}
                >
                  {template.rows} × {template.columns} ({template.capacity} {t('bottles')})
                </Text>
              )}
            </Pressable>
          ))}
        </View>

        {isCustom && (
          <View style={styles.customInputs}>
            <View style={styles.customInputRow}>
              <View style={styles.customInputWrapper}>
                <TextInput
                  label={t('rows')}
                  value={customRows}
                  onChangeText={setCustomRows}
                  keyboardType="number-pad"
                  placeholder="1-20"
                />
              </View>
              <View style={styles.customInputWrapper}>
                <TextInput
                  label={t('columns')}
                  value={customColumns}
                  onChangeText={setCustomColumns}
                  keyboardType="number-pad"
                  placeholder="1-20"
                />
              </View>
            </View>
            {rows > 0 && columns > 0 && (
              <Text style={[styles.capacityText, { color: colors.textSecondary }]}>
                {rows * columns} {t('bottles')}
              </Text>
            )}
          </View>
        )}

        <View style={styles.warning}>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            ⚠️ {t('layout_warning')}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('create_cellar')}
          onPress={handleCreate}
          disabled={!isValid}
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  templates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  templateCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: '47%',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
  },
  templateInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  customInputs: {
    marginTop: 16,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  customInputWrapper: {
    flex: 1,
  },
  capacityText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  warning: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
  },
});
