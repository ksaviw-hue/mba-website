import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  // Check if password matches the environment variable
  const adminPassword = process.env.ADMIN_PASSWORD || 'eba_admin_2025';

  if (password === adminPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}
