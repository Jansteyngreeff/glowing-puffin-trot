import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Footer = () => {
  const { data: business } = useQuery({
    queryKey: ['business-details'],
    queryFn: async () => {
      const { data } = await supabase.from('business_details').select('*').limit(1).single();
      return data;
    },
  });

  return (
    <footer className="bg-[#2A3A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={business?.logo_url || "/ge-construction-logo.png"}
                alt="GE Construction Logo"
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold">{business?.company_name || 'GE Construction'}</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {business?.tagline || 'Building Excellence • Delivering Dreams'}
            </p>
            <p className="text-sm text-gray-400">
              Serving {business?.service_area || 'Pretoria & Centurion'} with over 10 years of trusted construction experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C05A1E]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">Our Services</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">Blog</Link></li>
              <li><Link to="/reviews" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">Reviews</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C05A1E]">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Residential Renovations</li>
              <li>Home Improvements</li>
              <li>Roofing & Waterproofing</li>
              <li>Paving & Outdoor</li>
              <li>Building Projects</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C05A1E]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#C05A1E]" />
                <a href={`https://wa.me/${(business?.whatsapp || '+27614770708').replace(/[^0-9]/g, '')}`} className="text-sm text-gray-300 hover:text-[#C05A1E]">
                  {business?.phone || '+27 61 477 0708'}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#C05A1E]" />
                <a href={`mailto:${business?.email || 'gert@geconstruction.co.za'}`} className="text-sm text-gray-300 hover:text-[#C05A1E]">
                  {business?.email || 'gert@geconstruction.co.za'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#C05A1E] mt-1" />
                <span className="text-sm text-gray-300">
                  {business?.service_area || 'Pretoria & Centurion, Gauteng, South Africa'}
                </span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              {business?.facebook_url && (
                <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C05A1E] transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {business?.instagram_url && (
                <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C05A1E] transition-colors">
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {business?.company_name || 'GE Construction'}. All rights reserved. | Directed by Gert Engelbrecht
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
