-- =============================================
-- FINAL COMPREHENSIVE SECURITY & PERSISTENCE FIX (v2.1)
-- =============================================
-- Purpose: Resolve "Yetki Yok" errors AND fix Ad Persistence
-- Run this in your Supabase SQL Editor.

-- 1. Helper Function for Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role ILIKE 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CREATE ADS TABLE (For persistent advertisements)
CREATE TABLE IF NOT EXISTS public.ads (
    area TEXT PRIMARY KEY, -- 'top', 'bottomA', 'hero'
    url TEXT,
    link TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENSURE RLS IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 4. RESET POLICIES
DROP POLICY IF EXISTS "everyone_select_profiles" ON public.profiles;
DROP POLICY IF EXISTS "everyone_select_news" ON public.news;
DROP POLICY IF EXISTS "everyone_select_events" ON public.events;
DROP POLICY IF EXISTS "everyone_select_gallery" ON public.gallery;
DROP POLICY IF EXISTS "everyone_select_villagers" ON public.villagers;
DROP POLICY IF EXISTS "everyone_select_donations" ON public.donations;
DROP POLICY IF EXISTS "everyone_select_ads" ON public.ads;

DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_all_news" ON public.news;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_all_villagers" ON public.villagers;
DROP POLICY IF EXISTS "admin_all_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_all_ads" ON public.ads;

-- 5. CREATE NEW CLEAN POLICIES

-- SELECT (Everyone)
CREATE POLICY "everyone_select_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "everyone_select_news" ON public.news FOR SELECT USING (true);
CREATE POLICY "everyone_select_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "everyone_select_gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "everyone_select_villagers" ON public.villagers FOR SELECT USING (true);
CREATE POLICY "everyone_select_donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "everyone_select_ads" ON public.ads FOR SELECT USING (true);

-- ADMIN (Full Access)
CREATE POLICY "admin_all_profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_news" ON public.news FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_gallery" ON public.gallery FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_villagers" ON public.villagers FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_donations" ON public.donations FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_ads" ON public.ads FOR ALL TO authenticated USING (public.is_admin());

-- 6. ENSURE Mehmet Balcı is ADMIN
UPDATE public.profiles SET role = 'ADMIN' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'mbalci@ktun.edu.tr');
