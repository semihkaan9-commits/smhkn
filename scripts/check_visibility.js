
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkVisibility() {
    console.log('Attempting to fetch news as Anon...');
    const { data: news, error } = await supabase.from('news').select('*');

    if (error) {
        console.error('Fetch error:', error);
    } else {
        console.log(`Fetched ${news.length} news items.`);
        if (news.length > 0) {
            console.log('Sample item:', news[0]);
        }
    }
}

checkVisibility();
