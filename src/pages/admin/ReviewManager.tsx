import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Check, X, Trash2, Star, Plus, MessageSquare } from 'lucide-react';

type Tab = 'published' | 'pending' | 'add-new';

const ReviewManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('published');
  const [saved, setSaved] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    project: '',
    rating: 5,
    review_text: '',
  });

  const { data: publishedReviews } = useQuery({
    queryKey: ['admin-reviews-published'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: pendingReviews } = useQuery({
    queryKey: ['admin-reviews-pending'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('reviews').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-published'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('reviews').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('reviews').delete().eq('id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-published'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('reviews').insert({ ...newReview, status: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-published'] });
      setNewReview({ name: '', location: '', project: '', rating: 5, review_text: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const tabs = [
    { id: 'published' as Tab, label: 'Published', count: publishedReviews?.length ?? 0 },
    { id: 'pending' as Tab, label: 'Pending Approval', count: pendingReviews?.length ?? 0 },
    { id: 'add-new' as Tab, label: 'Add New', count: null },
  ];

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          Review added successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#C05A1E] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Published Tab */}
      {activeTab === 'published' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {publishedReviews?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Project</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {publishedReviews.map((review: any) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#2A3A4A] text-sm">{review.name}</p>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{review.location}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{review.project}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex space-x-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-[#C05A1E] fill-[#C05A1E]" />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              if (confirm('Delete this review?')) deleteMutation.mutate(review.id);
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
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No published reviews yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingReviews?.length ? (
            pendingReviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className="font-semibold text-[#2A3A4A]">{review.name}</p>
                      <span className="text-sm text-gray-500">• {review.location}</span>
                      <span className="text-sm text-[#C05A1E]">• {review.project}</span>
                    </div>
                    <div className="flex space-x-0.5 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-[#C05A1E] fill-[#C05A1E]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic">"{review.review_text}"</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => approveMutation.mutate(review.id)}
                      className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check size={18} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(review.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No pending reviews.</p>
            </div>
          )}
        </div>
      )}

      {/* Add New Tab */}
      {activeTab === 'add-new' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#2A3A4A] mb-6 flex items-center space-x-2">
            <Plus size={20} className="text-[#C05A1E]" />
            <span>Add New Review</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                value={newReview.location}
                onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                placeholder="e.g., Centurion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <input
                value={newReview.project}
                onChange={(e) => setNewReview({ ...newReview, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm"
                placeholder="e.g., Kitchen Renovation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={star <= newReview.rating ? 'text-[#C05A1E] fill-[#C05A1E]' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Text *</label>
              <textarea
                value={newReview.review_text}
                onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none text-sm resize-none"
                placeholder="Write the review text..."
              />
            </div>
          </div>
          <button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending || !newReview.name || !newReview.review_text}
            className="mt-4 bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>{addMutation.isPending ? 'Adding...' : 'Add Review'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;
