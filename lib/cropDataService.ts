import { supabaseClient } from './supabaseClient';

// Types
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

// Auth helper
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

// COSTS API

export async function getCostsByCrop(cropId: string): Promise<Cost[]> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('costs')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CropDataService] Error fetching costs:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CropDataService] Cost fetch exception:', err);
    throw err;
  }
}

export async function getTotalCostsByCrop(cropId: string): Promise<number> {
  const costs = await getCostsByCrop(cropId);
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
}

export async function getTotalCostsForUser(): Promise<number> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('costs')
      .select('amount')
      .eq('user_id', user.id);

    if (error) {
      console.error('[CropDataService] Error fetching total costs:', error);
      throw error;
    }

    return (data || []).reduce((sum, item) => sum + item.amount, 0);
  } catch (err) {
    console.error('[CropDataService] Total costs fetch exception:', err);
    throw err;
  }
}

export async function addCost(cropId: string, note: string, amount: number): Promise<Cost> {
  const user = await getAuthenticatedUser();

  try {
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
      console.error('[CropDataService] Error adding cost:', error);
      throw error;
    }

    console.log('[CropDataService] Cost added successfully:', data);
    return data;
  } catch (err) {
    console.error('[CropDataService] Add cost exception:', err);
    throw err;
  }
}

export async function deleteCost(costId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    const { error } = await supabaseClient
      .from('costs')
      .delete()
      .eq('id', costId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[CropDataService] Error deleting cost:', error);
      throw error;
    }

    console.log('[CropDataService] Cost deleted successfully');
  } catch (err) {
    console.error('[CropDataService] Delete cost exception:', err);
    throw err;
  }
}

// ACTIVITIES API

export async function getActivitiesByCrop(cropId: string): Promise<Activity[]> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('[CropDataService] Error fetching activities:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CropDataService] Activities fetch exception:', err);
    throw err;
  }
}

export async function addActivity(
  cropId: string,
  type: Activity['type'],
  date: string,
  note?: string
): Promise<Activity> {
  const user = await getAuthenticatedUser();

  try {
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
      console.error('[CropDataService] Error adding activity:', error);
      throw error;
    }

    console.log('[CropDataService] Activity added successfully:', data);
    return data;
  } catch (err) {
    console.error('[CropDataService] Add activity exception:', err);
    throw err;
  }
}

export async function deleteActivity(activityId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    const { error } = await supabaseClient
      .from('activities')
      .delete()
      .eq('id', activityId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[CropDataService] Error deleting activity:', error);
      throw error;
    }

    console.log('[CropDataService] Activity deleted successfully');
  } catch (err) {
    console.error('[CropDataService] Delete activity exception:', err);
    throw err;
  }
}

// HARVESTS API

export async function getHarvestsByCrop(cropId: string): Promise<Harvest[]> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('harvests')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('[CropDataService] Error fetching harvests:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CropDataService] Harvests fetch exception:', err);
    throw err;
  }
}

export async function getTotalHarvestsByCrop(cropId: string): Promise<number> {
  const harvests = await getHarvestsByCrop(cropId);
  return harvests.reduce((sum, harvest) => sum + harvest.quantity_kg, 0);
}

export async function getTotalHarvestsForUser(): Promise<number> {
  const user = await getAuthenticatedUser();

  try {
    const { data, error } = await supabaseClient
      .from('harvests')
      .select('quantity_kg')
      .eq('user_id', user.id);

    if (error) {
      console.error('[CropDataService] Error fetching total harvests for user:', error);
      throw error;
    }

    return (data || []).reduce((sum, item) => sum + item.quantity_kg, 0);
  } catch (err) {
    console.error('[CropDataService] Total harvests fetch exception:', err);
    throw err;
  }
}

export async function addHarvest(
  cropId: string,
  date: string,
  quantity_kg: number,
  note?: string
): Promise<Harvest> {
  const user = await getAuthenticatedUser();

  try {
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
      console.error('[CropDataService] Error adding harvest:', error);
      throw error;
    }

    console.log('[CropDataService] Harvest added successfully:', data);
    return data;
  } catch (err) {
    console.error('[CropDataService] Add harvest exception:', err);
    throw err;
  }
}

export async function deleteHarvest(harvestId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    const { error } = await supabaseClient
      .from('harvests')
      .delete()
      .eq('id', harvestId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[CropDataService] Error deleting harvest:', error);
      throw error;
    }

    console.log('[CropDataService] Harvest deleted successfully');
  } catch (err) {
    console.error('[CropDataService] Delete harvest exception:', err);
    throw err;
  }
}
