-- EBA Basketball League Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams Table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  owner TEXT,
  general_manager TEXT,
  head_coach TEXT,
  assistant_coaches TEXT[],
  conference TEXT NOT NULL CHECK (conference IN ('Eastern', 'Western')),
  primary_color TEXT NOT NULL DEFAULT '#00A8E8',
  secondary_color TEXT NOT NULL DEFAULT '#0A0E27',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Players Table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL,
  roblox_username TEXT NOT NULL,
  roblox_user_id TEXT NOT NULL,
  profile_picture TEXT,
  description TEXT,
  discord_username TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  roles TEXT[] DEFAULT ARRAY['Player']::TEXT[],
  
  -- Stats
  games_played INTEGER DEFAULT 0,
  points DECIMAL(10,2) DEFAULT 0,
  rebounds DECIMAL(10,2) DEFAULT 0,
  assists DECIMAL(10,2) DEFAULT 0,
  steals DECIMAL(10,2) DEFAULT 0,
  blocks DECIMAL(10,2) DEFAULT 0,
  turnovers DECIMAL(10,2) DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  field_goal_percentage DECIMAL(5,2) DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  three_point_percentage DECIMAL(5,2) DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  free_throw_percentage DECIMAL(5,2) DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  assist_turnover_ratio DECIMAL(10,2) DEFAULT 0,
  assist_percentage DECIMAL(10,2) DEFAULT 0,
  efficiency DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Games Table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  home_score INTEGER,
  away_score INTEGER,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'live', 'completed')) DEFAULT 'scheduled',
  season INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Game Stats Table (for individual player game performances)
CREATE TABLE game_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  opponent TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  result TEXT CHECK (result IN ('W', 'L')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Articles Table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  cover_image TEXT,
  excerpt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for better query performance
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_roblox_username ON players(roblox_username);
CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_scheduled_date ON games(scheduled_date);
CREATE INDEX idx_game_stats_player_id ON game_stats(player_id);
CREATE INDEX idx_game_stats_game_id ON game_stats(game_id);
CREATE INDEX idx_articles_published_date ON articles(published_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON game_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access policies (everyone can read)
CREATE POLICY "Public teams read access" ON teams FOR SELECT USING (true);
CREATE POLICY "Public players read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public games read access" ON games FOR SELECT USING (true);
CREATE POLICY "Public game_stats read access" ON game_stats FOR SELECT USING (true);
CREATE POLICY "Public articles read access" ON articles FOR SELECT USING (true);

-- Public write access policies (allow all operations for now)
-- TODO: Restrict to admin users only once authentication is fully set up
CREATE POLICY "Public teams write access" ON teams FOR ALL USING (true);
CREATE POLICY "Public players write access" ON players FOR ALL USING (true);
CREATE POLICY "Public games write access" ON games FOR ALL USING (true);
CREATE POLICY "Public game_stats write access" ON game_stats FOR ALL USING (true);
CREATE POLICY "Public articles write access" ON articles FOR ALL USING (true);
