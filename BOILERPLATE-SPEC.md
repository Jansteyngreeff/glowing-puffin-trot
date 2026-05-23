# BOILERPLATE-SPEC.md — Reusable Application Foundation

> **Abstract**: This document decouples the structural engine from the business logic of the GE Construction platform, producing a reusable boilerplate specification for building production-grade React + Supabase applications. Everything described here is framework-agnostic with respect to business domain — swap the content, keep the architecture.

---

## 1. Boilerplate Core Architecture

### Foundational Stack

| Layer | Technology | Role in Boilerplate |
|-------|-----------|---------------------|
| **Runtime** | React 19 + TypeScript | Component-based UI with strict type safety. The entire application layer — from routing to data fetching — is built on React's compositional model. |
| **Build System** | Vite 8 + `@vitejs/plugin-react-swc` | Near-instant HMR, optimized production builds, and native ESM. The `dyad-component-tagger` plugin is development-only and can be stripped for non-Dyad environments. |
| **Routing** | React Router v6 (BrowserRouter) | Declarative client-side routing with nested route trees. The boilerplate enforces a strict two-tree pattern: public routes (with header/footer shell) and admin routes (with sidebar shell), each wrapped in their own layout providers. |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui (Radix UI) | Utility-first CSS for rapid, consistent styling. shadcn/ui provides accessible, unstyled primitives that are copied into the project (not imported as a dependency), making them fully customizable. The `tailwindcss-animate` plugin enables animation utilities. |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) | Full backend-as-a-service. The boilerplate treats Supabase as the single source of truth for data, authentication, file storage, and serverless compute. No separate backend server is needed. |
| **State Management** | TanStack React Query v5 | Server state management with automatic caching, background refetching, optimistic updates, and cache invalidation. The boilerplate enforces a strict rule: all server data goes through React Query, never raw `useEffect` + `fetch`. |
| **Client State** | React Context + `useState` | Application-level state (auth session, feature flags, configuration) lives in Context providers. Form state is managed locally with `useState`. No external client-state library (Redux, Zustand, Jotai) is needed. |
| **Rich Text** | TipTap 3 + StarterKit + Image extension | WYSIWYG editor for any content management needs. Pre-configured with a full toolbar (headings, bold, italic, lists, blockquotes, code, images, undo/redo). |
| **File Upload** | react-dropzone + Supabase Storage | Drag-and-drop file upload with direct-to-storage integration. The pattern is: drop file → upload to Supabase Storage bucket → store public URL in database. |
| **SEO** | react-helmet-async | Dynamic `<head>` management. The boilerplate pattern is: fetch SEO settings from database per-page → inject via `<Helmet>`. |
| **Validation** | Zod | Schema validation for forms and API responses. Used alongside react-hook-form for type-safe form handling. |

### Why This Combination Works as a Template

1. **Zero backend server to maintain**: Supabase handles auth, database, storage, and serverless functions. A single developer can ship a full-stack application without managing infrastructure.

2. **Strict architectural conventions**: The two-route-tree pattern (public vs admin), the React Query data-fetching mandate, and the Context-based config providers mean every new feature follows the same predictable structure. An AI or developer always knows where new code belongs.

3. **Type safety end-to-end**: TypeScript on the frontend, PostgreSQL with strict schemas on the backend, and Zod for runtime validation at the boundary. Errors are caught at compile time or validation time, never silently at runtime.

4. **Content management out of the box**: TipTap editor + image upload + draft/publish workflow + SEO fields = a complete CMS that can manage content for any domain, not just construction.

5. **Analytics-agnostic tracking**: The analytics system reads configuration from the database (not hardcoded), so any tracking provider can be swapped in by changing the context provider and script injection component.

6. **Mobile-first by default**: Tailwind's responsive utilities and the hamburger menu pattern mean every new screen works on mobile without extra effort.

---

## 2. The "Clean Slate" Blueprint

### Permanent Skeleton (Keep These Files)

These files form the structural backbone of the boilerplate. They contain no business logic and should be preserved in every new project.

```
├── Configuration & Build
│   ├── vite.config.ts              # Vite config with path aliases, plugins
│   ├── tailwind.config.ts          # Tailwind theme, colors, animations
│   ├── tsconfig.json               # TypeScript base config
│   ├── tsconfig.app.json           # App-specific TS config
│   ├── tsconfig.node.json          # Node/Script TS config
│   ├── postcss.config.js           # PostCSS with Tailwind + Autoprefixer
│   ├── components.json             # shadcn/ui configuration
│   ├── eslint.config.js            # ESLint rules
│   ├── vercel.json                 # SPA rewrite rules for deployment
│   ├── .gitignore                  # Standard ignores
│   └── index.html                  # Entry HTML with root div, meta tags
│
├── Core Application
│   ├── src/main.tsx                # React entry point (renders <App />)
│   ├── src/App.tsx                 # Root component with route definitions
│   ├── src/App.css                 # Minimal app-level overrides
│   ├── src/globals.css             # Global styles, Tailwind, CSS variables, fonts
│   └── src/vite-env.d.ts           # Vite type declarations
│
├── Path Aliases & Utilities
│   ├── src/lib/
│   │   ├── supabase.ts             # Supabase client singleton (URL + key from env)
│   │   └── utils.ts                # Utility functions (cn for class merging)
│   │
│   ├── src/hooks/
│   │   ├── use-mobile.tsx          # Mobile breakpoint detection hook
│   │   └── use-toast.ts            # Toast notification hook (shadcn)
│   │
│   └── src/utils/
│       └── toast.ts                # Toast helper utilities (showSuccess, showError)
│
├── Context Providers
│   ├── src/contexts/
│   │   ├── AuthContext.tsx         # Supabase auth: session, user, signIn, signOut
│   │   └── AnalyticsContext.tsx    # Fetches tracking config from database
│   │
│   └── src/components/
│       ├── AnalyticsScripts.tsx    # Tracking script injection (FB Pixel, GA4, etc.)
│       └── SeoHead.tsx             # SEO head component (placeholder/null)
│
├── UI Component Library
│   └── src/components/ui/          # ALL shadcn/ui components (40+ files)
│       ├── accordion.tsx           # Accordion
│       ├── alert.tsx               # Alert
│       ├── alert-dialog.tsx        # Alert Dialog
│       ├── aspect-ratio.tsx        # Aspect Ratio
│       ├── avatar.tsx              # Avatar
│       ├── badge.tsx               # Badge
│       ├── breadcrumb.tsx          # Breadcrumb
│       ├── button.tsx              # Button
│       ├── calendar.tsx            # Calendar
│       ├── card.tsx                # Card
│       ├── carousel.tsx            # Carousel
│       ├── chart.tsx               # Chart (Recharts wrapper)
│       ├── checkbox.tsx            # Checkbox
│       ├── collapsible.tsx         # Collapsible
│       ├── command.tsx             # Command palette
│       ├── context-menu.tsx        # Context Menu
│       ├── dialog.tsx              # Dialog/Modal
│       ├── drawer.tsx              # Drawer
│       ├── dropdown-menu.tsx       # Dropdown Menu
│       ├── form.tsx                # Form (react-hook-form integration)
│       ├── hover-card.tsx          # Hover Card
│       ├── input.tsx               # Input
│       ├── input-otp.tsx           # OTP Input
│       ├── label.tsx               # Label
│       ├── menubar.tsx             # Menubar
│       ├── navigation-menu.tsx     # Navigation Menu
│       ├── pagination.tsx          # Pagination
│       ├── popover.tsx             # Popover
│       ├── progress.tsx            # Progress Bar
│       ├── radio-group.tsx         # Radio Group
│       ├── resizable.tsx           # Resizable Panels
│       ├── scroll-area.tsx         # Scroll Area
│       ├── select.tsx              # Select
│       ├── separator.tsx           # Separator
│       ├── sheet.tsx               # Sheet
│       ├── sidebar.tsx             # Sidebar
│       ├── skeleton.tsx            # Skeleton Loader
│       ├── slider.tsx              # Slider
│       ├── sonner.tsx              # Sonner Toast
│       ├── switch.tsx              # Switch/Toggle
│       ├── table.tsx               # Table
│       ├── tabs.tsx                # Tabs
│       ├── textarea.tsx            # Textarea
│       ├── toast.tsx               # Toast
│       ├── toaster.tsx             # Toaster
│       ├── toggle.tsx              # Toggle
│       ├── toggle-group.tsx        # Toggle Group
│       ├── tooltip.tsx             # Tooltip
│       └── use-toast.ts            # Toast hook
│
├── Admin Infrastructure
│   ├── src/components/admin/
│   │   ├── AdminLayout.tsx         # Admin shell: sidebar + header + <Outlet />
│   │   ├── ProtectedRoute.tsx      # Auth guard: redirects to login if no session
│   │   ├── Sidebar.tsx             # Admin navigation sidebar with nav items
│   │   ├── RichTextEditor.tsx      # TipTap WYSIWYG editor with toolbar
│   │   └── ImageUploader.tsx       # Drag-and-drop image upload to Supabase Storage
│   │
│   └── src/pages/admin/
│       ├── Login.tsx               # Login page with email/password form
│       └── Dashboard.tsx           # Dashboard with stats cards + recent activity
│
└── Public Shell
    ├── src/components/
    │   ├── Header.tsx              # Public header with logo, nav, mobile menu
    │   └── Footer.tsx              # Public footer with links, contact info
    │
    └── src/pages/
        └── NotFound.tsx            # 404 page
```

### Wipe-Clean Folders (Replace for New Project)

These folders contain domain-specific business logic. When starting a new project, delete everything inside and rebuild from scratch.

```
├── src/pages/
│   ├── Index.tsx                   # → Replace with new homepage
│   ├── Services.tsx                # → Replace with new public pages
│   ├── Blog.tsx                    # → Replace or remove
│   ├── BlogPost.tsx                # → Replace or remove
│   ├── Reviews.tsx                 # → Replace or remove
│   ├── Contact.tsx                 # → Replace with new contact/lead page
│   └── admin/
│       ├── BusinessDetails.tsx     # → Replace with new admin config page
│       ├── SeoSettings.tsx         # → Keep structure, update page slugs
│       ├── Analytics.tsx           # → Keep structure, update providers
│       ├── BlogList.tsx            # → Replace or remove
│       ├── BlogEditor.tsx          # → Replace or remove
│       └── ReviewManager.tsx       # → Replace or remove
│
├── src/components/
│   ├── HeroSection.tsx             # → Replace with new hero
│   ├── ServicesPreview.tsx         # → Replace with new feature cards
│   ├── TestimonialsPreview.tsx     # → Replace with new social proof
│   ├── TrustSignals.tsx            # → Replace with new stats/metrics
│   └── made-with-dyad.tsx          # → Remove (Dyad-specific)
│
├── public/
│   ├── ge-construction-logo.png    # → Replace with new brand assets
│   ├── favicon.png                 # → Replace with new favicon
│   ├── placeholder.svg             # → Keep or replace
│   ├── sitemap.xml                 # → Regenerate for new routes
│   └── robots.txt                  # → Update sitemap URL
│
├── scripts/
│   └── generate-sitemap.ts         # → Update BASE_URL and static pages
│
└── supabase/
    └── functions/
        └── regenerate-sitemap/     # → Update BASE_URL and static pages
```

### Files Requiring Surgical Updates

These skeleton files need targeted edits (not full rewrites) when starting a new project:

| File | What to Change |
|------|---------------|
| `src/App.tsx` | Update route definitions, page imports, layout wrappers |
| `src/globals.css` | Update color system (CSS variables), font imports |
| `src/lib/supabase.ts` | Update Supabase URL and anon key (or env var names) |
| `src/components/Header.tsx` | Update nav links, logo, brand name |
| `src/components/Footer.tsx` | Update links, brand info, social links |
| `src/components/admin/Sidebar.tsx` | Update nav items to match new admin pages |
| `src/components/admin/AdminLayout.tsx` | Update `getPageTitle()` route-to-title mapping |
| `index.html` | Update `<title>`, `<meta description>`, favicon paths |
| `src/pages/admin/SeoSettings.tsx` | Update `pages` array to match new public routes |
| `scripts/generate-sitemap.ts` | Update `BASE_URL` and `staticPages` array |
| `supabase/functions/regenerate-sitemap/index.ts` | Update `BASE_URL` and `staticPages` array |

---

## 3. Pre-Baked Modules & Features

The following modules are fully built, tested, and ready to reuse in any new project. They require zero code changes — only configuration.

### 3.1 Authentication System

**Files**: `src/contexts/AuthContext.tsx`, `src/pages/admin/Login.tsx`, `src/components/admin/ProtectedRoute.tsx`

**What it provides**:
- Email/password authentication via Supabase Auth
- Session persistence across page refreshes (Supabase token refresh)
- `useAuth()` hook exposing: `session`, `user`, `loading`, `signIn()`, `signOut()`
- `ProtectedRoute` component that redirects unauthenticated users to `/admin/login`
- Auto-redirect authenticated users away from login page

**How to reuse**: Zero changes needed. Just ensure the `profiles` table and `on_auth_user_created` trigger exist in the new Supabase project (see Section 4).

### 3.2 Admin Shell & Navigation

**Files**: `src/components/admin/AdminLayout.tsx`, `src/components/admin/Sidebar.tsx`

**What it provides**:
- Responsive sidebar navigation (collapsible on mobile with overlay)
- Header with page title, notification bell, user email display
- `<Outlet />` for nested route content
- `getPageTitle()` function mapping routes to display titles
- Sign-out button in sidebar footer

**How to reuse**: Update the `navItems` array in `Sidebar.tsx` and the `getPageTitle()` switch in `AdminLayout.tsx` to match new admin pages.

### 3.3 Rich Text Editor

**Files**: `src/components/admin/RichTextEditor.tsx`

**What it provides**:
- Full TipTap WYSIWYG editor with toolbar
- Formatting: bold, italic, code, headings (H1/H2/H3), bullet list, ordered list, blockquote
- Media: image insertion via URL prompt, link insertion via URL prompt
- History: undo/redo
- Styled output with Tailwind prose classes
- `content` prop (HTML string) and `onChange` callback (returns HTML string)

**How to reuse**: Import and use in any form that needs rich text input. Zero configuration needed.

### 3.4 Image Upload System

**Files**: `src/components/admin/ImageUploader.tsx`

**What it provides**:
- Drag-and-drop file upload via react-dropzone
- Direct upload to Supabase Storage bucket (`blog-images`)
- Image preview with remove button
- Fallback URL input for pasting image URLs
- Loading spinner during upload
- `value` prop (URL string) and `onChange` callback

**How to reuse**: Change the Supabase Storage bucket name in the `onDrop` function. Everything else is generic.

### 3.5 Analytics Integration

**Files**: `src/contexts/AnalyticsContext.tsx`, `src/components/AnalyticsScripts.tsx`

**What it provides**:
- Database-driven analytics configuration (no hardcoded tracking IDs)
- Master enable/disable toggle
- Facebook Pixel: PageView + custom events
- Google Analytics 4: page views via gtag.js + custom events
- `trackFbEvent(eventName, params)` and `trackGaEvent(eventName, params)` global helper functions
- Automatic outbound link click tracking (GA4)
- Settings fetched once and cached via React Query

**How to reuse**: The `analytics_settings` table schema is generic. Add new tracking providers by extending the context provider and script injection component. The `trackFbEvent`/`trackGaEvent` pattern can be replicated for any new provider.

### 3.6 SEO Management

**Files**: `src/pages/admin/SeoSettings.tsx`, `src/components/SeoHead.tsx`

**What it provides**:
- Per-page SEO configuration stored in database
- Fields: meta title, meta description, OG title, OG description, OG image, favicon
- Character counters for meta title (60) and description (160)
- Google Search preview rendering
- Social Media preview rendering
- Tab-based page selector

**How to reuse**: Update the `pages` array in `SeoSettings.tsx` to match new public routes. The `seo_settings` table schema is generic.

### 3.7 Sitemap Generation

**Files**: `scripts/generate-sitemap.ts`, `supabase/functions/regenerate-sitemap/index.ts`, `src/utils/sitemap.ts`

**What it provides**:
- Build-time sitemap generation (runs before `vite build`)
- Runtime sitemap regeneration via Supabase Edge Function
- Static pages + dynamic blog posts
- Proper `<lastmod>`, `<changefreq>`, and `<priority>` tags
- `regenerateSitemap()` client-side utility

**How to reuse**: Update `BASE_URL` and `staticPages` array in both the build script and edge function. The dynamic post-fetching logic can be adapted for any content type.

### 3.8 UI Component Library

**Files**: `src/components/ui/` (40+ shadcn/ui components)

**What it provides**:
- Complete set of accessible, customizable UI components
- All built on Radix UI primitives (accessible by default)
- Styled with Tailwind CSS (fully themeable via CSS variables)
- Includes: buttons, cards, dialogs, forms, tables, tabs, toasts, navigation, and more

**How to reuse**: These are permanent. Never edit them — create wrapper components if customization is needed.

### 3.9 Toast Notification System

**Files**: `src/utils/toast.ts`, `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`, `src/components/ui/sonner.tsx`

**What it provides**:
- `showSuccess(message)`, `showError(message)`, `showLoading(message)`, `dismissToast(id)` helpers
- Both shadcn/ui toast and Sonner toast systems installed
- Toaster components rendered at the root level in `App.tsx`

**How to reuse**: Call the helper functions from anywhere. Zero configuration.

### 3.10 Responsive Design System

**Files**: `src/hooks/use-mobile.tsx`, `src/globals.css`

**What it provides**:
- `useIsMobile()` hook with 768px breakpoint
- Mobile-first Tailwind classes used throughout
- Hamburger menu pattern in `Header.tsx`
- Responsive grid patterns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Container pattern: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

**How to reuse**: Follow the existing patterns. The breakpoint and container standards are already established.

---

## 4. Environment & Database Provisioning Guide

### 4.1 Environment Variables

Create a `.env.local` file:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The fallback values in `src/lib/supabase.ts` should be updated to point to the new Supabase project or removed entirely to enforce explicit configuration.

### 4.2 Supabase Project Setup

1. Create a new Supabase project at https://supabase.com/dashboard
2. Copy the project URL and anon key into `.env.local`
3. Enable Email provider in Authentication → Providers (disable email confirmations for simplicity, or configure SMTP)
4. Create the following storage buckets:

| Bucket | Public | Purpose |
|--------|--------|---------|
| `blog-images` | Yes | Content images (or rename for your domain) |
| `public-assets` | Yes | Sitemap, favicon, global assets |

### 4.3 Database Tables

Execute the following SQL in the Supabase SQL Editor. This creates the core boilerplate tables with proper RLS policies.

```sql
-- =============================================
-- 1. PROFILES TABLE (User profiles for auth)
-- =============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. BUSINESS DETAILS TABLE (Company info)
-- =============================================
CREATE TABLE public.business_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'Your Company',
  tagline TEXT NOT NULL DEFAULT 'Your Tagline',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  service_area TEXT NOT NULL DEFAULT '',
  business_hours JSONB DEFAULT '{
    "monday": {"open": "08:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "08:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "08:00", "close": "17:00", "closed": false},
    "thursday": {"open": "08:00", "close": "17:00", "closed": false},
    "friday": {"open": "08:00", "close": "17:00", "closed": false},
    "saturday": {"open": "09:00", "close": "13:00", "closed": false},
    "sunday": {"open": "00:00", "close": "00:00", "closed": true}
  }'::jsonb,
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '/logo.png',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.business_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_details_select_anon" ON public.business_details
  FOR SELECT USING (true);
CREATE POLICY "business_details_all_auth" ON public.business_details
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default row
INSERT INTO public.business_details (company_name, tagline) VALUES ('Your Company', 'Your Tagline');

-- =============================================
-- 3. SEO SETTINGS TABLE (Per-page SEO)
-- =============================================
CREATE TABLE public.seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  og_title TEXT NOT NULL DEFAULT '',
  og_description TEXT NOT NULL DEFAULT '',
  og_image_url TEXT NOT NULL DEFAULT '',
  favicon_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seo_settings_select_anon" ON public.seo_settings
  FOR SELECT USING (true);
CREATE POLICY "seo_settings_all_auth" ON public.seo_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default rows for each public page
INSERT INTO public.seo_settings (page_slug, meta_title, meta_description) VALUES
  ('home', 'Your Company | Your Tagline', 'Welcome to Your Company.'),
  ('services', 'Services | Your Company', 'Explore our services.'),
  ('blog', 'Blog | Your Company', 'Read our latest articles.'),
  ('reviews', 'Reviews | Your Company', 'See what our clients say.'),
  ('contact', 'Contact Us | Your Company', 'Get in touch with us.');

-- =============================================
-- 4. ANALYTICS SETTINGS TABLE (Tracking config)
-- =============================================
CREATE TABLE public.analytics_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_pixel_id TEXT,
  ga4_measurement_id TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_select_policy" ON public.analytics_settings
  FOR SELECT USING (true);
CREATE POLICY "analytics_insert_policy" ON public.analytics_settings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_update_policy" ON public.analytics_settings
  FOR UPDATE USING (true);
CREATE POLICY "analytics_delete_policy" ON public.analytics_settings
  FOR DELETE USING (true);

-- Insert default row
INSERT INTO public.analytics_settings (is_enabled) VALUES (false);

-- =============================================
-- 5. CONTENT TABLES (Blog / Reviews / etc.)
-- =============================================
-- These are domain-specific. Create your own tables here.
-- The boilerplate provides the admin UI patterns for:
--   - Content CRUD with TipTap editor
--   - Draft/publish workflow
--   - Image upload
--   - SEO fields
--   - Approval/rejection workflow
--
-- Reference the existing blog_posts, blog_categories, and reviews
-- tables in AI-CONTEXT.md for schema patterns.
```

### 4.4 Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" and create the admin account with email/password
3. The `on_auth_user_created` trigger will automatically create a profile record

### 4.5 Verify Installation

```bash
npm run dev
```

- Public site should load at `http://localhost:8080`
- Admin login should work at `http://localhost:8080/admin/login`
- Dashboard should show after authentication

---

## 5. Prompt Guide for Future AI Projects

The following is a master system instruction to give to an AI in a brand new project window. It instructs the AI to use this boilerplate structure to build a completely different application from scratch.

---

### MASTER SYSTEM PROMPT

```
You are an AI application builder working from a production-grade boilerplate foundation. Your job is to build a complete, fully functional application by leveraging the existing structural engine while replacing all domain-specific business logic with the new application's requirements.

## BOILERPLATE FOUNDATION

The project you're working with is built on the following stack:
- **Frontend**: React 19 + TypeScript + Vite 8
- **Routing**: React Router v6 (BrowserRouter) with nested routes
- **Styling**: Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: TanStack React Query v5 for server state, React Context for app state
- **Rich Text**: TipTap 3 editor with image support
- **File Upload**: react-dropzone + Supabase Storage
- **SEO**: react-helmet-async with database-driven meta tags
- **Analytics**: Database-driven tracking configuration (FB Pixel + GA4)

## ARCHITECTURAL RULES (NEVER VIOLATE)

1. **Two-Route-Tree Pattern**: Public routes use Header/Footer shell. Admin routes use Sidebar/AdminLayout shell. These are separate route trees in `src/App.tsx`.

2. **React Query Mandate**: ALL server data fetching MUST use `useQuery`. ALL server writes MUST use `useMutation` with `queryClient.invalidateQueries()` in `onSuccess`. NEVER use raw `useEffect` + `fetch` for server data.

3. **Supabase Client**: ALWAYS import from `@/lib/supabase`. NEVER create a new Supabase client instance.

4. **Path Aliases**: Use `@/` for all imports from `src/`. Configured in both tsconfig and vite.config.ts.

5. **Component Size**: Keep components under 100 lines. Split into separate files when they grow larger. Create a new file for every new component, no matter how small.

6. **File Locations**:
   - Pages → `src/pages/` (public) or `src/pages/admin/` (admin)
   - Reusable components → `src/components/`
   - Admin components → `src/components/admin/`
   - UI primitives → `src/components/ui/` (NEVER EDIT THESE)
   - Hooks → `src/hooks/`
   - Contexts → `src/contexts/`
   - Utilities → `src/utils/` or `src/lib/`
   - Database scripts → `scripts/`
   - Edge functions → `supabase/functions/`

7. **Styling**: ALWAYS use Tailwind CSS utility classes. NEVER use inline styles or CSS files for component styling. Follow the mobile-first pattern: design for small screens, enhance with `md:` and `lg:` breakpoints.

8. **Database Conventions**:
   - Table names: snake_case (e.g., `blog_posts`, `user_profiles`)
   - Column names: snake_case (e.g., `featured_image_url`, `created_at`)
   - ALWAYS enable RLS on new tables
   - ALWAYS create appropriate policies (public SELECT for published content, full access for authenticated users)
   - Use `auth.uid()` for user-specific data policies
   - Use `gen_random_uuid()` for primary keys
   - Include `created_at` and `updated_at` timestamps

9. **Error Handling**: Don't catch errors with try/catch unless specifically requested. Let errors bubble up so they can be identified and fixed.

10. **No Overengineering**: Don't add feature flags, backwards-compatibility shims, or abstractions for one-time operations. Keep it simple and elegant.

## PRE-BAKED MODULES (REUSE, DON'T REBUILD)

The following are already built and ready to use:

- **Auth system**: `useAuth()` hook, `ProtectedRoute`, login page — just ensure the `profiles` table and trigger exist
- **Admin shell**: `AdminLayout` with sidebar + header — just update nav items
- **Rich text editor**: `RichTextEditor` component — import and use directly
- **Image uploader**: `ImageUploader` component — import and use directly (update bucket name)
- **Analytics**: `AnalyticsContext` + `AnalyticsScripts` — just add tracking IDs in admin
- **SEO management**: `SeoSettings` admin page — just update the `pages` array
- **Toast notifications**: `showSuccess()`, `showError()` helpers — call from anywhere
- **UI library**: 40+ shadcn/ui components in `src/components/ui/` — import and use
- **Sitemap generation**: Build script + edge function — just update BASE_URL and static pages

## CLEAN SLATE INSTRUCTIONS

When building a new application on this boilerplate:

1. **Wipe domain-specific pages**: Replace everything in `src/pages/` (except `NotFound.tsx` and `admin/Login.tsx`) with new application pages.

2. **Wipe domain-specific components**: Replace everything in `src/components/` (except `admin/`, `ui/`, `Header.tsx`, `Footer.tsx`, `AnalyticsScripts.tsx`, `SeoHead.tsx`) with new application components.

3. **Update the admin sidebar**: Modify `src/components/admin/Sidebar.tsx` nav items to match new admin pages.

4. **Update the admin layout**: Modify `getPageTitle()` in `src/components/admin/AdminLayout.tsx` to map new routes to titles.

5. **Update routes**: Modify `src/App.tsx` to define new public and admin routes.

6. **Update SEO pages**: Modify the `pages` array in `src/pages/admin/SeoSettings.tsx` to match new public routes.

7. **Update sitemap**: Modify `scripts/generate-sitemap.ts` and `supabase/functions/regenerate-sitemap/index.ts` with new BASE_URL and static pages.

8. **Update branding**: Modify `index.html` title/meta, `Header.tsx` logo/name, `Footer.tsx` links/info.

9. **Create new database tables**: Add domain-specific tables following the schema conventions above. Keep the core boilerplate tables (`profiles`, `business_details`, `seo_settings`, `analytics_settings`).

10. **Update environment**: Point `src/lib/supabase.ts` to the new Supabase project.

## BUILD WORKFLOW

When the user asks you to build a feature:

1. Analyze the request and identify which files need to be created or modified.
2. Check if the requested feature already exists in the codebase — if so, tell the user.
3. Create new files using `<dyad-write>` tags (ONE tag per file, complete file contents).
4. Modify existing files using `<dyad-write>` with the COMPLETE updated file contents.
5. Install any new packages using `<dyad-add-dependency>`.
6. After all code changes, provide a concise one-sentence summary of what was built.
7. ALWAYS use `<dyad-chat-summary>` at the end with a brief title for the work done.

## CODE QUALITY STANDARDS

- All TypeScript, no `any` types
- All components must be responsive (mobile-first)
- All forms must have proper validation
- All database operations must use React Query
- All loading states must show skeleton or spinner
- All error states must show user-friendly messages
- Keep files small and focused (< 100 lines when possible)
- Use the existing color system and typography defined in `globals.css`
```

---

*This boilerplate specification is designed to be domain-agnostic. The GE Construction business logic is merely one instantiation of this architecture. Strip the domain, keep the engine, and rebuild for any vertical.*