# GE Construction — Digital Presence Platform

**A professional marketing website and content management system for GE Construction**, a South African construction and renovation company serving Pretoria and Centurion, Gauteng.

This platform is the digital front door for GE Construction — combining a public-facing marketing site built on modern React architecture with a full-featured admin CMS. Homeowners browse services, read blog content, and submit reviews, while the business manages every aspect of their digital presence from a single admin panel. Every visitor interaction is tracked through integrated analytics, and the primary call-to-action funnels leads through WhatsApp for immediate, personal communication.

🌐 **Live Site**: [geconstruction.co.za](https://geconstruction.co.za)

---

## Table of Contents

- [Core Functionality & Key Features](#core-functionality--key-features)
- [Architecture & Technical Ecosystem](#architecture--technical-ecosystem)
- [System Use Case & User Workflows](#system-use-case--user-workflows)
- [Local Setup & Environment Configurations](#local-setup--environment-configurations)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)

---

## Core Functionality & Key Features

### Public Website

| Feature | Description |
|---------|-------------|
| **Homepage** | Hero section with primary CTAs (WhatsApp + Quote Request), trust stats (10+ years experience, 200+ projects, 150+ clients), service previews, featured client reviews, and a compelling "Why Choose Us" section. |
| **Services Page** | A comprehensive listing of all six service categories — renovations, home improvements, roofing, paving, building projects, and structural solutions — each with detailed feature breakdowns. |
| **Blog System** | A full blog with listing page (card grid with images, categories, dates) and individual article pages. Articles support rich content, featured images, SEO metadata, and author attribution. Content renders from HTML produced by the TipTap WYSIWYG editor. |
| **Client Reviews Page** | Public-facing review display with average rating summary, individual review cards with star ratings and project details, and a submission form for new reviews. New reviews enter a moderation queue before appearing publicly. |
| **Contact Page** | Displays all business contact information (phone, WhatsApp, email, service area, business hours) and a quote request form that generates a structured WhatsApp message pre-filled with the user's project details. |
| **Responsive Design** | Mobile-first architecture across all pages. Hamburger navigation on mobile, responsive grids, and touch-friendly interactions. |

### Admin CMS (Protected)

Accessible at `/admin` after authentication. A full sidebar-navigated control panel for managing every aspect of the website.

| Module | What It Does |
|--------|-------------|
| **Dashboard** | Overview with key metrics — total blog posts, published posts, pending reviews, approved reviews. Quick-action cards for creating content. Recent activity feeds for posts and reviews. |
| **Business Details** | Editable company profile — company name, tagline, phone, WhatsApp, email, service area, business hours (per-day open/close/closed configuration), social media links (Facebook, Instagram), and logo URL. Changes reflect immediately across the public site. |
| **SEO Settings** | Per-page SEO management for all five public pages (Home, Services, Blog, Reviews, Contact). Each page has meta title, meta description, Open Graph title/description/image, and a character counter. Includes Google Search and Social Media preview renderings. Global favicon configuration on the home page. Sitemap regeneration button triggers the edge function to rebuild. |
| **Analytics Configuration** | Master toggle for enabling/disabling all tracking. Separate inputs for Facebook Pixel ID and Google Analytics 4 Measurement ID. Status sidebar showing which tracking scripts are active and loaded. |
| **Blog Management** | Full CRUD for blog posts. List view with status toggling (draft/published), inline editing, and delete. Editor view with TipTap WYSIWYG rich text editor, image upload (drag-and-drop to Supabase Storage), category selection, author field, status management, and SEO meta fields. Auto-generated URL slugs from titles. |
| **Review Manager** | Three-tab interface: Published reviews (view and delete), Pending approval (approve or reject incoming submissions), and Add New (manually create reviews on behalf of clients). Star rating selector and structured fields for name, location, project type, and review text. |

### WhatsApp-First Lead Generation

The platform is designed around a WhatsApp-first communication model, which is the primary way GE Construction conducts business:

- **Contact Form** → Generates a structured WhatsApp message with the user's name, service interest, phone, email, and project details. Opens WhatsApp in a new tab.
- **Every page** includes prominent WhatsApp CTAs linking directly to the business number.
- **Analytics tracking** captures WhatsApp clicks and contact form submissions as events in both Facebook Pixel and Google Analytics.

### Analytics & Tracking

- **Facebook Pixel**: Page view tracking + custom events (WhatsApp clicked, quote requested, contact form submitted, outbound link clicks).
- **Google Analytics 4**: Page view tracking via gtag.js + custom event tracking for the same interaction events.
- **Master toggle**: A single switch in the admin panel enables or disables all tracking scripts simultaneously.
- **Outbound link tracking**: Automatic detection and tracking of clicks on external links.

### Sitemap Generation

Dual-layer sitemap system:

1. **Build-time**: The `scripts/generate-sitemap.ts` script runs during `npm run build`, fetches all published blog posts from Supabase, and generates `public/sitemap.xml` with proper `<lastmod>`, `<changefreq>`, and `<priority>` tags.
2. **Runtime**: The admin SEO page includes a "Regenerate Sitemap" button that invokes a Supabase Edge Function (`regenerate-sitemap`) to dynamically rebuild the sitemap and upload it to storage.

---

## Architecture & Technical Ecosystem

### Frontend Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 + TypeScript | Component-based UI with full type safety |
| **Build Tool** | Vite 8 | Lightning-fast development server and optimized production builds |
| **Routing** | React Router v6 (BrowserRouter) | Client-side routing with nested route support (admin vs. public) |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui | Utility-first CSS with accessible, customizable Radix UI primitives |
| **Typography** | Google Fonts (Montserrat + Open Sans) | Montserrat for headings, Open Sans for body text |
| **Icons** | Lucide React | Consistent, lightweight SVG icon library |

**Key Design Principles:**

- **Mobile-first**: Every component is designed for small screens first, enhanced at `md` and `lg` breakpoints.
- **Rounded aesthetics**: `rounded-xl` and `rounded-lg` used consistently for soft, approachable shapes.
- **Confident color system**: Deep Slate Blue (`#2A3A4A`) for structure, Burnt Orange (`#C05A1E`) for action, Off-White (`#F4F4F2`) for backgrounds.
- **Motion with restraint**: Purposeful transitions only — hover states, button feedback, loading spinners.

### State Management & Data Synchronization

| Layer | Technology | Pattern |
|-------|-----------|---------|
| **Server State** | TanStack React Query v5 | Automatic caching, background refetching, stale-while-revalidate |
| **Auth State** | React Context + Supabase Auth | Session management with `onAuthStateChange` listener |
| **Analytics Config** | React Context | Fetches and caches analytics settings from the database |
| **Form State** | React `useState` | Controlled inputs with manual state management |
| **Routing State** | React Router | URL-based navigation state |

**React Query Pattern:**

All server data fetching uses `useQuery` with descriptive cache keys. All writes use `useMutation` with automatic cache invalidation via `queryClient.invalidateQueries()`. This ensures the UI always reflects the latest database state without manual refresh logic.

### Backend Architecture (Supabase)

| Service | Usage |
|---------|-------|
| **PostgreSQL Database** | Primary data store for all application data — business details, blog posts, reviews, SEO settings, analytics settings, user profiles |
| **Supabase Auth** | Email/password authentication for admin access. Session-based with automatic token refresh via `onAuthStateChange`. |
| **Supabase Storage** | `blog-images` bucket for blog post featured images (drag-and-drop upload via `react-dropzone`). `public-assets` bucket for sitemap XML. |
| **Row Level Security (RLS)** | Enabled on every table. Public SELECT access for published content. Full access restricted to authenticated admin users. |
| **Edge Functions** | `regenerate-sitemap` — dynamically rebuilds sitemap from the database and uploads to storage. Called from the admin SEO page. |
| **Database Triggers** | `on_auth_user_created` — automatically creates a profile record in `public.profiles` when a new user signs up. |

### Critical Integrations

| Integration | Purpose |
|-------------|---------|
| **WhatsApp Business API** (via `wa.me` links) | Primary communication channel. Contact forms, CTAs, and floating buttons all route through WhatsApp. |
| **Facebook Pixel** | Conversion tracking, audience building, and ad performance measurement for Meta advertising campaigns. |
| **Google Analytics 4** | Website traffic analysis, user behavior tracking, and outbound link monitoring. |
| **react-helmet-async** | Dynamic `<head>` management — page titles, meta descriptions, Open Graph tags, and favicon. Updated per-page from database values. |
| **TipTap Editor** | Full WYSIWYG rich text editing with toolbar, headings, lists, blockquotes, code, images, and undo/redo. |

---

## System Use Case & User Workflows

### Visitor Journey: From Discovery to Contact

```
1. Discover → Arrives on homepage via search, social media, or referral
2. Evaluate → Reviews hero message, trust stats (10+ yrs, 200+ projects), and featured reviews
3. Explore → Breads services page or reads blog articles for relevant information
4. Engage → Clicks WhatsApp button or fills out the contact/quote request form
5. Connect → WhatsApp opens with a pre-filled message; GE Construction responds personally
```

### Admin Workflow: Content Management

```
1. Sign In → Navigates to /admin/login → Authenticates with email/password
2. Dashboard → Views overview stats, recent posts, and pending review count
3. Content Creation →
   /admin/blog/new        → Writes article in TipTap editor → Uploads featured image → Sets SEO metadata → Saves as draft or publishes
   /admin/reviews         → Approves pending submissions OR manually adds new reviews
4. Site Configuration →
   /admin/business        → Updates company info, contact details, business hours, social links
   /admin/seo             → Sets per-page meta tags, Open Graph data, triggers sitemap regeneration
   /admin/analytics       → Configures tracking IDs, checks active status
```

### Admin Workflow: Review Moderation

```
1. Client submits review on public /reviews page
2. Review enters database with status = 'pending'
3. Admin navigates to /admin/reviews → Pending tab
4. Reviews the submission: reads text, checks rating and details
5. Clicks Approve (status → 'approved') or Reject (status → 'rejected')
6. Approved reviews appear on the public /reviews page and can be featured on homepage
```

### Admin Workflow: Blog Publishing

```
1. Admin navigates to /admin/blog/new
2. Enters title (slug auto-generates from title on first post)
3. Selects category, sets author
4. Uses TipTap editor for rich content: headings, bold/italic, lists, images, blockquotes
5. Uploads featured image via drag-and-drop or URL paste
6. Sets SEO meta title and description (overrides defaults)
7. Saves as Draft (invisible to public) or Publishes (visible immediately on /blog)
8. From /admin/blog, can toggle status inline, edit, or delete any post
```

---

## Local Setup & Environment Configurations

### Prerequisites

- **Node.js** v18+ (recommended: v20 LTS)
- **npm** v10+ or **yarn** v1.22+
- A **Supabase project** (this project is configured for an existing Supabase instance)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd ge-construction

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# === Supabase Configuration ===
# These connect to your Supabase project. The app has built-in fallback values
# for the current production Supabase instance, but best practice is to set them explicitly.

VITE_SUPABASE_URL=https://clpbflxkbaqcimrrbqkw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscGJmbHhrYmFxY2ltcnJicWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjU0NjcsImV4cCI6MjA5NTA0MTQ2N30.5BY840ZPjgz7l_mf-4qlJIyiGP-EleCjD51nl0lN6_I
```

> **Note**: The application includes fallback values for both variables directly in `src/lib/supabase.ts`. Running locally without `.env.local` will connect to the production Supabase instance — useful for development but exercise caution with write operations.

### Development Server

```bash
# Start the Vite dev server (default port 8080)
npm run dev
```

The application will be available at `http://localhost:8080`.

- Public site: `http://localhost:8080/`
- Admin panel: `http://localhost:8080/admin`

### Production Build

```bash
# Generates sitemap + optimized production build
npm run run build

# Preview the production build locally
npm run preview
```

> **Note**: The `npm run build` command automatically runs `npm run sitemap` first (via the `prebuild` script in `package.json`), which fetches published blog posts from Supabase and generates `public/sitemap.xml`.

### Sitemap Generation (Standalone)

```bash
# Generate sitemap.xml independently
npm run sitemap
```

This runs `scripts/generate-sitemap.ts`, which queries Supabase for all published blog posts and writes the sitemap to `public/sitemap.xml`.

### Admin Authentication

Accessing `/admin` requires authentication:

1. Navigate to `/admin/login`
2. Enter admin email and password (must be registered in your Supabase Auth users)
3. Upon successful authentication, the session is established via Supabase Auth
4. All subsequent admin route access is validated via the session token
5. Session persists across page refreshes via Supabase's automatic token refresh

---

## Project Structure

```
ge-construction/
├── public/                          # Static assets
│   ├── ge-construction-logo.png     # Company logo
│   ├── favicon.png                  # Site favicon
│   ├── sitemap.xml                  # Auto-generated sitemap (build)
│   └── robots.txt                   # Search engine crawler directives
├── scripts/
│   └── generate-sitemap.ts          # Build-time sitemap generator
├── src/
│   ├── App.tsx                      # Root component — route definitions
│   ├── globals.css                  # Global styles, Tailwind, fonts, CSS vars
│   ├── main.tsx                     # React entry point
│   ├── components/
│   │   ├── admin/                   # Admin-specific components
│   │   │   ├── AdminLayout.tsx      # Admin shell (sidebar + header + outlet)
│   │   │   ├── ProtectedRoute.tsx   # Auth guard for admin routes
│   │   │   ├── Sidebar.tsx          # Admin navigation sidebar
│   │   │   ├── RichTextEditor.tsx   # TipTap WYSIWYG editor with toolbar
│   │   │   └── ImageUploader.tsx    # Drag-and-drop image upload
│   │   ├── ui/                      # shadcn/ui components (do not edit)
│   │   ├── Header.tsx               # Public site header/navigation
│   │   ├── Footer.tsx               # Public site footer
│   │   ├── HeroSection.tsx          # Homepage hero banner
│   │   ├── ServicesPreview.tsx      # Homepage services grid
│   │   ├── TestimonialsPreview.tsx  # Homepage featured reviews
│   │   ├── TrustSignals.tsx         # Homepage stats bar
│   │   ├── AnalyticsScripts.tsx     # FB Pixel + GA4 injection & tracking
│   │   └── SeoHead.tsx              # SEO head component (placeholder)
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Supabase auth state & operations
│   │   └── AnalyticsContext.tsx     # Analytics settings from DB
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile breakpoint detection
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client singleton
│   │   └── utils.ts                 # Utility functions (cn for class merging)
│   ├── pages/
│   │   ├── Index.tsx                # Homepage
│   │   ├── Services.tsx             # Services page
│   │   ├── Blog.tsx                 # Blog listing
│   │   ├── BlogPost.tsx             # Individual blog article
│   │   ├── Reviews.tsx              # Reviews page + submission form
│   │   ├── Contact.tsx              # Contact page + quote form
│   │   ├── NotFound.tsx             # 404 page
│   │   └── admin/
│   │       ├── Login.tsx            # Admin authentication
│   │       ├── Dashboard.tsx        # Admin overview with stats
│   │       ├── BusinessDetails.tsx  # Company profile management
│   │       ├── SeoSettings.tsx      # SEO meta tags + sitemap regeneration
│   │       ├── Analytics.tsx        # Tracking configuration
│   │       ├── BlogList.tsx         # Blog post management table
│   │       ├── BlogEditor.tsx       # Create/edit blog posts
│   │       └── ReviewManager.tsx    # Review approval workflow
│   └── utils/
│       ├── sitemap.ts               # Client-side sitemap regeneration
│       └── toast.ts                 # Toast notification helpers
└── supabase/
    └── functions/
        └── regenerate-sitemap/
            └── index.ts             # Edge function: dynamic sitemap builder
```

---

## Database Schema

The application uses **7 database tables** in Supabase, all with Row Level Security (RLS) enabled.

### Tables

**`business_details`** — Company information (single record)
- Stores company name, tagline, phone, WhatsApp, email, service area, business hours (JSONB), social links, logo URL. Read publicly; written by authenticated admins.

**`blog_posts`** — Blog articles
- Full content management with slug-based URLs, TipTap HTML content, featured images, categories, author, draft/published status, publish date, and SEO fields. Anonymous users see only published posts.

**`blog_categories`** — Blog taxonomy
- Simple name/slug table for categorizing blog posts.

**`reviews`** — Client testimonials
- Name, location, project type, star rating (1-5), review text, approval status, and featured flag. Public submissions default to `pending`; admins approve or reject.

**`seo_settings`** — Per-page SEO metadata
- One record per public page (`home`, `services`, `blog`, `reviews`, `contact`). Meta title/description, Open Graph fields, favicon URL.

**`analytics_settings`** — Tracking configuration (single record)
- Facebook Pixel ID, GA4 Measurement ID, and a master enable/disable toggle.

**`profiles`** — User profiles
- Auto-created via database trigger when a new auth user signs up. Linked to `auth.users` via foreign key.

### Row Level Security Summary

| Table | Public Access | Admin Access |
|-------|--------------|--------------|
| `business_details` | SELECT | ALL |
| `blog_posts` | SELECT published only | ALL |
| `blog_categories` | SELECT | ALL |
| `reviews` | SELECT approved only | ALL |
| `seo_settings` | SELECT | ALL |
| `analytics_settings` | SELECT | ALL |
| `profiles` | Own record only | Own record only |

---

*Built with ❤️ for GE Construction — Building Excellence • Delivering Dreams*