-- Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    date TEXT, -- Stored as DD.MM.YYYY string in app
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    author_id UUID REFERENCES auth.users(id),
    
    -- Optional: Add constraints
    CONSTRAINT content_length CHECK (char_length(content) > 0)
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Everyone can view events
CREATE POLICY "Public events are viewable by everyone." 
ON public.events FOR SELECT 
USING (true);

-- 2. Authenticated users can insert events (or restrict to ADMIN if needed)
CREATE POLICY "Users can insert their own events." 
ON public.events FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- 3. Users can update/delete their own events (or ADMIN)
CREATE POLICY "Users can update their own events." 
ON public.events FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own events." 
ON public.events FOR DELETE 
USING (auth.uid() = author_id);
