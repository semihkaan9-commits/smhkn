import { createClient } from '@supabase/supabase-js';

// Hardcoded for this script execution to avoid dotenv issues in this environment
// User's .env.local values:
const SUPABASE_URL = 'https://rvovhwrtalfixyseufsu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2b3Zod3J0YWxmaXh5c2V1ZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjQwNDUsImV4cCI6MjA4NjIwMDA0NX0.q3QodQgkCoiLyA9LGTg2bWr01Dc3gsRAUdglmqxDZYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const NEWS_ITEMS = [
    {
        title: 'Köy Kahvesi Yenilendi',
        content: 'Köyümüzün emektar kahvesi, muhtarlığımızın öncülüğünde yeni yüzüne kavuştu. Tüm köylülerimizi çayımızı içmeye bekleriz.',
        imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Muhtar Ahmet Yılmaz'
    },
    {
        title: 'Yeni Sulama Kanalı Projesi',
        content: 'Tarımsal verimliliği artırmak amacıyla DSİ ile ortaklaşa yürütülen sulama kanalı projesi onaylandı. İnşaat önümüzdeki ay başlıyor.',
        imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Köy Meclisi'
    },
    {
        title: 'Geleneksel Hasat Şenliği',
        content: 'Bu yıl bolluk ve bereket içinde geçen hasat dönemimizi kutlamak için köy meydanında toplanıyoruz. Tüm halkımız davetlidir.',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-58f26c0dc835?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Tertip Komitesi'
    },
    {
        title: 'Köy Okulu Boyandı',
        content: 'Gönüllü gençlerimizin desteğiyle köy okulumuzun dış cephesi ve sınıfları boyandı. Emeği geçen herkese teşekkürler.',
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Okul Aile Birliği'
    },
    {
        title: 'Sağlık Ocağı Doktorumuz Göreve Başladı',
        content: 'Haftanın 3 günü köyümüzde hizmet verecek olan Doktor Ayşe Kaya görevine başlamıştır. Hayırlı olsun.',
        imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Muhtar Ahmet Yılmaz'
    }
];

const EVENT_ITEMS = [
    {
        title: 'Bahar Şenliği',
        content: 'Baharın gelişini kutlamak için düzenlediğimiz şenlikte yarışmalar, konserler ve yemek ikramı olacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'), // Display date
        startDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        endDate: new Date(Date.now() + 86400000 * 5 + 7200000).toISOString(), // 2 hours later
        author: 'Köy Gençliği'
    },
    {
        title: 'Köy Hayırı',
        content: 'Geleneksel köy hayırımız Cuma namazı çıkışında cami avlusunda yapılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 10 + 10800000).toISOString(),
        author: 'Muhtarlık'
    },
    {
        title: 'Futbol Turnuvası',
        content: 'Köyler arası futbol turnuvası başlıyor! Takımını kur, turnuvaya katıl.',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade8f55?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        startDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 15 + 7200000).toISOString(),
        author: 'Spor Kulübü'
    },
    {
        title: 'Sağlık Taraması',
        content: 'İlçe Sağlık Müdürlüğü ekipleri tarafından köy meydanında ücretsiz sağlık taraması yapılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        startDate: new Date(Date.now() + 86400000 * 20).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 20 + 14400000).toISOString(),
        author: 'Sağlık Ocağı'
    },
    {
        title: 'Açık Hava Sineması',
        content: 'Yaz akşamlarının vazgeçilmezi açık hava sineması etkinliğimizde "Selvi Boylum Al Yazmalım" filmi gösterilecektir.',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop',
        date: new Date().toLocaleDateString('tr-TR'),
        startDate: new Date(Date.now() + 86400000 * 25).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 25 + 10800000).toISOString(),
        author: 'Kültür Komitesi'
    }
];

async function seedData() {
    console.log('Seeding process started...');

    // Seed News
    console.log('Inserting News...');
    const { error: newsError } = await supabase.from('news').insert(NEWS_ITEMS);
    if (newsError) {
        console.error('Error inserting news:', newsError);
    } else {
        console.log('Successfully inserted 5 news items.');
    }

    // Seed Events
    console.log('Inserting Events...');
    const { error: eventsError } = await supabase.from('events').insert(EVENT_ITEMS);

    if (eventsError) {
        console.error('Error inserting events:', eventsError);
    } else {
        console.log('Successfully inserted 5 event items.');

        // Also insert events into Gallery as per app logic logic
        console.log('Inserting Events into Gallery...');
        const galleryItems = EVENT_ITEMS.map(event => ({
            title: `Etkinlik: ${event.title}`,
            imageUrl: event.imageUrl,
            date: event.date,
            category: 'Etkinlik'
        }));

        const { error: galleryError } = await supabase.from('gallery').insert(galleryItems);
        if (galleryError) {
            console.error('Error inserting gallery items from events:', galleryError);
        } else {
            console.log('Successfully inserted events into gallery.');
        }
    }

    console.log('Seeding process completed.');
}

seedData();
