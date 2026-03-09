-- =============================================
-- ATOMIC PERMISSION FIX (MEGA-ADMIN)
-- =============================================
-- Bu script "Yetki Yok" hatasını KESİN olarak çözer.
-- Supabase SQL Editor kısmında tamamını kopyalayıp çalıştırın.

-- 1. ADMİN KONTROL FONKSİYONUNU GÜNCELLE (Daha esnek ve güvenli)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  current_user_email text;
  user_role text;
BEGIN
  -- Email kontrolü (JWT'den al)
  current_user_email := auth.jwt() ->> 'email';
  
  -- 1. Yöntem: Kritik yönetici emaili kontrolü (En sağlam)
  IF current_user_email = 'mbalci@ktun.edu.tr' THEN
    RETURN true;
  END IF;

  -- 2. Yöntem: Profiles tablosundaki rol kontrolü (BÜYÜK/küçük harf duyarsız)
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  IF user_role ILIKE 'ADMIN' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TÜM ESKİ POLİTİKALARI SİL (Temiz bir başlangıç için)
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename); 
    END LOOP; 
END $$;

-- 3. RLS'LERİN AKTİF OLDUĞUNDAN EMİN OL
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 4. YENİ TEMİZ POLİTİKALARI OLUŞTUR

-- HERKES OKUYABİLİR (SELECT)
CREATE POLICY "public_read_all_profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "public_read_all_news" ON public.news FOR SELECT USING (true);
CREATE POLICY "public_read_all_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "public_read_all_gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "public_read_all_villagers" ON public.villagers FOR SELECT USING (true);
CREATE POLICY "public_read_all_donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "public_read_all_ads" ON public.ads FOR SELECT USING (true);

-- ADMİNLER HER ŞEYİ YAPABİLİR (ALL)
CREATE POLICY "admin_master_news" ON public.news FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_events" ON public.events FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_gallery" ON public.gallery FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_villagers" ON public.villagers FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_donations" ON public.donations FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "admin_master_ads" ON public.ads FOR ALL TO authenticated USING (public.is_admin());

-- KULLANICILAR KENDİ PROFİLLERİNİ/VİLLAGER KAYITLARINI GÜNCELLEYEBİLİR
CREATE POLICY "user_update_self_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "user_manage_self_villager" ON public.villagers FOR ALL TO authenticated USING (auth.uid() = user_id);

-- 5. MEHMET BALCI HESABINI ADMİN OLARAK İŞARETLE
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'ADMIN'
FROM auth.users
WHERE email = 'mbalci@ktun.edu.tr'
ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';

-- 6. ADS TABLOSUNA VARSAYILANLARI EKLE (Eğer yoksa)
INSERT INTO public.ads (area, url, link)
VALUES 
    ('top', null, null),
    ('bottomA', null, null),
    ('hero', null, null)
ON CONFLICT (area) DO NOTHING;
