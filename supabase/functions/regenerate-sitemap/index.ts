import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_URL = 'https://geconstruction.co.za';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const urls: string[] = [];
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
      urls.push(`  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`);
    }

    // Dynamic blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[regenerate-sitemap] Error fetching posts:', error.message);
    } else if (posts) {
      for (const post of posts) {
        const lastmod = (post.updated_at || post.published_at || now).toString().split('T')[0];
        urls.push(`  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    // Upload to Supabase storage (public bucket)
    const fileName = 'sitemap.xml';
    const fileBlob = new Blob([xml.trim() + '\n'], { type: 'application/xml' });

    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(fileName, fileBlob, {
        upsert: true,
        contentType: 'application/xml',
        cacheControl: '3600',
      });

    if (uploadError) {
      // If bucket doesn't exist, return the XML directly
      console.error('[regenerate-sitemap] Storage upload error:', uploadError.message);
      return new Response(
        JSON.stringify({
          success: true,
          message: `Sitemap generated with ${urls.length} URLs (storage upload failed, returning XML directly)`,
          urlCount: urls.length,
          xml,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public-assets')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sitemap regenerated with ${urls.length} URLs`,
        urlCount: urls.length,
        publicUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('[regenerate-sitemap] Unexpected error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});