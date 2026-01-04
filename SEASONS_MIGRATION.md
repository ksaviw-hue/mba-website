# Season Management Migration

## Database Setup

Run this SQL in your Supabase SQL Editor to create the seasons table:

```sql
-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS seasons CASCADE;

-- Create seasons table
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isCurrent" BOOLEAN DEFAULT false,
  "startDate" DATE,
  "endDate" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on displayOrder for efficient sorting
CREATE INDEX idx_seasons_display_order ON seasons("displayOrder");

-- Create index on isCurrent for quick lookups
CREATE INDEX idx_seasons_is_current ON seasons("isCurrent");

-- Insert default seasons
INSERT INTO seasons (name, "displayOrder", "isCurrent") VALUES
  ('Preseason 1', 0, true),
  ('Season 1', 1, false),
  ('Season 2', 2, false),
  ('Season 3', 3, false);

-- Enable RLS
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access to seasons"
  ON seasons FOR SELECT
  USING (true);

-- Allow authenticated users to manage seasons
CREATE POLICY "Allow authenticated users to manage seasons"
  ON seasons FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Features

The new season management system provides:

1. **Admin Panel** - Navigate to the "Seasons" tab in the admin dashboard
2. **Add Seasons** - Create new seasons with custom names and display order
3. **Edit Seasons** - Modify existing season names, dates, and current status
4. **Delete Seasons** - Remove seasons (with confirmation)
5. **Current Season** - Mark one season as current (used as default in dropdowns)
6. **Display Order** - Control the order seasons appear in dropdown menus
7. **Season Dates** - Optional start and end dates for each season

## Usage

### Managing Seasons
1. Sign in to the admin panel with Discord
2. Click the "Seasons" tab
3. Use the "Add Season" button to create new seasons
4. Click edit/delete icons to manage existing seasons
5. Check "Set as current season" to make a season the default selection

### Season Dropdowns
Seasons automatically appear in:
- Stats page season filter
- Games page season filter
- Any other pages using the season dropdown

The "All-Time" option is always included by default.

## Technical Details

- Seasons are stored in the `seasons` table
- Frontend pages fetch seasons via `/api/seasons`
- Current season is determined by `is_current` flag
- Seasons are sorted by `display_order` in dropdowns
- RLS policies allow public read, admin write
