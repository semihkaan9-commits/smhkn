
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkGallery() {
    console.log('Checking Gallery table...');
    const { data, error } = await supabase.from('gallery').select('*').limit(1);
    if (error) {
        console.error('Error fetching gallery:', error);
    } else {
        console.log('Gallery table exists. Sample item keys:', data.length > 0 ? Object.keys(data[0]) : 'No items found');
    }
}

checkGallery();
