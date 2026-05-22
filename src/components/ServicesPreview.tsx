import { Link } from "react-router-dom";
import { ArrowRight, Home, PaintBucket, CloudRain, Fence, Building2 } from "lucide-react";

const ServicesPreview = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Renovations",
      description: "Bathroom renovations, kitchen upgrades, and interior modernizations to transform your living space.",
    },
    {
      icon: PaintBucket,
      title: "Home Improvements",
      description: "Ceilings, painting, flooring, tiling, and plastering — all the finishing touches your home needs.",
    },
    {
      icon: CloudRain,
      title: "Roofing & Waterproofing",
      description: "Roof repairs, waterproofing systems, and leak fixes to keep your home dry and protected.",
    },
    {
      icon: Fence,
      title: "Paving & Outdoor",
      description: "Driveways, patios, and entertainment areas that enhance your outdoor living experience.",
    },
    {
      icon: Building2,
      title: "Building Projects",
      description: "Home additions, garages, boundary walls, and small residential builds from the ground up.",
    },
  ];

  return (
    <section className="py-16 bg-[#F4F4F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A3A4A] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From small renovations to complete builds, we offer comprehensive construction solutions for your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#2A3A4A] rounded-lg flex items-center justify-center mb-4">
                <service.icon className="text-[#C05A1E]" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-[#2A3A4A] mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                to="/services"
                className="text-[#C05A1E] font-medium inline-flex items-center space-x-1 hover:underline"
              >
                <span>Learn More</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="bg-[#2A3A4A] hover:bg-[#1A2A3A] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;