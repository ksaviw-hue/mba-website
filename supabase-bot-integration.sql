-- Bot Integration: Create users table (matches Discord bot schema)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,  -- Format: 'discord-{discord_id}'
    username TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    minecraft_username TEXT,
    minecraft_user_id TEXT,
    team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
    description TEXT,
    discord_username TEXT,
    roles TEXT[] DEFAULT ARRAY['Player']::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);

-- Service role can write (bot only)
CREATE POLICY "Service role users" ON users FOR ALL USING (
    auth.role() = 'service_role'
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_users_minecraft_username ON users(minecraft_username);
CREATE INDEX IF NOT EXISTS idx_users_discord_username ON users(discord_username);

-- Update teams table to match bot schema
ALTER TABLE teams ADD COLUMN IF NOT EXISTS guild_id TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_role_id TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_logo_url TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS team_logo_emoji TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS wins INTEGER DEFAULT 0;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS losses INTEGER DEFAULT 0;

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
    id BIGSERIAL PRIMARY KEY,
    guild_id TEXT NOT NULL,
    season_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guild_id, season_name)
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seasons" ON seasons FOR SELECT USING (true);
CREATE POLICY "Service role seasons" ON seasons FOR ALL USING (auth.role() = 'service_role');

-- Create player_season_stats table
CREATE TABLE IF NOT EXISTS player_season_stats (
    id BIGSERIAL PRIMARY KEY,
    player_id TEXT NOT NULL,  -- Format: 'discord-{discord_id}'
    season_id BIGINT REFERENCES seasons(id) ON DELETE CASCADE,
    guild_id TEXT NOT NULL,
    games_played INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    total_rebounds INTEGER DEFAULT 0,
    total_assists INTEGER DEFAULT 0,
    total_steals INTEGER DEFAULT 0,
    total_blocks INTEGER DEFAULT 0,
    total_turnovers INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, season_id)
);

ALTER TABLE player_season_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read player_season_stats" ON player_season_stats FOR SELECT USING (true);
CREATE POLICY "Service role player_season_stats" ON player_season_stats FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_player_season_stats_player ON player_season_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_season ON player_season_stats(season_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_guild ON player_season_stats(guild_id);

-- Create player_game_stats table
CREATE TABLE IF NOT EXISTS player_game_stats (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL,  -- Format: 'discord-{discord_id}'
    team_id TEXT REFERENCES teams(id),
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, player_id)
);

ALTER TABLE player_game_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read player_game_stats" ON player_game_stats FOR SELECT USING (true);
CREATE POLICY "Service role player_game_stats" ON player_game_stats FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_player_game_stats_game ON player_game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_player_game_stats_player ON player_game_stats(player_id);

-- Update games table for bot integration
ALTER TABLE games ADD COLUMN IF NOT EXISTS guild_id TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS season_id BIGINT REFERENCES seasons(id);
ALTER TABLE games ADD COLUMN IF NOT EXISTS team1_id TEXT REFERENCES teams(id);
ALTER TABLE games ADD COLUMN IF NOT EXISTS team2_id TEXT REFERENCES teams(id);
ALTER TABLE games ADD COLUMN IF NOT EXISTS team1_score INTEGER;
ALTER TABLE games ADD COLUMN IF NOT EXISTS team2_score INTEGER;
ALTER TABLE games ADD COLUMN IF NOT EXISTS winner_id TEXT REFERENCES teams(id);
ALTER TABLE games ADD COLUMN IF NOT EXISTS played_at TIMESTAMPTZ;
ALTER TABLE games ADD COLUMN IF NOT EXISTS recorded_by TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS vod_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create transaction_history table
CREATE TABLE IF NOT EXISTS transaction_history (
    id BIGSERIAL PRIMARY KEY,
    guild_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,  -- 'sign', 'release', 'trade', 'demand'
    player_id TEXT NOT NULL,  -- Format: 'discord-{discord_id}'
    from_team_id TEXT REFERENCES teams(id),
    to_team_id TEXT REFERENCES teams(id),
    performed_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transaction_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read transaction_history" ON transaction_history FOR SELECT USING (true);
CREATE POLICY "Service role transaction_history" ON transaction_history FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_transaction_history_player ON transaction_history(player_id);
CREATE INDEX IF NOT EXISTS idx_transaction_history_guild ON transaction_history(guild_id);

-- Create accolades table
CREATE TABLE IF NOT EXISTS accolades (
    id BIGSERIAL PRIMARY KEY,
    guild_id TEXT NOT NULL,
    player_id TEXT NOT NULL,  -- Format: 'discord-{discord_id}'
    season_id BIGINT REFERENCES seasons(id),
    accolade_type TEXT NOT NULL,  -- 'MVP', 'DPOY', 'All-Star', 'Champion', etc.
    description TEXT,
    awarded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE accolades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read accolades" ON accolades FOR SELECT USING (true);
CREATE POLICY "Service role accolades" ON accolades FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_accolades_player ON accolades(player_id);
CREATE INDEX IF NOT EXISTS idx_accolades_season ON accolades(season_id);

-- Create helpful views
CREATE OR REPLACE VIEW player_stats_view AS
SELECT 
  pss.player_id,
  u.username,
  u.minecraft_username,
  u.avatar_url,
  t.name as team_name,
  t.team_logo_url,
  s.season_name,
  pss.guild_id,
  pss.games_played,
  pss.total_points,
  pss.total_rebounds,
  pss.total_assists,
  pss.total_steals,
  pss.total_blocks,
  pss.total_turnovers,
  ROUND(pss.total_points::numeric / NULLIF(pss.games_played, 0), 1) as ppg,
  ROUND(pss.total_rebounds::numeric / NULLIF(pss.games_played, 0), 1) as rpg,
  ROUND(pss.total_assists::numeric / NULLIF(pss.games_played, 0), 1) as apg,
  ROUND(pss.total_steals::numeric / NULLIF(pss.games_played, 0), 1) as spg,
  ROUND(pss.total_blocks::numeric / NULLIF(pss.games_played, 0), 1) as bpg,
  ROUND(pss.total_turnovers::numeric / NULLIF(pss.games_played, 0), 1) as tpg
FROM player_season_stats pss
JOIN users u ON pss.player_id = u.id
LEFT JOIN teams t ON u.team_id = t.id
JOIN seasons s ON pss.season_id = s.id;

-- Migration helper: Copy data from players to users (if needed)
-- IMPORTANT: Run this manually after reviewing your data
/*
INSERT INTO users (id, username, minecraft_username, minecraft_user_id, avatar_url, description, discord_username, team_id, roles)
SELECT 
    'discord-' || COALESCE(discord_username, display_name), -- You'll need to map these properly
    display_name,
    minecraft_username,
    minecraft_user_id,
    profile_picture,
    description,
    discord_username,
    team_id,
    roles
FROM players
ON CONFLICT (id) DO NOTHING;
*/

-- Comments
COMMENT ON TABLE users IS 'Main users table - shared with Discord bot (uses discord-{id} format)';
COMMENT ON TABLE seasons IS 'Season tracking - managed by Discord bot';
COMMENT ON TABLE player_season_stats IS 'Aggregated player stats per season - updated by Discord bot';
COMMENT ON TABLE player_game_stats IS 'Individual game performance stats';
COMMENT ON TABLE transaction_history IS 'Team roster transaction log';
COMMENT ON TABLE accolades IS 'Player awards and achievements';
