import { supabaseClient } from './supabaseClient';

// Types
export type ActivityType = 'semina' | 'trapianto' | 'concimazione' | 'irrigazione' | 'raccolta';

export interface Cost {
  id: string;
  crop_id: string;
  user_id: string;
  title: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  crop_id: string;
  user_id: string;
  activity_type: ActivityType;
  activity_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Harvest {
  id: string;
  crop_id: string;
  user_id: string;
  quantity_kg: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type CostRow = {
  id: string;
  crop_id: string;
  user_id: string;
  title: string;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  crop_id: string;
  user_id: string;
  activity_type: ActivityType;
  activity_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type HarvestRow = {
  id: string;
  crop_id: string;
  user_id: string;
  quantity_kg: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function normalizeCost(row: CostRow): Cost {
  return {
    id: row.id,
    crop_id: row.crop_id,
    user_id: row.user_id,
    title: row.title,
    amount: Number(row.amount),
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    crop_id: row.crop_id,
    user_id: row.user_id,
    activity_type: row.activity_type,
    activity_date: row.activity_date,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeHarvest(row: HarvestRow): Harvest {
  return {
    id: row.id,
    crop_id: row.crop_id,
    user_id: row.user_id,
    quantity_kg: Number(row.quantity_kg),
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Auth helper
async function getAuthenticatedUser() {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('[AUTH] getSession ERROR:', JSON.stringify(error, null, 2));
    throw error;
  }

  const user = session?.user;

  console.log('[AUTH] Current user:', user?.id);
  console.log('[AUTH] User exists:', !!user);

  if (!user) {
    console.error('[AUTH] User not authenticated - session exists:', !!session);
    throw new Error('User not authenticated');
  }

  return user;
}

// COSTS API

export async function getCostsByCrop(cropId: string): Promise<Cost[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[COST QUERY] getCostsByCrop - crop_id:', cropId, 'user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('costs')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[COST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[COST QUERY] ERROR MESSAGE:', error?.message);
      console.error('[COST QUERY] ERROR DETAILS:', error?.details);
      console.error('[COST QUERY] ERROR HINT:', error?.hint);
      console.error('[COST QUERY] ERROR CODE:', error?.code);
      throw error;
    }

    console.log('[COST QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeCost);
  } catch (err) {
    console.error('[COST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
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
    console.log('[COST QUERY] getTotalCostsForUser - user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('costs')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('[COST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    const total = (data || []).reduce((sum, item) => sum + Number(item.amount), 0);
    console.log('[COST QUERY] SUCCESS - total:', total);
    return total;
  } catch (err) {
    console.error('[COST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function addCost(cropId: string, title: string, notes: string, amount: number): Promise<Cost> {
  const user = await getAuthenticatedUser();

  try {
    const payload: { crop_id: string; user_id: string; title: string; amount: number; notes?: string | null } = {
      crop_id: cropId,
      user_id: user.id,
      title,
      amount,
      notes: notes ? notes : null,
    };
    console.log('[COST INSERT] PAYLOAD:', JSON.stringify(payload, null, 2));
    console.log('[COST INSERT] crop_id:', cropId);
    console.log('[COST INSERT] user_id:', user.id);
    console.log('[COST INSERT] title:', title);
    console.log('[COST INSERT] amount:', amount);
    console.log('[COST INSERT] notes:', notes);

    const { data, error } = await supabaseClient
      .from('costs')
      .insert([payload])
      .select('*');

    if (error) {
      console.error('[COST INSERT] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[COST INSERT] ERROR MESSAGE:', error?.message);
      console.error('[COST INSERT] ERROR DETAILS:', error?.details);
      console.error('[COST INSERT] ERROR HINT:', error?.hint);
      console.error('[COST INSERT] ERROR CODE:', error?.code);
      console.error('[COST INSERT] ERROR OBJECT:', error);
      throw error;
    }

    console.log('[COST INSERT] SUCCESS - data:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      return normalizeCost(data[0] as CostRow);
    }
    throw new Error('No data returned from insert');
  } catch (err) {
    console.error('[COST INSERT] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function updateCost(costId: string, notes: string, amount: number): Promise<Cost> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[COST UPDATE] costId:', costId, 'user_id:', user.id, 'notes:', notes, 'amount:', amount);
    const { data, error } = await supabaseClient
      .from('costs')
      .update({ notes, amount })
      .eq('id', costId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('[COST UPDATE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[COST UPDATE] SUCCESS:', JSON.stringify(data, null, 2));
    return normalizeCost(data as CostRow);
  } catch (err) {
    console.error('[COST UPDATE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function deleteCost(costId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[COST DELETE] costId:', costId, 'user_id:', user.id);
    const { error } = await supabaseClient
      .from('costs')
      .delete()
      .eq('id', costId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[COST DELETE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[COST DELETE] SUCCESS');
  } catch (err) {
    console.error('[COST DELETE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

// ACTIVITIES API

export async function getActivitiesByCrop(cropId: string): Promise<Activity[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[ACTIVITY QUERY] getActivitiesByCrop - crop_id:', cropId, 'user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false });

    if (error) {
      console.error('[ACTIVITY QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[ACTIVITY QUERY] ERROR MESSAGE:', error?.message);
      console.error('[ACTIVITY QUERY] ERROR DETAILS:', error?.details);
      console.error('[ACTIVITY QUERY] ERROR HINT:', error?.hint);
      console.error('[ACTIVITY QUERY] ERROR CODE:', error?.code);
      throw error;
    }

    console.log('[ACTIVITY QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeActivity);
  } catch (err) {
    console.error('[ACTIVITY QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function addActivity(
  cropId: string,
  activity_type: ActivityType,
  activity_date: string,
  notes?: string
): Promise<Activity> {
  const user = await getAuthenticatedUser();

  try {
    const payload = {
      crop_id: cropId,
      user_id: user.id,
      activity_type,
      activity_date,
      notes: notes ? notes : null,
    };
    console.log('[ACTIVITY INSERT] PAYLOAD:', JSON.stringify(payload, null, 2));
    console.log('[ACTIVITY INSERT] crop_id:', cropId);
    console.log('[ACTIVITY INSERT] user_id:', user.id);
    console.log('[ACTIVITY INSERT] activity_type:', activity_type);
    console.log('[ACTIVITY INSERT] activity_date:', activity_date);
    console.log('[ACTIVITY INSERT] notes:', notes);

    const { data, error } = await supabaseClient
      .from('activities')
      .insert([payload])
      .select('*');

    if (error) {
      console.error('[ACTIVITY INSERT] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[ACTIVITY INSERT] ERROR MESSAGE:', error?.message);
      console.error('[ACTIVITY INSERT] ERROR DETAILS:', error?.details);
      console.error('[ACTIVITY INSERT] ERROR HINT:', error?.hint);
      console.error('[ACTIVITY INSERT] ERROR CODE:', error?.code);
      console.error('[ACTIVITY INSERT] ERROR OBJECT:', error);
      throw error;
    }

    console.log('[ACTIVITY INSERT] SUCCESS - data:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      return normalizeActivity(data[0] as ActivityRow);
    }
    throw new Error('No data returned from insert');
  } catch (err) {
    console.error('[ACTIVITY INSERT] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function updateActivity(
  activityId: string,
  activity_type: ActivityType,
  activity_date: string,
  notes?: string | null
): Promise<Activity> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[ACTIVITY UPDATE] activityId:', activityId, 'user_id:', user.id, 'activity_type:', activity_type, 'activity_date:', activity_date);
    const { data, error } = await supabaseClient
      .from('activities')
      .update({ activity_type, activity_date, notes: notes ?? null })
      .eq('id', activityId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('[ACTIVITY UPDATE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[ACTIVITY UPDATE] SUCCESS:', JSON.stringify(data, null, 2));
    return normalizeActivity(data as ActivityRow);
  } catch (err) {
    console.error('[ACTIVITY UPDATE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function deleteActivity(activityId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[ACTIVITY DELETE] activityId:', activityId, 'user_id:', user.id);
    const { error } = await supabaseClient
      .from('activities')
      .delete()
      .eq('id', activityId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[ACTIVITY DELETE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[ACTIVITY DELETE] SUCCESS');
  } catch (err) {
    console.error('[ACTIVITY DELETE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

// HARVESTS API

export async function getHarvestsByCrop(cropId: string): Promise<Harvest[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[HARVEST QUERY] getHarvestsByCrop - crop_id:', cropId, 'user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('harvests')
      .select('*')
      .eq('crop_id', cropId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[HARVEST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[HARVEST QUERY] ERROR MESSAGE:', error?.message);
      console.error('[HARVEST QUERY] ERROR DETAILS:', error?.details);
      console.error('[HARVEST QUERY] ERROR HINT:', error?.hint);
      console.error('[HARVEST QUERY] ERROR CODE:', error?.code);
      throw error;
    }

    console.log('[HARVEST QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeHarvest);
  } catch (err) {
    console.error('[HARVEST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function getActivitiesForUser(): Promise<Activity[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[ACTIVITY QUERY] getActivitiesForUser - user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false });

    if (error) {
      console.error('[ACTIVITY QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[ACTIVITY QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeActivity);
  } catch (err) {
    console.error('[ACTIVITY QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function getHarvestsForUser(): Promise<Harvest[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[HARVEST QUERY] getHarvestsForUser - user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('harvests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[HARVEST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[HARVEST QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeHarvest);
  } catch (err) {
    console.error('[HARVEST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function getTotalHarvestsForUser(): Promise<number> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[HARVEST QUERY] getTotalHarvestsForUser - user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('harvests')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('[HARVEST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    const total = (data || []).reduce((sum, item) => sum + Number(item.quantity_kg), 0);
    console.log('[HARVEST QUERY] SUCCESS - total kg:', total);
    return total;
  } catch (err) {
    console.error('[HARVEST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function getCostsForUser(): Promise<Cost[]> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[COST QUERY] getCostsForUser - user_id:', user.id);
    const { data, error } = await supabaseClient
      .from('costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[COST QUERY] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[COST QUERY] SUCCESS - returned', data?.length || 0, 'rows');
    return (data || []).map(normalizeCost);
  } catch (err) {
    console.error('[COST QUERY] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function getTotalHarvestsByCrop(cropId: string): Promise<number> {
  const harvests = await getHarvestsByCrop(cropId);
  return harvests.reduce((sum, harvest) => sum + harvest.quantity_kg, 0);
}

export async function addHarvest(
  cropId: string,
  quantity_kg: number,
  notes?: string
): Promise<Harvest> {
  const user = await getAuthenticatedUser();

  try {
    const payload = {
      crop_id: cropId,
      user_id: user.id,
      quantity_kg,
      notes: notes ? notes : null,
    };
    console.log('[HARVEST INSERT] PAYLOAD:', JSON.stringify(payload, null, 2));
    console.log('[HARVEST INSERT] crop_id:', cropId);
    console.log('[HARVEST INSERT] user_id:', user.id);
    console.log('[HARVEST INSERT] quantity_kg:', quantity_kg);
    console.log('[HARVEST INSERT] notes:', notes);

    const { data, error } = await supabaseClient
      .from('harvests')
      .insert([payload])
      .select('*');

    if (error) {
      console.error('[HARVEST INSERT] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      console.error('[HARVEST INSERT] ERROR MESSAGE:', error?.message);
      console.error('[HARVEST INSERT] ERROR DETAILS:', error?.details);
      console.error('[HARVEST INSERT] ERROR HINT:', error?.hint);
      console.error('[HARVEST INSERT] ERROR CODE:', error?.code);
      console.error('[HARVEST INSERT] ERROR OBJECT:', error);
      throw error;
    }

    console.log('[HARVEST INSERT] SUCCESS - data:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      return normalizeHarvest(data[0] as HarvestRow);
    }
    throw new Error('No data returned from insert');
  } catch (err) {
    console.error('[HARVEST INSERT] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function updateHarvest(
  harvestId: string,
  quantity_kg: number,
  notes?: string | null
): Promise<Harvest> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[HARVEST UPDATE] harvestId:', harvestId, 'user_id:', user.id, 'quantity_kg:', quantity_kg);
    const { data, error } = await supabaseClient
      .from('harvests')
      .update({ quantity_kg, notes: notes ?? null })
      .eq('id', harvestId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('[HARVEST UPDATE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[HARVEST UPDATE] SUCCESS:', JSON.stringify(data, null, 2));
    return normalizeHarvest(data as HarvestRow);
  } catch (err) {
    console.error('[HARVEST UPDATE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}

export async function deleteHarvest(harvestId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
    console.log('[HARVEST DELETE] harvestId:', harvestId, 'user_id:', user.id);
    const { error } = await supabaseClient
      .from('harvests')
      .delete()
      .eq('id', harvestId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[HARVEST DELETE] SUPABASE ERROR FULL:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('[HARVEST DELETE] SUCCESS');
  } catch (err) {
    console.error('[HARVEST DELETE] EXCEPTION:', JSON.stringify(err, null, 2));
    throw err;
  }
}
