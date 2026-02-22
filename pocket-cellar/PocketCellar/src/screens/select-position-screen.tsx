import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { CellarGrid, Header } from '../components';
import { useTheme } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { useCellarStore, useWineStore } from '../store';
import { Position } from '../types';

export const SelectPositionScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'SelectPosition'>['route']>();
  const { cellars, activeCellarId, getCellar, setActiveCellar } = useCellarStore();
  const { restoreWine, copyWine, isPositionOccupied } = useWineStore();

  const { archivedWineId, sourceWineId, mode } = route.params;
  const [selectedCellarId, setSelectedCellarId] = useState(
    route.params.cellarId ?? activeCellarId ?? cellars[0]?.id ?? ''
  );

  const selectedCellar = useMemo(
    () => (selectedCellarId ? getCellar(selectedCellarId) : null),
    [selectedCellarId, getCellar]
  );

  const handleCellarChange = useCallback((cellarId: string) => {
    setSelectedCellarId(cellarId);
  }, []);

  const handleCellPress = useCallback(
    (position: Position) => {
      if (!selectedCellarId) return;

      if (isPositionOccupied(selectedCellarId, position)) {
        Alert.alert(t('position_occupied'));
        return;
      }

      if (mode === 'restore' && archivedWineId) {
        restoreWine(archivedWineId, selectedCellarId, position);
        setActiveCellar(selectedCellarId);
        navigation.goBack();
      } else if (mode === 'copy' && sourceWineId) {
        copyWine(sourceWineId, selectedCellarId, position);
        setActiveCellar(selectedCellarId);
        navigation.goBack();
      }
    },
    [
      selectedCellarId,
      isPositionOccupied,
      mode,
      archivedWineId,
      sourceWineId,
      restoreWine,
      copyWine,
      setActiveCellar,
      navigation,
      t,
    ]
  );

  const getTitle = () => {
    switch (mode) {
      case 'restore':
        return t('select_target_position');
      case 'copy':
        return t('select_position');
      default:
        return t('select_position');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={getTitle()} />

      {cellars.length > 1 && (
        <View style={styles.cellarSelector}>
          <Text style={[styles.selectorLabel, { color: colors.textSecondary }]}>
            {t('select_target_cellar')}:
          </Text>
          <View style={styles.cellarChips}>
            {cellars.map((cellar) => (
              <Pressable
                key={cellar.id}
                onPress={() => handleCellarChange(cellar.id)}
                style={[
                  styles.cellarChip,
                  {
                    backgroundColor:
                      selectedCellarId === cellar.id
                        ? colors.accent
                        : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cellarChipText,
                    {
                      color:
                        selectedCellarId === cellar.id ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {cellar.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {selectedCellar && (
        <CellarGrid cellar={selectedCellar} onCellPress={handleCellPress} />
      )}

      <View style={styles.hint}>
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          {t('select_position')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cellarSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  cellarChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cellarChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cellarChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    padding: 16,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
  },
});
