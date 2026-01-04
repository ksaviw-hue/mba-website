-- Add missing minutes_played column to game_stats table
ALTER TABLE game_stats 
ADD COLUMN IF NOT EXISTS minutes_played INTEGER DEFAULT 0;
