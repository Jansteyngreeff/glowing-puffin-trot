import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#2A3A4A] to-[#1A2A3A] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Trusted Building & Renovation Solutions For Modern Homes
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Helping homeowners and small businesses improve, renovate, and maintain their properties through reliable workmanship and practical building solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center space-x-2 transition-colors border border-white/30"
            >
              <Phone size={20} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F4F2] to-transparent" />
    </section>
  );
};

export default HeroSection;