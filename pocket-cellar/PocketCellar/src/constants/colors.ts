export const WINE_TYPE_COLORS = {
  red: '#722F37',
  white: '#F4E6B0',
  rose: '#E8A0A0',
  sparkling: '#F5DEB3',
  sweet: '#FFBF00',
  fortified: '#8B4513',
  sake: '#E8F4F8',
} as const;

export const ACCENT_COLORS = {
  burgundy: '#722F37',
  roseWine: '#A83254',
  rubyRed: '#9B1B30',
  merlotPurple: '#8E4585',
  champagneGold: '#C9A962',
  oakBrown: '#6B4423',
  navyBlue: '#2C3E50',
  classicBlack: '#1A1A1A',
} as const;

export const ACCENT_COLOR_KEYS = [
  'burgundy',
  'roseWine',
  'rubyRed',
  'merlotPurple',
  'champagneGold',
  'oakBrown',
  'navyBlue',
  'classicBlack',
] as const;

export const LIGHT_THEME = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
  emptyCellBackground: '#FFFFFF',
  emptyCellBorder: '#E0E0E0',
} as const;

export const DARK_THEME = {
  background: '#1A1A1A',
  surface: '#2A2A2A',
  card: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#999999',
  border: '#3A3A3A',
  emptyCellBackground: '#2A2A2A',
  emptyCellBorder: '#3A3A3A',
} as const;
