-- ============================================
-- SUPABASE STORAGE SETUP
-- ============================================
-- Run this in your Supabase SQL Editor AFTER running the main schema
-- This creates storage buckets for team logos, player avatars, and article images

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('team-logos', 'team-logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']),
  ('player-avatars', 'player-avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']),
  ('article-images', 'article-images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for team-logos bucket
DROP POLICY IF EXISTS "Public can view team logos" ON storage.objects;
CREATE POLICY "Public can view team logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-logos');

DROP POLICY IF EXISTS "Anyone can upload team logos" ON storage.objects;
CREATE POLICY "Anyone can upload team logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-logos');

DROP POLICY IF EXISTS "Anyone can update team logos" ON storage.objects;
CREATE POLICY "Anyone can update team logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'team-logos');

DROP POLICY IF EXISTS "Anyone can delete team logos" ON storage.objects;
CREATE POLICY "Anyone can delete team logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-logos');

-- Create storage policies for player-avatars bucket
DROP POLICY IF EXISTS "Public can view player avatars" ON storage.objects;
CREATE POLICY "Public can view player avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'player-avatars');

DROP POLICY IF EXISTS "Anyone can upload player avatars" ON storage.objects;
CREATE POLICY "Anyone can upload player avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'player-avatars');

DROP POLICY IF EXISTS "Anyone can update player avatars" ON storage.objects;
CREATE POLICY "Anyone can update player avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'player-avatars');

DROP POLICY IF EXISTS "Anyone can delete player avatars" ON storage.objects;
CREATE POLICY "Anyone can delete player avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'player-avatars');

-- Create storage policies for article-images bucket
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Anyone can upload article images" ON storage.objects;
CREATE POLICY "Anyone can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Anyone can update article images" ON storage.objects;
CREATE POLICY "Anyone can update article images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Anyone can delete article images" ON storage.objects;
CREATE POLICY "Anyone can delete article images"
ON storage.objects FOR DELETE
USING (bucket_id = 'article-images');

-- ============================================
-- COMPLETED!
-- ============================================
-- Storage buckets created:
-- 1. team-logos (5MB limit) - For team logo uploads
-- 2. player-avatars (5MB limit) - For player profile pictures  
-- 3. article-images (10MB limit) - For news article images
--
-- All buckets are public (readable by anyone)
-- Anyone can upload/update/delete (no auth required)
-- ============================================
