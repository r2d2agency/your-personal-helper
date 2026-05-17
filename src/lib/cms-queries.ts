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
