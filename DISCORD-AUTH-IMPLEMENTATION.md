# Discord Authentication & Verification System - Implementation Summary

## ✅ Changes Completed

### 1. **Admin Access Updated** ([.env.local](.env.local))
Restricted admin access to only 3 Discord users:
- `1116798128901865582`
- `935330554868539492`
- `1450670398537597022`

### 2. **Discord Verification Flow Implemented** ([lib/auth.ts](lib/auth.ts))

**New Authentication Logic:**

#### For Admin Users (3 specified IDs):
- ✅ Can always sign in (for admin panel access)
- ✅ Automatically creates user record if new
- ✅ No Minecraft verification required

#### For Regular Players:
- ✅ **Checks if user exists in database**
  - If NO → Rejects sign-in with error "Must verify on Discord first"
- ✅ **Checks if user has `minecraft_username` field populated**
  - If NO → Rejects sign-in with error "Must verify Minecraft on Discord"
  - If YES → Allows sign-in successfully

#### User Record Creation:
- Users are **NOT** automatically created when signing in
- Users are created **by the Discord bot** when they verify their Minecraft username
- The bot sets the `minecraft_username` field when verification is complete
- Website checks for this field to determine verification status

### 3. **Error Page Updated** ([app/auth/error/page.tsx](app/auth/error/page.tsx))

**New Error Messages:**
- `AccessDenied`: "You must verify your Minecraft username on Discord before signing in"
- `Default`: "You need to verify your Minecraft username on Discord before you can sign in"

**Added Verification Instructions:**
Shows clear steps when user gets verification error:
1. Join the MBA Discord server
2. Go to the verification channel
3. Use the bot command to link Minecraft account
4. Come back and sign in again

### 4. **Sign-In Page Updated** ([app/auth/signin/page.tsx](app/auth/signin/page.tsx))

**Changed from Roblox to Discord:**
- ✅ Updated button from red Roblox theme to blue Discord theme
- ✅ Changed "Welcome to EBA" → "Welcome to MBA"
- ✅ Added Discord logo icon
- ✅ Added warning message about verification requirement

**New Warning Text:**
> ⚠️ Important: You must verify your Minecraft username on the MBA Discord server before signing in to the website. Join Discord and use the verification bot to link your Minecraft account.

---

## 🔄 Authentication Flow

### Step 1: User on Discord
1. User joins MBA Discord server
2. User runs Discord bot verification command
3. Bot verifies their Minecraft username
4. Bot creates user in database with:
   - `id`: `discord-{discord_id}`
   - `username`: Discord username
   - `minecraft_username`: Verified Minecraft username
   - `minecraft_user_id`: Minecraft UUID
   - `team_id`: null (Free Agent) or assigned team

### Step 2: User on Website
1. User clicks "Sign in with Discord"
2. Discord OAuth authenticates user
3. Website checks database for `discord-{discord_id}`
4. **If user NOT found** → Redirect to error: "Verify on Discord first"
5. **If user found but NO minecraft_username** → Redirect to error: "Verify on Discord first"
6. **If user found WITH minecraft_username** → Sign in successful! 

### Step 3: Post Sign-In
- If user has `team_id` → They're on a team (show team info)
- If user has NO `team_id` → They're a Free Agent (can view profile, stats)
- Session includes: Discord ID, player ID, team ID, username, avatar

---

## 🔑 Key Points

### Required Fields in Database
For successful sign-in, the `users` table record MUST have:
- ✅ `id` = `discord-{discord_id}` (created by bot)
- ✅ `minecraft_username` (verified by bot)
- ✅ `username` (Discord username)

### Admin vs Player Differences
| Feature | Admin Users | Regular Players |
|---------|-------------|-----------------|
| Sign-in Required | Discord OAuth | Discord OAuth + Minecraft Verification |
| Database Check | Creates if missing | Must exist with minecraft_username |
| Access Level | Full admin panel | Player profile only |
| Team Requirement | Optional | Optional (Free Agent if none) |

### Error Handling
- `MINECRAFT_NOT_VERIFIED` error → Redirects to `/auth/error?error=AccessDenied`
- Shows helpful instructions on how to verify
- Provides link back to sign-in page
- User-friendly messages (no technical jargon)

---

## 🧪 Testing Checklist

### Test Admin Sign-In
- [ ] Admin Discord ID can sign in without verification
- [ ] Admin panel loads correctly
- [ ] Admin can access all features

### Test Unverified Player
- [ ] Player without database record gets error
- [ ] Player with record but no minecraft_username gets error
- [ ] Error page shows verification instructions
- [ ] Can navigate back to sign-in page

### Test Verified Player (Free Agent)
- [ ] Player with minecraft_username signs in successfully
- [ ] Player profile loads
- [ ] Shows "Free Agent" status (no team)
- [ ] Can view stats (if any)

### Test Verified Player (On Team)
- [ ] Player with team_id signs in successfully
- [ ] Player profile shows team affiliation
- [ ] Can access team pages
- [ ] Can view team wall/features

---

## 🔒 Security Notes

1. **Discord Verification is Required**
   - Website does NOT create user accounts
   - Only Discord bot creates verified users
   - Prevents fake/spam accounts

2. **Admin Access is Restricted**
   - Only 3 specific Discord IDs can access admin panel
   - Hardcoded in environment variables
   - Cannot be bypassed

3. **Session Management**
   - JWT tokens store Discord ID
   - Session expires after 30 days
   - Admin status checked on every request

---

## 📝 Future Improvements

### Optional Enhancements:
1. **Better Error Messages**
   - Link directly to Discord verification channel
   - Show Discord server invite link
   - Display current verification status

2. **Verification Status Page**
   - Let users check if they're verified
   - Show which Minecraft username is linked
   - Allow re-verification if needed

3. **Admin Tools**
   - Manually verify users
   - Override verification requirement
   - Manage user records from admin panel

---

## ✅ Summary

The authentication system now:
- ✅ Uses Discord OAuth for all sign-ins
- ✅ Requires Minecraft verification (via Discord bot)
- ✅ Restricts admin access to 3 specific users
- ✅ Provides clear error messages for unverified users
- ✅ Automatically handles team assignments
- ✅ Integrates seamlessly with Discord bot database

Players MUST verify on Discord before they can sign in to the website! 🎮
