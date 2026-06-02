-- Policy to allow villagers to update their own profile
CREATE POLICY "Villagers can update their own profile"
ON public.villagers
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
