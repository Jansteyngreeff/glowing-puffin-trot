import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts-published'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      return data || [];
    },
  });

  const { data: seo } = useQuery({
    queryKey: ['seo-settings', 'blog'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').eq('page_slug', 'blog').single();
      return data;
    },
  });

  return (
    <div className="bg-[#F4F4F2]">
      <Helmet>
        <title>{seo?.meta_title || 'Blog | GE Construction'}</title>
        <meta name="description" content={seo?.meta_description || ''} />
        {seo?.og_title && <meta property="og:title" content={seo.og_title} />}
        {seo?.og_description && <meta property="og:description" content={seo.og_description} />}
        {seo?.og_image_url && <meta property="og:image" content={seo.og_image_url} />}
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#2A3A4A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Helpful tips, guides, and insights for homeowners in Pretoria and Centurion.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : blogPosts?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogPosts.map((post: any) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {post.featured_image_url && (
                    <img src={post.featured_image_url} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="bg-[#C05A1E] text-white px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</span>
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#2A3A4A] mb-3">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-2 text-[#C05A1E] font-medium hover:underline"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
