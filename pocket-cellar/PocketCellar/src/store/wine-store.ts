import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ArchivedWine, Position, Wine } from '../types';
import { generateId, storage } from '../utils';

const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

type WineState = {
  wines: Wine[];
  archivedWines: ArchivedWine[];
  addWine: (wine: Omit<Wine, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWine: (id: string, updates: Partial<Omit<Wine, 'id' | 'createdAt'>>) => void;
  deleteWine: (id: string) => void;
  moveWine: (id: string, newCellarId: string, newPosition: Position) => void;
  archiveWine: (id: string) => void;
  archiveWinesByCellar: (cellarId: string) => void;
  restoreWine: (archivedWineId: string, cellarId: string, position: Position) => string;
  deleteArchivedWine: (id: string) => void;
  getWineAt: (cellarId: string, position: Position) => Wine | undefined;
  getWinesByCellar: (cellarId: string) => Wine[];
  isPositionOccupied: (cellarId: string, position: Position) => boolean;
  copyWine: (id: string, newCellarId: string, newPosition: Position) => string;
};

export const useWineStore = create<WineState>()(
  persist(
    (set, get) => ({
      wines: [],
      archivedWines: [],

      addWine: (wineData) => {
        const id = generateId();
        const now = new Date().toISOString();
        const newWine: Wine = {
          ...wineData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ wines: [...state.wines, newWine] }));
        return id;
      },

      updateWine: (id, updates) =>
        set((state) => ({
          wines: state.wines.map((wine) =>
            wine.id === id
              ? { ...wine, ...updates, updatedAt: new Date().toISOString() }
              : wine
          ),
        })),

      deleteWine: (id) =>
        set((state) => ({
          wines: state.wines.filter((w) => w.id !== id),
        })),

      moveWine: (id, newCellarId, newPosition) =>
        set((state) => ({
          wines: state.wines.map((wine) =>
            wine.id === id
              ? {
                  ...wine,
                  cellarId: newCellarId,
                  position: newPosition,
                  updatedAt: new Date().toISOString(),
                }
              : wine
          ),
        })),

      archiveWine: (id) => {
        const wine = get().wines.find((w) => w.id === id);
        if (!wine) return;

        const archivedWine: ArchivedWine = {
          id: wine.id,
          name: wine.name,
          photos: wine.photos,
          winery: wine.winery,
          vintage: wine.vintage,
          country: wine.country,
          region: wine.region,
          grapeVarieties: wine.grapeVarieties,
          type: wine.type,
          capacity: wine.capacity,
          purchasePrice: wine.purchasePrice,
          currentValue: wine.currentValue,
          currency: wine.currency,
          purchaseDate: wine.purchaseDate,
          purchaseChannel: wine.purchaseChannel,
          rating: wine.rating,
          notes: wine.notes,
          createdAt: wine.createdAt,
          updatedAt: wine.updatedAt,
          archivedAt: new Date().toISOString(),
          originalCellarId: wine.cellarId,
          originalPosition: wine.position,
        };

        set((state) => ({
          wines: state.wines.filter((w) => w.id !== id),
          archivedWines: [...state.archivedWines, archivedWine],
        }));
      },

      archiveWinesByCellar: (cellarId) => {
        const winesInCellar = get().wines.filter((w) => w.cellarId === cellarId);
        const archivedWines: ArchivedWine[] = winesInCellar.map((wine) => ({
          id: wine.id,
          name: wine.name,
          photos: wine.photos,
          winery: wine.winery,
          vintage: wine.vintage,
          country: wine.country,
          region: wine.region,
          grapeVarieties: wine.grapeVarieties,
          type: wine.type,
          capacity: wine.capacity,
          purchasePrice: wine.purchasePrice,
          currentValue: wine.currentValue,
          currency: wine.currency,
          purchaseDate: wine.purchaseDate,
          purchaseChannel: wine.purchaseChannel,
          rating: wine.rating,
          notes: wine.notes,
          createdAt: wine.createdAt,
          updatedAt: wine.updatedAt,
          archivedAt: new Date().toISOString(),
          originalCellarId: wine.cellarId,
          originalPosition: wine.position,
        }));

        set((state) => ({
          wines: state.wines.filter((w) => w.cellarId !== cellarId),
          archivedWines: [...state.archivedWines, ...archivedWines],
        }));
      },

      restoreWine: (archivedWineId, cellarId, position) => {
        const archivedWine = get().archivedWines.find((w) => w.id === archivedWineId);
        if (!archivedWine) return '';

        const newId = generateId();
        const now = new Date().toISOString();
        const restoredWine: Wine = {
          id: newId,
          cellarId,
          position,
          name: archivedWine.name,
          photos: archivedWine.photos,
          winery: archivedWine.winery,
          vintage: archivedWine.vintage,
          country: archivedWine.country,
          region: archivedWine.region,
          grapeVarieties: archivedWine.grapeVarieties,
          type: archivedWine.type,
          capacity: archivedWine.capacity,
          purchasePrice: archivedWine.purchasePrice,
          currentValue: archivedWine.currentValue,
          currency: archivedWine.currency,
          purchaseDate: archivedWine.purchaseDate,
          purchaseChannel: archivedWine.purchaseChannel,
          rating: archivedWine.rating,
          notes: archivedWine.notes,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          wines: [...state.wines, restoredWine],
          archivedWines: state.archivedWines.filter((w) => w.id !== archivedWineId),
        }));

        return newId;
      },

      deleteArchivedWine: (id) =>
        set((state) => ({
          archivedWines: state.archivedWines.filter((w) => w.id !== id),
        })),

      getWineAt: (cellarId, position) =>
        get().wines.find(
          (w) =>
            w.cellarId === cellarId &&
            w.position.row === position.row &&
            w.position.column === position.column
        ),

      getWinesByCellar: (cellarId) =>
        get().wines.filter((w) => w.cellarId === cellarId),

      isPositionOccupied: (cellarId, position) =>
        get().wines.some(
          (w) =>
            w.cellarId === cellarId &&
            w.position.row === position.row &&
            w.position.column === position.column
        ),

      copyWine: (id, newCellarId, newPosition) => {
        const wine = get().wines.find((w) => w.id === id);
        if (!wine) return '';

        const newId = generateId();
        const now = new Date().toISOString();
        const copiedWine: Wine = {
          ...wine,
          id: newId,
          cellarId: newCellarId,
          position: newPosition,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ wines: [...state.wines, copiedWine] }));
        return newId;
      },
    }),
    {
      name: 'wines',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
