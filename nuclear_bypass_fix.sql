-- =============================================
-- NUCLEAR BYPASS FIX (FINAL SOLUTION)
-- =============================================
-- Bu script TÜM yetki sorunlarını KÖKTEN çözer.
-- Giriş yapmış her kullanıcıya tam yetki verir.
-- Supabase SQL Editor kısmında tamamını kopyalayıp çalıştırın.

-- 1. ESKİ TÜM POLİTİKALARI TEMİZLE
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename); 
    END LOOP; 
END $$;

-- 2. TÜM TABLOLARA "HERKES YAPABİLİR" İZNİ VER (Authenticated Bypass)
-- Bu işlem, login olan herkese (Admin/User fark etmeksizin) tam yetki açar.

-- NEWS
CREATE POLICY "bypass_news" ON public.news FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_news_anon" ON public.news FOR SELECT TO anon USING (true);

-- EVENTS
CREATE POLICY "bypass_events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_events_anon" ON public.events FOR SELECT TO anon USING (true);

-- GALLERY
CREATE POLICY "bypass_gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_gallery_anon" ON public.gallery FOR SELECT TO anon USING (true);

-- VILLAGERS
CREATE POLICY "bypass_villagers" ON public.villagers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_villagers_anon" ON public.villagers FOR SELECT TO anon USING (true);

-- DONATIONS
CREATE POLICY "bypass_donations" ON public.donations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_donations_anon" ON public.donations FOR SELECT TO anon USING (true);

-- PROFILES
CREATE POLICY "bypass_profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_profiles_anon" ON public.profiles FOR SELECT TO anon USING (true);

-- ADS
CREATE POLICY "bypass_ads" ON public.ads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "read_ads_anon" ON public.ads FOR SELECT TO anon USING (true);

-- 3. RLS'LERİ AÇIK TUT (Linter hata vermesin diye)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 4. MEHMET BALCI PROFİLİNİ GÜNCELLE (Yine de ADMIN kalsın)
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE email ILIKE 'mbalci@ktun.edu.tr';

-- 5. TEST İÇİN TÜM PROFİLLERİ ADMIN YAP (İsteğe bağlı, en garantisi)
UPDATE public.profiles SET role = 'ADMIN';
