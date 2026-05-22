import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Save, Search, Globe, RefreshCw, FileText } from 'lucide-react';
import { regenerateSitemap } from '@/utils/sitemap';

const pages = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'services', label: 'Services Page' },
  { slug: 'blog', label: 'Blog Page' },
  { slug: 'reviews', label: 'Reviews Page' },
  { slug: 'contact', label: 'Contact Page' },
];

const SeoSettings = () => {
  const queryClient = useQueryClient();
  const [activePage, setActivePage] = useState('home');
  const [saved, setSaved] = useState(false);
  const [sitemapRegenerating, setSitemapRegenerating] = useState(false);
  const [sitemapMessage, setSitemapMessage] = useState('');
  const [seoData, setSeoData] = useState<Record<string, any>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*');
      return data || [];
    },
  });

  useEffect(() => {
    if (settings) {
      const mapped: Record<string, any> = {};
      settings.forEach((s: any) => {
        mapped[s.page_slug] = s;
      });
      setSeoData(mapped);
    }
  }, [settings]);

  const currentData = seoData[activePage] || {};

  const handleChange = (field: string, value: string) => {
    setSeoData({
      ...seoData,
      [activePage]: { ...currentData, [field]: value },
    });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { ...currentData, page_slug: activePage, updated_at: new Date().toISOString() };
      if (currentData.id) {
        await supabase.from('seo_settings').update(data).eq('id', currentData.id);
      } else {
        await supabase.from('seo_settings').insert(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C05A1E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          SEO settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
          <nav className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.slug}
                onClick={() => setActivePage(page.slug)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activePage === page.slug
                    ? 'bg-[#C05A1E] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Search size={20} className="text-[#C05A1E]" />
              <span>Meta Tags</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  value={currentData.meta_title || ''}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="Page title for search engines"
                />
                <p className="text-xs text-gray-400 mt-1">{(currentData.meta_title || '').length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={currentData.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm resize-none"
                  placeholder="Page description for search engines"
                />
                <p className="text-xs text-gray-400 mt-1">{(currentData.meta_description || '').length}/160 characters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4 flex items-center space-x-2">
              <Globe size={20} className="text-[#C05A1E]" />
              <span>Open Graph Tags</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  value={currentData.og_title || ''}
                  onChange={(e) => handleChange('og_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="Title for social media shares"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <textarea
                  value={currentData.og_description || ''}
                  onChange={(e) => handleChange('og_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm resize-none"
                  placeholder="Description for social media shares"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  value={currentData.og_image_url || ''}
                  onChange={(e) => handleChange('og_image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Global Favicon */}
          {activePage === 'home' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-[#2A3A4A] mb-4">Global Settings</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <input
                  value={currentData.favicon_url || ''}
                  onChange={(e) => handleChange('favicon_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                  placeholder="/favicon.ico"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Save size={18} />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save SEO Settings'}</span>
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Google Preview</h3>
            <div className="space-y-1">
              <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
                {currentData.meta_title || 'Page Title'}
              </p>
              <p className="text-green-700 text-xs">www.geconstruction.co.za/{activePage === 'home' ? '' : activePage}</p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {currentData.meta_description || 'Page description will appear here...'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Social Preview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {currentData.og_image_url ? (
                <img src={currentData.og_image_url} alt="OG Preview" className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                  <Globe className="text-gray-300" size={32} />
                </div>
              )}
              <div className="p-3">
                <p className="font-semibold text-sm text-[#2A3A4A] truncate">
                  {currentData.og_title || currentData.meta_title || 'Page Title'}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {currentData.og_description || currentData.meta_description || 'Description...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSettings;
