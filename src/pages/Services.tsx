import { Link } from "react-router-dom";
import { ArrowRight, Home, PaintBucket, CloudRain, Fence, Building2, Wrench } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Renovations",
      description: "Transform your living space with our comprehensive renovation services. We help homeowners modernize and improve their homes with quality craftsmanship.",
      features: [
        "Bathroom renovations — from simple updates to complete remodels",
        "Kitchen upgrades — cabinetry, countertops, and layout improvements",
        "Interior modernizations — refreshing outdated spaces",
        "Room remodeling — converting or updating any room",
        "Open-plan improvements — creating flowing, modern living areas",
      ],
    },
    {
      icon: PaintBucket,
      title: "Home Improvements",
      description: "Enhance your home's appearance and functionality with our range of improvement services. Perfect for homeowners looking to refresh their space.",
      features: [
        "Ceiling installations and repairs",
        "Interior and exterior painting",
        "Flooring installation — tiles, laminate, and more",
        "Professional tiling for kitchens and bathrooms",
        "Plastering and skim coating",
      ],
    },
    {
      icon: CloudRain,
      title: "Roofing & Waterproofing",
      description: "Protect your home from the elements with our roofing and waterproofing solutions. Essential for maintaining your property's integrity.",
      features: [
        "Roof repairs and maintenance",
        "Comprehensive waterproofing systems",
        "Leak detection and repairs",
        "Flat roof maintenance and solutions",
        "Gutter installation and improvements",
      ],
    },
    {
      icon: Fence,
      title: "Paving & Outdoor Improvements",
      description: "Create beautiful outdoor spaces that extend your living area. Perfect for entertaining and adding value to your property.",
      features: [
        "Driveway paving — brick, concrete, and stone",
        "Patio construction and design",
        "Outdoor entertainment areas",
        "General paving for walkways and paths",
        "Garden pathways and landscaping features",
      ],
    },
    {
      icon: Building2,
      title: "Building Projects",
      description: "From additions to new structures, we handle building projects of all sizes. Trust us to bring your vision to life.",
      features: [
        "Home additions and extensions",
        "Garage construction",
        "Boundary walls and fencing",
        "Entertainment rooms and lapas",
        "Small residential builds",
      ],
    },
    {
      icon: Wrench,
      title: "Additional Construction Solutions",
      description: "Specialized services available when required for your project. We have the expertise to handle structural and fabrication needs.",
      features: [
        "Structural alterations and modifications",
        "Steelwork and framework",
        "Custom metal fabrication",
        "Support beam installation",
        "Welding services",
      ],
    },
  ];

  return (
    <div className="bg-[#F4F4F2]">
      {/* Hero Section */}
      <section className="bg-[#2A3A4A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Comprehensive construction and renovation solutions for homeowners and small businesses in Pretoria and Centurion.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-[#2A3A4A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="text-[#C05A1E]" size={28} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-[#2A3A4A] mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-[#C05A1E] mt-1">•</span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
            Need A Service Not Listed?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always happy to discuss your project. Get in touch and let's see how we can help.
          </p>
          <Link
            to="/contact"
            className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <span>Contact Us Today</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;