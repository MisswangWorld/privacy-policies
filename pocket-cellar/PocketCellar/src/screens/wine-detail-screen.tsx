import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
  Button,
  Header,
  MultiSelectField,
  SelectField,
  TextInput,
} from '../components';
import {
  CAPACITY_OPTIONS,
  CURRENCY_OPTIONS,
  PRESET_COUNTRIES,
  PRESET_GRAPE_VARIETIES,
  PRESET_REGIONS,
} from '../constants/presets';
import { useTheme } from '../hooks';
import { RootStackScreenProps } from '../navigation/types';
import { usePreferencesStore, useWineStore } from '../store';
import { WineType } from '../types';

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const WINE_TYPES: WineType[] = [
  'red',
  'white',
  'rose',
  'sparkling',
  'sweet',
  'fortified',
  'sake',
];

export const WineDetailScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'WineDetail'>['route']>();
  const {
    addWine,
    updateWine,
    archiveWine,
    wines,
    archivedWines,
  } = useWineStore();
  const {
    currency: defaultCurrency,
    customCountries,
    customRegions,
    customGrapeVarieties,
    addCustomCountry,
    addCustomRegion,
    addCustomGrapeVariety,
  } = usePreferencesStore();

  const { wineId, cellarId, position, mode } = route.params;
  const existingWine = wineId
    ? (wines.find((w) => w.id === wineId) ??
       (archivedWines.find((w) => w.id === wineId) as unknown as typeof wines[0] | undefined) ??
       null)
    : null;
  const isArchivedWine = !!(wineId && !wines.some((w) => w.id === wineId) && archivedWines.some((w) => w.id === wineId));

  const [isEditing, setIsEditing] = useState((mode === 'add' || mode === 'edit') && !isArchivedWine);
  const [name, setName] = useState(existingWine?.name ?? '');
  const [winery, setWinery] = useState(existingWine?.winery ?? '');
  const [vintage, setVintage] = useState(existingWine?.vintage?.toString() ?? '');
  const [country, setCountry] = useState(existingWine?.country ?? '');
  const [region, setRegion] = useState(existingWine?.region ?? '');
  const [grapeVarieties, setGrapeVarieties] = useState<string[]>(
    existingWine?.grapeVarieties ?? []
  );
  const [wineType, setWineType] = useState<WineType | undefined>(existingWine?.type);
  const [capacity, setCapacity] = useState(existingWine?.capacity ?? '750ml');
  const [purchasePrice, setPurchasePrice] = useState(
    existingWine?.purchasePrice?.toString() ?? ''
  );
  const [currentValue, setCurrentValue] = useState(
    existingWine?.currentValue?.toString() ?? ''
  );
  const [purchaseDateObj, setPurchaseDateObj] = useState<Date>(
    existingWine?.purchaseDate ? parseDate(existingWine.purchaseDate) : new Date()
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [purchaseChannel, setPurchaseChannel] = useState(
    existingWine?.purchaseChannel ?? ''
  );
  const [rating, setRating] = useState(existingWine?.rating ?? '');
  const [notes, setNotes] = useState(existingWine?.notes ?? '');
  const [photos, setPhotos] = useState<string[]>(existingWine?.photos ?? []);
  const [localCurrency, setLocalCurrency] = useState(
    existingWine?.currency ?? defaultCurrency
  );
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  const allCountries = useMemo(
    () => [...PRESET_COUNTRIES, ...customCountries],
    [customCountries]
  );
  const allRegions = useMemo(
    () => [...PRESET_REGIONS, ...customRegions],
    [customRegions]
  );
  const allGrapeVarieties = useMemo(
    () => [...PRESET_GRAPE_VARIETIES, ...customGrapeVarieties],
    [customGrapeVarieties]
  );

  const isValid = useMemo(() => name.trim().length > 0, [name]);

  const handleSave = useCallback(() => {
    if (!isValid) return;

    const wineData = {
      cellarId,
      position,
      name: name.trim(),
      winery: winery.trim() || undefined,
      vintage: vintage ? parseInt(vintage, 10) : undefined,
      country: country || undefined,
      region: region || undefined,
      grapeVarieties: grapeVarieties.length > 0 ? grapeVarieties : undefined,
      type: wineType,
      capacity: capacity || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      currentValue: currentValue ? parseFloat(currentValue) : undefined,
      currency: localCurrency,
      purchaseDate: formatDate(purchaseDateObj),
      purchaseChannel: purchaseChannel.trim() || undefined,
      rating: rating.trim() || undefined,
      notes: notes.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
    };

    if (existingWine) {
      updateWine(existingWine.id, wineData);
    } else {
      addWine(wineData);
    }

    // Save custom values
    if (country && !PRESET_COUNTRIES.includes(country)) {
      addCustomCountry(country);
    }
    if (region && !PRESET_REGIONS.includes(region)) {
      addCustomRegion(region);
    }
    grapeVarieties.forEach((v) => {
      if (!PRESET_GRAPE_VARIETIES.includes(v)) {
        addCustomGrapeVariety(v);
      }
    });

    navigation.goBack();
  }, [
    isValid,
    cellarId,
    position,
    name,
    winery,
    vintage,
    country,
    region,
    grapeVarieties,
    wineType,
    capacity,
    purchasePrice,
    currentValue,
    localCurrency,
    purchaseDateObj,
    purchaseChannel,
    rating,
    notes,
    photos,
    existingWine,
    updateWine,
    addWine,
    addCustomCountry,
    addCustomRegion,
    addCustomGrapeVariety,
    navigation,
  ]);

  const handleArchive = useCallback(() => {
    if (!existingWine) return;
    Alert.alert(t('move_to_archive'), '', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm'),
        style: 'destructive',
        onPress: () => {
          archiveWine(existingWine.id);
          navigation.goBack();
        },
      },
    ]);
  }, [existingWine, archiveWine, navigation, t]);

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= 5) {
      Alert.alert('', 'Maximum 5 photos');
      return;
    }

    Alert.alert('', '', [
      {
        text: t('take_photo'),
        onPress: async () => {
          const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
          if (result.assets?.[0]?.uri) {
            setPhotos([...photos, result.assets[0].uri]);
          }
        },
      },
      {
        text: t('choose_from_library'),
        onPress: async () => {
          const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          });
          if (result.assets?.[0]?.uri) {
            setPhotos([...photos, result.assets[0].uri]);
          }
        },
      },
      { text: t('cancel'), style: 'cancel' },
    ]);
  }, [photos, t]);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getTitle = () => {
    if (mode === 'add') return t('add_wine');
    if (isEditing) return t('edit_wine');
    return existingWine?.name ?? '';
  };

  const rightAction = useMemo(() => {
    if (mode === 'add' || isArchivedWine) return null;
    if (!isEditing) {
      return (
        <Pressable onPress={() => setIsEditing(true)}>
          <Text style={[styles.editButton, { color: colors.accent }]}>
            {t('edit_wine')}
          </Text>
        </Pressable>
      );
    }
    return null;
  }, [mode, isEditing, isArchivedWine, colors.accent, t]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <Header title={getTitle()} rightAction={rightAction} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photos */}
        {(isEditing || photos.length > 0) && (
          <View style={styles.photosSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('photos')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photosRow}>
                {photos.map((uri, index) => (
                  <Pressable
                    key={index}
                    onLongPress={() => isEditing && handleRemovePhoto(index)}
                    style={styles.photoWrapper}
                  >
                    <Image source={{ uri }} style={styles.photo} />
                  </Pressable>
                ))}
                {isEditing && photos.length < 5 && (
                  <Pressable
                    onPress={handleAddPhoto}
                    style={[
                      styles.addPhotoButton,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.addPhotoIcon, { color: colors.accent }]}>
                      +
                    </Text>
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Position badge — active wines link to grid; archived wines offer restore */}
        {existingWine && !isArchivedWine && (
          <Pressable
            onPress={() =>
              navigation.navigate('CellarGrid', { highlightedPosition: position })
            }
            style={[
              styles.positionBadge,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>
              {t('position')}
            </Text>
            <Text style={[styles.positionValue, { color: colors.text }]}>
              {t('row')} {position.row + 1} · {t('col')} {position.column + 1}
            </Text>
            <Text style={[styles.positionArrow, { color: colors.accent }]}>›</Text>
          </Pressable>
        )}
        {isArchivedWine && wineId && (
          <Pressable
            onPress={() =>
              navigation.navigate('SelectPosition', {
                archivedWineId: wineId,
                mode: 'restore',
              })
            }
            style={[
              styles.positionBadge,
              { backgroundColor: colors.accentLight, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.positionLabel, { color: colors.accent }]}>
              {t('archive')}
            </Text>
            <Text style={[styles.positionValue, { color: colors.accent }]}>
              {t('restore_to_cellar')}
            </Text>
            <Text style={[styles.positionArrow, { color: colors.accent }]}>›</Text>
          </Pressable>
        )}

        {/* Basic Info */}
        <TextInput
          label={t('wine_name')}
          value={name}
          onChangeText={setName}
          placeholder={t('wine_name')}
          required
          editable={isEditing}
        />

        <TextInput
          label={t('winery')}
          value={winery}
          onChangeText={setWinery}
          placeholder={t('winery')}
          editable={isEditing}
        />

        <TextInput
          label={t('vintage')}
          value={vintage}
          onChangeText={setVintage}
          placeholder="2020"
          keyboardType="number-pad"
          editable={isEditing}
        />

        <SelectField
          label={t('country')}
          value={country}
          options={allCountries}
          onSelect={setCountry}
          editable={isEditing}
        />

        <SelectField
          label={t('region')}
          value={region}
          options={allRegions}
          onSelect={setRegion}
          editable={isEditing}
        />

        <MultiSelectField
          label={t('grape_variety')}
          values={grapeVarieties}
          options={allGrapeVarieties}
          onSelect={setGrapeVarieties}
          editable={isEditing}
        />

        <SelectField
          label={t('wine_type')}
          value={wineType}
          options={WINE_TYPES}
          onSelect={(v) => setWineType(v as WineType)}
          allowCustom={false}
          getOptionLabel={(v) => t(v === 'sake' ? 'sake' : `${v}_wine`)}
          editable={isEditing}
        />

        <SelectField
          label={t('capacity')}
          value={capacity}
          options={CAPACITY_OPTIONS}
          onSelect={setCapacity}
          allowCustom={false}
          editable={isEditing}
        />

        {/* Price Info */}
        <View style={styles.priceRow}>
          <View style={styles.priceInput}>
            <TextInput
              label={t('purchase_price')}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              editable={isEditing}
              prefix={localCurrency}
              onPrefixPress={isEditing ? () => setIsCurrencyModalVisible(true) : undefined}
            />
          </View>
          <View style={styles.priceInput}>
            <TextInput
              label={t('current_value')}
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder="0.00"
              keyboardType="decimal-pad"
              editable={isEditing}
              prefix={localCurrency}
              onPrefixPress={isEditing ? () => setIsCurrencyModalVisible(true) : undefined}
            />
          </View>
        </View>

        {/* Purchase Date */}
        <View style={styles.dateFieldContainer}>
          <Text style={[styles.dateFieldLabel, { color: colors.text }]}>
            {t('purchase_date')}
          </Text>
          <Pressable
            onPress={() => isEditing && setIsDatePickerVisible(true)}
            style={[
              styles.dateRow,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {formatDate(purchaseDateObj)}
            </Text>
            {isEditing && (
              <Text style={[styles.dateArrow, { color: colors.accent }]}>›</Text>
            )}
          </Pressable>
        </View>

        <TextInput
          label={t('purchase_channel')}
          value={purchaseChannel}
          onChangeText={setPurchaseChannel}
          placeholder={t('purchase_channel')}
          editable={isEditing}
        />

        <TextInput
          label={t('rating')}
          value={rating}
          onChangeText={setRating}
          placeholder="e.g. WS 95, RP 92"
          editable={isEditing}
        />

        <TextInput
          label={t('notes')}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('notes')}
          multiline
          numberOfLines={4}
          editable={isEditing}
        />

        {existingWine && !isEditing && !isArchivedWine && (
          <Button
            title={t('move_to_archive')}
            onPress={handleArchive}
            variant="outline"
            fullWidth
            style={styles.archiveButton}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {isEditing && (
        <View style={styles.footer}>
          <Button
            title={t('save')}
            onPress={handleSave}
            disabled={!isValid}
            fullWidth
          />
        </View>
      )}

      <Modal
        visible={isCurrencyModalVisible}
        transparent
        animationType="slide"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setIsCurrencyModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCurrencyModalVisible(false)}
        >
          <View style={[styles.currencyModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('currency')}
            </Text>
            {CURRENCY_OPTIONS.map((curr) => (
              <Pressable
                key={curr}
                onPress={() => {
                  setLocalCurrency(curr);
                  setIsCurrencyModalVisible(false);
                }}
                style={[
                  styles.currencyOption,
                  localCurrency === curr && { backgroundColor: colors.accentLight },
                ]}
              >
                <Text
                  style={[
                    styles.currencyOptionText,
                    { color: localCurrency === curr ? colors.accent : colors.text },
                  ]}
                >
                  {t(curr)}
                </Text>
                {localCurrency === curr && (
                  <Text style={[styles.currencyOptionCheck, { color: colors.accent }]}>
                    ✓
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={isDatePickerVisible}
        transparent
        animationType="slide"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDatePickerVisible(false)}
        >
          <Pressable
            onPress={() => {}}
            style={[styles.datePickerModal, { backgroundColor: colors.surface }]}
          >
            <View style={styles.datePickerHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('purchase_date')}
              </Text>
              <Pressable onPress={() => setIsDatePickerVisible(false)}>
                <Text style={[styles.datePickerDone, { color: colors.accent }]}>
                  {t('done')}
                </Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={purchaseDateObj}
              mode="date"
              display="spinner"
              onChange={(_: DateTimePickerEvent, selectedDate?: Date) => {
                if (selectedDate) {
                  setPurchaseDateObj(selectedDate);
                }
              }}
              style={styles.datePicker}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  editButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  photosSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  addPhotoButton: {
    width: 80,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    fontSize: 32,
    fontWeight: '300',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  priceInput: {
    flex: 1,
  },
  positionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  positionLabel: {
    fontSize: 14,
    flex: 1,
  },
  positionValue: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  positionArrow: {
    fontSize: 18,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  currencyModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  currencyOptionText: {
    flex: 1,
    fontSize: 16,
  },
  currencyOptionCheck: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateFieldContainer: {
    marginBottom: 16,
  },
  dateFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateValue: {
    flex: 1,
    fontSize: 16,
  },
  dateArrow: {
    fontSize: 18,
  },
  datePickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  datePicker: {
    height: 220,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  datePickerDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  archiveButton: {
    marginTop: 24,
  },
  bottomSpacer: {
    height: 24,
  },
  footer: {
    padding: 16,
  },
});
