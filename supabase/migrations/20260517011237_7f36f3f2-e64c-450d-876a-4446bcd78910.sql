-- Fix activity_logs missing policies
CREATE POLICY "Editors can view activity logs" ON public.activity_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Users can insert activity logs" ON public.activity_logs
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- More specific policy for whatsapp_clicks to avoid "Always True" warning
-- Although for public tracking "true" is often intended, we can limit it to authenticated users or just accept the warning if it's truly public.
-- The user said "Registrar cliques de WhatsApp", so it's a public feature. 
-- I'll keep the public insert but try to be as restrictive as possible if needed.
-- Actually, the warning is just a warning. For public tracking, it's correct.

-- Ensure profiles can be created on signup
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
