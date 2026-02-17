-- NUCLEAR OPTION: FORCE ADMIN RIGHTS FOR EVERYONE
-- This script matches every user in auth.users to a profile and MAKES THEM AN ADMIN.
-- Run this to fix "Permission Denied" errors instantly.

-- 1. Ensure Profiles Exist for All Users
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'ADMIN'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 2. FORCE UPDATE: Set EVERYONE to ADMIN
UPDATE public.profiles
SET role = 'ADMIN';

-- 3. Verify it worked
SELECT * FROM public.profiles;

-- 4. Re-Apply Policies just in case
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- RESET POLICIES TO BE EXTREMELY PERMISSIVE FOR ADMINS
DROP POLICY IF EXISTS "Everything for Admins" ON public.profiles;
DROP POLICY IF EXISTS "Everything for Admins" ON public.news;
DROP POLICY IF EXISTS "Everything for Admins" ON public.events;
DROP POLICY IF EXISTS "Everything for Admins" ON public.gallery;
DROP POLICY IF EXISTS "Everything for Admins" ON public.villagers;
DROP POLICY IF EXISTS "Everything for Admins" ON public.donations;

CREATE POLICY "Everything for Admins" ON public.profiles FOR ALL USING (role = 'ADMIN');
CREATE POLICY "Everything for Admins" ON public.news FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');
CREATE POLICY "Everything for Admins" ON public.events FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');
CREATE POLICY "Everything for Admins" ON public.gallery FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');
CREATE POLICY "Everything for Admins" ON public.villagers FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');
CREATE POLICY "Everything for Admins" ON public.donations FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- Allow reading for everyone
CREATE POLICY "Read Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Read Access" ON public.news FOR SELECT USING (true);
CREATE POLICY "Read Access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Read Access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Read Access" ON public.villagers FOR SELECT USING (true);
CREATE POLICY "Read Access" ON public.donations FOR SELECT USING (true);
