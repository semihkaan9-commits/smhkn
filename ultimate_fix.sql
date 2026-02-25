-- ULTIMATE GOD MODE SCRIPT --
-- Bu script "Yetki Yok" hatasını kökten çözer. --

-- 1. Admin Kontrol Fonksiyonu Oluştur (En sağlam yöntem)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT (role = 'ADMIN') INTO is_admin
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN coalesce(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tüm Kullanıcıları Admin Yap (Sadece test ve kurtarma için)
UPDATE public.profiles SET role = 'ADMIN';

-- 3. Eksik Profilleri Tamamla
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'ADMIN'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 4. Politikaları Yeni Fonksiyonla Güncelle
-- NEWS
DROP POLICY IF EXISTS "force_admin_all_news" ON public.news;
DROP POLICY IF EXISTS "admin_all_news" ON public.news;
CREATE POLICY "admin_all_news" ON public.news FOR ALL TO authenticated USING (public.check_is_admin());

-- EVENTS
DROP POLICY IF EXISTS "force_admin_all_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated USING (public.check_is_admin());

-- GALLERY
DROP POLICY IF EXISTS "force_admin_all_gallery" ON public.gallery;
DROP POLICY IF EXISTS "admin_all_gallery" ON public.gallery;
CREATE POLICY "admin_all_gallery" ON public.gallery FOR ALL TO authenticated USING (public.check_is_admin());

-- VILLAGERS
DROP POLICY IF EXISTS "force_admin_all_villagers" ON public.villagers;
DROP POLICY IF EXISTS "admin_all_villagers" ON public.villagers;
CREATE POLICY "admin_all_villagers" ON public.villagers FOR ALL TO authenticated USING (public.check_is_admin());

-- DONATIONS
DROP POLICY IF EXISTS "force_admin_all_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_all_donations" ON public.donations;
CREATE POLICY "admin_all_donations" ON public.donations FOR ALL TO authenticated USING (public.check_is_admin());

-- 4. Genel Okuma Yetkisi Ver
DROP POLICY IF EXISTS "force_public_read_news" ON public.news;
DROP POLICY IF EXISTS "read_news" ON public.news;
CREATE POLICY "read_news" ON public.news FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_events" ON public.events;
DROP POLICY IF EXISTS "read_events" ON public.events;
CREATE POLICY "read_events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_gallery" ON public.gallery;
DROP POLICY IF EXISTS "read_gallery" ON public.gallery;
CREATE POLICY "read_gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_villagers" ON public.villagers;
DROP POLICY IF EXISTS "read_villagers" ON public.villagers;
CREATE POLICY "read_villagers" ON public.villagers FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_donations" ON public.donations;
DROP POLICY IF EXISTS "read_donations" ON public.donations;
CREATE POLICY "read_donations" ON public.donations FOR SELECT USING (true);

DROP POLICY IF EXISTS "force_public_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "read_profiles" ON public.profiles;
CREATE POLICY "read_profiles" ON public.profiles FOR SELECT USING (true);
