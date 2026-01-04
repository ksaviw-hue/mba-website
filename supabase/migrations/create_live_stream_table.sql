-- Create live_stream table for managing live Twitch streams
CREATE TABLE IF NOT EXISTS live_stream (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twitch_channel TEXT NOT NULL,
  title TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only one active stream at a time
CREATE UNIQUE INDEX idx_live_stream_active ON live_stream(is_live) WHERE is_live = true;

-- Enable RLS
ALTER TABLE live_stream ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read live stream
CREATE POLICY "Allow public read access to live stream"
  ON live_stream FOR SELECT
  USING (true);

-- Allow authenticated users to manage live stream
CREATE POLICY "Allow authenticated users to manage live stream"
  ON live_stream FOR ALL
  USING (true)
  WITH CHECK (true);
