import React, { memo } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { WINE_TYPE_COLORS } from '../constants/colors';
import { useTheme } from '../hooks';
import { Wine } from '../types';

type WinePreviewModalProps = {
  wine: Wine | null;
  visible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onArchive: () => void;
};

export const WinePreviewModal = memo(function WinePreviewModal({
  wine,
  visible,
  onClose,
  onViewDetails,
  onArchive,
}: WinePreviewModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (!wine) return null;

  const wineColor = wine.type ? WINE_TYPE_COLORS[wine.type] : WINE_TYPE_COLORS.red;

  const mediaEl = wine.photos?.[0] ? (
    <Image
      source={{ uri: wine.photos[0] }}
      style={isLandscape ? styles.imageLandscape : styles.image}
      resizeMode="cover"
    />
  ) : (
    <View
      style={[
        isLandscape ? styles.imageLandscape : styles.image,
        { backgroundColor: wineColor },
      ]}
    />
  );

  const infoEl = (
    <View style={isLandscape ? styles.infoLandscape : styles.headerInfo}>
      <Text
        style={[styles.name, { color: colors.text }]}
        numberOfLines={2}
      >
        {wine.name}
      </Text>
      {wine.winery && (
        <Text
          style={[styles.winery, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {wine.winery}
        </Text>
      )}
      {wine.vintage && (
        <Text style={[styles.vintage, { color: colors.textSecondary }]}>
          {wine.vintage}
        </Text>
      )}

      <View style={[styles.details, { borderTopColor: colors.border }]}>
        {wine.type && (
          <View style={styles.detailRow}>
            <View style={[styles.typeIndicator, { backgroundColor: wineColor }]} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {t(wine.type === 'sake' ? 'sake' : `${wine.type}_wine`)}
            </Text>
          </View>
        )}
        {wine.region && (
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {t(wine.region) || wine.region}
          </Text>
        )}
        {wine.country && (
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {t(wine.country) || wine.country}
          </Text>
        )}
      </View>

      <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
        <Pressable onPress={onViewDetails} style={styles.actionBtn}>
          <Text style={[styles.actionBtnText, { color: colors.accent }]}>
            {t('view_details')} →
          </Text>
        </Pressable>
        <View style={[styles.actionDivider, { backgroundColor: colors.border }]} />
        <Pressable onPress={onArchive} style={styles.actionBtn}>
          <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>
            {t('move_to_archive')}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            isLandscape ? styles.contentLandscape : styles.content,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {}}
        >
          {isLandscape ? (
            <View style={styles.landscapeBody}>
              {mediaEl}
              {infoEl}
            </View>
          ) : (
            <>
              <View style={styles.header}>
                {mediaEl}
                {infoEl}
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // Portrait card
  content: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  // Landscape card
  contentLandscape: {
    width: '80%',
    maxWidth: 560,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  landscapeBody: {
    flexDirection: 'row',
    gap: 16,
  },
  // Portrait: header row (image + basic info side by side)
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  imageLandscape: {
    width: 100,
    height: 130,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  // Landscape: info column takes remaining space
  infoLandscape: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  winery: {
    fontSize: 14,
    marginBottom: 2,
  },
  vintage: {
    fontSize: 14,
    fontWeight: '500',
  },
  details: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
  },
});
