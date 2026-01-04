# Roblox OAuth & Social Features Setup Guide

This document outlines the implementation of Roblox authentication and social features for the EBA website.

## ✅ Completed Setup

### 1. Authentication Infrastructure
- ✅ Installed NextAuth.js with Supabase adapter
- ✅ Created Roblox OAuth provider configuration
- ✅ Updated TypeScript types for session data
- ✅ Created sign-in page at `/auth/signin`
- ✅ Updated Navigation component with profile button
- ✅ Auto-login for existing players
- ✅ Auto-create Free Agent profiles for new users

### 2. Database Migration Created
- ✅ SQL migration file created at `database/migrations/add_auth_social_features.sql`
- Adds: `roblox_user_id`, `roblox_username`, `user_id`, `discord_username` to players table
- Creates: `article_likes`, `article_comments`, `team_wall_posts` tables
- Includes: Indexes and RLS policies

## 📋 Required Next Steps

### Step 1: Set up Roblox OAuth Application

1. Go to https://create.roblox.com/credentials
2. Create a new OAuth2 Application
3. Set the redirect URI to: `http://localhost:3000/api/auth/callback/roblox` (dev) and `https://ebassociation.com/api/auth/callback/roblox` (production)
4. Copy your Client ID and Client Secret
5. Update `.env.local`:
   ```env
   ROBLOX_CLIENT_ID=your_actual_client_id
   ROBLOX_CLIENT_SECRET=your_actual_client_secret
   ```
6. Add the same variables to Vercel environment variables

### Step 2: Run Database Migration

Execute the SQL migration in your Supabase dashboard:
```bash
# Go to Supabase Dashboard -> SQL Editor -> New Query
# Copy and paste the contents of database/migrations/add_auth_social_features.sql
# Run the query
```

Alternatively, you can run each ALTER TABLE and CREATE TABLE statement separately if there are any conflicts.

### Step 3: Test Authentication Flow

1. Click "Log In" button in top navigation
2. Authenticate with Roblox
3. Verify:
   - Existing players (with matching roblox_username) are automatically logged in
   - New users create a "Free Agent" player profile
   - Profile button appears with "View Profile" and avatar

## 🚧 Features Still To Implement

### Phase 1: Player Self-Editing (Next)
- Update player profile page to detect logged-in user
- Add edit mode for own profile
- Allow editing: bio, description, profile picture
- API route for player self-updates

### Phase 2: Article Like/Comment System
- Create API routes for likes/comments
- Add like button component to articles
- Create comment section component
- Display like count and comments on article pages

### Phase 3: Team Wall Feature  
- Create Team Wall component for team pages
- API routes for creating/deleting/pinning posts
- Check user's team membership before allowing posts
- Franchise owner controls (delete, pin)

### Phase 4: Discord Linking
- Add Discord OAuth button to player profiles
- Store discord_username when linked
- Display Discord username on profile

## 📁 Files Modified

### Created:
- `lib/auth.ts` - Updated with Roblox provider
- `types/next-auth.d.ts` - Extended session types
- `app/auth/signin/page.tsx` - Login page
- `database/migrations/add_auth_social_features.sql` - DB schema

### Modified:
- `components/Navigation.tsx` - Added profile button
- `.env.local` - Added Roblox OAuth placeholders

## 🔑 Key Features

### Free Agent System
When a new user signs in with Roblox:
- Player record is created automatically
- `team_id` is set to `null` (Free Agent)
- `position` is set to "Free Agent"
- They can still be assigned to teams via admin panel
- They have full player profile functionality

### Dual Authentication
- **Discord OAuth**: For admins only (existing system)
- **Roblox OAuth**: For players (new system)
- Session tracks both types separately
- `session.user.isAdmin` for admins
- `session.user.playerId` for players

## 🎯 Usage Examples

### Check if user is logged in:
```typescript
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
if (session?.user.playerId) {
  // User is logged in as a player
  const playerId = session.user.playerId;
}
```

### Check if viewing own profile:
```typescript
const isOwnProfile = session?.user.playerId === player.id;
```

### Redirect to login:
```typescript
import { signIn } from 'next-auth/react';
signIn('roblox');
```

## 🐛 Troubleshooting

### "Invalid redirect URI" error
- Make sure your Roblox OAuth app has the correct callback URL registered
- Format: `{NEXTAUTH_URL}/api/auth/callback/roblox`

### User created but not linked to player
- Check `roblox_username` column matches exactly
- Check database logs in Supabase for errors

### Profile button not showing
- Verify session is loaded (`status === "authenticated"`)
- Check that `session.user.playerId` exists
- Ensure player record has `user_id` set

## 📊 Database Schema

### Players Table Additions:
```sql
roblox_user_id TEXT UNIQUE       -- Roblox user ID (sub claim)
roblox_username TEXT             -- Roblox username for matching
user_id TEXT UNIQUE              -- Links to auth user
discord_username TEXT            -- For Discord linking feature
```

### New Tables:
- `article_likes`: User likes on articles
- `article_comments`: Comments on articles  
- `team_wall_posts`: Team wall posts with pinning

All tables have RLS enabled with appropriate policies.
