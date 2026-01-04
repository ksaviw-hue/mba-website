-- Add season column to games table
-- This allows games to be categorized by season (Preseason 1, Season 1, Season 2, Season 3)

ALTER TABLE games 
ADD COLUMN IF NOT EXISTS season TEXT DEFAULT 'Preseason 1';

-- Update any existing games without a season to Preseason 1
UPDATE games 
SET season = 'Preseason 1' 
WHERE season IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN games.season IS 'Season identifier: Preseason 1, Season 1, Season 2, Season 3, etc.';
