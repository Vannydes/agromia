import { cropKeys, type CropKey } from './crops';

export type HarvestEntry = {
  date: string;
  quantity_kg: number;
};

export type CostEntry = {
  label: string;
  amount: number;
};

export type RevenueEntry = {
  label: string;
  amount: number;
  date: string;
};

export type CropState = {
  key: CropKey;
  plants: number;
  harvests: HarvestEntry[];
  costs: CostEntry[];
  revenues: RevenueEntry[];
  transplantDate?: string;
  events?: any[]; // TODO: define proper type
};

export type GardenState = {
  crops: CropState[];
};

const STORAGE_KEY = 'agromia_garden';

function isHarvestEntry(value: unknown): value is HarvestEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).date === 'string' &&
    typeof (value as any).quantity_kg === 'number'
  );
}

function isCostEntry(value: unknown): value is CostEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).label === 'string' &&
    typeof (value as any).amount === 'number'
  );
}

function isRevenueEntry(value: unknown): value is RevenueEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).label === 'string' &&
    typeof (value as any).amount === 'number' &&
    typeof (value as any).date === 'string'
  );
}

function isCropState(value: unknown): value is CropState {
  return (
    typeof value === 'object' &&
    value !== null &&
    cropKeys.includes((value as any).key) &&
    typeof (value as any).plants === 'number' &&
    Array.isArray((value as any).harvests) &&
    Array.isArray((value as any).costs) &&
    Array.isArray((value as any).revenues) &&
    (value as any).harvests.every(isHarvestEntry) &&
    (value as any).costs.every(isCostEntry) &&
    (value as any).revenues.every(isRevenueEntry)
  );
}

function isGardenState(value: unknown): value is GardenState {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as any).crops) &&
    (value as any).crops.every(isCropState)
  );
}

function loadGardenState(): GardenState {
  if (typeof window === 'undefined') {
    return { crops: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { crops: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    if (isGardenState(parsed)) {
      return parsed;
    }
  } catch {
    // ignore invalid data
  }

  return { crops: [] };
}

function saveGardenState(state: GardenState) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getAllCropStates(): CropState[] {
  return loadGardenState().crops;
}

export function getCropState(key: CropKey): CropState {
  const state = loadGardenState();
  const existing = state.crops.find((item) => item.key === key);

  if (existing) {
    // Ensure revenues array exists for backward compatibility
    return {
      ...existing,
      revenues: existing.revenues || []
    };
  }

  const fresh: CropState = {
    key,
    plants: 0,
    harvests: [],
    costs: [],
    revenues: []
  };

  saveGardenState({ crops: [...state.crops, fresh] });
  return fresh;
}

export function setCropPlants(key: CropKey, plants: number): CropState {
  const state = loadGardenState();
  const next: CropState[] = state.crops.map((item) =>
    item.key === key ? { ...item, plants, revenues: item.revenues || [] } : item
  );

  if (!next.some((item) => item.key === key)) {
    next.push({ key, plants, harvests: [], costs: [], revenues: [] });
  }

  const updated = { crops: next };
  saveGardenState(updated);
  return getCropState(key);
}

export function setCropTransplantDate(key: CropKey, transplantDate: string): CropState {
  const state = loadGardenState();
  const next: CropState[] = state.crops.map((item) =>
    item.key === key ? { ...item, transplantDate } : item
  );

  if (!next.some((item) => item.key === key)) {
    next.push({ key, plants: 0, harvests: [], costs: [], revenues: [], transplantDate });
  }

  const updated = { crops: next };
  saveGardenState(updated);
  return getCropState(key);
}

export function addHarvestEntry(key: CropKey, harvest: HarvestEntry): CropState {
  const state = loadGardenState();
  const next = state.crops.map((item) =>
    item.key === key
      ? { ...item, harvests: [...item.harvests, harvest] }
      : item
  );

  if (!next.some((item) => item.key === key)) {
    next.push({ key, plants: 0, harvests: [harvest], costs: [], revenues: [] });
  }

  const updated = { crops: next };
  saveGardenState(updated);
  return getCropState(key);
}

export function addCostEntry(key: CropKey, cost: CostEntry): CropState {
  const state = loadGardenState();
  const next = state.crops.map((item) =>
    item.key === key
      ? { ...item, costs: [...item.costs, cost] }
      : item
  );

  if (!next.some((item) => item.key === key)) {
    next.push({ key, plants: 0, harvests: [], costs: [cost], revenues: [] });
  }

  const updated = { crops: next };
  saveGardenState(updated);
  return getCropState(key);
}

export function addRevenueEntry(key: CropKey, revenue: RevenueEntry): CropState {
  const state = loadGardenState();
  const next = state.crops.map((item) =>
    item.key === key
      ? { ...item, revenues: [...(item.revenues || []), revenue] }
      : item
  );

  if (!next.some((item) => item.key === key)) {
    next.push({ key, plants: 0, harvests: [], costs: [], revenues: [revenue] });
  }

  const updated = { crops: next };
  saveGardenState(updated);
  return getCropState(key);
}
