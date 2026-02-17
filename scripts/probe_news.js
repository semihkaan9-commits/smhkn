
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function probeNews() {
    console.log('Probing News table...');
    // Try inserting with string in author_id
    const { error: errorString } = await supabase.from('news').insert([{
        title: 'Probe Test String',
        content: 'Testing author_id type',
        date: new Date().toLocaleDateString('tr-TR'),
        author_id: 'Not a UUID',
        image_url: 'http://test.com/image.jpg'
    }]);

    if (errorString) {
        console.log('Insert with String author_id failed (Expected if UUID):', errorString.message);
    } else {
        console.log('Insert with String author_id SUCCESS (It is a string or text column!)');
        // Clean up
        await supabase.from('news').delete().eq('title', 'Probe Test String');
        return;
    }

    // Try inserting with random UUID
    const randomUUID = '14552554-0610-466d-862a-88151433010c';
    const { error: errorUUID } = await supabase.from('news').insert([{
        title: 'Probe Test UUID',
        content: 'Testing author_id type',
        date: new Date().toLocaleDateString('tr-TR'),
        author_id: randomUUID,
        image_url: 'http://test.com/image.jpg'
    }]);

    if (errorUUID) {
        console.log('Insert with Random UUID failed (Expected if FK constraint):', errorUUID.message);
    } else {
        console.log('Insert with Random UUID SUCCESS (It is a UUID column without strict FK or FK met)');
        // Clean up
        await supabase.from('news').delete().eq('title', 'Probe Test UUID');
    }
}

probeNews();
