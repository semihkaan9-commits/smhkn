-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  role TEXT DEFAULT 'GUEST' -- 'ADMIN', 'VILLAGER', 'GUEST'
);

-- 3. Function to handle new user creation (Auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'GUEST');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. CRITICAL FIX: Backfill profiles for existing users who might be missing them
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'ADMIN' -- Default existing users to ADMIN for safety in this specific app context
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 6. Grant Admin role to specific email (OPTIONAL - Replace with your email if needed)
-- UPDATE public.profiles SET role = 'ADMIN' WHERE id IN (SELECT id FROM auth.users WHERE email = 'your_email@example.com');


-- 7. ENABLE RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 8. RESET ALL POLICIES (Drop everything first to be clean)

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- NEWS
DROP POLICY IF EXISTS "Public news are viewable by everyone." ON public.news;
DROP POLICY IF EXISTS "Authenticated users can insert news." ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can delete news" ON public.news;
CREATE POLICY "Public news are viewable by everyone." ON public.news FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert news." ON public.news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors and Admins can update news" ON public.news FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Authors and Admins can delete news" ON public.news FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- EVENTS
DROP POLICY IF EXISTS "Public events are viewable by everyone." ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events." ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can delete events" ON public.events;
CREATE POLICY "Public events are viewable by everyone." ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events." ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors and Admins can update events" ON public.events FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Authors and Admins can delete events" ON public.events FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- GALLERY
DROP POLICY IF EXISTS "Public gallery is viewable by everyone." ON public.gallery;
DROP POLICY IF EXISTS "Authenticated users can insert gallery items." ON public.gallery;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery;
CREATE POLICY "Public gallery is viewable by everyone." ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gallery items." ON public.gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete gallery items" ON public.gallery FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- VILLAGERS
DROP POLICY IF EXISTS "Public villagers are viewable by everyone." ON public.villagers;
DROP POLICY IF EXISTS "Users can insert villager profile." ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can update villager profiles" ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can delete villager profiles" ON public.villagers;
CREATE POLICY "Public villagers are viewable by everyone." ON public.villagers FOR SELECT USING (true);
CREATE POLICY "Users can insert villager profile." ON public.villagers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and Admins can update villager profiles" ON public.villagers FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Users and Admins can delete villager profiles" ON public.villagers FOR DELETE USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- DONATIONS
DROP POLICY IF EXISTS "Public donations are viewable by everyone." ON public.donations;
DROP POLICY IF EXISTS "Admins can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can delete donations" ON public.donations;
CREATE POLICY "Public donations are viewable by everyone." ON public.donations FOR SELECT USING (true);
CREATE POLICY "Admins can insert donations" ON public.donations FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Admins can delete donations" ON public.donations FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
