CREATE TABLE IF NOT EXISTS dynamic_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES dynamic_sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE dynamic_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes görebilir dynamic_items" ON dynamic_items;
CREATE POLICY "Herkes görebilir dynamic_items" 
ON dynamic_items FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Sadece admin insert yapabilir dynamic_items" ON dynamic_items;
CREATE POLICY "Sadece admin insert yapabilir dynamic_items" 
ON dynamic_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin silebilir dynamic_items" ON dynamic_items;
CREATE POLICY "Sadece admin silebilir dynamic_items" 
ON dynamic_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin güncelleyebilir dynamic_items" ON dynamic_items;
CREATE POLICY "Sadece admin güncelleyebilir dynamic_items" 
ON dynamic_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);
