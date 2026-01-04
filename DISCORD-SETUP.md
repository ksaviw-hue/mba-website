# Discord OAuth Setup Guide

## Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "Minecraft Basketball Association" (or your preferred name)
4. Click "Create"

## Step 2: Get Your Client ID and Secret

1. In your application, go to the "OAuth2" tab on the left
2. Copy your **Client ID** - you'll need this!
3. Click "Reset Secret" to generate a **Client Secret**
4. Copy the secret immediately - you won't be able to see it again!

## Step 3: Add Redirect URL

1. Still in the OAuth2 tab, scroll down to "Redirects"
2. Click "Add Redirect"
3. Add these URLs:
   - For local development: `http://localhost:3000/api/auth/callback/discord`
   - For production (when deployed): `https://your-domain.vercel.app/api/auth/callback/discord`
4. Click "Save Changes"

## Step 4: Configure Your Environment Variables

1. Open the `.env.local` file in your project
2. Replace the placeholder values:

```env
DISCORD_CLIENT_ID=paste_your_client_id_here
DISCORD_CLIENT_SECRET=paste_your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret
```

### Generate NEXTAUTH_SECRET

Run this command in your terminal (Git Bash or WSL):
```bash
openssl rand -base64 32
```

Or use this PowerShell command:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as your `NEXTAUTH_SECRET`.

## Step 5: Get Your Discord User ID

You need to find the Discord user ID for "trevonism":

1. Open Discord
2. Go to Settings → Advanced
3. Enable "Developer Mode"
4. Right-click on your username anywhere in Discord
5. Click "Copy User ID"
6. This is your Discord ID (should be 1116798128901865582)

The ID is already configured in `.env.local` under `ADMIN_DISCORD_IDS`.

## Step 6: Test It Out

1. Save all changes to `.env.local`
2. Restart your dev server:
   ```bash
   # Press Ctrl+C to stop the current server
   npm run dev
   ```
3. Go to http://localhost:3000/admin
4. Click "Sign in with Discord"
5. Authorize the application
6. You should now see the admin dashboard!

## Adding More Admins

To allow multiple Discord users to access the admin panel:

1. Get their Discord user IDs (same process as Step 5)
2. Add them to `.env.local` separated by commas:

```env
ADMIN_DISCORD_IDS=1116798128901865582,another_id_here,yet_another_id
```

## For Production (Vercel)

When you deploy to Vercel:

1. Go to your project settings in Vercel
2. Click "Environment Variables"
3. Add each variable:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL, e.g., `https://www.mbaassociation.com`)
   - `ADMIN_DISCORD_IDS`
4. Redeploy your application

## Security Notes

- **Never commit `.env.local` to Git** (it's already in .gitignore)
- Keep your Discord Client Secret private
- Only share admin access with trusted users
- You can revoke access by removing Discord IDs from the environment variable

## Troubleshooting

### "Sign in failed"
- Check that your Discord Client ID and Secret are correct
- Make sure the redirect URL in Discord matches exactly
- Verify your Discord user ID is in the `ADMIN_DISCORD_IDS` list

### "Invalid redirect URI"
- Go back to Discord Developer Portal
- Double-check the redirect URL is exactly: `http://localhost:3000/api/auth/callback/discord`

### Environment variables not loading
- Restart your dev server after changing `.env.local`
- Make sure the file is named exactly `.env.local` (not `.env`)

## How It Works

1. User clicks "Sign in with Discord" on the admin page
2. They're redirected to Discord to authorize
3. Discord sends them back to your app with their info
4. The app checks if their Discord ID is in the allowed list
5. If yes, they get access to the admin panel
6. If no, they see an error and can't access it

Only the Discord user "trevonism" (ID: 1116798128901865582) can access the admin area by default.
