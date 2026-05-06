export type CropGuide = {
  spacing_cm: string;
  sowing_period: string;
  harvest_period: string;
  min_yield_per_plant_kg: number;
  max_yield_per_plant_kg: number;
  avg_yield_per_plant_kg: number;
};

export const cropGuides: Record<string, CropGuide> = {
  pomodoro: {
    spacing_cm: '40-50 cm',
    sowing_period: 'Marzo - Aprile',
    harvest_period: 'Giugno - Agosto',
    min_yield_per_plant_kg: 2,
    max_yield_per_plant_kg: 4,
    avg_yield_per_plant_kg: 2.5
  },
  zucchina: {
    spacing_cm: '80-100 cm',
    sowing_period: 'Aprile - Maggio',
    harvest_period: 'Giugno - Settembre',
    min_yield_per_plant_kg: 2.5,
    max_yield_per_plant_kg: 4,
    avg_yield_per_plant_kg: 3
  },
  lattuga: {
    spacing_cm: '25-30 cm',
    sowing_period: 'Febbraio - Maggio',
    harvest_period: 'Aprile - Giugno',
    min_yield_per_plant_kg: 0.25,
    max_yield_per_plant_kg: 0.35,
    avg_yield_per_plant_kg: 0.3
  }
};

export function getCropGuide(name: string): CropGuide | undefined {
  return cropGuides[name.trim().toLowerCase()];
}

export function getEstimatedYieldRange(name: string, plants_number: number) {
  const guide = getCropGuide(name);
  if (!guide || plants_number <= 0) {
    return undefined;
  }

  return {
    min: plants_number * guide.min_yield_per_plant_kg,
    max: plants_number * guide.max_yield_per_plant_kg
  };
}
