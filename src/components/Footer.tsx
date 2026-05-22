import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2A3A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/ge-construction-logo.png"
                alt="GE Construction Logo"
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold">GE Construction</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Building Excellence • Delivering Dreams
            </p>
            <p className="text-sm text-gray-400">
              Serving Pretoria & Centurion with over 10 years of trusted construction experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C05A1E]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-[#C05A1E] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
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

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#C05A1E]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#C05A1E]" />
                <a href="https://wa.me/27000000000" className="text-sm text-gray-300 hover:text-[#C05A1E]">
                  +27 00 000 0000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#C05A1E]" />
                <a href="mailto:info@geconstruction.co.za" className="text-sm text-gray-300 hover:text-[#C05A1E]">
                  info@geconstruction.co.za
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#C05A1E] mt-1" />
                <span className="text-sm text-gray-300">
                  Pretoria & Centurion,<br />Gauteng, South Africa
                </span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-[#C05A1E] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C05A1E] transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} GE Construction. All rights reserved. | Directed by Gert Engelbrecht
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;