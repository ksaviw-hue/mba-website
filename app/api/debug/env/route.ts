import { NextResponse } from 'next/server';

export async function GET() {
  // Only show this in development or for debugging
  const envCheck = {
    SUPABASE_SERVICE_ROLE_KEY_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY_LENGTH: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    ROBLOX_CLIENT_ID_SET: !!process.env.ROBLOX_CLIENT_ID,
    ROBLOX_CLIENT_SECRET_SET: !!process.env.ROBLOX_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
  };

  return NextResponse.json(envCheck);
}
