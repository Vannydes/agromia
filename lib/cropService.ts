import { supabaseClient } from './supabaseClient';

export interface Crop {
  id: string;
  user_id: string;
  name: string;
  plants: number;
  custom_crop_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomCrop {
  id: string;
  user_id: string;
  name: string;
  spacing_cm: number;
  min_yield: number;
  max_yield: number;
  created_at: string;
}

export interface CreateCropData {
  name: string;
  plants: number;
  custom_crop_id?: string | null;
}

export interface CreateCustomCropData {
  name: string;
  spacing_cm: number;
  min_yield: number;
  max_yield: number;
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

// Get all crops for the current user
export async function getUserCrops(): Promise<Crop[]> {
  console.log('[Dashboard] 📊 Fetching crops start');
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('crops')
      .select('id, user_id, name, plants, custom_crop_id, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Dashboard] ❌ Error fetching crops:', error);
      throw error;
    }

    console.log('[Dashboard] ✅ Crops loaded:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('[Dashboard] 💥 Crops fetch exception:', err);
    throw err;
  }
}

export async function getCropById(id: string): Promise<Crop | null> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('crops')
      .select('id, user_id, name, plants, custom_crop_id, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (typeof error.details === 'string' && error.details.includes('No rows found')) {
        return null;
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('[CropService] Error fetching crop by id:', err);
    throw err;
  }
}

// Create a new crop
export async function createCrop(cropData: CreateCropData): Promise<Crop> {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabaseClient
    .from('crops')
    .insert({
      user_id: user.id,
      name: cropData.name,
      plants: cropData.plants,
      custom_crop_id: cropData.custom_crop_id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Update a crop
export async function updateCrop(id: string, updates: Partial<CreateCropData>): Promise<Crop> {
  const { data, error } = await supabaseClient
    .from('crops')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Delete a crop
export async function deleteCrop(id: string): Promise<void> {
  const { error } = await supabaseClient
    .from('crops')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

// Get all custom crops for the current user
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

  return data || [];
}

// Create a new custom crop
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

  return data;
}