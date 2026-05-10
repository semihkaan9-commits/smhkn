-- admin@balcilar.com kullanıcısını ADMIN yapmak için Supabase SQL Editor'de bu kodu çalıştırın:
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@balcilar.com'
);
