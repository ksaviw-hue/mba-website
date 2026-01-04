-- Migration: Add authentication and social features

-- Add Minecraft and Discord fields to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS minecraft_user_id TEXT UNIQUE;
ALTER TABLE players ADD COLUMN IF NOT EXISTS minecraft_username TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;
ALTER TABLE players ADD COLUMN IF NOT EXISTS discord_username TEXT;

-- Create article_likes table
CREATE TABLE IF NOT EXISTS article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, player_id)
);

-- Create article_comments table
CREATE TABLE IF NOT EXISTS article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_wall_posts table
CREATE TABLE IF NOT EXISTS team_wall_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMPTZ,
  pinned_by UUID REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_article_likes_article ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_player ON article_likes(player_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_article ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_player ON article_comments(player_id);
CREATE INDEX IF NOT EXISTS idx_team_wall_posts_team ON team_wall_posts(team_id);
CREATE INDEX IF NOT EXISTS idx_team_wall_posts_player ON team_wall_posts(player_id);
CREATE INDEX IF NOT EXISTS idx_team_wall_posts_pinned ON team_wall_posts(is_pinned, created_at);

-- Add RLS policies
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_wall_posts ENABLE ROW LEVEL SECURITY;

-- Article likes policies (anyone can read, only authenticated can like)
CREATE POLICY "Anyone can view article likes" ON article_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like articles" ON article_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can unlike their own likes" ON article_likes FOR DELETE USING (true);

-- Article comments policies
CREATE POLICY "Anyone can view article comments" ON article_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON article_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own comments" ON article_comments FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own comments" ON article_comments FOR DELETE USING (true);

-- Team wall posts policies
CREATE POLICY "Anyone can view team wall posts" ON team_wall_posts FOR SELECT USING (true);
CREATE POLICY "Team members can post" ON team_wall_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own posts" ON team_wall_posts FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own posts" ON team_wall_posts FOR DELETE USING (true);
