import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Header } from '../components';
import { WINE_TYPE_COLORS } from '../constants/colors';
import { useTheme } from '../hooks';
import { useCellarStore, useWineStore } from '../store';
import { ArchivedWine } from '../types';

export const ArchiveScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { archivedWines, deleteArchivedWine } = useWineStore();
  const { cellars } = useCellarStore();

  const handleRestore = useCallback(
    (wine: ArchivedWine) => {
      if (cellars.length === 0) {
        Alert.alert('', t('no_cellars'));
        return;
      }
      navigation.navigate('SelectPosition', {
        archivedWineId: wine.id,
        mode: 'restore',
      });
    },
    [cellars.length, navigation, t]
  );

  const handleDelete = useCallback(
    (wine: ArchivedWine) => {
      Alert.alert(t('delete'), '', [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deleteArchivedWine(wine.id),
        },
      ]);
    },
    [deleteArchivedWine, t]
  );

  const renderItem = useCallback(
    ({ item }: { item: ArchivedWine }) => {
      const wineColor = item.type
        ? WINE_TYPE_COLORS[item.type]
        : WINE_TYPE_COLORS.red;

      return (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Pressable
            style={styles.cardContent}
            onPress={() =>
              navigation.navigate('WineDetail', {
                wineId: item.id,
                cellarId: item.originalCellarId,
                position: item.originalPosition,
                mode: 'view',
              })
            }
          >
            {item.photos?.[0] ? (
              <Image
                source={{ uri: item.photos[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.placeholder, { backgroundColor: wineColor }]} />
            )}
            <View style={styles.info}>
              <Text
                style={[styles.name, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {item.winery && (
                <Text
                  style={[styles.secondary, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.winery}
                </Text>
              )}
              <View style={styles.details}>
                {item.vintage && (
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    {item.vintage}
                  </Text>
                )}
                {item.type && (
                  <View style={styles.typeContainer}>
                    <View
                      style={[styles.typeIndicator, { backgroundColor: wineColor }]}
                    />
                    <Text style={[styles.detail, { color: colors.textSecondary }]}>
                      {t(item.type === 'sake' ? 'sake' : `${item.type}_wine`)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>

          <View style={styles.actions}>
            <Pressable
              onPress={() => handleRestore(item)}
              style={[styles.actionButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.actionButtonText}>{t('restore')}</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                {t('delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      );
    },
    [colors, handleRestore, handleDelete, t]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={t('archive')} />

      <FlatList
        data={archivedWines}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('no_archived_wines')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 6,
  },
  placeholder: {
    width: 60,
    height: 80,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  secondary: {
    fontSize: 14,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detail: {
    fontSize: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});
