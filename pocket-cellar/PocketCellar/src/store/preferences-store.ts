import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ACCENT_COLORS } from '../constants/colors';
import { i18n } from '../i18n';
import { Language, ThemeMode, UserPreferences } from '../types';
import { storage } from '../utils/storage';

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

type PreferencesState = UserPreferences & {
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  setCurrency: (currency: string) => void;
  addCustomCountry: (country: string) => void;
  addCustomRegion: (region: string) => void;
  addCustomGrapeVariety: (variety: string) => void;
  completeOnboarding: () => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'system',
      accentColor: ACCENT_COLORS.burgundy,
      currency: 'AUD',
      customCountries: [],
      customRegions: [],
      customGrapeVarieties: [],
      hasCompletedOnboarding: false,

      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setTheme: (theme) => set({ theme }),

      setAccentColor: (accentColor) => set({ accentColor }),

      setCurrency: (currency) => set({ currency }),

      addCustomCountry: (country) =>
        set((state) => ({
          customCountries: state.customCountries.includes(country)
            ? state.customCountries
            : [...state.customCountries, country],
        })),

      addCustomRegion: (region) =>
        set((state) => ({
          customRegions: state.customRegions.includes(region)
            ? state.customRegions
            : [...state.customRegions, region],
        })),

      addCustomGrapeVariety: (variety) =>
        set((state) => ({
          customGrapeVarieties: state.customGrapeVarieties.includes(variety)
            ? state.customGrapeVarieties
            : [...state.customGrapeVarieties, variety],
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
