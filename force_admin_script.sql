-- FINAL CLEAN SOLUTION: FORCE ADMIN RIGHTS AND RESET POLICIES WITH UNIQUE NAMES
-- This ensures no "Policy already exists" errors by using unique policy names.

-- 1. Ensure Profiles Exist for All Users and set to ADMIN
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'ADMIN'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'ADMIN';

-- 2. Re-Apply RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 3. ADMIN FULL ACCESS (New Unique Names)
DROP POLICY IF EXISTS "force_admin_all_profiles" ON public.profiles;
CREATE POLICY "force_admin_all_profiles" ON public.profiles FOR ALL USING (role = 'ADMIN');

DROP POLICY IF EXISTS "force_admin_all_news" ON public.news;
CREATE POLICY "force_admin_all_news" ON public.news FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "force_admin_all_events" ON public.events;
CREATE POLICY "force_admin_all_events" ON public.events FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "force_admin_all_gallery" ON public.gallery;
CREATE POLICY "force_admin_all_gallery" ON public.gallery FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "force_admin_all_villagers" ON public.villagers;
CREATE POLICY "force_admin_all_villagers" ON public.villagers FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

DROP POLICY IF EXISTS "force_admin_all_donations" ON public.donations;
CREATE POLICY "force_admin_all_donations" ON public.donations FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 4. PUBLIC READ ACCESS (New Unique Names)
DROP POLICY IF EXISTS "force_public_read_profiles" ON public.profiles;
CREATE POLICY "force_public_read_profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_news" ON public.news;
CREATE POLICY "force_public_read_news" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_events" ON public.events;
CREATE POLICY "force_public_read_events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_gallery" ON public.gallery;
CREATE POLICY "force_public_read_gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_villagers" ON public.villagers;
CREATE POLICY "force_public_read_villagers" ON public.villagers FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_donations" ON public.donations;
CREATE POLICY "force_public_read_donations" ON public.donations FOR SELECT USING (true);
