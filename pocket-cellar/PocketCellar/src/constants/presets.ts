import { CellarTemplate } from '../types';

export const CELLAR_TEMPLATES: CellarTemplate[] = [
  { id: 'mini', nameKey: 'template_mini', rows: 2, columns: 6, capacity: 12 },
  { id: 'small', nameKey: 'template_small', rows: 3, columns: 6, capacity: 18 },
  { id: 'medium', nameKey: 'template_medium', rows: 4, columns: 6, capacity: 24 },
  { id: 'standard', nameKey: 'template_standard', rows: 6, columns: 6, capacity: 36 },
  { id: 'large', nameKey: 'template_large', rows: 6, columns: 9, capacity: 54 },
  { id: 'professional', nameKey: 'template_professional', rows: 8, columns: 10, capacity: 80 },
  { id: 'custom', nameKey: 'template_custom', rows: 0, columns: 0, capacity: 0 },
];

export const PRESET_COUNTRIES = [
  'france',
  'italy',
  'spain',
  'usa',
  'australia',
  'chile',
  'argentina',
  'germany',
  'portugal',
  'new_zealand',
  'south_africa',
  'austria',
  'japan',
  'china',
];

export const PRESET_REGIONS = [
  'bordeaux',
  'burgundy',
  'champagne',
  'rhone_valley',
  'loire_valley',
  'alsace',
  'tuscany',
  'piedmont',
  'veneto',
  'rioja',
  'priorat',
  'napa_valley',
  'sonoma',
  'oregon',
  'barossa_valley',
  'hunter_valley',
  'margaret_river',
  'central_valley',
  'mendoza',
  'mosel',
  'rheingau',
  'douro',
  'porto',
  'marlborough',
];

export const PRESET_GRAPE_VARIETIES = [
  'cabernet_sauvignon',
  'merlot',
  'pinot_noir',
  'syrah',
  'sangiovese',
  'nebbiolo',
  'tempranillo',
  'malbec',
  'zinfandel',
  'gamay',
  'chardonnay',
  'sauvignon_blanc',
  'riesling',
  'pinot_grigio',
  'viognier',
  'gewurztraminer',
  'semillon',
  'chenin_blanc',
  'albarino',
  'gruner_veltliner',
];

export const CAPACITY_OPTIONS = [
  '375ml',
  '750ml',
  '1.5L',
  '3L',
];

export const CURRENCY_OPTIONS = [
  'AUD',
  'CNY',
  'EUR',
  'GBP',
  'JPY',
  'USD',
];
