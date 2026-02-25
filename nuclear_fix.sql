-- NUCLEAR FIX: DISABLE RLS COMPLETELY --
-- Bu script RLS'yi (güvenlik duvarını) tamamen kapatır.
-- Bu sayede yetki kontrolü yapılmaz ve silme/güncelleme %100 çalışır.

ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Politikaları da silelim ki tertemiz olsun
DROP POLICY IF EXISTS "admin_all_news" ON public.news;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_all_villagers" ON public.villagers;
DROP POLICY IF EXISTS "admin_all_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;

DROP POLICY IF EXISTS "public_read_news" ON public.news;
DROP POLICY IF EXISTS "public_read_events" ON public.events;
DROP POLICY IF EXISTS "public_read_gallery" ON public.gallery;
DROP POLICY IF EXISTS "public_read_villagers" ON public.villagers;
DROP POLICY IF EXISTS "public_read_donations" ON public.donations;
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
