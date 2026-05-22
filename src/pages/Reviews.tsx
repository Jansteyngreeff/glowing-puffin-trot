import { useState, FormEvent } from "react";
import { Star, Quote, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";

const Reviews = () => {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    project: "",
    rating: 5,
    review_text: "",
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews-approved'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: seo } = useQuery({
    queryKey: ['seo-settings', 'reviews'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').eq('page_slug', 'reviews').single();
      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('reviews').insert({ ...formData, status: 'pending' });
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", location: "", project: "", rating: 5, review_text: "" });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="bg-[#F4F4F2]">
      <Helmet>
        <title>{seo?.meta_title || 'Client Reviews | GE Construction'}</title>
        <meta name="description" content={seo?.meta_description || ''} />
        {seo?.og_title && <meta property="og:title" content={seo.og_title} />}
        {seo?.og_description && <meta property="og:description" content={seo.og_description} />}
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#2A3A4A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Reviews</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            See what homeowners in Pretoria and Centurion are saying about GE Construction.
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overall Rating */}
          <div className="bg-white rounded-xl p-8 mb-12 text-center">
            <div className="text-5xl font-bold text-[#2A3A4A] mb-2">{avgRating}</div>
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-[#C05A1E] fill-[#C05A1E]" size={24} />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews?.length || 0}+ verified reviews</p>
          </div>

          {/* Reviews */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : reviews?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm relative">
                  <Quote className="absolute top-4 right-4 text-[#C05A1E]/20" size={32} />
                  <div className="flex space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-[#C05A1E] fill-[#C05A1E]" size={16} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.review_text}"</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-[#2A3A4A]">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                    {review.project && <p className="text-sm text-[#C05A1E] mt-1">{review.project}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave one!</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Review Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#2A3A4A] mb-4">Leave A Review</h2>
            <p className="text-gray-600">
              Had a great experience with GE Construction? We'd love to hear about it.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700">
                Your review has been submitted and is pending approval. We appreciate your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none"
                    placeholder="e.g., Centurion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none"
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
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        size={28}
                        className={star <= formData.rating ? 'text-[#C05A1E] fill-[#C05A1E]' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea
                  name="review_text"
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-[#C05A1E] hover:bg-[#A04A18] disabled:bg-[#C05A1E]/60 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={18} />
                <span>{submitMutation.isPending ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2A3A4A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready To Join Our Happy Clients?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss your next project. Get in touch today for a free consultation.
          </p>
          <a
            href="https://wa.me/27614770708"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-8 py-4 rounded-lg font-semibold inline-block transition-colors"
          >
            WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
