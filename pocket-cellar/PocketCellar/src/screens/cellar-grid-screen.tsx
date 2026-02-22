import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import {
  CellarGrid,
  CellarSelector,
  MenuButton,
  WinePreviewModal,
} from '../components';
import { useTheme } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { useCellarStore, useWineStore } from '../store';
import { Position, Wine } from '../types';

export const CellarGridScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'CellarGrid'>['route']>();
  const { activeCellarId, getCellar } = useCellarStore();
  const { archiveWine } = useWineStore();

  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [highlightedPosition, setHighlightedPosition] = useState<Position | null>(null);

  const highlightRow = route.params?.highlightedPosition?.row;
  const highlightCol = route.params?.highlightedPosition?.column;

  useEffect(() => {
    if (highlightRow !== undefined && highlightCol !== undefined) {
      setHighlightedPosition({ row: highlightRow, column: highlightCol });
    }
  }, [highlightRow, highlightCol]);

  useEffect(() => {
    if (!highlightedPosition) return;
    const timer = setTimeout(() => setHighlightedPosition(null), 2000);
    return () => clearTimeout(timer);
  }, [highlightedPosition]);

  const activeCellar = useMemo(
    () => (activeCellarId ? getCellar(activeCellarId) : null),
    [activeCellarId, getCellar]
  );

  const handleCellPress = useCallback(
    (position: Position, wine?: Wine) => {
      if (wine) {
        setSelectedWine(wine);
        setIsPreviewVisible(true);
      } else if (activeCellarId) {
        navigation.navigate('WineDetail', {
          cellarId: activeCellarId,
          position,
          mode: 'add',
        });
      }
    },
    [activeCellarId, navigation]
  );

  const handleCellLongPress = useCallback(
    (position: Position, wine?: Wine) => {
      if (wine) {
        Alert.alert(
          wine.name,
          '',
          [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('copy'),
              onPress: () => {
                navigation.navigate('SelectPosition', {
                  sourceWineId: wine.id,
                  mode: 'copy',
                });
              },
            },
            {
              text: t('move_to_archive'),
              style: 'destructive',
              onPress: () => archiveWine(wine.id),
            },
          ]
        );
      }
    },
    [archiveWine, navigation, t]
  );

  const handleViewDetails = useCallback(() => {
    if (selectedWine && activeCellarId) {
      setIsPreviewVisible(false);
      navigation.navigate('WineDetail', {
        wineId: selectedWine.id,
        cellarId: activeCellarId,
        position: selectedWine.position,
        mode: 'view',
      });
    }
  }, [selectedWine, activeCellarId, navigation]);

  const handleArchiveFromPreview = useCallback(() => {
    if (selectedWine) {
      archiveWine(selectedWine.id);
      setIsPreviewVisible(false);
      setSelectedWine(null);
    }
  }, [selectedWine, archiveWine]);

  const handleAddCellar = useCallback(() => {
    navigation.navigate('CreateCellar');
  }, [navigation]);

  const handleEditCellar = useCallback(() => {
    if (activeCellarId) {
      navigation.navigate('EditCellar', { cellarId: activeCellarId });
    }
  }, [activeCellarId, navigation]);

  if (!activeCellar) {
    return (
      <View
        style={[
          styles.container,
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('no_cellars')}
        </Text>
        <Pressable onPress={handleAddCellar}>
          <Text style={[styles.addLink, { color: colors.accent }]}>
            {t('add_first_cellar')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <CellarSelector onAddPress={handleAddCellar} />
        <View style={styles.headerRight}>
          <Pressable onPress={handleEditCellar} style={styles.editButton}>
            <Text style={[styles.editIcon, { color: colors.accent }]}>✎</Text>
          </Pressable>
          <MenuButton />
        </View>
      </View>

      <CellarGrid
        cellar={activeCellar}
        onCellPress={handleCellPress}
        onCellLongPress={handleCellLongPress}
        highlightedPosition={highlightedPosition}
      />

      <WinePreviewModal
        wine={selectedWine}
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        onViewDetails={handleViewDetails}
        onArchive={handleArchiveFromPreview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 12,
  },
  addLink: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 20,
  },
});
