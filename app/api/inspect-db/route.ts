import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const results: Record<string, any> = {};

    // If a service role key is available, use it to bypass RLS and inspect schema
    let supabase = createServerSupabaseClient();
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
    const tables = ['costs', 'harvests', 'activities'];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        results[table] = { error: JSON.parse(JSON.stringify(error)) };
        continue;
      }

      const row = Array.isArray(data) && data.length > 0 ? data[0] : {};
      results[table] = { columns: Object.keys(row), sample: row };
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
