-- Drop existing table if exists
DROP TABLE IF EXISTS public.managers;

-- Create managers table
CREATE TABLE public.managers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    title TEXT NOT NULL,
    phone TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read managers
CREATE POLICY "Enable read access for all users" ON public.managers
    FOR SELECT USING (true);

-- Policy: Allow only admins to insert managers
CREATE POLICY "Admins can insert managers" ON public.managers
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
    );

-- Policy: Allow only admins to update managers
CREATE POLICY "Admins can update managers" ON public.managers
    FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
    );

-- Policy: Allow only admins to delete managers
CREATE POLICY "Admins can delete managers" ON public.managers
    FOR DELETE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) ILIKE 'admin'
    );
