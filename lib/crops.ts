import { CustomCrop } from './cropService';

export const crops = {
  aglio: {
    name: 'Aglio',
    spacing: 15,
    yieldMin: 0.1,
    yieldMax: 0.2,
    varieties: ['Tondo', 'Lungo']
  },
  basilico: {
    name: 'Basilico',
    spacing: 20,
    yieldMin: 0.2,
    yieldMax: 0.5,
    varieties: ['Genovese', 'Rucola', 'Lemon']
  },
  broccolo: {
    name: 'Broccolo',
    spacing: 45,
    yieldMin: 0.6,
    yieldMax: 1.2,
    varieties: ['Calabrese', 'Romanesco']
  },
  cavolo: {
    name: 'Cavolo',
    spacing: 50,
    yieldMin: 1,
    yieldMax: 2,
    varieties: ['Verza', 'Cavolo nero', 'Cavolfiore']
  },
  carota: {
    name: 'Carota',
    spacing: 10,
    yieldMin: 0.1,
    yieldMax: 0.25,
    varieties: ['Nantes', 'Chantenay', 'Baby']
  },
  cetriolo: {
    name: 'Cetriolo',
    spacing: 40,
    yieldMin: 2,
    yieldMax: 5,
    varieties: ['Lingua di Serpente', 'Tondo', 'Mignon']
  },
  fragola: {
    name: 'Fragola',
    spacing: 30,
    yieldMin: 0.3,
    yieldMax: 0.8,
    varieties: ['Albion', 'Camarosa', 'Mara des Bois']
  },
  finocchio: {
    name: 'Finocchio',
    spacing: 30,
    yieldMin: 0.4,
    yieldMax: 0.7,
    varieties: ['Dolce', 'Fino', 'Marconi']
  },
  insalata: {
    name: 'Insalata',
    spacing: 25,
    yieldMin: 0.3,
    yieldMax: 0.6,
    varieties: ['Lollo', 'Iceberg', 'Romana']
  },
  lattuga: {
    name: 'Lattuga',
    spacing: 30,
    yieldMin: 0.4,
    yieldMax: 0.8,
    varieties: ['Gentilina', 'Batavia', 'Romaine']
  },
  melanzana: {
    name: 'Melanzana',
    spacing: 60,
    yieldMin: 2,
    yieldMax: 5,
    varieties: ['Violetta', 'Nera', 'Striata']
  },
  patata: {
    name: 'Patata',
    spacing: 35,
    yieldMin: 0.8,
    yieldMax: 1.5,
    varieties: ['Monalisa', 'Yukon Gold', 'Charlotte']
  },
  peperone: {
    name: 'Peperone',
    spacing: 50,
    yieldMin: 1.5,
    yieldMax: 3,
    varieties: ['Dolce', 'Corno di Toro', 'Quadrato']
  },
  peperoncino: {
    name: 'Peperoncino',
    spacing: 40,
    yieldMin: 0.5,
    yieldMax: 1.5,
    varieties: ['Cayenna', 'Bird’s Eye', 'Jalapeño']
  },
  pisello: {
    name: 'Pisello',
    spacing: 10,
    yieldMin: 0.2,
    yieldMax: 0.5,
    varieties: ['Mangiatutto', 'Pisello Nano', 'Pisello Zucchino']
  },
  pomodoro: {
    name: 'Pomodoro',
    spacing: 50,
    yieldMin: 3,
    yieldMax: 6,
    varieties: ['Ciliegino', 'San Marzano', 'Cuore di bue']
  },
  prezzemolo: {
    name: 'Prezzemolo',
    spacing: 15,
    yieldMin: 0.15,
    yieldMax: 0.3,
    varieties: ['Riccio', 'Piatto']
  },
  rucola: {
    name: 'Rucola',
    spacing: 10,
    yieldMin: 0.1,
    yieldMax: 0.2,
    varieties: ['Selvatica', 'Coltivata']
  },
  zucchina: {
    name: 'Zucchina',
    spacing: 80,
    yieldMin: 2,
    yieldMax: 4,
    varieties: ['Nera', 'Chiara', 'Fiorentina']
  }
} as const;

export type CropKey = keyof typeof crops;
export type CropConfig = (typeof crops)[CropKey];

export const cropKeys = (Object.keys(crops) as CropKey[]).sort((a, b) =>
  crops[a].name.localeCompare(crops[b].name, 'it-IT')
);

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

  return [...predefined, ...custom].sort((a, b) =>
    a.config.name.localeCompare(b.config.name, 'it-IT')
  );
}
