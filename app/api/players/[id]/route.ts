import { players } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const player = players.find(p => p.id === params.id);
  
  if (!player) {
    return NextResponse.json(
      { error: 'Player not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(player);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  
  // In production, this would update the database
  return NextResponse.json({ 
    success: true, 
    message: 'Player updated successfully',
    player: body 
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In production, this would delete from database
  return NextResponse.json({ 
    success: true, 
    message: 'Player deleted successfully' 
  });
}
