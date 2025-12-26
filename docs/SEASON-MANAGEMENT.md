# Season Management Guide

## Overview

The EBA Website now has a centralized season configuration system that makes it easy to update the season across the entire website.

## Current Season Configuration

All season-related settings are managed in **[lib/config.ts](../lib/config.ts)**.

### How to Update the Season

When starting a new season (e.g., moving from Season 1 to Season 2):

1. Open [lib/config.ts](../lib/config.ts)
2. Update the following values:

```typescript
export const LEAGUE_CONFIG = {
  // Change this to the new season number
  CURRENT_SEASON: 2,  // Was 1, now 2
  
  // Update the display name
  CURRENT_SEASON_NAME: 'Season 2',  // Was 'Season 1'
  
  // Add new season to available seasons
  AVAILABLE_SEASONS: ['Season 1', 'Season 2', 'All-Time'],
  
  // Update season dates
  SEASON_START_DATE: '2025-07-01',
  SEASON_END_DATE: '2026-06-30',
}
```

3. Save the file
4. The changes will automatically apply to:
   - Games page (displays "Season X" on each game)
   - Stats page (season selector dropdown)
   - Admin panel (default season when creating games)
   - Any future season-dependent features

## Where Seasons Are Used

### Games
- **Display**: Shows season number on game cards
- **Admin**: Default season when creating new games
- **File**: [app/games/page.tsx](../app/games/page.tsx)

### Stats
- **Display**: Season selector dropdown for filtering stats
- **File**: [app/stats/page.tsx](../app/stats/page.tsx)

### Admin Panel
- **Games Admin**: Default season value in form
- **File**: [components/admin/GamesAdmin.tsx](../components/admin/GamesAdmin.tsx)

## Helper Functions

The config file provides helper functions:

```typescript
// Get display text for a season number
getSeasonDisplay(1)  // Returns "Season 1"

// Check if a season is current
isCurrentSeason(1)   // Returns true if CURRENT_SEASON is 1
```

## Database

Games in the database have a `season` column (INTEGER) that stores the season number.

## Future Enhancements

Possible future features:
- Season archives (view historical seasons)
- Season comparisons
- Playoff brackets per season
- Season awards and achievements

## Important Notes

- Season numbers in the database are integers (1, 2, 3, etc.)
- Display names are strings ("Season 1", "Season 2", etc.)
- Always update both `CURRENT_SEASON` (number) and `CURRENT_SEASON_NAME` (string)
- Add new seasons to `AVAILABLE_SEASONS` array to make them selectable in stats
