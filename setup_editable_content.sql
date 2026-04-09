-- Editable Pages and Dynamic Sections Setup Script

-- 1. Create page_content table for all editable strings
CREATE TABLE IF NOT EXISTS page_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes görebilir page_content" ON page_content;
CREATE POLICY "Herkes görebilir page_content" 
ON page_content FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Sadece admin ekleyebilir page_content" ON page_content;
CREATE POLICY "Sadece admin ekleyebilir page_content" 
ON page_content FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin silebilir page_content" ON page_content;
CREATE POLICY "Sadece admin silebilir page_content" 
ON page_content FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin güncelleyebilir page_content" ON page_content;
CREATE POLICY "Sadece admin güncelleyebilir page_content" 
ON page_content FOR UPDATE 
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


-- 2. Create dynamic_sections table for admin created tabs
CREATE TABLE IF NOT EXISTS dynamic_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE dynamic_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes görebilir dynamic_sections" ON dynamic_sections;
CREATE POLICY "Herkes görebilir dynamic_sections" 
ON dynamic_sections FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Sadece admin insert yapabilir dynamic_sections" ON dynamic_sections;
CREATE POLICY "Sadece admin insert yapabilir dynamic_sections" 
ON dynamic_sections FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin silebilir dynamic_sections" ON dynamic_sections;
CREATE POLICY "Sadece admin silebilir dynamic_sections" 
ON dynamic_sections FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND UPPER(profiles.role) = 'ADMIN'
  )
);

DROP POLICY IF EXISTS "Sadece admin güncelleyebilir dynamic_sections" ON dynamic_sections;
CREATE POLICY "Sadece admin güncelleyebilir dynamic_sections" 
ON dynamic_sections FOR UPDATE 
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
