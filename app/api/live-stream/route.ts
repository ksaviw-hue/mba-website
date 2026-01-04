import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const ADMIN_DISCORD_IDS = process.env.ADMIN_DISCORD_IDS?.split(',') || [];

// GET - Get active live stream
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('live_stream')
      .select('*')
      .eq('is_live', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') {
        // No active stream or table doesn't exist
        return NextResponse.json({ stream: null });
      }
      console.error('Live stream error:', error);
      return NextResponse.json({ stream: null });
    }

    return NextResponse.json({ stream: data });
  } catch (error) {
    console.error('Live stream error:', error);
    return NextResponse.json({ stream: null });
  }
}

// POST - Create/Start a live stream
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.discordId || !ADMIN_DISCORD_IDS.includes(session.user.discordId)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { twitchChannel, title } = body;

    if (!twitchChannel || !title) {
      return NextResponse.json({ error: 'Twitch channel and title are required' }, { status: 400 });
    }

    // First, set all existing streams to not live
    await supabaseAdmin
      .from('live_stream')
      .update({ is_live: false })
      .eq('is_live', true);

    // Create new live stream
    const { data, error } = await supabaseAdmin
      .from('live_stream')
      .insert({
        twitch_channel: twitchChannel,
        title,
        is_live: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, stream: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update live stream status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.discordId || !ADMIN_DISCORD_IDS.includes(session.user.discordId)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isLive, twitchChannel, title } = body;

    if (!id) {
      return NextResponse.json({ error: 'Stream ID is required' }, { status: 400 });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (isLive !== undefined) updates.is_live = isLive;
    if (twitchChannel !== undefined) updates.twitch_channel = twitchChannel;
    if (title !== undefined) updates.title = title;

    // If setting a stream to live, make sure all others are not live
    if (isLive === true) {
      await supabaseAdmin
        .from('live_stream')
        .update({ is_live: false })
        .neq('id', id)
        .eq('is_live', true);
    }

    const { data, error } = await supabaseAdmin
      .from('live_stream')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, stream: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a live stream
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.discordId || !ADMIN_DISCORD_IDS.includes(session.user.discordId)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Stream ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('live_stream')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

