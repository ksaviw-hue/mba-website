# Quick Start Guide

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
EBAWebsite/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── branding/            # Branding page
│   ├── links/               # Links page
│   ├── stats/               # Stats leaderboards
│   ├── games/               # Games schedule
│   ├── players/             # Player search & profiles
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   └── Navigation.tsx       # Main navigation
├── lib/                     # Utilities and data
│   └── mockData.ts         # Mock data (EDIT THIS!)
├── types/                   # TypeScript types
│   └── index.ts            # Type definitions
└── public/                  # Static files

```

## Editing Mock Data

To add/edit data, modify **`lib/mockData.ts`**:

### Adding a Team:
```typescript
{
  id: '3',
  name: 'Los Angeles Lakers',
  owner: 'John Doe',
  generalManager: 'Jane Smith',
  headCoach: 'Coach Mike',
  assistantCoaches: ['Assistant 1', 'Assistant 2'],
  colors: {
    primary: '#552583',  // Purple
    secondary: '#FDB927', // Gold
  },
}
```

### Adding a Player:
```typescript
{
  id: '2',
  displayName: 'PlayerName',
  robloxUsername: 'roblox_username',
  robloxUserId: '123456789',
  profilePicture: 'https://tr.rbxcdn.com/...',
  description: 'Bio text here',
  discordUsername: 'discord_username',
  teamId: '1',  // Match team ID
  roles: ['Player'],
  stats: {
    gamesPlayed: 5,
    points: 15.4,
    rebounds: 6.2,
    assists: 3.1,
    steals: 1.5,
    blocks: 0.8,
    turnovers: 2.1,
    fieldGoalsMade: 45,
    fieldGoalsAttempted: 100,
    fieldGoalPercentage: 45.0,
    threePointersMade: 12,
    threePointersAttempted: 35,
    threePointPercentage: 34.3,
    freeThrowsMade: 20,
    freeThrowsAttempted: 25,
    freeThrowPercentage: 80.0,
    fouls: 12,
    assistTurnoverRatio: 1.5,
    assistPercentage: 15.0,
    efficiency: 18.5,
  },
}
```

### Adding a Game:
```typescript
{
  id: '3',
  homeTeamId: '1',
  awayTeamId: '2',
  homeScore: 105,      // Optional - only for completed games
  awayScore: 98,       // Optional - only for completed games
  scheduledDate: '2025-12-30T19:00:00',
  status: 'completed', // 'scheduled' | 'live' | 'completed'
  season: 0,
}
```

### Adding an Article:
```typescript
{
  id: '3',
  title: 'Article Title',
  content: 'Full article content goes here...',
  author: 'Author Name',
  publishedDate: '2025-12-25T15:30:00',
  excerpt: 'Short preview text for the home page',
}
```

## Updating Links

Edit **`app/links/page.tsx`** and update the `links` array:

```typescript
{
  title: 'Roblox Group',
  url: 'https://www.roblox.com/groups/YOUR_GROUP_ID',
  // ...
}
```

## Color Customization

### Main Colors (in `app/globals.css`):
```css
:root {
  --background: #0a0e27;    /* Dark blue background */
  --foreground: #ffffff;    /* White text */
}
```

### Team Colors:
Set in `lib/mockData.ts` for each team:
```typescript
colors: {
  primary: '#C8102E',   // Main color
  secondary: '#000000', // Secondary color
}
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Latest news and upcoming games |
| Branding | `/branding` | Teams and staff |
| Links | `/links` | External links (Roblox, Discord) |
| Stats | `/stats` | League leaders by category |
| Games | `/games` | Schedule and results |
| Players | `/players` | Search all players |
| Profile | `/players/[id]` | Individual player stats |
| Admin | `/admin` | Admin dashboard (basic) |

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/players` | GET | Get all players |
| `/api/players` | POST | Create player |
| `/api/players/[id]` | GET | Get one player |
| `/api/players/[id]` | PUT | Update player |
| `/api/players/[id]` | DELETE | Delete player |
| `/api/teams` | GET, POST | Teams |
| `/api/games` | GET, POST | Games |
| `/api/articles` | GET, POST | Articles |

## Next Steps

1. **Test locally** - Make sure everything works
2. **Update mock data** - Add your real teams and players
3. **Push to GitHub** - See `DEPLOYMENT.md`
4. **Deploy to Vercel** - See `DEPLOYMENT.md`
5. **Add real links** - Update URLs in links page
6. **Plan database** - See `ROADMAP.md` for next features

## Common Issues

### Port already in use
```bash
# Kill the process on port 3000 (Windows)
npx kill-port 3000
```

### Styles not updating
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript errors
```bash
# Check for errors
npm run lint
```

## Support

For questions or issues:
1. Check the code comments
2. Review `ROADMAP.md` for planned features
3. Check Next.js documentation: https://nextjs.org/docs

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React** - UI library
