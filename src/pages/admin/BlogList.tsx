import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';

const BlogList = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('blog_posts').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === 'published') {
        updates.published_at = new Date().toISOString();
      }
      await supabase.from('blog_posts').update(updates).eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{posts?.length || 0} total posts</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
        >
          <Plus size={16} />
          <span>New Post</span>
        </Link>
      </div>

      {posts?.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {post.featured_image_url ? (
                          <img src={post.featured_image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#2A3A4A] text-sm truncate max-w-[200px]">{post.title}</p>
                          <p className="text-xs text-gray-400">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{post.category || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatusMutation.mutate({
                          id: post.id,
                          status: post.status === 'published' ? 'draft' : 'published'
                        })}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {post.status}
                      </button>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-gray-500" />
                        </Link>
                        <Link
                          to={`/admin/blog/edit/${post.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-gray-500" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this post?')) {
                              deleteMutation.mutate(post.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-[#2A3A4A] mb-2">No blog posts yet</h3>
          <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
          <Link
            to="/admin/blog/new"
            className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <Plus size={18} />
            <span>Create First Post</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogList;
