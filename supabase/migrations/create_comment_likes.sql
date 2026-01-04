-- Create article_comment_likes table
CREATE TABLE IF NOT EXISTS article_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES article_comments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, player_id)
);

-- Create index for faster queries
CREATE INDEX idx_comment_likes_comment_id ON article_comment_likes(comment_id);
CREATE INDEX idx_comment_likes_player_id ON article_comment_likes(player_id);

-- Enable RLS
ALTER TABLE article_comment_likes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read likes
CREATE POLICY "Allow public read access to comment likes"
  ON article_comment_likes FOR SELECT
  USING (true);

-- Allow authenticated users to manage their own likes
CREATE POLICY "Allow authenticated users to manage their comment likes"
  ON article_comment_likes FOR ALL
  USING (true)
  WITH CHECK (true);
