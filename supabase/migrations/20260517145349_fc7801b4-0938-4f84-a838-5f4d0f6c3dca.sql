-- FAQ table
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Public can view active FAQ" ON public.faq FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);

-- Admin policies
CREATE POLICY "Editors can manage FAQ" ON public.faq FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Editors can manage testimonials" ON public.testimonials FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor')));

-- Set modules to be visible on home by default
UPDATE public.cms_modules SET display_in_home = true;
UPDATE public.cms_modules SET display_in_home = false WHERE slug IN ('activity_logs', 'settings');
