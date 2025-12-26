-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT fk_player
    FOREIGN KEY (player_id)
    REFERENCES public.players(id)
    ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_player_id ON public.staff(player_id);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_created_at ON public.staff(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON public.staff
  FOR SELECT USING (true);

-- Create policy for insert (requires authentication)
CREATE POLICY "Enable insert for authenticated users only" ON public.staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for delete (requires authentication)
CREATE POLICY "Enable delete for authenticated users only" ON public.staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE public.staff IS 'Stores staff members and their roles in the EBA organization';
COMMENT ON COLUMN public.staff.id IS 'Unique identifier for the staff record';
COMMENT ON COLUMN public.staff.player_id IS 'Foreign key reference to the players table';
COMMENT ON COLUMN public.staff.role IS 'The staff role assigned to the player';
COMMENT ON COLUMN public.staff.created_at IS 'Timestamp when the staff record was created';
