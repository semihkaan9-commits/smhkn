-- Add business_card_url column to villagers table if it does not exist
ALTER TABLE public.villagers ADD COLUMN IF NOT EXISTS business_card_url TEXT;
