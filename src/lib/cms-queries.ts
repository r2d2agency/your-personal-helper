import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getModules = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("cms_modules")
      .select("*")
      .order("menu_order", { ascending: true });

    if (error) throw error;
    return data;
  });

export const getPublicHomeData = createServerFn({ method: "GET" })
  .handler(async () => {
    // 1. Get active home modules
    const { data: modules, error: modError } = await supabase
      .from("cms_modules")
      .select("*")
      .eq("is_active", true)
      .eq("display_in_home", true)
      .order("menu_order", { ascending: true });

    if (modError) throw modError;

    // 2. Fetch data for each module in parallel
    // We only fetch if the module is active in home
    const slugs = modules.map(m => m.slug);
    
    const [
      banners,
      categories,
      kits,
      courses,
      stores,
      faq,
      testimonials
    ] = await Promise.all([
      slugs.includes('banners') ? supabase.from("banners").select("*").eq("is_active", true).order("display_order") : Promise.resolve({ data: [] }),
      slugs.includes('categories') ? supabase.from("categories").select("*").eq("is_active", true).order("display_order") : Promise.resolve({ data: [] }),
      slugs.includes('kits') ? supabase.from("kits").select("*").eq("is_active", true).eq("is_featured", true) : Promise.resolve({ data: [] }),
      slugs.includes('courses') ? supabase.from("courses").select("*").eq("is_active", true).order("event_date") : Promise.resolve({ data: [] }),
      slugs.includes('stores') ? supabase.from("stores").select("*").eq("is_active", true) : Promise.resolve({ data: [] }),
      slugs.includes('faq') ? supabase.from("faq").select("*").eq("is_active", true).order("display_order") : Promise.resolve({ data: [] }),
      slugs.includes('testimonials') ? supabase.from("testimonials").select("*").eq("is_active", true) : Promise.resolve({ data: [] }),
    ]);

    return {
      modules,
      data: {
        banners: banners.data || [],
        categories: categories.data || [],
        kits: kits.data || [],
        courses: courses.data || [],
        stores: stores.data || [],
        faq: faq.data || [],
        testimonials: testimonials.data || [],
      }
    };
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const [
      { count: banners },
      { count: categories },
      { count: kits },
      { count: courses },
      { count: modules }
    ] = await Promise.all([
      supabase.from("banners").select("*", { count: 'exact', head: true }).eq('is_active', true),
      supabase.from("categories").select("*", { count: 'exact', head: true }).eq('is_active', true),
      supabase.from("kits").select("*", { count: 'exact', head: true }).eq('is_active', true),
      supabase.from("courses").select("*", { count: 'exact', head: true }).eq('is_active', true),
      supabase.from("cms_modules").select("*", { count: 'exact', head: true }).eq('is_active', true),
    ]);

    return {
      banners: banners || 0,
      categories: categories || 0,
      kits: kits || 0,
      courses: courses || 0,
      modules: modules || 0,
    };
  });
