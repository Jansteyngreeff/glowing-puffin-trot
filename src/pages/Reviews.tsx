import { Star, Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah & Johan M.",
      location: "Centurion",
      project: "Kitchen Renovation",
      rating: 5,
      text: "GE Construction transformed our outdated kitchen into a modern dream space. Gert's attention to detail and communication throughout the process was exceptional. The team was professional, clean, and always on time. Highly recommend!",
    },
    {
      name: "Pieter V.",
      location: "Pretoria North",
      project: "Roof Repairs & Waterproofing",
      rating: 5,
      text: "We needed urgent roof repairs before winter. They responded quickly, did excellent work, and at a fair price. Our roof hasn't leaked since. Thank you, Gert and team!",
    },
    {
      name: "Maria D.",
      location: "Irene",
      project: "Paving & Outdoor Entertainment Area",
      rating: 5,
      text: "From paving our driveway to building a new entertainment area, GE Construction handled everything professionally. They're our go-to for any home project. The quality of work is outstanding.",
    },
    {
      name: "Thabo & Nomsa K.",
      location: "Hatfield",
      project: "Bathroom Renovation",
      rating: 5,
      text: "Our bathroom was completely transformed! The team was respectful of our home, cleaned up daily, and finished on time. We couldn't be happier with the result.",
    },
    {
      name: "Johan S.",
      location: "Brooklyn",
      project: "Home Addition",
      rating: 5,
      text: "GE Construction built an additional room onto our home. The project was well-managed, and the quality exceeded our expectations. Gert kept us informed every step of the way.",
    },
    {
      name: "Linda P.",
      location: "Waterkloof",
      project: "Interior Painting & Ceilings",
      rating: 5,
      text: "We had our entire interior repainted and new ceilings installed. The team was efficient, tidy, and the finish is flawless. Very happy with the service.",
    },
    {
      name: "David & Anne M.",
      location: "Montana",
      project: "Garage Construction",
      rating: 5,
      text: "Built a double garage that matches our home perfectly. Great communication, fair pricing, and excellent craftsmanship. Would definitely use them again.",
    },
    {
      name: "Michelle R.",
      location: "Garsfontein",
      project: "Complete Home Renovation",
      rating: 5,
      text: "GE Construction renovated our entire home over several months. They managed multiple trades, kept to the timeline, and the result is stunning. True professionals!",
    },
    {
      name: "Andre B.",
      location: "Lynnwood",
      project: "Boundary Wall",
      rating: 5,
      text: "Needed a new boundary wall after storm damage. Quick response, competitive quote, and excellent work. The wall looks great and is very sturdy.",
    },
  ];

  return (
    <div className="bg-[#F4F4F2]">
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
            <div className="text-5xl font-bold text-[#2A3A4A] mb-2">5.0</div>
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-[#C05A1E] fill-[#C05A1E]" size={24} />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length}+ verified reviews</p>
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm relative"
              >
                <Quote className="absolute top-4 right-4 text-[#C05A1E]/20" size={32} />
                <div className="flex space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-[#C05A1E] fill-[#C05A1E]" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-[#2A3A4A]">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.location}</p>
                  <p className="text-sm text-[#C05A1E] mt-1">{review.project}</p>
                </div>
              </div>
            ))}
          </div>
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
            href="https://wa.me/27000000000"
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