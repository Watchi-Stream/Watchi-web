-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create animes table
CREATE TABLE animes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    genres TEXT[] DEFAULT '{}',
    rating FLOAT,
    release_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create episodes table
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anime_id UUID REFERENCES animes(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    episode_num INTEGER NOT NULL,
    season_num INTEGER DEFAULT 1,
    video_url TEXT NOT NULL,
    thumbnail TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    anime_id UUID REFERENCES animes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, anime_id)
);

-- Create watch_history table
CREATE TABLE watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress FLOAT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (user_id, episode_id)
);

-- Create indexes for performance
CREATE INDEX idx_animes_title ON animes(title);
CREATE INDEX idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX idx_episodes_episode_num ON episodes(episode_num);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_anime_id ON favorites(anime_id);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_episode_id ON watch_history(episode_id);

-- Set up Row Level Security (RLS)
-- Enable RLS
ALTER TABLE animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Animes - Everyone can view
CREATE POLICY "Anyone can view animes" ON animes
    FOR SELECT USING (true);

-- Episodes - Everyone can view
CREATE POLICY "Anyone can view episodes" ON episodes
    FOR SELECT USING (true);

-- Favorites - Users can view their own favorites
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Favorites - Users can create their own favorites
CREATE POLICY "Users can create their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites - Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Watch History - Users can view their own watch history
CREATE POLICY "Users can view their own watch history" ON watch_history
    FOR SELECT USING (auth.uid() = user_id);

-- Watch History - Users can create their own watch history
CREATE POLICY "Users can create their own watch history" ON watch_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Watch History - Users can update their own watch history
CREATE POLICY "Users can update their own watch history" ON watch_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Sample data for testing (optional, can be removed for production)
INSERT INTO animes (title, description, cover_image, genres, rating, release_year)
VALUES 
('My Hero Academia', 'In a world where people with superpowers (known as "Quirks") are the norm, Izuku Midoriya has dreams of one day becoming a Hero, despite being bullied by his classmates for not having a Quirk.', 'https://example.com/mha.jpg', ARRAY['Action', 'Adventure', 'Comedy'], 8.5, 2016),
('Demon Slayer', 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.', 'https://example.com/demonslayer.jpg', ARRAY['Action', 'Fantasy', 'Adventure'], 8.9, 2019),
('Attack on Titan', 'In a world where humanity lives within cities surrounded by enormous walls that protect them from gigantic man-eating humanoids referred to as Titans, Eren Yeager vows to clean the world of the giant humanoid Titans that have brought humanity to the brink of extinction.', 'https://example.com/aot.jpg', ARRAY['Action', 'Drama', 'Fantasy'], 9.0, 2013);

-- Insert sample episodes for testing
INSERT INTO episodes (anime_id, title, episode_num, video_url, description)
VALUES 
((SELECT id FROM animes WHERE title = 'My Hero Academia' LIMIT 1), 'Izuku Midoriya: Origin', 1, 'https://streamtape.com/e/sample1', 'Izuku Midoriya desperately wants to be a hero, but he is one of the few in his generation born without a quirk.'),
((SELECT id FROM animes WHERE title = 'My Hero Academia' LIMIT 1), 'What It Takes to Be a Hero', 2, 'https://streamtape.com/e/sample2', 'Izuku receives a crash course in heroics when All Might takes him to the beach to train.'),
((SELECT id FROM animes WHERE title = 'Demon Slayer' LIMIT 1), 'Cruelty', 1, 'https://streamtape.com/e/sample3', 'Tanjiro is devastated when he returns home to find his family slaughtered by demons.'),
((SELECT id FROM animes WHERE title = 'Attack on Titan' LIMIT 1), 'To You, 2000 Years From Now', 1, 'https://streamtape.com/e/sample4', 'After 100 years of peace, mankind is suddenly reminded of the terror of being at the Titans' mercy.'); 