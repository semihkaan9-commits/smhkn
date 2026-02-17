-- Helper function to check if user is admin (Optional but makes policies cleaner)
-- OR just inline the check. Inlining is safer if functions can't be created easily.

-- 1. Events Table Policies
DROP POLICY IF EXISTS "Users can update their own events." ON public.events;
DROP POLICY IF EXISTS "Users can delete their own events." ON public.events;

CREATE POLICY "Users and Admins can update events"
ON public.events FOR UPDATE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

CREATE POLICY "Users and Admins can delete events"
ON public.events FOR DELETE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

-- 2. News Table Policies
-- Assuming similar policies existed or creating new ones
DROP POLICY IF EXISTS "Users can update their own news." ON public.news;
DROP POLICY IF EXISTS "Users can delete their own news." ON public.news;

CREATE POLICY "Users and Admins can update news"
ON public.news FOR UPDATE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

CREATE POLICY "Users and Admins can delete news"
ON public.news FOR DELETE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

-- 3. Gallery Table Policies
DROP POLICY IF EXISTS "Users can update their own gallery items." ON public.gallery;
DROP POLICY IF EXISTS "Users can delete their own gallery items." ON public.gallery;

CREATE POLICY "Users and Admins can update gallery items"
ON public.gallery FOR UPDATE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

CREATE POLICY "Users and Admins can delete gallery items"
ON public.gallery FOR DELETE
USING (
  auth.uid() = author_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

-- 4. Villagers Table Policies
DROP POLICY IF EXISTS "Users can update their own villager profile." ON public.villagers;
DROP POLICY IF EXISTS "Users can delete their own villager profile." ON public.villagers;

CREATE POLICY "Users and Admins can update villager profiles"
ON public.villagers FOR UPDATE
USING (
  auth.uid() = user_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);

CREATE POLICY "Users and Admins can delete villager profiles"
ON public.villagers FOR DELETE
USING (
  auth.uid() = user_id 
  OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
);
