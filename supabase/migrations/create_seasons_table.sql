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

-- Allow admins to manage seasons (you'll need to update this based on your auth system)
CREATE POLICY "Allow authenticated users to manage seasons"
  ON seasons FOR ALL
  USING (true)
  WITH CHECK (true);
