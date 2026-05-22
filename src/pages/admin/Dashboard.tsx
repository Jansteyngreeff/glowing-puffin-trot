import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FileText, Star, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: blogCount } = useQuery({
    queryKey: ['admin-blog-count'],
    queryFn: async () => {
      const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: publishedCount } = useQuery({
    queryKey: ['admin-published-count'],
    queryFn: async () => {
      const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
      return count || 0;
    },
  });

  const { data: pendingReviews } = useQuery({
    queryKey: ['admin-pending-reviews'],
    queryFn: async () => {
      const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      return count || 0;
    },
  });

  const { data: approvedReviews } = useQuery({
    queryKey: ['admin-approved-reviews'],
    queryFn: async () => {
      const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'approved');
      return count || 0;
    },
  });

  const { data: recentPosts } = useQuery({
    queryKey: ['admin-recent-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: recentReviews } = useQuery({
    queryKey: ['admin-recent-reviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, name, status, rating, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const stats = [
    { label: 'Total Blog Posts', value: blogCount ?? 0, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published Posts', value: publishedCount ?? 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Reviews', value: pendingReviews ?? 0, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Approved Reviews', value: approvedReviews ?? 0, icon: Star, color: 'bg-[#C05A1E]' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-[#2A3A4A] mt-1">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/blog/new"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#C05A1E] transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C05A1E]/10 rounded-lg flex items-center justify-center">
              <Plus className="text-[#C05A1E]" size={20} />
            </div>
            <div>
              <p className="font-semibold text-[#2A3A4A]">Write New Blog Post</p>
              <p className="text-sm text-gray-500">Create a new article</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-[#C05A1E] transition-colors" size={18} />
        </Link>

        <Link
          to="/admin/reviews"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#C05A1E] transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-500" size={20} />
            </div>
            <div>
              <p className="font-semibold text-[#2A3A4A]">Review Submissions</p>
              <p className="text-sm text-gray-500">{pendingReviews ?? 0} pending approval</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-[#C05A1E] transition-colors" size={18} />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#2A3A4A]">Recent Blog Posts</h2>
            <Link to="/admin/blog" className="text-sm text-[#C05A1E] hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts?.length ? (
              recentPosts.map((post: any) => (
                <div key={post.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#2A3A4A] truncate max-w-[250px]">{post.title}</p>
                    <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No blog posts yet</p>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#2A3A4A]">Recent Reviews</h2>
            <Link to="/admin/reviews" className="text-sm text-[#C05A1E] hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReviews?.length ? (
              recentReviews.map((review: any) => (
                <div key={review.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#2A3A4A]">{review.name}</p>
                    <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.status === 'approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {review.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
