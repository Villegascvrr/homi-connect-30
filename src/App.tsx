
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import MatchingPage from "./pages/MatchingPage";
import ProfilePage from "./components/profiles/ProfilePage";
import ProfileForm from "./components/profiles/ProfileForm";
import ProfileViewPage from "./components/profiles/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DevelopmentBanner from "./components/layout/DevelopmentBanner";
import Navbar from "./components/layout/Navbar";
import DemoBanner from "./components/layout/DemoBanner";

const queryClient = new QueryClient();

// No más layouts con Outlet, volvemos a un enfoque más directo
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <DevelopmentBanner />
            
            {/* Rutas de autenticación (sin Navbar) */}
            <Routes>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Página principal */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <DemoBanner />
                    <div className="flex-1">
                      <Index />
                    </div>
                  </>
                }
              />

              {/* Rutas protegidas con Navbar */}
              <Route
                path="/matching"
                element={
                  <ProtectedRoute allowPreview={true}>
                    <>
                      <Navbar />
                      <DemoBanner />
                      <div className="flex-1">
                        <MatchingPage isPreview={false} />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute allowPreview={true}>
                    <>
                      <Navbar />
                      <DemoBanner />
                      <div className="flex-1">
                        <ChatPage isPreview={false} />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <DemoBanner />
                      <div className="flex-1">
                        <ProfilePage />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <DemoBanner />
                      <div className="flex-1">
                        <ProfileViewPage />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/create"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <DemoBanner />
                      <div className="flex-1">
                        <ProfileForm />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />

              {/* Redirecciones */}
              <Route path="" element={<Navigate to="/" replace />} />
              
              {/* Ruta para capturar todas las demás */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <div className="flex-1">
                      <NotFound />
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
