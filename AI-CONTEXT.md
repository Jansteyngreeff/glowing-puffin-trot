# GE Construction — AI Context Document

> **Master reference for any AI session working on this project.**
> Last updated: 2025-07-20

---

## 1. Project Overview & Objective

**GE Construction** is a South African construction and renovation company based in Pretoria & Centurion, Gauteng. The application is a **marketing website + admin CMS** that serves as the company's primary digital presence.

### Business Context
- **Company**: GE Construction, directed by Gert Engelbrecht
- **Services**: Residential renovations, home improvements, roofing & waterproofing, paving & outdoor, building projects
- **Target Audience**: Homeowners and small businesses in Pretoria & Centurion, Gauteng, South Africa
- **Tone**: Professional, trustworthy, approachable — "Big enough to trust. Small enough to care."
- **Primary CTA**: WhatsApp-first communication (most business comes via WhatsApp)
- **Live URL**: https://geconstruction.co.za

### Application Purpose
1. **Public-facing website**: Showcase services, collect leads via WhatsApp, publish blog content, display client reviews
2. **Admin CMS**: Manage business details, blog posts, reviews, SEO settings, analytics tracking

---

## 2. Tech Stack & Architecture

### Core Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Routing** | React Router v6 (BrowserRouter) |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) |
| **State/Server** | React Query (TanStack Query) v5 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **SEO** | react-helmet-async |
| **Rich Text** | TipTap editor |
| **Forms** | react-hook-form + Zod validation |
| **Deployment** | Vercel (SPA rewrite to index.html) |

### Key Dependencies
- `@supabase/supabase-js` — Supabase client
- `@tanstack/react-query` — Server state management
- `react-helmet-async` — Document head management
- `react-router-dom` — Client-side routing
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image` — Rich text editing
- `react-dropzone` — Image upload drag & drop
- `lucide-react` — Icon library
- `zod` — Schema validation
- `recharts` — Charts (available but not yet used in analytics dashboard)

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (fallback: `https://clpbflxkbaqcimrrbqkw.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anon key |

### Build Commands
```bash
npm run dev          # Start Vite dev server
npm run build        # Generate sitemap + Vite production build (sitemap runs automatically)
npm run sitemap      # Run sitemap generation script only (scripts/generate-sitemap.ts)
npm run preview      # Preview production build locally
```

### Sitemap Generation
- **Build-time**: `scripts/generate-sitemap.ts` runs via `npm run sitemap`, fetches published blog posts from Supabase, writes `public/sitemap.xml`
- **Runtime**: `supabase/functions/regenerate-sitemap/index.ts` edge function can be called from the admin SEO Settings page. Returns the XML and optionally uploads to `public-assets` storage bucket.
- **Client call**: `src/utils/sitemap.ts` exports `regenerateSitemap()` which invokes the edge function via `supabase.functions.invoke()`.
- **robots.txt**: Points to `https://geconstruction.co.za/sitemap.xml`

### Supabase Client Configuration
- **File**: `src/lib/supabase.ts`
- **Project ID**: `clpbflxkbaqcimrrbqkw`
- **URL**: `https://clpbflxkbaqcimrrbqkw.supabase.co`
- **Auth**: Email/password only (no third-party providers)
- **Storage Buckets**: `blog-images` (for blog post images), `public-assets` (for sitemap.xml)

### Edge Functions
- **`regenerate-sitemap`** (`supabase/functions/regenerate-sitemap/index.ts`): Generates XML sitemap from static pages + published blog posts, uploads to `public-assets` bucket. Called from `src/utils/sitemap.ts`.

---

## 3. Core Features & Progress Status

### ✅ Fully Built

| Feature | Status | Notes |
|---------|--------|-------|
| **Public Pages** | ✅ Complete | Home, Services, Blog (list + detail), Reviews, Contact, 404 |
| **Admin CMS** | ✅ Complete | Dashboard, Business Details, SEO Settings, Blog CRUD, Review Manager, Analytics Settings |
| **Authentication** | ✅ Complete | Supabase Auth with email/password, ProtectedRoute, session management |
| **SEO Management** | ✅ Complete | Per-page meta tags, Open Graph, favicon, Google preview in admin |
| **Analytics Integration** | ✅ Complete | Facebook Pixel + GA4 with master toggle, event tracking, admin analytics page |
| **WhatsApp Integration** | ✅ Complete | Contact form → WhatsApp message, floating CTAs throughout |
| **Blog System** | ✅ Complete | CRUD with TipTap editor, image upload, categories, draft/publish, SEO fields |
| **Review System** | ✅ Complete | Public submission (pending approval), admin approval workflow, featured flag |
| **Sitemap Generation** | ✅ Complete | Build script (`scripts/generate-sitemap.ts`) generates static sitemap at build time, edge function for dynamic regeneration, admin SEO page has "Regenerate Sitemap" button |
| **Responsive Design** | ✅ Complete | Mobile-first, hamburger menu, responsive grids |

### ⚠️ Known Gaps / Partial Implementations

| Gap | Details | Priority |
|-----|---------|----------|
| **Analytics Dashboard Data** | Admin Analytics page configures tracking IDs (FB Pixel + GA4 with master toggle) but has no actual analytics data display (no charts, no page view counts). The `recharts` package is installed but unused. | Medium |
| **Contact Form Backend** | Contact form submits via WhatsApp redirect (no server-side storage). No database table for contact submissions. | Medium |
| **Blog Content Rendering** | Blog post content uses a custom markdown-like parser (`formatContent` in `BlogPost.tsx`) rather than rendering TipTap HTML directly. This is a workaround — TipTip HTML content may not render perfectly. | Low |
| **Image Optimization** | No image optimization pipeline. Images are stored as-is in Supabase Storage. | Low |
| **Gallery/Portfolio** | No project gallery or portfolio page. Likely next feature. | High (planned) |
| **Service Pricing** | No pricing page or pricing information on service pages. | Medium (planned) |

### 🔮 Likely Next Features
1. **Project Gallery/Portfolio** — Showcase completed projects with before/after images
2. **Service Pricing Page** — Transparent pricing or pricing ranges
3. **Analytics Dashboard** — Display actual visitor data (requires integrating GA4 API or similar)

---

## 4. Key Design & Coding Patterns

### Color System
| Name | Hex | Usage |
|------|-----|-------|
| **Deep Slate Blue** | `#2A3A4A` | Primary dark — headers, nav, footer, dark backgrounds |
| **Burnt Orange** | `#C05A1E` | Primary accent — CTAs, links, highlights, active states |
| **Burnt Orange Dark** | `#A04A18` | Hover state for orange buttons |
| **Off-White** | `#F4F4F2` | Page backgrounds, card backgrounds |
| **White** | `#FFFFFF` | Cards, content areas |
| **WhatsApp Green** | `#25D366` | WhatsApp-specific buttons |

### Typography
- **Headings**: Montserrat (700/800 weight) — loaded from Google Fonts
- **Body**: Open Sans (400/500/600 weight) — loaded from Google Fonts
- **Font loading**: `@import url()` in `src/globals.css`

### Folder Structure
```
src/
├── App.tsx                    # Root component with routing
├── App.css                    # Minimal app-level styles
├── globals.css                # Global styles, Tailwind, fonts, CSS variables
├── main.tsx                   # React entry point
├── vite-env.d.ts              # Vite type declarations
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── AdminLayout.tsx    # Admin shell with sidebar + header
│   │   ├── ProtectedRoute.tsx # Auth guard for admin routes
│   │   ├── Sidebar.tsx        # Admin navigation sidebar
│   │   ├── RichTextEditor.tsx # TipTap WYSIWYG editor
│   │   └── ImageUploader.tsx  # Drag & drop image upload to Supabase Storage
│   ├── ui/                    # shadcn/ui components (DO NOT EDIT)
│   ├── Header.tsx             # Public site header/navigation
│   ├── Footer.tsx             # Public site footer
│   ├── HeroSection.tsx        # Homepage hero banner
│   ├── ServicesPreview.tsx    # Homepage services grid
│   ├── TestimonialsPreview.tsx # Homepage featured reviews
│   ├── TrustSignals.tsx       # Homepage stats (10+ years, 200+ projects, etc.)
│   ├── SeoHead.tsx            # SEO head component (currently unused/null)
│   ├── AnalyticsScripts.tsx   # FB Pixel + GA4 script injection + event tracking
│   └── made-with-dyad.tsx     # Dyad attribution badge
├── contexts/
│   ├── AuthContext.tsx         # Supabase auth state, signIn, signOut
│   └── AnalyticsContext.tsx    # Fetches analytics_settings from DB
├── hooks/
│   ├── use-mobile.tsx          # Mobile breakpoint detection
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   ├── supabase.ts             # Supabase client singleton
│   └── utils.ts                # Utility functions (cn for class merging)
├── pages/
│   ├── Index.tsx               # Homepage
│   ├── Services.tsx            # Services listing page
│   ├── Blog.tsx                # Blog post listing
│   ├── BlogPost.tsx            # Individual blog post (by slug)
│   ├── Reviews.tsx             # Client reviews + submission form
│   ├── Contact.tsx             # Contact form (WhatsApp redirect)
│   ├── NotFound.tsx            # 404 page
│   └── admin/
│       ├── Login.tsx           # Admin login page
│       ├── Dashboard.tsx       # Admin overview with stats
│       ├── BusinessDetails.tsx # Company info, contact, hours, social
│       ├── SeoSettings.tsx     # Per-page SEO meta/OG tags + sitemap regen button
│       ├── Analytics.tsx       # FB Pixel + GA4 configuration with master toggle
│       ├── BlogList.tsx        # Blog post management table
│       ├── BlogEditor.tsx      # Create/edit blog post
│       └── ReviewManager.tsx   # Approve/reject/add reviews
└── utils/
    ├── sitemap.ts              # Client-side sitemap regeneration via edge function
    └── toast.ts                # Toast notification utilities

scripts/
    └── generate-sitemap.ts     # Build-time sitemap generator (static + dynamic posts)

supabase/functions/
    └── regenerate-sitemap/
        └── index.ts            # Edge function for dynamic sitemap regeneration
```

### Naming Conventions
- **Components**: PascalCase (`BlogEditor.tsx`, `ProtectedRoute.tsx`)
- **Pages**: PascalCase, in `src/pages/` or `src/pages/admin/`
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useAnalytics`)
- **Contexts**: PascalCase with `Context` suffix (`AuthContext`, `AnalyticsContext`)
- **Utilities**: camelCase (`formatContent`, `generateSlug`)
- **Database tables**: snake_case (`blog_posts`, `business_details`, `seo_settings`)
- **Database columns**: snake_case (`featured_image_url`, `meta_title`, `published_at`)

### Route Patterns
```
Public:
  /                   → Homepage (Index)
  /services           → Services page
  /blog               → Blog listing
  /blog/:slug         → Individual blog post
  /reviews            → Reviews page
  /contact            → Contact page
  *                   → 404 page

Admin:
  /admin/login        → Login page (no header/footer)
  /admin              → Dashboard (protected)
  /admin/business     → Business Details (protected)
  /admin/seo          → SEO Settings (protected) + Sitemap regeneration button
  /admin/analytics    → Analytics Settings (protected) — FB Pixel + GA4 configuration
  /admin/blog         → Blog List (protected)
  /admin/blog/new     → New Blog Post (protected)
  /admin/blog/edit/:id → Edit Blog Post (protected)
  /admin/reviews      → Review Manager (protected)
```

### Admin vs Public Route Pattern
- Admin routes are wrapped in `<ProtectedRoute>` which checks `useAuth().session`
- Unauthenticated admin access redirects to `/admin/login`
- Authenticated users visiting `/admin/login` redirect to `/admin`
- Public routes are wrapped in `<AnalyticsProvider>` for tracking
- Admin routes do NOT include Header/Footer — they use `<AdminLayout>` with sidebar

### Database Query Patterns
```typescript
// Standard select with filtering
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('field', value)
  .order('created_at', { ascending: false });

// Single record fetch
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('id', id)
  .single();

// Insert
await supabase.from('table_name').insert(payload);

// Update
await supabase.from('table_name').update(payload).eq('id', id);

// Delete
await supabase.from('table_name').delete().eq('id', id);

// Count (head request)
const { count } = await supabase
  .from('table_name')
  .select('*', { count: 'exact', head: true });
```

### React Query Patterns
```typescript
// Query
const { data, isLoading } = useQuery({
  queryKey: ['unique-key'],
  queryFn: async () => { /* fetch logic */ },
});

// Mutation with cache invalidation
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (payload) => { /* write logic */ },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['related-key'] });
  },
});
```

### Styling Patterns
- Always use Tailwind utility classes for styling
- Use the color system variables (e.g., `text-[#2A3A4A]`, `bg-[#C05A1E]`)
- Prefer `rounded-xl` or `rounded-lg` for rounded shapes
- Use `space-y-4`, `gap-4`, `gap-6` for consistent spacing
- Mobile-first: design for small screens, use `md:` and `lg:` breakpoints for larger
- Use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for page-level containers
- Cards: `bg-white rounded-xl shadow-sm p-6` or `p-8`

---

## 5. Critical Database Schema & Endpoints

### Supabase Client
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://clpbflxkbaqcimrrbqkw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "<fallback-key>";
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### Storage Buckets
| Bucket | Purpose | Access |
|--------|---------|--------|
| `blog-images` | Blog post featured images | Public |
| `public-assets` | Sitemap XML, other public assets | Public |

### Tables (7 total — analytics_settings included)

#### 1. `business_details`
Stores company information displayed throughout the site.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `company_name` | text | `'GE Construction'` | |
| `tagline` | text | `'Building Excellence • Delivering Dreams'` | |
| `phone` | text | `'+27 61 477 0708'` | |
| `email` | text | `'gert@geconstruction.co.za'` | |
| `whatsapp` | text | `'+27 61 477 0708'` | |
| `service_area` | text | `'Pretoria & Centurion, Gauteng, South Africa'` | |
| `business_hours` | jsonb | JSON object with 7 days | `{monday: {open, close, closed}, ...}` |
| `facebook_url` | text | `''` | |
| `instagram_url` | text | `''` | |
| `logo_url` | text | `'/ge-construction-logo.png'` | |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. `business_details_select_anon` (SELECT: true), `business_details_all_auth` (ALL: true).

#### 2. `blog_posts`
Blog articles with full content management.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `slug` | text | — | Unique URL identifier |
| `title` | text | `''` | |
| `excerpt` | text | `''` | Short description |
| `content` | text | `''` | Full article (HTML from TipTap) |
| `category` | text | `''` | Category name (not FK) |
| `featured_image_url` | text | `''` | |
| `author` | text | `'Gert Engelbrecht'` | |
| `status` | text | `'draft'` | `'draft'` or `'published'` |
| `meta_title` | text | `''` | SEO override |
| `meta_description` | text | `''` | SEO override |
| `published_at` | timestamptz | null | Set on first publish |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. `blog_posts_select_published` (SELECT: `status='published' OR auth.role()='authenticated'`), `blog_posts_all_auth` (ALL: true).

#### 3. `blog_categories`
Categories for blog posts.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `name` | text | — | Display name |
| `slug` | text | — | URL slug |
| `created_at` | timestamptz | `now()` | |

**RLS**: Enabled. `blog_categories_select_anon` (SELECT: true), `blog_categories_all_auth` (ALL: true).

#### 4. `reviews`
Client reviews with approval workflow.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `name` | text | `''` | Client name |
| `location` | text | `''` | e.g., "Centurion" |
| `project` | text | `''` | e.g., "Kitchen Renovation" |
| `rating` | integer | `5` | 1-5 stars |
| `review_text` | text | `''` | Review content |
| `status` | text | `'pending'` | `'pending'`, `'approved'`, or `'rejected'` |
| `is_featured` | boolean | `false` | Featured on homepage |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. `reviews_select_approved` (SELECT: `status='approved' OR auth.role()='authenticated'`), `reviews_insert_anon` (INSERT: true — allows public submissions), `reviews_all_auth` (ALL: true).

#### 5. `seo_settings`
Per-page SEO metadata.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `page_slug` | text | — | e.g., `'home'`, `'services'`, `'blog'`, `'reviews'`, `'contact'` |
| `meta_title` | text | `''` | |
| `meta_description` | text | `''` | |
| `og_title` | text | `''` | Open Graph title |
| `og_description` | text | `''` | Open Graph description |
| `og_image_url` | text | `''` | Open Graph image |
| `favicon_url` | text | `''` | Global favicon (stored on home record) |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. `seo_settings_select_anon` (SELECT: true), `seo_settings_all_auth` (ALL: true).

#### 6. `analytics_settings`
Tracking configuration.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | `gen_random_uuid()` | PK |
| `facebook_pixel_id` | text | null | e.g., `'123456789012345'` |
| `ga4_measurement_id` | text | null | e.g., `'G-XXXXXXXXXX'` |
| `is_enabled` | boolean | `false` | Master toggle |
| `created_at` | timestamptz | `now()` | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. `analytics_select_policy` (SELECT: true), `analytics_insert_policy` (INSERT: true), `analytics_update_policy` (UPDATE: true), `analytics_delete_policy` (DELETE: true).

#### 7. `profiles`
User profiles (auto-created on signup via trigger).

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | UUID | — | PK, FK → `auth.users(id)` |
| `first_name` | text | null | |
| `last_name` | text | null | |
| `avatar_url` | text | null | |
| `updated_at` | timestamptz | `now()` | |

**RLS**: Enabled. Users can only access their own profile (`auth.uid() = id`).

### Database Trigger
- **`on_auth_user_created`**: After INSERT on `auth.users`, creates a profile in `public.profiles` with `id`, `first_name`, `last_name` from `raw_user_meta_data`.

---

## 6. Instructional Guidelines for Future AI Sessions

### Code Modification Rules
1. **Always read files before editing** — use `read_file` to understand current state
2. **Use `search_replace`** for small, surgical changes (unique context required)
3. **Use `write_file`** for creating new files or rewriting entire files
4. **Never edit shadcn/ui components** in `src/components/ui/` — create custom components instead
5. **Never edit `AI_RULES.md`** unless explicitly asked
6. **Always verify changes** by reading the file after editing
7. **Run type checks** after TypeScript changes with `run_type_checks`

### Conventions to Follow
1. **Mobile-first responsive design** — always design for small screens first
2. **Use the established color system** — Deep Slate Blue (`#2A3A4A`), Burnt Orange (`#C05A1E`), Off-White (`#F4F4F2`)
3. **Use Montserrat for headings, Open Sans for body** — already loaded in `globals.css`
4. **Use React Query** for all data fetching — never use raw `useEffect` + `fetch`
5. **Use `useMutation`** for all writes with `onSuccess` cache invalidation
6. **Import supabase from `@/lib/supabase`** — never create a new client
7. **Use `@/` path alias** for all imports (configured in tsconfig + vite)
8. **Keep components small and focused** — split into separate files when they grow
9. **Use TypeScript** — all new files must be `.tsx` or `.ts`
10. **Follow the existing folder structure** — pages in `src/pages/`, components in `src/components/`

### Patterns to Maintain
1. **Admin routes**: Wrap in `<ProtectedRoute>`, use `<AdminLayout>`, no Header/Footer
2. **Public routes**: Wrapped in `<AnalyticsProvider>` (fetches analytics_settings), include `<AnalyticsScripts />` for tracking injection, `<Header>` and `<Footer>`
3. **SEO**: Use `<Helmet>` at the page level with data fetched from `seo_settings` table
4. **Analytics Tracking**: Use `trackFbEvent(eventName, params)` and `trackGaEvent(eventName, params)` from `src/components/AnalyticsScripts.tsx` for custom event tracking. Page views are automatic via FB Pixel / GA4 base scripts.
5. **Forms**: Use controlled components with `useState`, submit via Supabase mutations
6. **Loading states**: Show `animate-pulse` skeleton or `animate-spin` spinner
7. **Error handling**: Show user-friendly error messages in styled alert boxes
8. **WhatsApp integration**: Format messages with `encodeURIComponent`, open in new tab
9. **Image uploads**: Use `react-dropzone` + Supabase Storage (`blog-images` bucket)
10. **Sitemap**: Regenerate via `regenerateSitemap()` from `src/utils/sitemap.ts` (calls edge function) or run `npm run sitemap` for build-time generation. The sitemap includes all static pages plus published blog posts.
11. **RLS**: All tables have RLS enabled. Public reads use `true` policy for settings tables (`business_details`, `seo_settings`, `analytics_settings`). Blog posts filter by `status='published'` for anonymous users. Reviews filter by `status='approved'` for anonymous users.

### What NOT to Do
- ❌ Don't add error handling for scenarios that can't happen
- ❌ Don't add feature flags or backwards-compatibility shims
- ❌ Don't create abstractions for one-time operations
- ❌ Don't add docstrings/comments to code that isn't yours
- ❌ Don't use `any` types — use proper TypeScript types
- ❌ Don't use inline styles — always use Tailwind classes
- ❌ Don't install packages that already exist in the project
- ❌ Don't modify `vite.config.ts`, `tailwind.config.ts`, or `tsconfig*.json` unless explicitly asked
- ❌ Don't create SQL migration files in `supabase/migrations/` — use the `execute_sql` tool instead
- ❌ Don't hardcode tracking IDs in components — always read from `analytics_settings` table via `AnalyticsContext`
- ❌ Don't edit files in `supabase/functions/` directly — use the Supabase edge function creation workflow

### Reference Files
- **`AI_RULES.md`** — Project rules for the Dyad environment (tech stack, theme, deployment)
- **`src/App.tsx`** — Route definitions (single source of truth for all routes)
- **`src/lib/supabase.ts`** — Supabase client configuration
- **`src/contexts/AuthContext.tsx`** — Authentication patterns
- **`src/contexts/AnalyticsContext.tsx`** — Analytics settings context (FB Pixel + GA4)
- **`src/components/AnalyticsScripts.tsx`** — Tracking script injection + `trackFbEvent` / `trackGaEvent` helpers
- **`src/utils/sitemap.ts`** — Client-side sitemap regeneration via edge function
- **`src/globals.css`** — Color system, typography, CSS variables
