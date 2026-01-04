# RLS Fix Instructions

## Problem
When trying to update game seasons (or any other data), you're getting "error undefined" or "game not found" errors. This is because Row Level Security (RLS) is enabled on your Supabase tables, and the API is using the anonymous key which only has read permissions.

## Solution Implemented
I've updated all your API routes to use the Supabase service role key, which bypasses RLS for admin operations.

## Steps to Complete the Fix

### 1. Get Your Service Role Key from Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **service_role** key (NOT the anon key)

### 2. Add the Service Role Key Locally

1. Open `.env.local` in your project
2. Replace `your_service_role_key_here` with your actual service role key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_actual_key_here
   ```

### 3. Add the Service Role Key to Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your MBA Website project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Set:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your service role key (same one from step 2)
   - **Environment**: Production (and optionally Preview/Development)
6. Click **Save**

### 4. Redeploy

After adding the environment variable to Vercel:

1. Go to your project's **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

OR just push a new commit to trigger a deployment:
```bash
git add .
git commit -m "Add service role key support for RLS bypass"
git push
```

### 5. Test

Once redeployed:
1. Go to your admin panel
2. Try updating a game's season (e.g., Season 1 → Preseason 1)
3. The update should now work without errors

## What Was Changed

### Files Modified:
- `lib/supabase.ts` - Added `supabaseAdmin` client with service role key
- `app/api/games/route.ts` - Changed all operations to use `supabaseAdmin`
- `app/api/players/route.ts` - Changed all operations to use `supabaseAdmin`
- `app/api/teams/route.ts` - Changed all operations to use `supabaseAdmin`
- `app/api/articles/route.ts` - Changed all operations to use `supabaseAdmin`
- `app/api/staff/route.ts` - Changed all operations to use `supabaseAdmin`
- `app/api/players/game-stats/route.ts` - Changed all operations to use `supabaseAdmin`
- `.env.local` - Added placeholder for `SUPABASE_SERVICE_ROLE_KEY`

### How It Works:
- The original `supabase` client uses the **anon key** which respects RLS policies
- The new `supabaseAdmin` client uses the **service role key** which bypasses RLS
- Public pages still use the regular client (read-only)
- API routes now use the admin client (read + write)

## Security Notes

⚠️ **IMPORTANT**: The service role key gives full database access. 
- Never expose it in client-side code
- Only use it in API routes (server-side)
- Don't commit the actual key to Git
- Keep it in environment variables only

The implementation is secure because:
- `supabaseAdmin` is only used in API routes (server-side)
- Client-side code still uses the regular `supabase` client
- Your existing Discord auth middleware protects admin routes

## Troubleshooting

### If updates still don't work after deployment:
1. Check Vercel logs for errors
2. Verify the environment variable is set correctly in Vercel
3. Make sure you redeployed after adding the variable
4. Check that the service role key is valid

### To verify locally:
1. Make sure `.env.local` has the correct service role key
2. Restart your development server: `npm run dev`
3. Test game updates in the admin panel

## Questions?
If you're still having issues, check:
- Vercel deployment logs
- Supabase logs (Dashboard → Logs)
- Browser console for errors
