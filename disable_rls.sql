-- =============================================
-- RLS'Yİ KAPAT - Haber, Etkinlik, Galeri Tabloları
-- Bu script'i Supabase SQL Editor'de çalıştırın
-- =============================================

-- NEWS tablosunda RLS'yi kapat
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;

-- EVENTS tablosunda RLS'yi kapat
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- GALLERY tablosunda RLS'yi kapat
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;

-- DONATIONS tablosunda RLS'yi kapat
ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;

-- VILLAGERS tablosunda RLS'yi kapat
ALTER TABLE public.villagers DISABLE ROW LEVEL SECURITY;

-- PROFILES tablosunda RLS'yi kapat
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
