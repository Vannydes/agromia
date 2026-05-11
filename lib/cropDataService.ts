import { supabaseClient } from './supabaseClient';
import { crops } from './crops';

export interface CustomCrop {
  id: string;
  user_id: string;
  name: string;
  spacing_cm: number;
  min_yield: number;
  max_yield: number;
  created_at: string;
}

export interface Crop {
  id: string;
  user_id: string;
  name: string;
  plants: number;
  custom_crop_id?: string | null;
  transplant_date?: string | null;
  created_at: string;
  updated_at: string;
  custom_crops?: CustomCrop | null;
}

function normalizeCropData(crop: Crop & { custom_crops?: CustomCrop[] | null }): Crop {
  const customCropRaw = crop.custom_crops;
  const customCrop = Array.isArray(customCropRaw) ? customCropRaw[0] ?? null : customCropRaw ?? null;
  return {
    ...crop,
    custom_crops: customCrop,
  };
}

export interface Cost {
  id: string;
  crop_id: string;
  user_id: string;
  note: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  crop_id: string;
  user_id: string;
  type: 'semina' | 'trapianto' | 'concimazione' | 'irrigazione' | 'raccolta';
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Harvest {
  id: string;
  crop_id: string;
  user_id: string;
  date: string;
  quantity_kg: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCropData {
  name: string;
  plants: number;
  custom_crop_id?: string | null;
  transplant_date?: string | null;
}

export interface CreateCustomCropData {
  name: string;
  spacing_cm: number;
  min_yield: number;
  max_yield: number;
}

export interface DashboardStats {
  totalCrops: number;
  totalPlants: number;
  totalEstimatedMin: number;
  totalEstimatedMax: number;
  totalRealProduction: number;
  totalCosts: number;
}

async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    throw error;
  }

  const user = session?.user;

  if (!user) {
    throw new Error('User not authenticated');
  }

  return user;
}

function getCropYieldRange(crop: Crop) {
  if (crop.custom_crops) {
    return {
      min: Number(crop.custom_crops.min_yield) || 1,
      max: Number(crop.custom_crops.max_yield) || 3,
    };
  }

  const config = Object.values(crops).find((item) => item.name === crop.name);
  return {
    min: config?.yieldMin ?? 1,
    max: config?.yieldMax ?? 3,
  };
}

export async function getUserCrops(): Promise<Crop[]> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('crops')
    .select('id, user_id, name, plants, custom_crop_id, transplant_date, created_at, updated_at, custom_crops(id, spacing_cm, min_yield, max_yield)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data || []) as Array<Crop & { custom_crops?: CustomCrop[] | null }>;
  return rows.map(normalizeCropData);
}

export async function getCropById(id: string): Promise<Crop | null> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('crops')
    .select('id, user_id, name, plants, custom_crop_id, transplant_date, created_at, updated_at, custom_crops(id, spacing_cm, min_yield, max_yield)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.details?.toString().includes('No rows found')) {
      return null;
    }
    throw error;
  }

  return normalizeCropData(data as Crop & { custom_crops?: CustomCrop[] | null });
}

export async function createCrop(cropData: CreateCropData): Promise<Crop> {
  const user = await getAuthenticatedUser();
  const payload = {
    user_id: user.id,
    name: cropData.name,
    plants: cropData.plants,
    custom_crop_id: cropData.custom_crop_id || null,
    transplant_date: cropData.transplant_date || null,
  };

  const { data, error } = await supabaseClient
    .from('crops')
    .insert(payload)
    .select('id, user_id, name, plants, custom_crop_id, transplant_date, created_at, updated_at, custom_crops(id, spacing_cm, min_yield, max_yield)')
    .single();

  if (error) {
    throw error;
  }

  return normalizeCropData(data as Crop & { custom_crops?: CustomCrop[] | null });
}

export async function deleteCrop(id: string): Promise<void> {
  const user = await getAuthenticatedUser();
  const { error } = await supabaseClient
    .from('crops')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
}

export async function getUserCustomCrops(): Promise<CustomCrop[]> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('custom_crops')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as CustomCrop[];
}

export async function createCustomCrop(cropData: CreateCustomCropData): Promise<CustomCrop> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('custom_crops')
    .insert({
      user_id: user.id,
      name: cropData.name,
      spacing_cm: cropData.spacing_cm,
      min_yield: cropData.min_yield,
      max_yield: cropData.max_yield,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CustomCrop;
}

export async function getCosts(cropId?: string): Promise<Cost[]> {
  const user = await getAuthenticatedUser();
  let query = supabaseClient
    .from('costs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (cropId) {
    query = query.eq('crop_id', cropId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []) as Cost[];
}

export async function addCost(cropId: string, note: string, amount: number): Promise<Cost> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('costs')
    .insert({
      crop_id: cropId,
      user_id: user.id,
      note,
      amount,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Cost;
}

export async function getActivities(cropId?: string): Promise<Activity[]> {
  const user = await getAuthenticatedUser();
  let query = supabaseClient
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (cropId) {
    query = query.eq('crop_id', cropId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []) as Activity[];
}

export async function addActivity(
  cropId: string,
  type: Activity['type'],
  date: string,
  note?: string
): Promise<Activity> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('activities')
    .insert({
      crop_id: cropId,
      user_id: user.id,
      type,
      date,
      note: note || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Activity;
}

export async function getHarvests(cropId?: string): Promise<Harvest[]> {
  const user = await getAuthenticatedUser();
  let query = supabaseClient
    .from('harvests')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (cropId) {
    query = query.eq('crop_id', cropId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data || []) as Harvest[];
}

export async function addHarvest(
  cropId: string,
  date: string,
  quantity_kg: number,
  note?: string
): Promise<Harvest> {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabaseClient
    .from('harvests')
    .insert({
      crop_id: cropId,
      user_id: user.id,
      date,
      quantity_kg,
      note: note || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Harvest;
}

export async function getUserTotalCosts(): Promise<number> {
  const costs = await getCosts();
  return costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
}

export async function getUserTotalHarvests(): Promise<number> {
  const harvests = await getHarvests();
  return harvests.reduce((sum, harvest) => sum + Number(harvest.quantity_kg), 0);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const crops = await getUserCrops();
  const totalCosts = await getUserTotalCosts();
  const totalRealProduction = await getUserTotalHarvests();

  const totalEstimatedMin = crops.reduce((sum, crop) => {
    const range = getCropYieldRange(crop);
    return sum + crop.plants * range.min;
  }, 0);

  const totalEstimatedMax = crops.reduce((sum, crop) => {
    const range = getCropYieldRange(crop);
    return sum + crop.plants * range.max;
  }, 0);

  return {
    totalCrops: crops.length,
    totalPlants: crops.reduce((sum, crop) => sum + crop.plants, 0),
    totalEstimatedMin,
    totalEstimatedMax,
    totalRealProduction,
    totalCosts,
  };
}

export async function getCostsByCrop(cropId: string): Promise<Cost[]> {
  return getCosts(cropId);
}

export async function getActivitiesByCrop(cropId: string): Promise<Activity[]> {
  return getActivities(cropId);
}

export async function getHarvestsByCrop(cropId: string): Promise<Harvest[]> {
  return getHarvests(cropId);
}
