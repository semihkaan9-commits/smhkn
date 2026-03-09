import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvovhwrtalfixyseufsu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(5);
    if (error) {
      console.error('Error selecting profiles:', error);
    } else {
      console.log('Successfully connected and read profiles:', data.length, 'rows found');
      console.log('First 5 profiles:', JSON.stringify(data, null, 2));
    }

    const { data: news, error: newsErr } = await supabase.from('news').select('id').limit(1);
    if (newsErr) console.error('Error selecting news:', newsErr);
    else console.log('Successfully read news table.');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

check();
