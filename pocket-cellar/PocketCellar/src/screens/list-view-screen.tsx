import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Button, Header, WineListItem } from '../components';
import { PRESET_GRAPE_VARIETIES } from '../constants/presets';
import { useTheme } from '../hooks';
import { useCellarStore, useWineStore } from '../store';
import { Wine, WineType } from '../types';

type SortOption = 'name' | 'date' | 'vintage' | 'price';
type FilterCategory = 'wine_type' | 'grape';

const WINE_TYPES: WineType[] = [
  'red', 'white', 'rose', 'sparkling', 'sweet', 'fortified', 'sake',
];

const FILTER_CATEGORIES: FilterCategory[] = ['wine_type', 'grape'];

const getWineTypeKey = (type: string): string =>
  type === 'sake' ? 'sake' : `${type}_wine`;

export const ListViewScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { wines, archiveWine } = useWineStore();
  const { activeCellarId } = useCellarStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('wine_type');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
  const [isValuePickerVisible, setIsValuePickerVisible] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filterValueOptions = useMemo(
    () => ['all', ...(filterCategory === 'wine_type' ? WINE_TYPES : PRESET_GRAPE_VARIETIES)],
    [filterCategory]
  );

  const getValueLabel = useCallback(
    (value: string): string => {
      if (value === 'all') return t('all');
      if (filterCategory === 'wine_type') return t(getWineTypeKey(value));
      return t(value);
    },
    [filterCategory, t]
  );

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setFilterCategory(category);
    setFilterValue('all');
    setIsCategoryPickerVisible(false);
  }, []);

  const filteredWines = useMemo(() => {
    let result = wines.filter((w) => w.cellarId === activeCellarId);

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.winery?.toLowerCase().includes(query)
      );
    }

    // Filter
    if (filterValue !== 'all') {
      if (filterCategory === 'wine_type') {
        result = result.filter((w) => w.type === filterValue);
      } else {
        result = result.filter((w) => w.grapeVarieties?.includes(filterValue));
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'vintage':
          return (b.vintage ?? 0) - (a.vintage ?? 0);
        case 'price':
          return (b.purchasePrice ?? 0) - (a.purchasePrice ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [wines, activeCellarId, searchQuery, sortBy, filterCategory, filterValue]);

  const handleWinePress = useCallback(
    (wine: Wine) => {
      if (isSelectMode) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(wine.id)) {
            next.delete(wine.id);
          } else {
            next.add(wine.id);
          }
          return next;
        });
      } else {
        navigation.navigate('WineDetail', {
          wineId: wine.id,
          cellarId: wine.cellarId,
          position: wine.position,
          mode: 'view',
        });
      }
    },
    [isSelectMode, navigation]
  );

  const handleArchiveSelected = useCallback(() => {
    selectedIds.forEach((id) => archiveWine(id));
    setSelectedIds(new Set());
    setIsSelectMode(false);
  }, [selectedIds, archiveWine]);

  const renderItem = useCallback(
    ({ item }: { item: Wine }) => (
      <WineListItem
        wine={item}
        onPress={() => handleWinePress(item)}
        isSelected={selectedIds.has(item.id)}
        showCheckbox={isSelectMode}
      />
    ),
    [handleWinePress, selectedIds, isSelectMode]
  );

  const rightAction = useMemo(() => {
    if (isSelectMode) {
      return (
        <Pressable onPress={() => setIsSelectMode(false)}>
          <Text style={[styles.actionText, { color: colors.accent }]}>
            {t('cancel')}
          </Text>
        </Pressable>
      );
    }
    return (
      <Pressable onPress={() => setIsSelectMode(true)}>
        <Text style={[styles.actionText, { color: colors.accent }]}>
          {t('select')}
        </Text>
      </Pressable>
    );
  }, [isSelectMode, colors.accent, t]);

  const isFiltered = filterValue !== 'all';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={t('list_view')} rightAction={rightAction} />

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder={t('search')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        {/* Sort row */}
        <View style={styles.filterRow}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            {t('sort')}:
          </Text>
          {(['name', 'date', 'vintage', 'price'] as SortOption[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setSortBy(option)}
              style={[
                styles.filterChip,
                { backgroundColor: sortBy === option ? colors.accent : colors.surface },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: sortBy === option ? '#FFFFFF' : colors.text },
                ]}
              >
                {t(`sort_by_${option}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Filter row — two dropdowns */}
        <View style={[styles.filterRow, styles.filterDropdownRow]}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            {t('filter')}:
          </Text>

          {/* Category dropdown */}
          <Pressable
            onPress={() => setIsCategoryPickerVisible(true)}
            style={[styles.dropdown, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.dropdownText, { color: colors.text }]}>
              {t(filterCategory)}
            </Text>
            <Text style={[styles.dropdownChevron, { color: colors.textSecondary }]}>
              ▾
            </Text>
          </Pressable>

          {/* Value dropdown */}
          <Pressable
            onPress={() => setIsValuePickerVisible(true)}
            style={[
              styles.dropdown,
              { backgroundColor: isFiltered ? colors.accentLight : colors.surface },
            ]}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: isFiltered ? colors.accent : colors.text },
              ]}
            >
              {getValueLabel(filterValue)}
            </Text>
            <Text
              style={[
                styles.dropdownChevron,
                { color: isFiltered ? colors.accent : colors.textSecondary },
              ]}
            >
              ▾
            </Text>
          </Pressable>

          {/* Reset button — only when a filter is active */}
          {isFiltered && (
            <Pressable
              onPress={() => setFilterValue('all')}
              style={[styles.resetButton, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.resetText, { color: colors.textSecondary }]}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredWines}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('no_wines')}
            </Text>
          </View>
        }
      />

      {isSelectMode && selectedIds.size > 0 && (
        <View style={styles.footer}>
          <Button
            title={`${t('move_to_archive')} (${selectedIds.size})`}
            onPress={handleArchiveSelected}
            fullWidth
          />
        </View>
      )}

      {/* Category picker modal */}
      <Modal
        visible={isCategoryPickerVisible}
        transparent
        animationType="slide"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setIsCategoryPickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCategoryPickerVisible(false)}
        >
          <View style={[styles.pickerModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('filter')}
            </Text>
            {FILTER_CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => handleCategoryChange(category)}
                style={[
                  styles.pickerOption,
                  filterCategory === category && { backgroundColor: colors.accentLight },
                ]}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    { color: filterCategory === category ? colors.accent : colors.text },
                  ]}
                >
                  {t(category)}
                </Text>
                {filterCategory === category && (
                  <Text style={[styles.pickerCheck, { color: colors.accent }]}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Value picker modal */}
      <Modal
        visible={isValuePickerVisible}
        transparent
        animationType="slide"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setIsValuePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsValuePickerVisible(false)}
        >
          <View style={[styles.pickerModal, styles.pickerModalTall, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t(filterCategory)}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterValueOptions.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => {
                    setFilterValue(value);
                    setIsValuePickerVisible(false);
                  }}
                  style={[
                    styles.pickerOption,
                    filterValue === value && { backgroundColor: colors.accentLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      { color: filterValue === value ? colors.accent : colors.text },
                    ]}
                  >
                    {getValueLabel(value)}
                  </Text>
                  {filterValue === value && (
                    <Text style={[styles.pickerCheck, { color: colors.accent }]}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterDropdownRow: {
    flexWrap: 'nowrap',
  },
  filterLabel: {
    fontSize: 14,
    flexShrink: 0,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipText: {
    fontSize: 13,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  dropdownText: {
    fontSize: 13,
  },
  dropdownChevron: {
    fontSize: 11,
  },
  resetButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 12,
  },
  list: {
    padding: 16,
    paddingTop: 8,
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
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  pickerModalTall: {
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pickerOptionText: {
    flex: 1,
    fontSize: 16,
  },
  pickerCheck: {
    fontSize: 18,
    fontWeight: '600',
  },
});
