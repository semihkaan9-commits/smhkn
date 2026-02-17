-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  role TEXT DEFAULT 'GUEST' -- 'ADMIN', 'VILLAGER', 'GUEST'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. VILLAGERS
CREATE TABLE IF NOT EXISTS public.villagers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  nickname TEXT,
  profession TEXT,
  address TEXT,
  contact TEXT,
  rating NUMERIC DEFAULT 0
);

ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public villagers are viewable by everyone." ON public.villagers;
DROP POLICY IF EXISTS "Users can insert villager profile." ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can update villager profiles" ON public.villagers;
DROP POLICY IF EXISTS "Users and Admins can delete villager profiles" ON public.villagers;

CREATE POLICY "Public villagers are viewable by everyone." ON public.villagers FOR SELECT USING (true);
CREATE POLICY "Users can insert villager profile." ON public.villagers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and Admins can update villager profiles" ON public.villagers FOR UPDATE USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Users and Admins can delete villager profiles" ON public.villagers FOR DELETE USING (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- 3. NEWS
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  date TEXT,
  author_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public news are viewable by everyone." ON public.news;
DROP POLICY IF EXISTS "Authenticated users can insert news." ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can update news" ON public.news;
DROP POLICY IF EXISTS "Authors and Admins can delete news" ON public.news;

CREATE POLICY "Public news are viewable by everyone." ON public.news FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert news." ON public.news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors and Admins can update news" ON public.news FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Authors and Admins can delete news" ON public.news FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- 4. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  date TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public events are viewable by everyone." ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events." ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Authors and Admins can delete events" ON public.events;

-- Clean up potentially conflicting old policies from previous scripts
DROP POLICY IF EXISTS "Users can insert their own events." ON public.events;
DROP POLICY IF EXISTS "Users can update their own events." ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events." ON public.events;

CREATE POLICY "Public events are viewable by everyone." ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events." ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors and Admins can update events" ON public.events FOR UPDATE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Authors and Admins can delete events" ON public.events FOR DELETE USING (auth.uid() = author_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- 5. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT DEFAULT 'image',
  url TEXT NOT NULL,
  caption TEXT,
  date TEXT,
  category TEXT
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public gallery is viewable by everyone." ON public.gallery;
DROP POLICY IF EXISTS "Authenticated users can insert gallery items." ON public.gallery;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery;

CREATE POLICY "Public gallery is viewable by everyone." ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gallery items." ON public.gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete gallery items" ON public.gallery FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');

-- 6. DONATIONS
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  donor_name TEXT,
  amount NUMERIC,
  date TEXT
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public donations are viewable by everyone." ON public.donations;
DROP POLICY IF EXISTS "Admins can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can delete donations" ON public.donations;

CREATE POLICY "Public donations are viewable by everyone." ON public.donations FOR SELECT USING (true);
CREATE POLICY "Admins can insert donations" ON public.donations FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
CREATE POLICY "Admins can delete donations" ON public.donations FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin');
