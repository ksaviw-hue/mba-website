# Discord Bot Integration - Implementation Guide

## ✅ Completed Changes

### 1. Environment Variables Updated
- Added `DISCORD_GUILD_ID` to `.env.local`
- Updated `NEXTAUTH_URL` from ebassociation.com to mbaassociation.com
- Existing Discord OAuth credentials preserved

### 2. Type Definitions Updated (`types/index.ts`)
- Added `User` interface with discord-{id} format
- Added `Season` interface
- Added `PlayerSeasonStats` interface for bot-aggregated stats
- Updated `Team`, `Game` interfaces to support bot fields
- Kept legacy `Player` interface for backward compatibility

### 3. Authentication Updated (`lib/auth.ts`)
- ✅ Discord OAuth now creates/updates users in `users` table
- ✅ Uses `discord-{id}` format for user IDs
- ✅ Both admins and players can sign in via Discord
- ✅ Automatically creates user record on first sign-in

### 4. New API Routes Created

**`/api/users/route.ts`**
- GET: Fetch all users with team data and aggregated stats
- POST: Create new user (admin only)
- Uses `users` table instead of `players`

**`/api/stats/leaderboard/route.ts`**
- GET: Fetch leaderboard from bot's `player_season_stats`
- Supports filtering by stat (ppg, rpg, apg, spg, bpg)
- Includes team data and calculated averages
- Only shows active season stats

### 5. Database Migration SQL Created
**`supabase-bot-integration.sql`** includes:
- `users` table with discord-{id} format
- `seasons` table
- `player_season_stats` table (bot-managed)
- `player_game_stats` table
- `transaction_history` table
- `accolades` table
- Updated `teams` and `games` tables with bot fields
- Helper view: `player_stats_view`
- Row Level Security policies

---

## 🔧 Next Steps (Manual Actions Required)

### Step 1: Set Discord Guild ID
1. Open Discord Developer mode (User Settings → Advanced → Developer Mode)
2. Right-click your Discord server → Copy Server ID
3. Update `.env.local`:
   ```env
   DISCORD_GUILD_ID=YOUR_ACTUAL_GUILD_ID_HERE
   ```
4. Also add to Vercel environment variables

### Step 2: Run Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase-bot-integration.sql`
3. Execute the entire script
4. This will create all bot-compatible tables

### Step 3: Data Migration (Choose One Option)

**Option A: Fresh Start (Recommended if no production data)**
- The new `users` table is empty
- Bot will populate it as players join via Discord
- Manually migrate any existing team data

**Option B: Migrate Existing Players**
If you have existing player data in the `players` table:
```sql
-- Map existing players to users table
-- You'll need to manually map discord IDs
INSERT INTO users (id, username, minecraft_username, minecraft_user_id, avatar_url, description, team_id, roles)
SELECT 
    'discord-THEIR_ACTUAL_DISCORD_ID', -- ⚠️ You need to map these manually
    display_name,
    minecraft_username,
    minecraft_user_id,
    profile_picture,
    description,
    team_id,
    ARRAY['Player']::TEXT[]
FROM players
WHERE discord_username IS NOT NULL;
```

### Step 4: Update Components (Partially Done)

**Still Need Manual Updates:**
1. **Admin Components** - Update to use `discord-{id}` format:
   - `components/admin/PlayersAdmin.tsx` - Change player creation
   - `components/admin/TeamsAdmin.tsx` - Update roster queries
   - `components/admin/GamesAdmin.tsx` - Use bot's game format

2. **Player Pages** - Switch from `/api/players` to `/api/users`:
   - `app/players/page.tsx`
   - `app/players/[id]/page.tsx`
   - `app/stats/page.tsx` - Use `/api/stats/leaderboard`

3. **Team Pages** - Update to show bot data:
   - `app/teams/[id]/page.tsx`
   - `app/branding/page.tsx`

### Step 5: Test Authentication
1. Clear browser cookies/storage
2. Visit `/auth/signin`
3. Sign in with Discord
4. Check Supabase → Users table
5. Verify user created with `discord-{your_discord_id}` format

### Step 6: Test Bot Integration
1. Have Discord bot create a team: `/team add`
2. Have bot sign a player: `/sign @player`
3. Have bot record a game: `/stats recordgame`
4. Verify data appears in:
   - Supabase → teams table
   - Supabase → users table (team_id updated)
   - Supabase → games table
   - Supabase → player_season_stats table

### Step 7: Update Frontend to Use New APIs

**Update these files to use new endpoints:**
```typescript
// OLD: app/players/page.tsx
const response = await fetch('/api/players');

// NEW: Use /api/users instead
const response = await fetch('/api/users');
```

**Update stats to use leaderboard:**
```typescript
// OLD: app/stats/page.tsx - manual calculation
// Calculate stats from game_stats...

// NEW: Use bot's aggregated stats
const response = await fetch('/api/stats/leaderboard?stat=ppg');
const leaderboard = await response.json();
```

---

## 🔑 Important Notes

### User ID Format
⚠️ **CRITICAL**: All user IDs MUST use format `discord-{discord_id}`

**Example:**
- Discord ID: `1116798128901865582`
- Database ID: `discord-1116798128901865582`

### Table Relationships
```
users (discord-{id})
  ↓ team_id
teams
  ↓ id
games (team1_id, team2_id)
  ↓ id
player_game_stats (game_id, player_id)
  
player_season_stats (aggregated by bot)
  ↓ player_id
users (discord-{id})
```

### Permissions
- Website uses `SUPABASE_ANON_KEY` (read-only)
- Bot uses `SUPABASE_SERVICE_ROLE_KEY` (full access)
- Row Level Security enabled on all tables

### Conference Names
Bot uses different conference names:
- Website: "Eastern", "Western"
- Bot: "Desert", "Plains"

Update team conference field to match bot's naming or add mapping logic.

---

## 📋 Integration Checklist

- [x] Environment variables updated
- [x] Type definitions updated
- [x] Discord OAuth authentication implemented
- [x] Users API created
- [x] Stats leaderboard API created
- [x] Database migration SQL created
- [ ] Set actual Discord Guild ID in .env.local
- [ ] Run database migration in Supabase
- [ ] Choose data migration strategy
- [ ] Update admin components to use discord-{id}
- [ ] Update player pages to use /api/users
- [ ] Update stats page to use /api/stats/leaderboard
- [ ] Test Discord sign-in
- [ ] Test bot creating teams
- [ ] Test bot recording stats
- [ ] Verify data sync between bot and website

---

## 🆘 Troubleshooting

**Issue: User not created on sign-in**
- Check browser console for errors
- Check Supabase logs
- Verify RLS policies allow insertion
- Check SUPABASE_SERVICE_ROLE_KEY is set

**Issue: Stats not showing**
- Verify DISCORD_GUILD_ID is set correctly
- Check that bot has recorded stats
- Query `player_season_stats` table directly
- Verify active season exists in `seasons` table

**Issue: Bot and website show different data**
- Confirm both use same Supabase project
- Verify guild_id matches in all queries
- Check that tables are shared (not separate)

**Issue: Team roster not updating**
- Bot updates `users.team_id` field
- Website should query `users WHERE team_id = ?`
- Check RLS policies allow bot to update

---

## 📚 Useful Queries

**Check user exists:**
```sql
SELECT * FROM users WHERE id = 'discord-YOUR_ID';
```

**View active season stats:**
```sql
SELECT * FROM player_stats_view 
WHERE season_name = (SELECT season_name FROM seasons WHERE is_active = true LIMIT 1)
ORDER BY ppg DESC;
```

**View team rosters:**
```sql
SELECT t.name, u.username, u.minecraft_username
FROM teams t
LEFT JOIN users u ON u.team_id = t.id
ORDER BY t.name, u.username;
```

**View recent transactions:**
```sql
SELECT * FROM transaction_history
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🚀 When Everything Is Working

You should be able to:
1. ✅ Sign in via Discord on website
2. ✅ See teams created by bot on website
3. ✅ View player stats recorded by bot
4. ✅ See roster updates when bot signs/releases players
5. ✅ View game results and box scores
6. ✅ See real-time leaderboards
7. ✅ View transaction history

The bot and website will share the same database, keeping everything in sync!
