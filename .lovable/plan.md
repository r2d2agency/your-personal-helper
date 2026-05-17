# Modular CMS System for Basmar Doces

## Core Infrastructure
1.  **Database Migration**: Create core tables:
    *   `profiles`: User profiles (linking auth.uid to application-specific user info).
    *   `system_settings`: Global CMS settings.
    *   `activity_logs`: CMS activity tracking.
    *   `whatsapp_clicks`: Click tracking.
    *   `cms_modules`: Definition of available CMS modules (active/inactive status).
    *   Tables for each module (banners, histories, categories, kits, courses, partners, stores, testimonials, faqs, custom_pages).
2.  **Auth Setup**: Enable email/password and Google auth.
3.  **Core Components**: Sidebar, Header, and CMS Module Manager.
4.  **Admin UI**:
    *   Layout: Sidebar with dynamic links based on active modules.
    *   Dashboard: Summary stats.
    *   Module Manager: Toggle module availability.
    *   CRUD interfaces for the requested 11 modules.
5.  **Public UI**:
    *   Home Page: Dynamic layout based on active modules (hero banner, kits, etc.).
    *   Dynamic pages (e.g., individual Kit page, Course detail).
6.  **WhatsApp Integration**: Tracking click utility and link formatting.

## Technical Details
- **Database**: PostgreSQL (via Supabase).
- **Backend**: TanStack Server Functions (createServerFn).
- **Frontend**: TanStack React, Tailwind CSS, Shadcn UI components.
- **CMS Control**: A `cms_modules` table with `is_active`, `order`, etc., to dynamically render admin and public UI elements.
- **WhatsApp Tracking**: A server-side RPC or API route to log clicks (`whatsapp_clicks` table).

## Implementation Order
1.  Run migration for the database schema.
2.  Set up Authentication.
3.  Build Core Module Management.
4.  Build individual module CRUD interfaces (starting with banners and categories).
5.  Build public dynamic layout components.
