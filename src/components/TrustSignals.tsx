import { Award, Users, Home, Clock } from "lucide-react";

const TrustSignals = () => {
  const stats = [
    { icon: Clock, value: "10+", label: "Years Experience" },
    { icon: Home, value: "200+", label: "Projects Completed" },
    { icon: Users, value: "150+", label: "Happy Clients" },
    { icon: Award, value: "100%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 bg-[#C05A1E] rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-[#2A3A4A] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;