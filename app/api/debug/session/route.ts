import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Check if there's a player in the database with this user_id
  const { data: players, error } = await supabaseAdmin
    .from('players')
    .select('*')
    .eq('user_id', session.user.id);

  return NextResponse.json({
    session: {
      user: session.user,
      expires: session.expires,
    },
    databaseCheck: {
      playersFound: players?.length || 0,
      players: players,
      error: error?.message,
    }
  });
}

