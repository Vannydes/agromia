import { supabaseClient } from './supabaseClient';
import { useAuth } from './auth-context';

export interface Crop {
  id: string;
  user_id: string;
  name: string;
  plants: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCropData {
  name: string;
  plants: number;
}

// Get all crops for the current user
export async function getUserCrops(): Promise<Crop[]> {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabaseClient
    .from('crops')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// Create a new crop
export async function createCrop(cropData: CreateCropData): Promise<Crop> {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabaseClient
    .from('crops')
    .insert({
      user_id: user.id,
      name: cropData.name,
      plants: cropData.plants,
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