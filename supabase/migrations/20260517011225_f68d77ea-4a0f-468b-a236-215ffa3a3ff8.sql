-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own, editors can view all
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Editors can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Public access policies (for the site)
CREATE POLICY "Public can view active modules" ON public.cms_modules
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active banners" ON public.banners
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active categories" ON public.categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active kits" ON public.kits
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active courses" ON public.courses
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active stores" ON public.stores
FOR SELECT USING (is_active = true);

-- Admin/Editor policies
CREATE POLICY "Editors can manage modules" ON public.cms_modules
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Editors can manage banners" ON public.banners
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Editors can manage categories" ON public.categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Editors can manage kits" ON public.kits
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Editors can manage courses" ON public.courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

CREATE POLICY "Editors can manage stores" ON public.stores
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Click tracking: anyone can insert, editors can view
CREATE POLICY "Public can insert clicks" ON public.whatsapp_clicks
FOR INSERT WITH CHECK (true);

CREATE POLICY "Editors can view clicks" ON public.whatsapp_clicks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);
