import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .order('scheduled_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedGames = games?.map(game => ({
    id: game.id,
    homeTeamId: game.home_team_id,
    awayTeamId: game.away_team_id,
    homeScore: game.home_score,
    awayScore: game.away_score,
    scheduledDate: game.scheduled_date,
    status: game.status,
    season: game.season,
    isForfeit: game.is_forfeit || false,
    forfeitWinner: game.forfeit_winner,
  })) || [];

  return NextResponse.json(formattedGames);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.homeTeamId || !body.awayTeamId || !body.scheduledDate) {
      return NextResponse.json(
        { error: 'Home team, away team, and scheduled date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('games')
      .insert({
        home_team_id: body.homeTeamId,
        away_team_id: body.awayTeamId,
        scheduled_date: body.scheduledDate,
        status: body.status || 'scheduled',
        season: body.season || 'Preseason 1',
        home_score: body.homeScore,
        away_score: body.awayScore,
        is_forfeit: body.isForfeit || false,
        forfeit_winner: body.forfeitWinner,
      })
      .select()
      .single();

    if (error) {
      console.error('Game creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Game created successfully',
      game: {
        id: data.id,
        homeTeamId: data.home_team_id,
        awayTeamId: data.away_team_id,
        scheduledDate: data.scheduled_date,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (updates.homeScore !== undefined) updateData.home_score = updates.homeScore;
    if (updates.awayScore !== undefined) updateData.away_score = updates.awayScore;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate;
    if (updates.season !== undefined) updateData.season = updates.season;
    if (updates.isForfeit !== undefined) updateData.is_forfeit = updates.isForfeit;
    if (updates.forfeitWinner !== undefined) updateData.forfeit_winner = updates.forfeitWinner;

    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Game update error:', error);
      return NextResponse.json(
        { error: error?.message || 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Game updated successfully',
      game: { id: data.id }
    });
    });
  } catch (error: any) {
    console.error('Game update exception:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
