-- MEET Database Schema
-- PostgreSQL migration for Supabase
-- Run this in your Supabase SQL Editor

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$'),
  full_name       TEXT NOT NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  avatar_url      TEXT,
  cover_url       TEXT,
  bio             TEXT CHECK (char_length(bio) <= 500),
  city            TEXT,
  country         TEXT,
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  account_type    TEXT NOT NULL DEFAULT 'personal' CHECK (account_type IN ('personal','creator','business','organization')),
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_private      BOOLEAN NOT NULL DEFAULT FALSE,
  website         TEXT,
  followers_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  connections_count INTEGER NOT NULL DEFAULT 0,
  posts_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INTERESTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interests (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name     TEXT UNIQUE NOT NULL,
  slug     TEXT UNIQUE NOT NULL,
  icon     TEXT,
  category TEXT,
  color    TEXT
);

CREATE TABLE IF NOT EXISTS profile_interests (
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (profile_id, interest_id)
);

-- ─── SOCIAL GRAPH ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE TABLE IF NOT EXISTS connections (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- ─── POSTS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) <= 5000),
  post_type     TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text','image','video','audio','poll')),
  visibility    TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','connections','private')),
  media_url     TEXT,
  location      TEXT,
  category      TEXT,
  tags          TEXT[] DEFAULT '{}',
  likes_count   INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count  INTEGER NOT NULL DEFAULT 0,
  saves_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  order_index INTEGER NOT NULL DEFAULT 0,
  alt_text    TEXT
);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, profile_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 1000),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saves (
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, profile_id)
);

-- ─── EVENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL CHECK (char_length(title) <= 200),
  description      TEXT NOT NULL,
  cover_url        TEXT,
  start_date       TIMESTAMPTZ NOT NULL,
  end_date         TIMESTAMPTZ NOT NULL,
  venue_name       TEXT NOT NULL,
  address          TEXT NOT NULL,
  city             TEXT NOT NULL,
  country          TEXT NOT NULL,
  latitude         DECIMAL(9,6),
  longitude        DECIMAL(9,6),
  category         TEXT NOT NULL DEFAULT 'other',
  capacity         INTEGER,
  is_free          BOOLEAN NOT NULL DEFAULT TRUE,
  price            DECIMAL(10,2),
  currency         TEXT NOT NULL DEFAULT 'USD',
  is_online        BOOLEAN NOT NULL DEFAULT FALSE,
  online_url       TEXT,
  attendees_count  INTEGER NOT NULL DEFAULT 0,
  interested_count INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE TABLE IF NOT EXISTS event_attendees (
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going','interested')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, profile_id)
);

-- ─── COMMUNITIES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (char_length(name) <= 100),
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT NOT NULL,
  cover_url     TEXT,
  avatar_url    TEXT,
  category      TEXT NOT NULL,
  is_private    BOOLEAN NOT NULL DEFAULT FALSE,
  members_count INTEGER NOT NULL DEFAULT 1,
  posts_count   INTEGER NOT NULL DEFAULT 0,
  events_count  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_members (
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','moderator','member')),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (community_id, profile_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  post_id      UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (community_id, post_id)
);

-- ─── ACTIVITIES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  description        TEXT,
  category           TEXT NOT NULL,
  city               TEXT NOT NULL,
  country            TEXT NOT NULL,
  participants_count INTEGER NOT NULL DEFAULT 0,
  image_url          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PLACES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL DEFAULT 'other',
  image_url        TEXT,
  address          TEXT NOT NULL,
  city             TEXT NOT NULL,
  country          TEXT NOT NULL,
  latitude         DECIMAL(9,6),
  longitude        DECIMAL(9,6),
  rating           DECIMAL(3,2),
  events_count     INTEGER NOT NULL DEFAULT 0,
  interested_count INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MESSAGING ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_group   BOOLEAN NOT NULL DEFAULT FALSE,
  name       TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, profile_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT,
  message_type    TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text','image','audio')),
  media_url       TEXT,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type           TEXT NOT NULL,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  actor_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reference_id   UUID,
  reference_type TEXT,
  is_read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SAFETY ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason         TEXT NOT NULL,
  description    TEXT,
  reference_id   UUID,
  reference_type TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- ─── ADULT SECTION (Isolated) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS adult_profiles (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id       UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bio              TEXT CHECK (char_length(bio) <= 500),
  photos           TEXT[] DEFAULT '{}',
  location_display TEXT,
  age              INTEGER CHECK (age >= 18 AND age <= 120),
  is_visible       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adult_preferences (
  profile_id         UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_genders  TEXT[],
  age_min            INTEGER DEFAULT 18,
  age_max            INTEGER DEFAULT 99,
  max_distance_km    INTEGER DEFAULT 50,
  looking_for        TEXT[],
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adult_matches (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','matched','unmatched')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_a_id, profile_b_id),
  CHECK (profile_a_id < profile_b_id)
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city, start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category, start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_community_members_profile ON community_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- Full text search
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(to_tsvector('english', full_name || ' ' || COALESCE(username, '') || ' ' || COALESCE(bio, '')));
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_communities_search ON communities USING gin(to_tsvector('english', name || ' ' || description));

-- ─── FUNCTIONS & TRIGGERS ────────────────────────────────────────────────────

-- Auto-create profile after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::TEXT, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE adult_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE adult_matches ENABLE ROW LEVEL SECURITY;

-- ─── ROW LEVEL SECURITY POLICIES ─────────────────────────────────────────────

-- Profiles: public read, own write
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: public read, own write
DROP POLICY IF EXISTS "Public posts viewable by everyone" ON posts;
CREATE POLICY "Public posts viewable by everyone" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (author_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (author_id = auth.uid());

-- Events: public read, host write
DROP POLICY IF EXISTS "Events viewable by everyone" ON events;
CREATE POLICY "Events viewable by everyone" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create events" ON events;
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (host_id = auth.uid());

DROP POLICY IF EXISTS "Hosts can update events" ON events;
CREATE POLICY "Hosts can update events" ON events FOR UPDATE USING (host_id = auth.uid());

DROP POLICY IF EXISTS "Hosts can delete events" ON events;
CREATE POLICY "Hosts can delete events" ON events FOR DELETE USING (host_id = auth.uid());

-- Communities: public read, member write
DROP POLICY IF EXISTS "Communities viewable by everyone" ON communities;
CREATE POLICY "Communities viewable by everyone" ON communities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create communities" ON communities;
CREATE POLICY "Users can create communities" ON communities FOR INSERT WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update communities" ON communities;
CREATE POLICY "Admins can update communities" ON communities FOR UPDATE USING (creator_id = auth.uid() OR auth.uid() IN (SELECT profile_id FROM community_members WHERE community_id = id AND role IN ('owner','admin')));

-- Messages: conversation members only
DROP POLICY IF EXISTS "Users can see their messages" ON messages;
CREATE POLICY "Users can see their messages" ON messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM conversation_members WHERE profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (SELECT conversation_id FROM conversation_members WHERE profile_id = auth.uid())
);

-- Notifications: own only
DROP POLICY IF EXISTS "Users see own notifications" ON notifications;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can mark own notifications read" ON notifications;
CREATE POLICY "Users can mark own notifications read" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Adult profiles: self only
DROP POLICY IF EXISTS "Adults see their own adult profile" ON adult_profiles;
CREATE POLICY "Adults see their own adult profile" ON adult_profiles FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Adults can insert their profile" ON adult_profiles;
CREATE POLICY "Adults can insert their profile" ON adult_profiles FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Adults can update their profile" ON adult_profiles;
CREATE POLICY "Adults can update their profile" ON adult_profiles FOR UPDATE USING (profile_id = auth.uid());

-- ─── STORAGE BUCKETS ─────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('posts', 'posts', true),
  ('events', 'events', true),
  ('communities', 'communities', true),
  ('messages', 'messages', false)
ON CONFLICT (id) DO NOTHING;

-- ─── SEED INTERESTS ──────────────────────────────────────────────────────────
INSERT INTO interests (name, slug, icon, category, color) VALUES
  ('Technology', 'technology', '💻', 'professional', '#3B82F6'),
  ('Photography', 'photography', '📸', 'creative', '#F59E0B'),
  ('Music', 'music', '🎵', 'creative', '#8B5CF6'),
  ('Business', 'business', '💼', 'professional', '#10B981'),
  ('Entrepreneurship', 'entrepreneurship', '🚀', 'professional', '#EF4444'),
  ('Fitness', 'fitness', '💪', 'lifestyle', '#F97316'),
  ('Travel', 'travel', '✈️', 'lifestyle', '#06B6D4'),
  ('Food', 'food', '🍽️', 'lifestyle', '#84CC16'),
  ('Gaming', 'gaming', '🎮', 'entertainment', '#A855F7'),
  ('Sports', 'sports', '⚽', 'sports', '#22C55E'),
  ('Fashion', 'fashion', '👗', 'lifestyle', '#EC4899'),
  ('Art', 'art', '🎨', 'creative', '#F43F5E'),
  ('Design', 'design', '✏️', 'creative', '#6366F1'),
  ('Education', 'education', '📚', 'professional', '#0EA5E9'),
  ('Finance', 'finance', '📈', 'professional', '#14B8A6'),
  ('Film', 'film', '🎬', 'entertainment', '#EAB308'),
  ('Cars', 'cars', '🚗', 'lifestyle', '#64748B'),
  ('Nature', 'nature', '🌿', 'lifestyle', '#22D3EE'),
  ('Books', 'books', '📖', 'education', '#8B5CF6'),
  ('Wellness', 'wellness', '🧘', 'lifestyle', '#34D399')
ON CONFLICT (name) DO NOTHING;
