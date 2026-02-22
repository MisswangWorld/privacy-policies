export type WineType = 'red' | 'white' | 'rose' | 'sparkling' | 'sweet' | 'fortified' | 'sake';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'zh' | 'en';

export type Position = {
  row: number;
  column: number;
};

export type WineCellar = {
  id: string;
  name: string;
  note?: string;
  rows: number;
  columns: number;
  createdAt: string;
};

export type Wine = {
  id: string;
  cellarId: string;
  position: Position;
  name: string;
  photos?: string[];
  winery?: string;
  vintage?: number;
  country?: string;
  region?: string;
  grapeVarieties?: string[];
  type?: WineType;
  capacity?: string;
  purchasePrice?: number;
  currentValue?: number;
  currency: string;
  purchaseDate?: string;
  purchaseChannel?: string;
  rating?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ArchivedWine = Omit<Wine, 'cellarId' | 'position'> & {
  archivedAt: string;
  originalCellarId: string;
  originalPosition: Position;
};

export type UserPreferences = {
  language: Language;
  theme: ThemeMode;
  accentColor: string;
  currency: string;
  customCountries: string[];
  customRegions: string[];
  customGrapeVarieties: string[];
  hasCompletedOnboarding: boolean;
};

export type CellarTemplate = {
  id: string;
  nameKey: string;
  rows: number;
  columns: number;
  capacity: number;
};
