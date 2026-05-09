import { supabaseClient } from './supabaseClient';

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

export async function createFeedback(message: string): Promise<void> {
  const user = await getAuthenticatedUser();

  const { error } = await supabaseClient
    .from('feedback')
    .insert([
      {
        user_id: user.id,
        message,
      },
    ]);

  if (error) {
    throw error;
  }
}
