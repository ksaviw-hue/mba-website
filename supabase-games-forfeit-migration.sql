-- Add forfeit columns to games table
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS is_forfeit BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS forfeit_winner TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.games.is_forfeit IS 'Whether this game was decided by forfeit';
COMMENT ON COLUMN public.games.forfeit_winner IS 'Which team won by forfeit: home or away';
