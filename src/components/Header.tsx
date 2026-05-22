import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header = ({ isMenuOpen, setIsMenuOpen }: HeaderProps) => {
  const location = useLocation();

  const { data: business } = useQuery({
    queryKey: ['business-details'],
    queryFn: async () => {
      const { data } = await supabase.from('business_details').select('*').limit(1).single();
      return data;
    },
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const whatsappLink = business?.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : "https://wa.me/27614770708";

  return (
    <header className="bg-[#2A3A4A] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={business?.logo_url || "/ge-construction-logo.png"}
              alt="GE Construction Logo"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-wide">{business?.company_name || 'GE Construction'}</span>
              <span className="block text-xs text-[#C05A1E]">{business?.tagline || 'Building Excellence • Delivering Dreams'}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#C05A1E] ${
                  isActive(link.path) ? "text-[#C05A1E]" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C05A1E] hover:bg-[#A04A18] px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Phone size={16} />
              <span>WhatsApp Us</span>
            </a>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors hover:text-[#C05A1E] ${
                  isActive(link.path) ? "text-[#C05A1E]" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 bg-[#C05A1E] hover:bg-[#A04A18] px-4 py-3 rounded-lg text-center"
            >
              WhatsApp Us
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
