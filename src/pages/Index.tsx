import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Users, Home, Award } from "lucide-react";
import HeroSection from "../components/HeroSection";
import ServicesPreview from "../components/ServicesPreview";
import TestimonialsPreview from "../components/TestimonialsPreview";
import TrustSignals from "../components/TrustSignals";

const Index = () => {
  return (
    <div className="bg-[#F4F4F2]">
      <HeroSection />
      <TrustSignals />
      <ServicesPreview />
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A3A4A] mb-4">
              Why Homeowners Choose GE Construction
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Big enough to trust. Small enough to care. We bring over 10 years of hands-on experience to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#F4F4F2] p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#C05A1E] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2A3A4A] mb-2">Reliable Workmanship</h3>
              <p className="text-gray-600">
                We take pride in delivering quality results that stand the test of time. Every project gets our full attention and commitment.
              </p>
            </div>

            <div className="bg-[#F4F4F2] p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#C05A1E] rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2A3A4A] mb-2">Personal Service</h3>
              <p className="text-gray-600">
                You'll work directly with Gert and our team. No runaround, no confusion — just clear communication and honest advice.
              </p>
            </div>

            <div className="bg-[#F4F4F2] p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#C05A1E] rounded-lg flex items-center justify-center mb-4">
                <Home className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2A3A4A] mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Based in Pretoria and Centurion, we understand local building requirements, climate challenges, and neighborhood styles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsPreview />

      {/* CTA Section */}
      <section className="py-16 bg-[#2A3A4A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready To Start Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's chat about your renovation or building plans. No obligation, no pressure — just friendly advice from a team that cares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Get A Free Quote</span>
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://wa.me/27614770708"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-[#2A3A4A] px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;