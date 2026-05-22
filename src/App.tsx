import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import BusinessDetails from "./pages/admin/BusinessDetails";
import SeoSettings from "./pages/admin/SeoSettings";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import ReviewManager from "./pages/admin/ReviewManager";

const queryClient = new QueryClient();

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Routes>
                  {/* Admin Login (no header/footer) */}
                  <Route path="/admin/login" element={<Login />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <Routes>
                          <Route element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="business" element={<BusinessDetails />} />
                            <Route path="seo" element={<SeoSettings />} />
                            <Route path="blog" element={<BlogList />} />
                            <Route path="blog/new" element={<BlogEditor />} />
                            <Route path="blog/edit/:id" element={<BlogEditor />} />
                            <Route path="reviews" element={<ReviewManager />} />
                          </Route>
                        </Routes>
                      </ProtectedRoute>
                    }
                  />

                  {/* Public Routes */}
                  <Route
                    path="*"
                    element={
                      <>
                        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                        <main className="flex-grow">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/reviews" element={<Reviews />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
