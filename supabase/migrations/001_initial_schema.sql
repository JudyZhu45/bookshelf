-- ============================================================
-- BookShelf: Initial Schema
-- ============================================================

-- Profiles (mirror of Clerk users)
CREATE TABLE profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id   TEXT UNIQUE NOT NULL,
  username   TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Favorites
CREATE TABLE favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ol_work_id TEXT NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT,
  cover_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ol_work_id)
);

-- Reading status
CREATE TABLE reading_status (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ol_work_id TEXT NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT,
  cover_url  TEXT,
  status     TEXT NOT NULL CHECK (status IN ('want_to_read', 'reading', 'finished')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, ol_work_id)
);

-- Activity feed
CREATE TABLE activity_feed (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action     TEXT NOT NULL CHECK (action IN ('favorited', 'started_reading', 'finished')),
  ol_work_id TEXT NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT,
  cover_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Trigger: log reading status changes to activity feed
-- ============================================================
CREATE OR REPLACE FUNCTION fn_log_reading_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_feed (user_id, action, ol_work_id, title, author, cover_url)
  VALUES (
    NEW.user_id,
    CASE NEW.status
      WHEN 'reading'  THEN 'started_reading'
      WHEN 'finished' THEN 'finished'
      ELSE 'favorited'
    END,
    NEW.ol_work_id, NEW.title, NEW.author, NEW.cover_url
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_reading_status_activity
AFTER INSERT OR UPDATE ON reading_status
FOR EACH ROW EXECUTE FUNCTION fn_log_reading_activity();

-- Trigger: log favorites to activity feed
CREATE OR REPLACE FUNCTION fn_log_favorite()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_feed (user_id, action, ol_work_id, title, author, cover_url)
  VALUES (NEW.user_id, 'favorited', NEW.ol_work_id, NEW.title, NEW.author, NEW.cover_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_favorites_activity
AFTER INSERT ON favorites
FOR EACH ROW EXECUTE FUNCTION fn_log_favorite();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Helper to get the Clerk user ID from the JWT
CREATE OR REPLACE FUNCTION requesting_clerk_id()
RETURNS TEXT AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'sub';
$$ LANGUAGE sql STABLE;

-- profiles
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (clerk_id = requesting_clerk_id());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (clerk_id = requesting_clerk_id());

-- favorites
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));

-- reading_status
CREATE POLICY "reading_status_select_own" ON reading_status FOR SELECT
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));
CREATE POLICY "reading_status_insert_own" ON reading_status FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));
CREATE POLICY "reading_status_update_own" ON reading_status FOR UPDATE
  USING (user_id = (SELECT id FROM profiles WHERE clerk_id = requesting_clerk_id()));

-- activity_feed: everyone can read, only trigger can insert
CREATE POLICY "feed_select_all" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "feed_no_direct_insert" ON activity_feed FOR INSERT WITH CHECK (false);
