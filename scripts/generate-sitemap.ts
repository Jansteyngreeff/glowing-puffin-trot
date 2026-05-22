import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://clpbflxkbaqcimrrbqkw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscGJmbHhrYmFxY2ltcnJicWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjU0NjcsImV4cCI6MjA5NTA0MTQ2N30.5BY840ZPjgz7l_mf-4qlJIyiGP-EleCjD51nl0lN6_I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BASE_URL = 'https://geconstruction.co.za';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

async function generateSitemap(): Promise<void> {
  const urls: SitemapUrl[] = [];
  const now = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/services', changefreq: 'monthly', priority: 0.8 },
    { path: '/blog', changefreq: 'weekly', priority: 0.8 },
    { path: '/reviews', changefreq: 'weekly', priority: 0.7 },
    { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  ];

  for (const page of staticPages) {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // Dynamic blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error.message);
  } else if (posts) {
    for (const post of posts) {
      urls.push({
        loc: `${BASE_URL}/blog/${post.slug}`,
        lastmod: (post.updated_at || post.published_at || now).toString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml.trim() + '\n', 'utf-8');
  console.log(`✅ Sitemap generated at ${outputPath} with ${urls.length} URLs`);
}

generateSitemap().catch((err) => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});