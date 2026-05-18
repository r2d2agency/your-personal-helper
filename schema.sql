-- Schema SQL para o PostgreSQL no EasyPanel

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Perfis (necessária para permissões)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'editor'
);

-- Tabela de Módulos CMS
CREATE TABLE IF NOT EXISTS cms_modules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    display_in_menu BOOLEAN DEFAULT true,
    display_in_home BOOLEAN DEFAULT false,
    menu_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Banners
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_cover TEXT,
    whatsapp_message TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

-- Tabela de Cursos
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_cover TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    professor TEXT,
    status TEXT DEFAULT 'em_breve',
    is_active BOOLEAN DEFAULT true
);

-- Tabela de FAQ
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Kits
CREATE TABLE IF NOT EXISTS kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Tabela de Lojas
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    neighborhood TEXT,
    phone TEXT,
    whatsapp TEXT,
    opening_hours TEXT,
    google_map_url TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Tabela de Depoimentos
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cliques de WhatsApp (Analytics)
CREATE TABLE IF NOT EXISTS whatsapp_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT,
    page_origin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Logs de Atividade
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action TEXT NOT NULL,
    module TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir módulos padrão
INSERT INTO cms_modules (name, slug, description, icon, display_in_home, menu_order) VALUES
('Banners', 'banners', 'Gerenciar banners da home', 'Layout', true, 1),
('Categorias', 'categories', 'Gerenciar categorias de produtos', 'Grid', true, 2),
('Kits', 'kits', 'Gerenciar kits de festa', 'Package', true, 3),
('Cursos', 'courses', 'Gerenciar cursos e workshops', 'GraduationCap', true, 4),
('Lojas', 'stores', 'Gerenciar unidades físicas', 'MapPin', true, 5),
('FAQ', 'faq', 'Gerenciar perguntas frequentes', 'HelpCircle', true, 6),
('Depoimentos', 'testimonials', 'Gerenciar depoimentos de clientes', 'MessageSquare', true, 7)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    display_in_home = EXCLUDED.display_in_home,
    menu_order = EXCLUDED.menu_order,
    updated_at = NOW();
