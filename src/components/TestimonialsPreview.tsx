import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const TestimonialsPreview = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#F4F4F2] p-6 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials?.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A3A4A] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it — hear from homeowners we've helped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any) => (
            <div key={testimonial.id} className="bg-[#F4F4F2] p-6 rounded-xl relative">
              <Quote className="absolute top-4 right-4 text-[#C05A1E]/20" size={40} />
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-[#C05A1E] fill-[#C05A1E]" size={18} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.review_text}"</p>
              <div>
                <p className="font-semibold text-[#2A3A4A]">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/reviews" className="text-[#C05A1E] font-semibold hover:underline">
            Read More Reviews →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
