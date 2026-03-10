import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'C:/Users/semih/Desktop/okul/smhkn-main/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insert into News table...');
  const newNews = {
    title: 'Test Haber Başlığı 1',
    content: 'Bu haber sistem tarafından otomatik olarak test amaçlı eklenmiştir.',
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
    date: new Date().toLocaleDateString('tr-TR'),
    // Note: Trying to insert without an author_id first to see if it allows it (since RLS might be bypassed or failing on uid)
  };

  const { data, error } = await supabase.from('news').insert([newNews]).select();
  
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Insert Success:', data);
  }
}

testInsert();
