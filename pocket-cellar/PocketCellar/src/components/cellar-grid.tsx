import React, { memo, useCallback, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../hooks';
import { useWineStore } from '../store';
import { Position, Wine, WineCellar } from '../types';
import { WineCell } from './wine-cell';

type CellarGridProps = {
  cellar: WineCellar;
  onCellPress: (position: Position, wine?: Wine) => void;
  onCellLongPress?: (position: Position, wine?: Wine) => void;
  highlightedPosition?: Position | null;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16;
const MIN_CELL_SIZE = 40;
const MAX_CELL_SIZE = 60;
const LABEL_WIDTH = 20;
const CELL_MARGIN = 2; // matches margin: 2 in WineCell styles

export const CellarGrid = memo(function CellarGrid({
  cellar,
  onCellPress,
  onCellLongPress,
  highlightedPosition,
}: CellarGridProps) {
  const { colors } = useTheme();
  const wines = useWineStore((s) => s.wines);

  const cellSize = useMemo(() => {
    // Account for left + right row labels and cell margins
    const availableWidth =
      SCREEN_WIDTH - GRID_PADDING * 2 - LABEL_WIDTH * 2 - cellar.columns * CELL_MARGIN * 2;
    const calculatedSize = availableWidth / cellar.columns;
    return Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, calculatedSize));
  }, [cellar.columns]);

  // Build a position → wine map so renderCell reactively updates when wines change.
  const wineMap = useMemo(() => {
    const map = new Map<string, Wine>();
    wines
      .filter((w) => w.cellarId === cellar.id)
      .forEach((w) => map.set(`${w.position.row}-${w.position.column}`, w));
    return map;
  }, [wines, cellar.id]);

  const renderCell = useCallback(
    (row: number, column: number) => {
      const position = { row, column };
      const wine = wineMap.get(`${row}-${column}`);
      const isHighlighted =
        highlightedPosition?.row === row &&
        highlightedPosition?.column === column;

      return (
        <WineCell
          key={`${row}-${column}`}
          wine={wine}
          onPress={() => onCellPress(position, wine)}
          onLongPress={() => onCellLongPress?.(position, wine)}
          size={cellSize}
          isHighlighted={isHighlighted}
        />
      );
    },
    [cellar.id, cellSize, wineMap, onCellPress, onCellLongPress, highlightedPosition]
  );

  // Each cell occupies cellSize + CELL_MARGIN * 2 total width
  const cellTotalWidth = cellSize + CELL_MARGIN * 2;

  const columnHeader = useMemo(() => {
    const labels = [];
    for (let col = 0; col < cellar.columns; col++) {
      labels.push(
        <View key={col} style={[styles.colLabel, { width: cellTotalWidth }]}>
          <Text style={[styles.indexText, { color: colors.textSecondary }]}>
            {col + 1}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.colHeaderRow}>
        <View style={{ width: LABEL_WIDTH }} />
        {labels}
        <View style={{ width: LABEL_WIDTH }} />
      </View>
    );
  }, [cellar.columns, cellTotalWidth, colors.textSecondary]);

  const renderRow = useCallback(
    (rowIndex: number) => {
      const cells = [];
      for (let col = 0; col < cellar.columns; col++) {
        cells.push(renderCell(rowIndex, col));
      }
      const label = (
        <View style={styles.rowLabel}>
          <Text style={[styles.indexText, { color: colors.textSecondary }]}>
            {rowIndex + 1}
          </Text>
        </View>
      );
      return (
        <View key={rowIndex} style={styles.row}>
          {label}
          {cells}
          {label}
        </View>
      );
    },
    [cellar.columns, renderCell, colors.textSecondary]
  );

  const rows = useMemo(() => {
    const result = [];
    for (let row = 0; row < cellar.rows; row++) {
      result.push(renderRow(row));
    }
    return result;
  }, [cellar.rows, renderRow]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      >
        <View
          style={[
            styles.gridContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {columnHeader}
          {rows}
        </View>
      </ScrollView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: GRID_PADDING,
  },
  horizontalContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gridContainer: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
  colHeaderRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  colLabel: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    width: LABEL_WIDTH,
    alignItems: 'center',
  },
  indexText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
