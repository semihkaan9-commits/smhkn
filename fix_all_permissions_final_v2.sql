-- =============================================
-- FINAL COMPREHENSIVE SECURITY FIX (v2)
-- =============================================
-- Purpose: Resolve "Yetki Yok" (No Permission) errors
-- Run this in your Supabase SQL Editor.

-- 1. Helper Function for Admin Check (SECURITY DEFINER for consistency)
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

-- 2. ENSURE RLS IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 3. RESET POLICIES (DROP ALL POTENTIAL NAMES)
-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "force_public_read_profiles" ON public.profiles;

-- NEWS
DROP POLICY IF EXISTS "Public news are viewable by everyone." ON public.news;
DROP POLICY IF EXISTS "Authenticated users can insert news." ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can delete news" ON public.news;
DROP POLICY IF EXISTS "admin_all_news" ON public.news;
DROP POLICY IF EXISTS "read_news" ON public.news;

-- EVENTS
DROP POLICY IF EXISTS "Public events are viewable by everyone." ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events." ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;
DROP POLICY IF EXISTS "read_events" ON public.events;

-- GALLERY
DROP POLICY IF EXISTS "Public gallery is viewable by everyone." ON public.gallery;
DROP POLICY IF EXISTS "Authenticated users can insert gallery items." ON public.gallery;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery;
DROP POLICY IF EXISTS "admin_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "read_gallery" ON public.gallery;

-- VILLAGERS
DROP POLICY IF EXISTS "Public villagers are viewable by everyone." ON public.villagers;
DROP POLICY IF EXISTS "Users can insert villager profile." ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can update villager profiles" ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can delete villager profiles" ON public.villagers;
DROP POLICY IF EXISTS "admin_all_villagers" ON public.villagers;
DROP POLICY IF EXISTS "read_villagers" ON public.villagers;

-- DONATIONS
DROP POLICY IF EXISTS "Public donations are viewable by everyone." ON public.donations;
DROP POLICY IF EXISTS "Admins can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can delete donations" ON public.donations;
DROP POLICY IF EXISTS "admin_all_donations" ON public.donations;
DROP POLICY IF EXISTS "read_donations" ON public.donations;


-- 4. CREATE NEW CLEAN POLICIES

-- SELECT (Everyone)
CREATE POLICY "everyone_select_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "everyone_select_news" ON public.news FOR SELECT USING (true);
CREATE POLICY "everyone_select_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "everyone_select_gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "everyone_select_villagers" ON public.villagers FOR SELECT USING (true);
CREATE POLICY "everyone_select_donations" ON public.donations FOR SELECT USING (true);

-- ADMIN (Full Access)
CREATE POLICY "admin_all_profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_news" ON public.news FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_gallery" ON public.gallery FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_villagers" ON public.villagers FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_all_donations" ON public.donations FOR ALL TO authenticated USING (public.is_admin());

-- USER OWN DATA (Fallback for Villagers/Profiles)
CREATE POLICY "user_manage_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "user_manage_own_villager" ON public.villagers FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 5. FINAL CHECK: Ensure specific email is ADMIN
-- Mehmet Balcı email for reference
UPDATE public.profiles SET role = 'ADMIN' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'mbalci@ktun.edu.tr');
