-- =============================================
-- FIX RLS LINTER ERRORS: ENABLE ROW LEVEL SECURITY
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable RLS for all tables mentioned in the linter report
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villagers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Note: Existing policies like "force_public_read_*" and "force_admin_*" 
-- will now actually take effect.
