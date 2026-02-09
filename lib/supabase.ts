import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing! Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Fallback to avoid crash during initialization if env vars are missing
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);
