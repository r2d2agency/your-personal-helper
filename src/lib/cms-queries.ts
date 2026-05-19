import { createServerFn } from "@tanstack/react-start";
import { query } from "./db";

export const getModules = createServerFn({ method: "GET" })
  .handler(async () => {
    const { rows } = await query(
      "SELECT * FROM cms_modules ORDER BY menu_order ASC"
    );
    return rows;
  });

export const getPublicHomeData = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      // 1. Get active home modules
      const { rows: modules } = await query(
        "SELECT * FROM cms_modules WHERE is_active = true AND display_in_home = true ORDER BY menu_order ASC"
      );

      // 2. Fetch data for each module
      const slugs = modules.map(m => m.slug);
      
      const banners = slugs.includes('banners') ? (await query("SELECT * FROM banners WHERE is_active = true ORDER BY display_order")).rows : [];
      const categories = slugs.includes('categories') ? (await query("SELECT * FROM categories WHERE is_active = true ORDER BY display_order")).rows : [];
      const kits = slugs.includes('kits') ? (await query("SELECT * FROM kits WHERE is_active = true AND is_featured = true")).rows : [];
      const courses = slugs.includes('courses') ? (await query("SELECT * FROM courses WHERE is_active = true ORDER BY event_date")).rows : [];
      const stores = slugs.includes('stores') ? (await query("SELECT * FROM stores WHERE is_active = true")).rows : [];
      const faq = slugs.includes('faq') ? (await query("SELECT * FROM faq WHERE is_active = true ORDER BY display_order")).rows : [];
      const testimonials = slugs.includes('testimonials') ? (await query("SELECT * FROM testimonials WHERE is_active = true")).rows : [];

      return {
        modules,
        data: {
          banners,
          categories,
          kits,
          courses,
          stores,
          faq,
          testimonials,
        }
      };
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
      return {
        modules: [],
        data: {
          banners: [],
          categories: [],
          kits: [],
          courses: [],
          stores: [],
          faq: [],
          testimonials: [],
        }
      };
    }
  });

export const getStats = createServerFn({ method: "GET" })
  .handler(async () => {
    // Simple count queries
    const banners = (await query("SELECT COUNT(*) FROM banners WHERE is_active = true")).rows[0].count;
    const categories = (await query("SELECT COUNT(*) FROM categories WHERE is_active = true")).rows[0].count;
    const kits = (await query("SELECT COUNT(*) FROM kits WHERE is_active = true")).rows[0].count;
    const courses = (await query("SELECT COUNT(*) FROM courses WHERE is_active = true")).rows[0].count;
    const modules = (await query("SELECT COUNT(*) FROM cms_modules WHERE is_active = true")).rows[0].count;

    return {
      banners: parseInt(banners) || 0,
      categories: parseInt(categories) || 0,
      kits: parseInt(kits) || 0,
      courses: parseInt(courses) || 0,
      modules: parseInt(modules) || 0,
    };
  });
