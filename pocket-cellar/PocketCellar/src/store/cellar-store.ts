import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { WineCellar } from '../types';
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

type CellarState = {
  cellars: WineCellar[];
  activeCellarId: string | null;
  addCellar: (cellar: Omit<WineCellar, 'id' | 'createdAt'>) => string;
  updateCellar: (id: string, updates: Partial<Pick<WineCellar, 'name' | 'note'>>) => void;
  deleteCellar: (id: string) => void;
  setActiveCellar: (id: string | null) => void;
  getCellar: (id: string) => WineCellar | undefined;
};

export const useCellarStore = create<CellarState>()(
  persist(
    (set, get) => ({
      cellars: [],
      activeCellarId: null,

      addCellar: (cellarData) => {
        const id = generateId();
        const newCellar: WineCellar = {
          ...cellarData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          cellars: [...state.cellars, newCellar],
          activeCellarId: state.activeCellarId ?? id,
        }));
        return id;
      },

      updateCellar: (id, updates) =>
        set((state) => ({
          cellars: state.cellars.map((cellar) =>
            cellar.id === id ? { ...cellar, ...updates } : cellar
          ),
        })),

      deleteCellar: (id) =>
        set((state) => {
          const newCellars = state.cellars.filter((c) => c.id !== id);
          const newActiveId =
            state.activeCellarId === id
              ? newCellars[0]?.id ?? null
              : state.activeCellarId;
          return {
            cellars: newCellars,
            activeCellarId: newActiveId,
          };
        }),

      setActiveCellar: (id) => set({ activeCellarId: id }),

      getCellar: (id) => get().cellars.find((c) => c.id === id),
    }),
    {
      name: 'cellars',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
