import { CustomCrop } from './cropService';

export const crops = {
  pomodoro: {
    name: 'Pomodoro',
    spacing: 50,
    yieldMin: 3,
    yieldMax: 6,
    varieties: ['Ciliegino', 'San Marzano', 'Cuore di bue']
  },
  zucchina: {
    name: 'Zucchina',
    spacing: 100,
    yieldMin: 4,
    yieldMax: 8,
    varieties: ['Nera', 'Chiara', 'Fiorentina']
  },
  insalata: {
    name: 'Insalata',
    spacing: 25,
    yieldMin: 0.3,
    yieldMax: 1,
    varieties: ['Lollo', 'Iceberg', 'Romana']
  }
} as const;

export type CropKey = keyof typeof crops;
export type CropConfig = (typeof crops)[CropKey];

export const cropKeys = Object.keys(crops) as CropKey[];

export const cropOptions = cropKeys.map((key) => ({
  key,
  config: crops[key]
}));

export function getCropConfig(key: string): CropConfig | undefined {
  return crops[key as CropKey];
}

export interface CropOption {
  key: string;
  config: CropConfig | CustomCropConfig;
  isCustom?: boolean;
}

export interface CustomCropConfig {
  name: string;
  spacing: number;
  yieldMin: number;
  yieldMax: number;
}

export function getAllCropOptions(customCrops: CustomCrop[]): CropOption[] {
  const predefined = cropOptions.map(option => ({
    ...option,
    isCustom: false
  }));

  const custom = customCrops.map(crop => ({
    key: `custom-${crop.id}`,
    config: {
      name: crop.name,
      spacing: crop.spacing_cm,
      yieldMin: crop.min_yield,
      yieldMax: crop.max_yield
    },
    isCustom: true
  }));

  return [...predefined, ...custom];
}
