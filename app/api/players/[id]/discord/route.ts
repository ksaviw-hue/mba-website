import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH - Update Discord username
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.playerId) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Ensure user can only edit their own profile
    if (session.user.playerId !== params.id) {
      return NextResponse.json({ error: 'Forbidden - You can only edit your own profile' }, { status: 403 });
    }

    const body = await request.json();
    const { discordUsername } = body;

    if (!discordUsername || discordUsername.trim().length === 0) {
      return NextResponse.json({ error: 'Discord username is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('players')
      .update({ discord_username: discordUsername.trim() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating Discord username:', error);
      return NextResponse.json({ error: 'Failed to update Discord username' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/players/[id]/discord:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
