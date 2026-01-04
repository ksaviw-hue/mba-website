import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all seasons
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('seasons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seasons:', error);
      // Return empty array if table doesn't exist
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return NextResponse.json([]);
  }
}

// POST - Create new season
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, displayOrder, isCurrent, startDate, endDate } = body;

    if (!name || displayOrder === undefined) {
      return NextResponse.json({ error: 'Name and display order are required' }, { status: 400 });
    }

    // If setting as current, unset all other current seasons
    if (isCurrent) {
      await supabaseAdmin
        .from('seasons')
        .update({ isCurrent: false })
        .eq('isCurrent', true);
    }

    const { data, error } = await supabaseAdmin
      .from('seasons')
      .insert([
        {
          name,
          displayOrder,
          isCurrent: isCurrent || false,
          startDate: startDate || null,
          endDate: endDate || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json({ error: 'Failed to create season' }, { status: 500 });
  }
}

