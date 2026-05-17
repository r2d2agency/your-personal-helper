-- Create the has_role function to avoid recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Update profiles policies
DROP POLICY IF EXISTS "Editors can view all profiles" ON public.profiles;
CREATE POLICY "Editors can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update cms_modules policies
DROP POLICY IF EXISTS "Editors can manage modules" ON public.cms_modules;
CREATE POLICY "Editors can manage modules"
ON public.cms_modules
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update activity_logs policies
DROP POLICY IF EXISTS "Editors can view activity logs" ON public.activity_logs;
CREATE POLICY "Editors can view activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update banners policies
DROP POLICY IF EXISTS "Editors can manage banners" ON public.banners;
CREATE POLICY "Editors can manage banners"
ON public.banners
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update categories policies
DROP POLICY IF EXISTS "Editors can manage categories" ON public.categories;
CREATE POLICY "Editors can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update kits policies
DROP POLICY IF EXISTS "Editors can manage kits" ON public.kits;
CREATE POLICY "Editors can manage kits"
ON public.kits
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update courses policies
DROP POLICY IF EXISTS "Editors can manage courses" ON public.courses;
CREATE POLICY "Editors can manage courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update stores policies
DROP POLICY IF EXISTS "Editors can manage stores" ON public.stores;
CREATE POLICY "Editors can manage stores"
ON public.stores
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update faq policies
DROP POLICY IF EXISTS "Editors can manage FAQ" ON public.faq;
CREATE POLICY "Editors can manage FAQ"
ON public.faq
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update testimonials policies
DROP POLICY IF EXISTS "Editors can manage testimonials" ON public.testimonials;
CREATE POLICY "Editors can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Update whatsapp_clicks policies
DROP POLICY IF EXISTS "Editors can view clicks" ON public.whatsapp_clicks;
CREATE POLICY "Editors can view clicks"
ON public.whatsapp_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
