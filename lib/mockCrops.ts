export type ActivityType = 'semina' | 'trapianto' | 'concimazione';

export type Activity = {
  type: ActivityType;
  date: string;
  note: string;
};

export type CostItem = {
  name: string;
  amount: number;
};

export type Harvest = {
  date: string;
  quantity_kg: number;
};

export type Crop = {
  id: string;
  name: string;
  area_mq: number;
  plants_number: number;
  estimated_yield_min_kg: number;
  estimated_yield_max_kg: number;
  estimated_price_per_kg: number;
  costs: CostItem[];
  activities: Activity[];
  harvests: Harvest[];
};

export const initialCrops: Crop[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    area_mq: 30,
    plants_number: 40,
    estimated_yield_min_kg: 80,
    estimated_yield_max_kg: 160,
    estimated_price_per_kg: 2.5,
    costs: [
      { name: 'Concime', amount: 45 },
      { name: 'Terriccio', amount: 18 }
    ],
    activities: [
      { type: 'semina', date: '2026-03-02', note: 'Semina in cassette' },
      { type: 'trapianto', date: '2026-04-18', note: 'Trapianto in piena terra' },
      { type: 'concimazione', date: '2026-05-10', note: 'Fertilizzante organico' }
    ],
    harvests: []
  },
  {
    id: 'zucchina',
    name: 'Zucchina',
    area_mq: 24,
    plants_number: 18,
    estimated_yield_min_kg: 45,
    estimated_yield_max_kg: 72,
    estimated_price_per_kg: 2.0,
    costs: [
      { name: 'Semi', amount: 12 },
      { name: 'Tutore', amount: 20 }
    ],
    activities: [
      { type: 'semina', date: '2026-04-01', note: 'Semina diretta' },
      { type: 'trapianto', date: '2026-04-25', note: 'Trapianto con sostegni' }
    ],
    harvests: []
  },
  {
    id: 'lattuga',
    name: 'Lattuga',
    area_mq: 10,
    plants_number: 50,
    estimated_yield_min_kg: 12.5,
    estimated_yield_max_kg: 17.5,
    estimated_price_per_kg: 1.8,
    costs: [
      { name: 'Fertilizzante', amount: 10 }
    ],
    activities: [
      { type: 'semina', date: '2026-05-05', note: 'Semina in vaso' }
    ],
    harvests: []
  }
];
