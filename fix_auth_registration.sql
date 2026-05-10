-- ==============================================================================
-- DATABASE AUTHENTICATION FIX (RUN THIS IN SUPABASE SQL EDITOR)
-- ==============================================================================
-- Bu dosya, siteye kayit olurken karsilasilan 500 Database Error (Tetikleyici Hatasi) 
-- sorununu cozmek icin hazirlanmistir.
-- ==============================================================================

-- 1. UUID eklentisinin acik oldugundan emin olun.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. profiles tablosunun gereksinimlerini guncelleyelim (Hata payini azaltmak icin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  role TEXT DEFAULT 'GUEST'
);

-- 3. Guvenli Tetikleyici (Trigger) Fonksiyonu
-- Yeni bir kullanici kayit oldugunda onu otomatik olarak profiles tablosuna ekler.
-- Eger rol (role) verilmemisse varsayilan olarak GUEST atar. Eger cift kayit (conflict) 
-- olursa patlamak yerine veriyi gunceller (ON CONFLICT DO UPDATE).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Kullanici'), 
    COALESCE(new.raw_user_meta_data->>'role', 'GUEST')
  )
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Tetikleyiciyi (Trigger) Yeniden Olusturma
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Onceden kaydolup profil tablosunda eksik kalmis kisileri duzeltme (Eger Varsa)
INSERT INTO public.profiles (id, full_name, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'Kullanici'), COALESCE(raw_user_meta_data->>'role', 'GUEST')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Not: Eger halen "Invalid login credentials" (Gecersiz kimlik bilgileri) veya 
-- giris engeli devam ediyorsa, lutfen Supabase projenizde "Authentication -> Email Templates"
-- veya "Authentication -> Providers -> Email" altindaki "Confirm Email" (E-posta Onayi) 
-- seceneginin KAPALI oldugundan emin olun.
