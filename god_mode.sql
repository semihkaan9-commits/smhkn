-- GOD MODE SQL: KESİN VE SON ÇÖZÜM --
-- Bu script her şeyi siler ve admin yetkisini en basit/en güçlü haliyle yeniden kurar. --

-- 1. Önce TÜM mevcut politikaları siliyoruz (Temizlik)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 2. RLS'yi Tablolarda Aktif Tutuyoruz
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. KULLANICIYI ADMİN YAP (Case-insensitive 'ADMIN')
-- Eğer profiles'da yoksan seni ekler, varsan rolünü 'ADMIN' yapar.
INSERT INTO public.profiles (id, full_name, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'Admin Kullanıcı'), 'ADMIN'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';

-- 4. ADMİN İÇİN HER ŞEYİ AÇ (ILIKE ile büyük/küçük harf duyarlılığını bitiriyoruz)
-- News
CREATE POLICY "admin_all_news" ON public.news FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- Events
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- Gallery
CREATE POLICY "admin_all_gallery" ON public.gallery FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- Villagers
CREATE POLICY "admin_all_villagers" ON public.villagers FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- Donations
CREATE POLICY "admin_all_donations" ON public.donations FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- Profiles
CREATE POLICY "admin_all_profiles" ON public.profiles FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE 'ADMIN'));

-- 5. HERKESE OKUMA YETKİSİ VER (Ziyaretçiler için)
CREATE POLICY "public_read_news" ON public.news FOR SELECT USING (true);
CREATE POLICY "public_read_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "public_read_gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "public_read_villagers" ON public.villagers FOR SELECT USING (true);
CREATE POLICY "public_read_donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);
