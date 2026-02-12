
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
    console.log('Checking News table...');
    const { data: news, error: newsError } = await supabase.from('news').select('*').limit(1);
    if (newsError) {
        console.error('Error fetching news:', newsError);
    } else {
        console.log('News table exists. Sample item keys:', news.length > 0 ? Object.keys(news[0]) : 'No items found');
    }

    console.log('Checking Events table...');
    const { data: events, error: eventsError } = await supabase.from('events').select('*').limit(1);
    if (eventsError) {
        console.error('Error fetching events:', eventsError);
    } else {
        console.log('Events table exists. Sample item keys:', events.length > 0 ? Object.keys(events[0]) : 'No items found');
    }
}

checkSchema();
