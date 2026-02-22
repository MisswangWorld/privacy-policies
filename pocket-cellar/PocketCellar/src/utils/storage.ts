import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'pocket-cellar-storage' });

export const StorageKeys = {
  CELLARS: 'cellars',
  WINES: 'wines',
  ARCHIVED_WINES: 'archivedWines',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const getStorageItem = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return null;
};

export const setStorageItem = <T>(key: string, value: T): void => {
  storage.set(key, JSON.stringify(value));
};

export const removeStorageItem = (key: string): void => {
  storage.remove(key);
};
