import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      return data;
    },
  });

  const formatContent = (content: string) => {
    if (!content) return '';
    return content
      .split('\n')
      .map((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('## ')) {
          return `<h2 class="text-2xl font-bold text-[#2A3A4A] mt-8 mb-4">${trimmedLine.replace('## ', '')}</h2>`;
        }
        if (trimmedLine.startsWith('### ')) {
          return `<h3 class="text-xl font-semibold text-[#2A3A4A] mt-6 mb-3">${trimmedLine.replace('### ', '')}</h3>`;
        }
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          return `<p class="font-semibold text-[#2A3A4A] mt-4 mb-2">${trimmedLine.replace(/\*\*/g, '')}</p>`;
        }
        if (trimmedLine.startsWith('- ')) {
          return `<li class="ml-4 text-gray-700 mb-1">${trimmedLine.replace('- ', '')}</li>`;
        }
        if (/^\d+\.\s/.test(trimmedLine)) {
          return `<li class="ml-4 text-gray-700 mb-1 list-decimal">${trimmedLine.replace(/^\d+\.\s/, '')}</li>`;
        }
        if (trimmedLine === '') {
          return '<br/>';
        }
        if (trimmedLine.includes('|') && trimmedLine.startsWith('|')) {
          if (trimmedLine.includes('---')) return '';
          const cells = trimmedLine.split('|').filter(c => c.trim() !== '');
          if (cells.length > 0) {
            return `<div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">${cells.map(cell => `<span class="text-gray-700">${cell.trim()}</span>`).join('')}</div>`;
          }
        }
        return `<p class="text-gray-700 mb-4 leading-relaxed">${trimmedLine}</p>`;
      })
      .join('');
  };

  if (isLoading) {
    return (
      <div className="bg-[#F4F4F2] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C05A1E]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F4F4F2]">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-[#2A3A4A] mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back To Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F4F2]">
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#2A3A4A] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back To Blog</span>
          </Link>
          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
            <span className="bg-[#C05A1E] text-white px-3 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.featured_image_url && (
            <img src={post.featured_image_url} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-xl mb-8" />
          )}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-[#2A3A4A] rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help With Your Project?
            </h2>
            <p className="text-gray-300 mb-6">
              Get in touch with GE Construction for a free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center transition-colors"
              >
                Get A Free Quote
              </Link>
              <a
                href="https://wa.me/27614770708"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-100 text-[#2A3A4A] px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
