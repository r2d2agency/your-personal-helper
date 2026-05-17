-- Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'editor'
);

-- CMS Modules management
CREATE TABLE public.cms_modules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  display_in_menu BOOLEAN DEFAULT true,
  display_in_home BOOLEAN DEFAULT false,
  menu_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Core tables
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  module TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.whatsapp_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT,
  page_origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modules tables
CREATE TABLE public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image_desktop TEXT,
  image_mobile TEXT,
  button_text TEXT,
  button_link TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_cover TEXT,
  whatsapp_message TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.kits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  theme TEXT,
  description TEXT,
  items_included TEXT[],
  image_cover TEXT,
  fest_type TEXT,
  approx_people INTEGER,
  store_id UUID,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false
);

CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_cover TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  professor TEXT,
  status TEXT DEFAULT 'em_breve', -- em_breve, aberto, encerrado
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  neighborhood TEXT,
  phone TEXT,
  whatsapp TEXT,
  opening_hours TEXT,
  google_map_url TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Insert CMS modules definitions
INSERT INTO public.cms_modules (name, slug, icon) VALUES
('Banners Sazonais', 'banners', 'Image'),
('Categorias', 'categories', 'Grid'),
('Pegue e Monte', 'kits', 'Package'),
('Cursos', 'courses', 'GraduationCap'),
('Lojas', 'stores', 'MapPin'),
('FAQ', 'faq', 'HelpCircle'),
('Depoimentos', 'testimonials', 'MessageSquare');
