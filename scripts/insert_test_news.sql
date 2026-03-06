-- Insert two random news items directly via SQL
-- Since we know auth.uid() check is on, we'll bypass it for this script by logging in or running as god mode.
-- In Supabase SQL editor, this runs as postgres role, so RLS doesn't block it.

INSERT INTO public.news (title, content, image_url, date)
VALUES 
('Köy Meydanı Yenileme Çalışmaları Başladı', 'Köy meydanımızın parke taşları yenileniyor, ayrıca yeni oturma alanları ve ışıklandırmalar eklenecek. Çalışmaların 2 hafta sürmesi planlanıyor.', 'https://images.unsplash.com/photo-1516086817668-3f5f3e9c2f6d?auto=format&fit=crop&q=80', '2024-03-15'),
('Geleneksel Bahar Şenliği Hazırlıkları', 'Bu yılki bahar şenliğimiz için hazırlıklar tüm hızıyla devam ediyor. Tüm köylülerimizin katılımını bekliyoruz. Detaylı program yakında duyurulacaktır.', 'https://images.unsplash.com/photo-1533174000255-5c026d36e84d?auto=format&fit=crop&q=80', '2024-03-10');

-- Insert into gallery to mimic the behavior
INSERT INTO public.gallery (type, url, caption, date)
VALUES 
('image', 'https://images.unsplash.com/photo-1516086817668-3f5f3e9c2f6d?auto=format&fit=crop&q=80', 'Haber: Köy Meydanı Yenileme Çalışmaları Başladı', '2024-03-15'),
('image', 'https://images.unsplash.com/photo-1533174000255-5c026d36e84d?auto=format&fit=crop&q=80', 'Haber: Geleneksel Bahar Şenliği Hazırlıkları', '2024-03-10');
