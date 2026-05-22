import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id || id === 'new';

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    featured_image_url: '',
    author: 'Gert Engelbrecht',
    status: 'draft',
    meta_title: '',
    meta_description: '',
  });

  const { data: existingPost } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      return data;
    },
    enabled: !isNew,
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('blog_categories').select('*').order('name');
      return data || [];
    },
  });

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title || '',
        slug: existingPost.slug || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        category: existingPost.category || '',
        featured_image_url: existingPost.featured_image_url || '',
        author: existingPost.author || 'Gert Engelbrecht',
        status: existingPost.status || 'draft',
        meta_title: existingPost.meta_title || '',
        meta_description: existingPost.meta_description || '',
      });
    }
  }, [existingPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'title' && isNew && !formData.slug) {
      setFormData({ ...formData, [field]: value, slug: generateSlug(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        updated_at: new Date().toISOString(),
        ...(formData.status === 'published' && !existingPost?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      };

      if (isNew) {
        const { data } = await supabase.from('blog_posts').insert(payload).select().single();
        return data;
      } else {
        await supabase.from('blog_posts').update(payload).eq('id', id);
        return null;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (isNew && data) {
        navigate(`/admin/blog/edit/${data.id}`);
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center space-x-2 text-gray-500 hover:text-[#2A3A4A] transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Posts</span>
        </button>
        <div className="flex items-center space-x-3">
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
          >
            <Save size={16} />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          Blog post saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm font-mono"
                placeholder="post-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm resize-none"
                placeholder="Brief description of the post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => handleChange('content', html)}
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  value={formData.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="SEO title (defaults to post title)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm resize-none"
                  placeholder="SEO description (defaults to excerpt)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
              >
                <option value="">Select category...</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ImageUploader
              value={formData.featured_image_url}
              onChange={(url) => handleChange('featured_image_url', url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
