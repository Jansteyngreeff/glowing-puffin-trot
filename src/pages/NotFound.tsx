import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F4F4F2]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#2A3A4A] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-[#C05A1E] hover:bg-[#A04A18] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
        >
          <Home size={20} />
          <span>Back To Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;