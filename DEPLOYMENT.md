# Deploying to Vercel

## Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)

## Step 1: Push to GitHub

1. Initialize git in your project folder:
```bash
cd c:\Users\ksavi\Downloads\EBAWebsite
git init
```

2. Add all files:
```bash
git add .
```

3. Create initial commit:
```bash
git commit -m "Initial commit - EBA Basketball League website"
```

4. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it "eba-website" (or your preferred name)
   - Don't initialize with README (you already have files)
   - Click "Create repository"

5. Connect your local repo to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/eba-website.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the repository you just created
4. Vercel will auto-detect Next.js - no configuration needed!
5. Click "Deploy"

### Option B: Via Vercel CLI
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and your site will be deployed!

## Step 3: Update Links

After deployment, update the links in the website:

1. Open `app/links/page.tsx`
2. Replace placeholder URLs with your actual links:
   - Roblox Group URL
   - Roblox Game URL
   - Discord Invite URL
   - Your Vercel URL (e.g., https://eba-website.vercel.app)

## Step 4: Custom Domain (Optional)

When you're ready to move to a custom domain:

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Next Steps for Production

### 1. Add a Database
Consider using:
- **Vercel Postgres** (integrated with Vercel)
- **Supabase** (PostgreSQL with auth)
- **MongoDB Atlas** (NoSQL option)
- **PlanetScale** (MySQL)

### 2. Add Authentication
For admin features:
- **NextAuth.js** (most popular)
- **Clerk** (easy to use)
- **Auth0** (enterprise-grade)

### 3. Roblox API Integration
- Use Roblox API to fetch user data
- Store player information in database
- Automatically update profile pictures

### 4. Discord Integration (Optional)
- Discord bot for notifications
- Sync Discord roles with team roles

## Environment Variables

When you add a database or auth, you'll need environment variables:

1. Create `.env.local` file (already in .gitignore)
2. Add your secrets:
```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="https://your-domain.com"
```

3. In Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add the same variables there

## Continuous Deployment

Every time you push to GitHub, Vercel will automatically rebuild and deploy your site!

```bash
git add .
git commit -m "Update website"
git push
```

Your changes will be live in ~1 minute!
