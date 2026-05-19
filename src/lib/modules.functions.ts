import { createServerFn } from "@tanstack/react-start";
import { query } from "./db";
import { requireAuth } from "./auth.functions";

export const updateModule = createServerFn({ method: "POST" })
  .inputValidator((d: { id: number; patch: Record<string, any> }) => d)
  .handler(async ({ data }) => {
    requireAuth();
    const allowed = ["name", "slug", "description", "icon", "menu_order", "is_active", "display_in_menu", "display_in_home"];
    const entries = Object.entries(data.patch).filter(([k]) => allowed.includes(k));
    if (!entries.length) return { ok: true };
    const setSql = entries.map(([k], i) => `${k} = $${i + 2}`).join(", ");
    const values = entries.map(([, v]) => v);
    await query(`UPDATE cms_modules SET ${setSql}, updated_at = now() WHERE id = $1`, [data.id, ...values]);
    return { ok: true };
  });

export const swapModuleOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { aId: number; aOrder: number; bId: number; bOrder: number }) => d)
  .handler(async ({ data }) => {
    requireAuth();
    await query("UPDATE cms_modules SET menu_order = $1 WHERE id = $2", [data.bOrder, data.aId]);
    await query("UPDATE cms_modules SET menu_order = $1 WHERE id = $2", [data.aOrder, data.bId]);
    return { ok: true };
  });
