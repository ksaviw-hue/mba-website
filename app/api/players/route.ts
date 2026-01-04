import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// This endpoint is kept for backward compatibility
// New code should use /api/users instead
export async function GET() {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('username');

  if (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return empty array if no users, otherwise return the users
  return NextResponse.json(users || []);
}
