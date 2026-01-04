import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Get likes for an article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: likes, error } = await supabaseAdmin
      .from('article_likes')
      .select('id, player_id, created_at')
      .eq('article_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching likes:', error);
      return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
    }

    const likeCount = likes?.length || 0;
    
    return NextResponse.json({ likes, likeCount });
  } catch (error) {
    console.error('Error in GET /api/articles/[id]/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Like an article
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.playerId) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Check if already liked
    const { data: existingLike } = await supabaseAdmin
      .from('article_likes')
      .select('id')
      .eq('article_id', params.id)
      .eq('player_id', session.user.playerId)
      .single();

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Create like
    const { data, error } = await supabaseAdmin
      .from('article_likes')
      .insert({
        article_id: params.id,
        player_id: session.user.playerId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating like:', error);
      return NextResponse.json({ error: 'Failed to like article' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/articles/[id]/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Unlike an article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.playerId) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from('article_likes')
      .delete()
      .eq('article_id', params.id)
      .eq('player_id', session.user.playerId);

    if (error) {
      console.error('Error deleting like:', error);
      return NextResponse.json({ error: 'Failed to unlike article' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/articles/[id]/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
