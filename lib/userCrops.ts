export type CropEvent = {
  type: 'trapianto' | 'concimazione' | 'trattamento' | 'raccolta';
  note?: string;
  date: string;
};

export type UserCrop = {
  id: number;
  name: string;
  cropKey?: string;
  varietyKey?: string;
  plants: number;
  spacing: number;
  yieldMin: number;
  yieldMax: number;
  createdAt: string;
  costs: Array<unknown>;
  harvests: Array<unknown>;
  pricePerKg: number;
  events: CropEvent[];
};

const STORAGE_KEY = 'userCrops';

export function getUserCrops(): UserCrop[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function addUserCrop(crop: UserCrop): UserCrop[] {
  const current = getUserCrops();
  const next = [...current, crop];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function saveUserCrops(crops: UserCrop[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
}
