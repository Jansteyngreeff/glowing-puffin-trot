import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const { data: business } = useQuery({
    queryKey: ['business-details'],
    queryFn: async () => {
      const { data } = await supabase.from('business_details').select('*').limit(1).single();
      return data;
    },
  });

  const { data: seo } = useQuery({
    queryKey: ['seo-settings', 'contact'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').eq('page_slug', 'contact').single();
      return data;
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi GE Construction! My name is ${formData.name}.\n\nI'm interested in: ${formData.service}\n\n${formData.message}\n\nYou can reach me at:\nEmail: ${formData.email}\nPhone: ${formData.phone}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsapp = (business?.whatsapp || '+27614770708').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsapp}?text=${encodedMessage}`, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hours = business?.business_hours || {};
  const formatHours = (day: any) => {
    if (!day || day.closed) return 'Closed';
    return `${day.open} — ${day.close}`;
  };

  return (
    <div className="bg-[#F4F4F2]">
      <Helmet>
        <title>{seo?.meta_title || 'Contact Us | GE Construction'}</title>
        <meta name="description" content={seo?.meta_description || ''} />
        {seo?.og_title && <meta property="og:title" content={seo.og_title} />}
        {seo?.og_description && <meta property="og:description" content={seo.og_description} />}
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[#2A3A4A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Ready to start your project? Get in touch — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#2A3A4A] mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you have a question, need a quote, or want to discuss your project, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#C05A1E] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A3A4A]">WhatsApp (Preferred)</h3>
                    <p className="text-gray-600">Quick responses, easy communication</p>
                    <a
                      href={`https://wa.me/${(business?.whatsapp || '+27614770708').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C05A1E] font-medium hover:underline"
                    >
                      {business?.whatsapp || '+27 61 477 0708'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2A3A4A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A3A4A]">Phone</h3>
                    <p className="text-gray-600">Call us during business hours</p>
                    <a href={`tel:${business?.phone || '+27614770708'}`} className="text-[#C05A1E] font-medium hover:underline">
                      {business?.phone || '+27 61 477 0708'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2A3A4A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A3A4A]">Email</h3>
                    <p className="text-gray-600">Send us an email anytime</p>
                    <a href={`mailto:${business?.email || 'gert@geconstruction.co.za'}`} className="text-[#C05A1E] font-medium hover:underline">
                      {business?.email || 'gert@geconstruction.co.za'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2A3A4A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A3A4A]">Service Areas</h3>
                    <p className="text-gray-600">{business?.service_area || 'Pretoria & Centurion, Gauteng'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#2A3A4A] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A3A4A]">Business Hours</h3>
                    <p className="text-gray-600">Monday — Friday: {formatHours(hours.monday)}</p>
                    <p className="text-gray-600">Saturday: {formatHours(hours.saturday)}</p>
                    <p className="text-gray-600">Sunday: {formatHours(hours.sunday)}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 bg-[#25D366] rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Prefer WhatsApp?</h3>
                <p className="mb-4">Get a quick response by messaging us directly on WhatsApp.</p>
                <a
                  href={`https://wa.me/${(business?.whatsapp || '+27614770708').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#25D366] px-6 py-3 rounded-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
                >
                  Start WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#2A3A4A] mb-6">Request A Quote</h2>
              <p className="text-gray-600 mb-6">
                Fill in the form below and we'll send you a WhatsApp message to get the conversation started.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none transition-all" placeholder="John Smith" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none transition-all" placeholder="082 123 4567" />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
                  <select id="service" name="service" required value={formData.service} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none transition-all">
                    <option value="">Select a service...</option>
                    <option value="Residential Renovation">Residential Renovation</option>
                    <option value="Home Improvements">Home Improvements</option>
                    <option value="Roofing & Waterproofing">Roofing & Waterproofing</option>
                    <option value="Paving & Outdoor">Paving & Outdoor</option>
                    <option value="Building Project">Building Project</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                  <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05A1E] focus:border-transparent outline-none transition-all resize-none" placeholder="Tell us about your project..." />
                </div>

                <button type="submit" className="w-full bg-[#C05A1E] hover:bg-[#A04A18] text-white py-4 rounded-lg font-semibold transition-colors">
                  Send Via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
