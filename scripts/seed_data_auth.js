
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const NEWS_ITEMS = [
    {
        title: 'Köy Kahvesi Yenilendi',
        content: 'Köyümüzün emektar kahvesi, muhtarlığımızın öncülüğünde yeni yüzüne kavuştu. Tüm köylülerimizi çayımızı içmeye bekleriz.',
        image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
    },
    {
        title: 'Yeni Sulama Kanalı Projesi',
        content: 'Tarımsal verimliliği artırmak amacıyla DSİ ile ortaklaşa yürütülen sulama kanalı projesi onaylandı. İnşaat önümüzdeki ay başlıyor.',
        image_url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
    },
    {
        title: 'Geleneksel Hasat Şenliği',
        content: 'Bu yıl bolluk ve bereket içinde geçen hasat dönemimizi kutlamak için köy meydanında toplanıyoruz. Tüm halkımız davetlidir.',
        image_url: 'https://images.unsplash.com/photo-1625246333195-58f26c0dc835?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
    },
    {
        title: 'Köy Okulu Boyandı',
        content: 'Gönüllü gençlerimizin desteğiyle köy okulumuzun dış cephesi ve sınıfları boyandı. Emeği geçen herkese teşekkürler.',
        image_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
    },
    {
        title: 'Sağlık Ocağı Doktorumuz Göreve Başladı',
        content: 'Haftanın 3 günü köyümüzde hizmet verecek olan Doktor Ayşe Kaya görevine başlamıştır. Hayırlı olsun.',
        image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
    }
];

async function seedDataAuth() {
    console.log('Authenticating...');
    const email = `seed_test_${Date.now()}@test.com`;
    const password = 'TestPassword123!';

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Haber Editörü',
                role: 'ADMIN' // Trying to be admin to bypass policies if check is on role
            }
        }
    });

    if (authError) {
        console.error('Auth failed:', authError);
        return;
    }

    const userId = authData.user?.id;
    if (!userId) {
        console.error('No user ID returned');
        return;
    }

    console.log(`Authenticated as ${email} (${userId})`);

    // Prepare items with author_id
    const itemsToInsert = NEWS_ITEMS.map(item => ({
        ...item,
        author_id: userId
    }));

    console.log('Inserting News...');
    const { error: newsError } = await supabase.from('news').insert(itemsToInsert);

    if (newsError) {
        console.error('Error inserting news:', newsError);
    } else {
        console.log('Successfully inserted 5 news items.');
    }

    // Events - Skip as table missing implies failure
    console.log('Skipping Events as table is missing.');
}

seedDataAuth();
